<div align="center">


🛣️ RoadEye AI

AI-Powered Traffic Intelligence & Enforcement System

<p><strong>Real-time detection • Smart tracking • Automated enforcement • Analytics dashboard</strong></p>

<img src="https://img.shields.io/badge/RoadEye_AI-V1.0-0EA5E9?style=for-the-badge&logo=tesla&logoColor=white"/>   
<p> </p>

<img src="https://img.shields.io/badge/AI-YOLOv8-red?style=flat-square"/>
<img src="https://img.shields.io/badge/Backend-FastAPI-059669?style=flat-square"/>
<img src="https://img.shields.io/badge/Frontend-React-0ea5e9?style=flat-square"/>
<img src="https://img.shields.io/badge/Database-SQLite-6366f1?style=flat-square"/>
<img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square"/>


</div>


---

🎥 App preview

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/860a8e9d-fa0d-4bd8-9bf2-a817cf87e2b3" />


<p align="center">
  <img src="assets/demo.gif" width="90%" alt="RoadEye Demo"/>
</p>


# 📖 Overview

RoadEye AI is a full-stack intelligent traffic enforcement system designed to detect, track, and penalize violations in real time.

Built as :
	•	🌐 Cloud-ready \
	•	⚡ Real-time capable \
	•	📊 Analytics-driven \
	•	🧠 AI-enhanced \


# ✨ Core Capabilities

Feature	Description
🛡️ Detection Engine	Identifies helmet violations, red light jumps, tripling, and wrong lane \
📹 Multi-Input Support	Webcam, RTSP CCTV, images, videos \
📩 E-Ticketing	Auto email with evidence + confidence \
🗄️ Storage	Persistent SQLite logging \
📊 Dashboard	React analytics workstation \

---

# 🖼️ System Screenshots

### 📊 Dashboard UI

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/7915efd0-f8f7-406f-9dc3-b0184545019a" />


### 📩 Violation Email Output
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/2e5f9a4c-effa-4cd7-bdd9-2e66a343b5f3" />


---


# 🏗️ Architecture
<img width="1440" height="229" alt="image" src="https://github.com/user-attachments/assets/06badaee-d174-46e8-b7be-e3a85b427a83" />

---

# ⚙️ Tech Stack

Layer	Tech : \
🎨 Frontend	React 18, Vite \
⚙️ Backend	FastAPI, Uvicorn \
🧠 AI	YOLOv8 (Roboflow) \
🗄️ Database	SQLite \
📡 Video	OpenCV \
📩 Email	Yagmail SMTP \

---



# 🚀 Installation

🔹 Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install opencv-python-headless
```
🔐 Environment Variables
```
ROBOFLOW_API_KEY=your_key
ROBOFLOW_MODEL=username/project/version
SENDER_EMAIL=admin@gmail.com
SENDER_PASSWORD=app_password
```
▶️ Run Backend
``
..source venv/bin/activate && uvicorn main:app --reload
``

🔹 Frontend Setup
```
cd frontend
npm install
npm run dev
```


🌐 Local Access
```
👉 http://localhost:5173

Go to Workstation → Start Camera → Monitor Violations
```

🛠️ Command Reference

<details>
<summary>Backend Commands</summary>

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
</details>


<details>
<summary>Frontend Commands</summary>

```
npm install
npm run dev
npm run build
npm run preview
```
</details>



<div align="center">


⭐ Star this repo if you found it impressive!

</div>
