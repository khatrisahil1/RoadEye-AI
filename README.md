<div align="center">
  <img src="https://img.shields.io/badge/System-RoadEye_AI-EF4444?style=for-the-badge&logo=polestar" alt="RoadEye AI" />
  <h1>🛣️ RoadEye AI</h1>
  <p><strong>Next-Generation Automated Traffic Intelligence & Enforcement Edge Node</strong></p>
</div>

<hr/>

## 📖 Overview
**RoadEye AI** is a comprehensive, full-stack deep learning solution engineered to autonomously monitor local traffic intersections, instantly identify systemic vehicular driving infractions, and programmatically draft and dispatch evidentiary citation tickets. 

Originally built strictly as a localized desktop tool, this **V2.0** architecture completely reconstructs the system into an enterprise-grade cloud-ready Web Application—featuring a beautiful real-time React analytics workstation, a permanent SQLite enforcement database, and a highly concurrent Python server wrapping **Roboflow API inference**.

### Core Capabilities
- 🛡️ **Zero-Latency Infraction Detection:** Real-time identification of *No Helmet*, *Red Light Jumps*, *Tripling*, and *Wrong Lane* utilizing custom-trained models.
- 📹 **Omnipresent Media Support:** Seamlessly process static imagery, local MP4 forensic video files, live laptop WebCams, or unified **RTSP Network Security Cameras** using an integrated OpenCV hardware transcoder.
- 📩 **Automated E-Ticketing Pipeline:** Instantaneously bounds the infraction with a confidence rating and dispatches a rich-HTML evidentiary email to local administrative authorities (via Gmail SMTP).
- 🗄️ **Persistent Analytics Database:** Retains highly granular analytical logs utilizing a zero-dependency local SQLite schema.
- 📊 **Intelligence Bureau Workstation:** A fully React-based Single Page Application boasting dynamic charting, ticket reviews, parameter configurations, and a 1-click **CSV Report Exporter**.

---

## 🏗️ Architectural Topology

The software strictly decouples frontend GUI from backend model inference rendering it infinitely horizontally scalable:
- **Frontend Core:** React 18 / Vite / Vanilla CSS (Light Mode Analytics Dashboard)
- **Backend API:** FastAPI (Python 3) / Uvicorn Server
- **Database Layer:** Native SQLite3
- **Inference Cloud:** Roboflow Hosted YOLOv8
- **Transport Security:** HTTP Base64 Payloads / Yagmail SMTP

### 🧠 Intelligent Object Tracking (DeepSORT Successor)
In previous V1 desktop iterations, the project report heavily leaned on **DeepSORT** for multi-object tracking. However, passing local frames into DeepSORT algorithms fails catastrophically in network-dependent stateless REST APIs (where WebCams proxy HTTP payloads dynamically).

To vastly **exceed** the original report specifications, RoadEye V2 leverages a completely custom, pure-math **Stateful Centroid Target Tracking Engine** wired directly into FastAPI's memory state. 
This matrix intercepts Raw Roboflow predictions over HTTP, hashes target velocities using spatial distance heuristics, and systematically maps sequential `Vehicle IDs` globally. Thus, a violating vehicle driving through the camera feed across 5 different frames triggers exactly *one* automated citation, drastically curtailing database inflation and admin email spam natively.

---

## 🚀 Quickstart Initialization

This setup assumes `python` and `npm` are locally installed.

### 1. Backend Boot sequence
Navigate to the central API housing, securely instantiate the Python dependencies, configure global environment bindings, and deploy the Uvicorn listener:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install opencv-python-headless # Transcoding proxy
```
**Configure Environment Security Parameters (`backend/.env`):**
```env
ROBOFLOW_API_KEY="YOUR_API_KEY"
ROBOFLOW_MODEL="username/projectname/version"
SENDER_EMAIL="admin_dispatch@gmail.com"
SENDER_PASSWORD="your_16_char_google_app_password"
```

**Ignition:**
```bash
source ../venv/bin/activate && uvicorn main:app --reload
```

### 2. Frontend Boot Sequence
In a secondary terminal, mount the React application:
```bash
cd frontend
npm install
npm run dev
```

The system will now be active at **http://localhost:5173**. 
Navigate to the "Workstation" tab to configure your IP Camera (RTSP hook) or Local WebCam and begin AI inferences!

---

## 🛠️ Useful & Required Commands Reference

### Backend Commands
Navigate to the `backend` directory before running these:
- **Create Virtual Environment:** `python -m venv venv`
- **Activate Environment (Mac/Linux):** `source venv/bin/activate`
- **Activate Environment (Windows):** `venv\Scripts\activate`
- **Install Dependencies:** `pip install -r requirements.txt`
- **Start Server (Development):** `uvicorn main:app --reload`
- **Start Server (Custom Port/Host):** `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

### Frontend Commands
Navigate to the `frontend` directory before running these:
- **Install Dependencies:** `npm install`
- **Run Developer Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`

---
*Built as a dedicated final year system software engineering project.*
