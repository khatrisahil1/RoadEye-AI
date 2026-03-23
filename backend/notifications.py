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
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>Resolution Notice</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px 0; min-height: 100vh;">
  <table width="100%" style="max-width: 672px; margin: 0 auto; background-color: #f8fafc; border-collapse: collapse;">
    <tr>
      <td style="padding: 0 16px;">
        
        <!-- Header -->
        <table width="100%" style="background-color: #ffffff; border-bottom: 1px solid #e2e8f0; border-collapse: collapse; margin-bottom: 40px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02);">
          <tr>
            <td style="padding: 16px 20px; text-align: left;">
              <div style="display: inline-block; vertical-align: middle; background-color: #2563eb; width: 32px; height: 32px; border-radius: 8px; text-align: center; line-height: 32px; margin-right: 8px;">
                <span style="font-family: 'Material Symbols Outlined'; color: #ffffff; font-size: 20px; line-height: 32px; vertical-align: middle;">account_balance</span>
              </div>
              <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; color: #0f172a; vertical-align: middle; letter-spacing: -0.02em;">Citizen Resolution Portal</span>
            </td>
            <td style="padding: 16px 20px; text-align: right;">
              <span style="background-color: #f1f5f9; color: #64748b; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 9999px; text-transform: uppercase;">Public Safety</span>
            </td>
          </tr>
        </table>

        <!-- Notice Banner -->
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background-color: #fef2f2; border: 1px solid #fee2e2; padding: 6px 12px; border-radius: 9999px;">
            <span style="font-family: 'Material Symbols Outlined'; color: #dc2626; font-size: 14px; vertical-align: middle; margin-right: 4px;">priority_high</span>
            <span style="font-size: 12px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.025em; vertical-align: middle;">Notice of Violation</span>
          </span>
        </div>

        <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; line-height: 1.1; letter-spacing: -0.02em;">Traffic Safety Infraction</h1>
        <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0 0 32px 0;">
          Our safety monitoring system has recorded a violation associated with your vehicle credentials. We provide this notice to facilitate a quick and fair resolution.
        </p>

        <!-- Main Card -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 32px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
          
          <!-- Card Header -->
          <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 24px;">
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="text-align: left;">
                  <p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">Ticket Reference</p>
                  <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">#TKT-650-2026</p>
                </td>
                <td style="text-align: right;">
                  <span style="background-color: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 6px;">Resolution Required</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Card Body -->
          <div style="padding: 24px;">
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <!-- Left Column (Details) -->
                <td width="55%" style="vertical-align: top; padding-right: 16px;">
                  
                  <p style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Primary Violation</p>
                  <table style="margin-bottom: 24px; border-collapse: collapse;">
                    <tr>
                      <td style="padding-right: 12px; vertical-align: top;">
                        <div style="background-color: #f1f5f9; width: 40px; height: 40px; border-radius: 9999px; text-align: center; line-height: 40px;">
                          <span style="font-family: 'Material Symbols Outlined'; color: #475569; font-size: 20px; line-height: 40px;">[DYNAMIC_ICON]</span>
                        </div>
                      </td>
                      <td style="vertical-align: top; padding-top: 2px;">
                        <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 20px; color: #0f172a; display: block; line-height: 1.2; margin-bottom: 4px;">[DYNAMIC_TITLE]</span>
                        <span style="font-size: 14px; color: #64748b;">Safety Regulation Sec. 44-A</span>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td width="50%" style="vertical-align: top;">
                        <p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Date & Time</p>
                        <p style="font-size: 14px; font-weight: 500; color: #1e293b; margin: 0 0 2px 0;">March 22, 2026</p>
                        <p style="font-size: 12px; color: #64748b; font-style: italic; margin: 0;">7:39 PM</p>
                      </td>
                      <td width="50%" style="vertical-align: top;">
                        <p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Settlement Amount</p>
                        <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0;">$45.00</p>
                        <p style="font-size: 12px; color: #2563eb; font-weight: 500; margin: 0;">Early pay discount available</p>
                      </td>
                    </tr>
                  </table>
                </td>
                
                <!-- Right Column (Image) -->
                <td width="45%" style="vertical-align: top;">
                  <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; position: relative;">
                    <img src="[IMAGE_URI]" style="width: 100%; height: auto; display: block;" alt="Evidence" />
                    <!-- Using dark grey label under the banner image to map Tailwind overlay seamlessly -->
                    <div style="background-color: #1e293b; padding: 12px; color: #ffffff;">
                      <span style="font-family: 'Material Symbols Outlined'; font-size: 12px; vertical-align: middle; margin-right: 4px;">verified</span>
                      <span style="font-size: 10px; font-weight: 700; vertical-align: middle;">Evidence Capture ID: Node_7714</span>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Call to action -->
        <div style="margin-bottom: 48px;">
          <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: #1e293b; font-size: 18px; margin: 0 0 16px 0; padding-left: 4px;">Choose your next step</h2>
          
          <a href="#" style="display: block; text-decoration: none; background-color: #2563eb; color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td width="56" style="vertical-align: middle;">
                  <div style="background-color: rgba(255,255,255,0.2); width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px;">
                    <span style="font-family: 'Material Symbols Outlined'; color: #ffffff; font-size: 20px; line-height: 40px;">payments</span>
                  </div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-weight: 700; font-size: 16px; display: block; margin-bottom: 2px; color: #ffffff;">Pay Settlement</span>
                  <span style="font-size: 12px; color: #bfdbfe;">Immediate resolution and case closure</span>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <span style="font-family: 'Material Symbols Outlined'; font-size: 24px; color: #ffffff;">chevron_right</span>
                </td>
              </tr>
            </table>
          </a>

          <table width="100%" style="border-collapse: collapse; margin-bottom: 12px;">
            <tr>
              <td width="49%" style="padding-right: 1%;">
                <a href="#" style="display: block; text-decoration: none; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; height: 100%;">
                  <table width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td width="56" style="vertical-align: middle;">
                        <div style="background-color: #f8fafc; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px;">
                          <span style="font-family: 'Material Symbols Outlined'; color: #64748b; font-size: 20px; line-height: 40px;">visibility</span>
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="font-weight: 700; font-size: 14px; display: block; margin-bottom: 2px; color: #334155;">Review Evidence</span>
                        <span style="font-size: 10px; color: #64748b;">High-res photos & video</span>
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <span style="font-family: 'Material Symbols Outlined'; font-size: 20px; color: #94a3b8;">chevron_right</span>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
              <td width="49%" style="padding-left: 1%;">
                <a href="#" style="display: block; text-decoration: none; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; height: 100%;">
                  <table width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td width="56" style="vertical-align: middle;">
                        <div style="background-color: #f8fafc; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px;">
                          <span style="font-family: 'Material Symbols Outlined'; color: #64748b; font-size: 20px; line-height: 40px;">gavel</span>
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="font-weight: 700; font-size: 14px; display: block; margin-bottom: 2px; color: #334155;">Contest Ticket</span>
                        <span style="font-size: 10px; color: #64748b;">Submit an appeal</span>
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <span style="font-family: 'Material Symbols Outlined'; font-size: 20px; color: #94a3b8;">chevron_right</span>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #dbeafe; padding: 24px; border-radius: 16px; margin-bottom: 48px;">
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="36" style="vertical-align: top; padding-top: 2px;">
                <span style="font-family: 'Material Symbols Outlined'; font-size: 20px; color: #2563eb;">info</span>
              </td>
              <td>
                <h4 style="font-weight: 700; color: #0f172a; font-size: 14px; margin: 0 0 8px 0;">Automated Safety Assurance</h4>
                <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">
                  This notice was generated via the RoadEye Vision Engine to ensure community safety. All detections undergo a multi-stage verification process. For questions about your rights, please visit our <a href="#" style="color: #2563eb; text-decoration: underline; font-weight: 500;">Resolution Resource Center</a>.
                </p>
              </td>
            </tr>
          </table>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding: 48px 0; text-align: center;">
          <div style="margin-bottom: 24px;">
            <a href="#" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; margin: 0 12px; display: inline-block;">Safety Standards</a>
            <a href="#" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; margin: 0 12px; display: inline-block;">Privacy Policy</a>
            <a href="#" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; margin: 0 12px; display: inline-block;">Accessibility</a>
          </div>
          <p style="font-size: 11px; color: #64748b; line-height: 1.6; max-width: 400px; margin: 0 auto 16px auto;">
            This is an automated administrative message. Please do not reply directly to this email. For support, use the portal's integrated help system.
          </p>
          <p style="font-size: 10px; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
            © 2026 Department of Transit & Public Safety
          </p>
        </div>

      </td>
    </tr>
  </table>
</div>
</body>
</html>
        """
        
        # Determine the dynamic icon and text
        violation_clean_title = violation_type.title()
        if "helmet" in violation_type.lower():
            icon_name = "motorcycle"
        elif "phone" in violation_type.lower() or "distracted" in violation_type.lower():
            icon_name = "smartphone"
        elif "light" in violation_type.lower() or "lane" in violation_type.lower() or "speed" in violation_type.lower():
            icon_name = "traffic"
        else:
            icon_name = "priority_high"

        html_content = html_template.replace("#TKT-650-2026", f"#{ticket_id}") \
                                    .replace("[DYNAMIC_TITLE]", violation_clean_title) \
                                    .replace("[DYNAMIC_ICON]", icon_name) \
                                    .replace("March 22, 2026", date_str) \
                                    .replace("7:39 PM", time_str) \
                                    .replace("[IMAGE_URI]", b64_data_uri)

        contents = [
            html_content
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
