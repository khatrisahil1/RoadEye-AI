import os
import base64
import time

import cv2
import numpy as np
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from notifications import send_violation_email
from database import init_db, insert_violation, get_all_violations
from tracker import CentroidTracker

# Globals mapping object tracking state statelessly across HTTP calls
tracker = CentroidTracker(maxDisappeared=8, maxDistance=250)
logged_violations = set()

# Load environment variables, override needed for uvicorn reloads on empty keys
load_dotenv(override=True)

app = FastAPI(title="RoadEye AI Backend", version="1.0.0")

# Enable CORS for React frontend (Vite runs on port 5173 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    print("SQLite Database successfully initialized.")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RoadEye AI Backend is running."}

@app.get("/api/history")
def read_history():
    """Endpoint serving real permanent SQLite historical data to the Intelligence frontend tab"""
    try:
        records = get_all_violations()
        return {"success": True, "history": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stream")
def video_feed(url: str):
    """Dynamically proxies an RTSP or remote IP camera stream into an MJPEG stream playable natively in browsers"""
    def gen_frames(rtsp_url):
        cap = cv2.VideoCapture(rtsp_url)
        try:
            while True:
                success, frame = cap.read()
                if not success:
                    break
                ret, buffer = cv2.imencode('.jpg', frame)
                jpg_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpg_bytes + b'\r\n')
        finally:
            cap.release()
    
    return StreamingResponse(gen_frames(url), media_type='multipart/x-mixed-replace; boundary=frame')

@app.post("/api/detect")
async def detect_violation(file: UploadFile = File(...), recipient_email: str = Form(None), model_name: str = Form(None)):
    """
    Receives an uploaded image from the frontend, sends it to the Roboflow
    YOLOv8 inference API, analyzes the results, and returns detections.
    Triggers an email notification if a violation is found.
    """
    # Dynamically grab the key to ensure we don't use stale empty strings 
    # if .env was saved while server was already running
    ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "").strip('"').strip("'")
    ROBOFLOW_MODEL = os.getenv("ROBOFLOW_MODEL", "helmet-detection-and-number-plate-recognition/2").strip('"').strip("'")
    
    # Use dynamically provided model_name or fallback to ROBOFLOW_MODEL
    if model_name:
        model_name = model_name.strip(' "\'\n\r')
    actual_model = model_name if model_name and len(model_name) > 2 else ROBOFLOW_MODEL

    try:
        image_bytes = await file.read()
        
        # --- Preprocessing Unit (Report Specific) ---
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is not None:
            # 1. Noise Reduction (Gaussian Blur)
            img = cv2.GaussianBlur(img, (5, 5), 0)
            # 2. Image Resizing (Standardizing to 640x640)
            img = cv2.resize(img, (640, 640))
            # 3. Re-encode frame for REST Transmission 
            _, encoded_img = cv2.imencode('.jpg', img)
            image_bytes = encoded_img.tobytes()
            
        base64_image = base64.b64encode(image_bytes).decode("ascii")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    if not ROBOFLOW_API_KEY:
        print("Demo Mode: No Roboflow API Key provided. Returning mock violations.")
        detections = {
            "predictions": [
                {
                    "class": "no helmet",
                    "confidence": 0.94,
                    "x": 300,
                    "y": 200,
                    "width": 120,
                    "height": 120
                },
                {
                    "class": "tripling",
                    "confidence": 0.88,
                    "x": 300,
                    "y": 350,
                    "width": 250,
                    "height": 300
                }
            ]
        }
    else:
        # Roboflow Infer API URL
        upload_url = f"https://detect.roboflow.com/{actual_model}?api_key={ROBOFLOW_API_KEY}"

        # Perform prediction (Sending base64 encoded string, which Roboflow officially supports)
        response = None
        try:
            response = requests.post(
                upload_url,
                data=base64_image,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            detections = response.json()
        except requests.exceptions.RequestException as e:
            error_details = response.text if 'response' in locals() and response is not None else str(e)
            print(f"Roboflow API Error: {error_details} | Model: {actual_model}")
            # Do NOT swallow the error, throw it so the frontend can display it in red
            raise HTTPException(status_code=502, detail=f"Roboflow API Error: {error_details} | Model: {actual_model}")

    predictions = detections.get("predictions", [])
    
    # Filter incoming predictions and map them into the tracker matrix
    rects_with_classes = []
    for pred in predictions:
        class_name = pred.get("class", "").lower()
        if class_name in ["no helmet", "without helmet", "red light", "tripling", "wrong lane", "using phone", "using_phone", "phone"]:
            rects_with_classes.append((pred.get("x", 0), pred.get("y", 0), pred.get("width", 0), pred.get("height", 0), class_name))
            
    objects, classes = tracker.update(rects_with_classes)

    violation_found = False
    violation_type = ""
    violation_confidence = 0.0
    
    # Analyze the tracked object matrix to prevent duplicate tickets across frames
    for obj_id, centroid in objects.items():
        cls_name = classes[obj_id]
        if obj_id not in logged_violations:
            logged_violations.add(obj_id)
            violation_found = True
            violation_type = cls_name
            # Grab rough confidence from matching generic bounding boxes mapping 
            violation_confidence = max([float(p.get("confidence", 0.9)) for p in predictions if p.get("class", "").lower() == cls_name], default=0.9)
            print(f"TRACKER :: Registered NEW Violation - Object ID {obj_id} - Class {cls_name}")
            break
        else:
            print(f"TRACKER :: Ignored Duplicate Violation - Object ID {obj_id} (Already Ticketed)")
            
    # Trigger Email & Database ONLY if a NEW unticketed tracked vehicle object enters the array
    if violation_found:
        # Save image temporarily or pass bytes to yagmail
        temp_image_path = f"/tmp/{file.filename}"
        with open(temp_image_path, "wb") as f:
            f.write(image_bytes)
            
        ticket_id = f"TKT-{(int(time.time()) % 1000) + 100:03d}" # Generate 3-digit pseudo ID for email
        
        send_success = send_violation_email(
            violation_type=violation_type, 
            image_path=temp_image_path,
            confidence=violation_confidence,
            ticket_id=ticket_id,
            custom_recipient=recipient_email
        )
        print(f"Violation Email Sent: {send_success} to {recipient_email}")
        
        # Persist to SQLite Database permanently
        insert_violation(violation_type, violation_confidence, f"data:image/jpeg;base64,{base64_image}")

    return {
        "success": True,
        "filename": file.filename,
        "violation_found": violation_found,
        "violation_type": violation_type,
        "predictions": predictions
    }
