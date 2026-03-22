import os
import yagmail
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", "")

def send_violation_email(violation_type: str, image_path: str, custom_recipient: str = None):
    """
    Sends an email notification with the violation details and attached image.
    """
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("Email credentials are not set in .env. Skipping email dispatch.")
        return False

    try:
        yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)
        
        subject = f"RoadEye AI Alert: {violation_type.title()} Detected"
        
        html_content = f"""
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fbf7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px 20px;">
        <tr><td align="center">

            <!-- Header -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-bottom: 30px;">
                <tr>
                    <td align="left" style="font-weight: 800; font-size: 20px; color: #2563eb;">
                        <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-size: 14px;">🛣️</span> RoadEye<span style="color: #f97316;">AI</span>
                    </td>
                    <td align="right">
                        <a href="#" style="padding: 8px 16px; border: 1px solid #2563eb; color: #2563eb; border-radius: 999px; text-decoration: none; font-size: 13px; font-weight: 600;">System Dashboard</a>
                    </td>
                </tr>
            </table>

            <!-- Main Title -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-bottom: 24px; text-align: center;">
                <tr>
                    <td align="center">
                        <p style="color: #64748b; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Automated Intelligence</p>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.3;">Traffic Violation Detected<br/> ft. {violation_type.title()}</h1>
                        <p style="color: #475569; font-size: 15px; margin-top: 12px; line-height: 1.5; padding: 0 20px;">Get immediate actionable intelligence from <strong>RoadEye Edge Node 1</strong> — and maintain safety standards in an AI-first world.</p>
                        <a href="#" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; margin-top: 16px;">Check details & Evidence</a>
                        <p style="font-size: 12px; color: #64748b; margin-top: 16px;">Tip: For a closer look at the camera logs, check the workstation. <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 600;">Follow now</a></p>
                    </td>
                </tr>
            </table>

            <!-- Inner White Card -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <tr><td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr><td align="left">
                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Meet the system</h2>
                        </td></tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                        <tr>
                            <td width="55" valign="top">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #eff6ff; display: inline-block; text-align: center; line-height: 48px; font-size: 20px;">
                                    🤖
                                </div>
                            </td>
                            <td align="left" valign="top">
                                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">RoadEye YOLOv8 Engine</p>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">Chief Intelligence Officer (CIO), Automated Node</p>
                                <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">High Confidence Rating &bull; Sector 4 Deployment</p>
                            </td>
                        </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr><td align="left">
                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Here's what you'll take away</h2>
                            <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.6;">
                                <li style="margin-bottom: 6px;">The AI model definitively detected a <strong style="color: #ef4444;">{violation_type.title()}</strong> violation</li>
                                <li style="margin-bottom: 6px;">Secure photographic evidence is attached to this dispatch</li>
                                <li style="margin-bottom: 6px;">Instant bounding boxes and metadata logged centrally</li>
                                <li style="margin-bottom: 6px;">How to build long-term safety awareness in monitored zones</li>
                            </ul>

                            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
                                Artificial Intelligence is rapidly transforming how traffic forces monitor, analyze, and enforce laws — and officers must evolve with it. This dispatch decodes how AI is reshaping road safety across Indian intersections.
                            </p>
                        </td></tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr><td align="center">
                            <a href="#" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: 600;">Download Attachment</a>
                            <p style="font-size: 12px; color: #64748b; margin-top: 12px; margin-bottom: 0;">Tap "Download Attachment" to see native resolution evidence.</p>
                        </td></tr>
                    </table>
                </td></tr>
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-top: 32px; text-align: center;">
                <tr><td align="center">
                    <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Need past history?</p>
                    <p style="font-size: 14px; color: #475569; margin: 0;">
                        <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 600;">Export logs anyway</a> — you'll be able to access the database CSV.
                    </p>
                </td></tr>
            </table>

        </td></tr>
        </table>
        """

        contents = [
            html_content,
            image_path
        ]
        
        # Send to the configured receiver email, or the dynamically provided one from the frontend
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
