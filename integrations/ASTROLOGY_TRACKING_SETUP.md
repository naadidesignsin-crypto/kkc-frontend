# Astrology customer tracking

Consultation hours: **2 PM–9 PM IST**. These are enquiry hours, not automatically reserved slots. Existing plans remain **10 minutes / INR 999** and **20 minutes / INR 1,500**.

## Activate Google Sheets tracking

Do these steps separately in your existing _local and _prod Sheet-bound Apps Script projects.

1. Open the appropriate private registration spreadsheet, then Extensions > Apps Script.
2. Update the existing Code.gs using integrations/google-forms-setup.gs. Its doGet now routes page=astrology-tracker; existing Karthika registration stays available.
3. Add a Script file named AstrologyTracking and paste integrations/AstrologyTracking.gs.
4. Add an HTML file named AstrologyTracker and paste integrations/AstrologyTracker.html.
5. Select configureKkcAstrologyTracking and Run as the spreadsheet owner. Authorize if prompted. Existing KKC_WEBAPP_SHEET_ID / KKC_WEBAPP_ENVIRONMENT settings are reused. Complete the existing styled-registration configuration first if not already configured.
6. Deploy > Manage deployments > edit the existing Web app > New version > Deploy. Keep Execute as Me and access Anyone. Updating the existing deployment preserves the /exec URL already configured in the frontend.
7. In the website, complete an astrology enquiry, review it, agree to saving the details, then select Save enquiry & prepare WhatsApp.
8. Open the private sheet tab AstrologyCustomers_local or AstrologyCustomers_prod. You will see name, DOB, topic, duration, fee, contact/birth details, payment acknowledgement, reference and booking status.
9. Download the register through File > Download, or File > Print / Save as PDF.

## Verification

Localhost always selects the LOCAL Apps Script endpoint. Public production uses PROD. The server refuses requests with an environment mismatch. No private sheet data is published or read by the website.

The browser waits for a confirmed server response before displaying an enquiry reference. If the bridge/deployment is missing or times out, it explicitly says saving could not be confirmed and permits a WhatsApp enquiry as a fallback. This fallback does NOT claim a saved customer record. Retries reuse the same request ID to avoid duplicate rows.

Customer consent is unchecked by default. A selected price or customer checkbox NEVER marks payment verified. The register uses not_paid or reported_paid_pending_verification and Enquiry - slot not confirmed. KKC must manually verify payment and confirm the appointment.

Use the same existing VITE_REGISTRATION_WEBAPP_URL_LOCAL and VITE_REGISTRATION_WEBAPP_URL_PROD settings. No new credentials or paid Render service are required. For an approved Vercel preview origin, add the exact origin to the optional Script Property KKC_ASTRO_ALLOWED_ORIGINS (comma-separated).

The live Apps Script deployment cannot be updated from this local Git change. Live Google Sheets delivery remains unverified until the owner completes deployment and submits a test enquiry.

Implementation references: https://developers.google.com/apps-script/guides/html/communication and https://developers.google.com/apps-script/guides/html/restrictions
