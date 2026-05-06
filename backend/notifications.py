import os
import yagmail
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", "")

from datetime import datetime

def send_violation_email(violation_type: str, image_path: str, confidence: float = 0.99, ticket_id: str = "TKT-001", custom_recipient: str = None):
    """
    Sends an official email notification with a premium Citizen Portal UI and attached inline image.
    """
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("Email credentials are not set in .env. Skipping email dispatch.")
        return False

    try:
        yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)
        
        subject = f"NOTICE OF VIOLATION: {violation_type.title()} [{ticket_id}]"
        
        # Format exact dates for the premium ticket UI
        date_str = datetime.now().strftime("%B %d, %Y")
        time_str = datetime.now().strftime("%I:%M %p")
        
        # Read the image file as a native Base64 data URI to flawlessly embed the dynamic image directly into the Tailwind HTML 
        import base64
        try:
            with open(image_path, "rb") as f:
                b64_str = base64.b64encode(f.read()).decode("utf-8")
                b64_data_uri = f"data:image/jpeg;base64,{b64_str}"
        except Exception as e:
            b64_data_uri = ""
            print(f"Failed to encode image: {e}")

        # Emails explicitly strip external stylesheets and Tailwind <script> tags. We manually map the aesthetic to pure, foolproof Inline CSS tables using Web Fonts for 100% fidelity where supported.
        html_template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
        .header { background: #003366; color: #ffffff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; opacity: 0.8; font-size: 12px; }
        .status-banner { background: #fff4f4; color: #cc0000; padding: 10px; text-align: center; font-weight: 700; font-size: 12px; border-bottom: 1px solid #ffcccc; }
        .content { padding: 30px; }
        .section-header { font-size: 14px; font-weight: 700; color: #003366; text-transform: uppercase; margin-bottom: 15px; border-left: 4px solid #003366; padding-left: 10px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .data-table tr:nth-child(even) { background-color: #f9fbff; }
        .data-table td { padding: 12px 15px; border: 1px solid #eef2f7; font-size: 14px; color: #333; }
        .label { font-weight: 700; color: #666; width: 40%; background: #f4f7f9; }
        .value { font-weight: 600; color: #111; }
        .evidence-frame { border: 2px solid #eef2f7; border-radius: 8px; overflow: hidden; margin-top: 10px; background: #fafafa; padding: 10px; }
        .evidence-img { width: 100%; border-radius: 4px; display: block; }
        .penalty-card { background: #003366; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; margin-top: 25px; }
        .penalty-price { font-size: 28px; font-weight: 800; margin: 10px 0; }
        .footer { padding: 25px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; background: #fafafa; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>E-Challan Notice</h1>
            <p>Traffic Enforcement & Road Safety Authority | Government of UP</p>
        </div>
        <div class="status-banner">🚨 ACTION REQUIRED: AUTOMATED TRAFFIC VIOLATION DETECTED</div>
        <div class="content">
            <div class="section-header">Vehicle & Offense Information</div>
            <table class="data-table">
                <tr><td class="label">Challan Number</td><td class="value">#TKT-446</td></tr>
                <tr><td class="label">Vehicle Reg. No</td><td class="value">UP-16-AX-7714 (Detected)</td></tr>
                <tr><td class="label">Vehicle Make/Model</td><td class="value">Two-Wheeler | TVS Apache</td></tr>
                <tr><td class="label">Nature of Offense</td><td class="value" style="color: #d00;">[DYNAMIC_ICON] [DYNAMIC_TITLE]</td></tr>
                <tr><td class="label">Date & Time</td><td class="value">May 07, 2026 | 03:39 AM</td></tr>
                <tr><td class="label">Precise Location</td><td class="value">NH-24 Intersection, Crossing Republic, GZB</td></tr>
            </table>

            <div class="section-header">Digital Evidence Capture</div>
            <div class="evidence-frame">
                <img src="[IMAGE_URI]" class="evidence-img" alt="Evidence Preview">
                <p style="font-size: 10px; text-align: center; color: #999; margin-top: 8px;">High-resolution evidence photo attached to this email.</p>
            </div>

            <div class="penalty-card">
                <div style="font-size: 12px; opacity: 0.9;">TOTAL SETTLEMENT AMOUNT</div>
                <div class="penalty-price">₹ 1,000.00</div>
                <div style="font-size: 10px; opacity: 0.8;">Case ID: RoadEye-AI-GZB-7714</div>
            </div>
        </div>
        <div class="footer">
            <p>This is a system-generated legal notice. Please visit the official citizen portal for settlement.<br>
            <strong>GLBITM Smart Systems Research Group</strong><br>
            © 2026 RoadEye AI Intelligence. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
"""
        
        # Determine the dynamic icon and text
        violation_clean_title = violation_type.title()
        if "helmet" in violation_type.lower():
            icon_emoji = "🏍️"
        elif "phone" in violation_type.lower() or "distracted" in violation_type.lower():
            icon_emoji = "📱"
        elif "light" in violation_type.lower() or "lane" in violation_type.lower() or "speed" in violation_type.lower():
            icon_emoji = "🚦"
        else:
            icon_emoji = "⚠️"

        html_content = html_template.replace("#TKT-650-2026", f"#{ticket_id}") \
                                    .replace("[DYNAMIC_TITLE]", violation_clean_title) \
                                    .replace("[DYNAMIC_ICON]", icon_emoji) \
                                    .replace("March 22, 2026", date_str) \
                                    .replace("7:39 PM", time_str) \
                                    .replace("[IMAGE_URI]", b64_data_uri)

        contents = [
            html_content,
            image_path # Yagmail automatically detects this as a file and attaches it
        ]

        
        recipient = custom_recipient if custom_recipient else (RECEIVER_EMAIL if RECEIVER_EMAIL else SENDER_EMAIL)
        
        yag.send(
            to=recipient,
            subject=subject,
            contents=contents
        )
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
