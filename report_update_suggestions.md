# Required Updates to Project Documents (Report & Paper)

Based on the latest updates to your application (V2 Web Architecture), your project documents currently describe the V1 localized desktop version. You need to update several sections to reflect your current, enterprise-grade cloud-ready Web Application. 

Here is a detailed, section-by-section breakdown of what must be updated in your existing Project Report (and mirrored in your Project Paper).

## 1. DeepSORT -> Stateful Centroid Target Tracking
The most critical technical change is the replacement of the DeepSORT tracking algorithm with your custom tracking engine.
- **Abstract (Page v)**: Replace "The integration of DeepSORT enables precise tracking..." with "The integration of a custom Stateful Centroid Target Tracking Engine wires directly into the API to intercept predictions and hash velocities, enabling precise tracking..."
- **Section 1.5 Objectives (Page 4, Obj 2)**: Replace mentions of DeepSORT with the new stateful spatial distance tracker.
- **Section 2.4 Inferences (Page 8)**: Remove DeepSORT as the tracking dependency and highlight your custom stateless REST HTTP tracking implementation.
- **Section 3.3.4 Object Tracking Module (Page 12)**: *Completely rewrite this section.* Delete references to DeepSORT. Explain that your V2 architecture uses a "Stateful Centroid Target Tracking Engine" integrated into FastAPI's memory state, which maps sequential `Vehicle IDs` based on spatial distance heuristics from Roboflow API predictions over HTTP. 

## 2. Infrastructure & System Architecture
Your V2 application is now a decoupled, full-stack application.
- **Section 3.1 & 3.2 System Architecture (Pages 9-10)**: Update the architecture descriptions to explicitly mention the decoupling of the frontend and backend. 
  - **Frontend Core**: React 18 / Vite / Vanilla CSS (Analytics Dashboard).
  - **Backend API**: FastAPI (Python 3) / Uvicorn Server.
  - **Inference**: Roboflow Hosted YOLOv8 (instead of local YOLOv8 processing).
- **Section 3.3.8 Violation Report Generation (Page 13)**: Emphasize that the violations are passed to a "permanent SQLite enforcement database" and exposed via a "React-based Single Page Application" (Intelligence Bureau Workstation) that allows for dynamic charting and 1-click CSV Report Exports.
- **Chapter 4 Methodology (Page 15)**: Update this section to reflect the use of modern HTTP/REST APIs to tie the system together (HTTP Base64 Payloads).

## 3. Technology Stack & Software Requirements
Update the tables and descriptions of the technologies used to reflect Reality.
- **Section 4.2 Software Requirements (Table 4.1, Page 16)**:
  - Add **React (Vite)** instead of just HTML/CSS/React.
  - Add **FastAPI and Uvicorn** for the backend server.
  - Add **SQLite3** as the persistent database layer.
  - Change "Email API/Service (e.g., Gmail API)" to **Yagmail SMTP** which dispatches rich-HTML evidentiary emails.
  - Mention **Roboflow API** instead of purely local model training/execution.

## 4. Diagram and Flowchart Suggestions (For Your Paper)
Since you want your paper to reach 6 pages, you should plan to include the following diagrams (you can pull these from the report or update them for the paper):
1. **High-Level Web Architecture Diagram**: A flowchart showing the React Frontend interacting with the FastAPI Backend via REST, which talks to the Roboflow Cloud Inference and saves to a local SQLite database.
2. **Stateful Centroid Tracking Flowchart**: A flowchart detailing how your custom math matrix replaces DeepSORT: `Frames -> Roboflow API -> Target Bounding Boxes -> Centroid Calculation -> Spatial Distance Hashing -> Assign Vehicle ID`.
3. **Database Schema Diagram**: Showcase your SQLite database tables (e.g., Violations, Vehicles, Timestamps) to pad academic length with technical depth.
4. **Email Ticketing Pipeline Flowchart**: `Violation Detected -> Extract Image as Base64 -> Build Rich HTML Template -> Send via Yagmail SMTP -> Update SQLite Log`.

## Next Steps for the Project Paper:
I need a copy of your **Project Paper**. Please make sure the PDF or Word document is added directly to your `RoadEye-AI` workspace folder so I can read it! Once you upload it there, I can help you structure the 6 pages step-by-step and tell you exactly where to insert these diagrams.
