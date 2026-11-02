# Karthika Masam registrations

Required fields: Gothram, Namam, phone number (10-digit Indian number), email ID.
Optional fields: address and note. Attendee count is no longer collected.

## Activate shared registration without Render

A Google Docs link (`docs.google.com/document/...`) is not a registration form.
Use Google Forms and its linked private Google Sheet. Only the responder form URL goes into the frontend; never publish the responses Sheet or any organiser/edit links.

1. In the KKC Google account, create a new private Google Sheet.
2. Open **Extensions > Apps Script** and paste [google-forms-setup.gs](integrations/google-forms-setup.gs).
3. Save, choose `setupKarthikaRegistration`, and run it. Google will request authorisation to create the form, link the Sheet, and create PDF reports in Drive.
4. Copy the **Responder link (website)** from the new **KKC Setup** tab. Check that the form has all six fields, required/optional status, and accepts a test submission from a signed-out browser. Workspace policies may require adjusting responder access in Google Forms.
5. Set `VITE_REGISTRATION_FORM_URL` to that `https://docs.google.com/forms/d/e/.../viewform` URL in Vercel's production environment, then redeploy. A `https://forms.gle/...` responder short link also works. For local testing, put it in `.env.local` and restart Vite.
6. The website popup now links to the Google Form. Submitting the form saves to the shared Sheet. The website does not claim a registration succeeded merely because the form was opened.
7. Your authorised team can open the Sheet from any system. Reopen the Sheet after setup to see **KKC Registrations > Export registrations to PDF**. It creates a private PDF in the current user's Drive. You can also use **File > Download > PDF** or **Microsoft Excel** in Sheets.

The script is prepared locally, not executed in a Google account. If setup is interrupted, open the saved form link to inspect it; do not clear its stored ID and rerun blindly. No email is sent by this setup or export.

Google Forms does not apply the local demo's duplicate-phone check. Existing local browser records are not automatically imported into Google Forms or its Sheet; export them separately first.

## Local demo while Google is not configured

Without `VITE_REGISTRATION_FORM_URL`, the existing browser-only demo remains clearly labelled. Existing saved entries are preserved; absent Gothram/address values show “Not provided”.

Open **Demo registrations & PDF / Excel export** below the event card:
- **Print / Save PDF** opens a formatted report. Click **Print / Save as PDF** in that tab and choose **Save as PDF** in the browser dialog.
- **Download Excel (.xlsx)** includes the updated fields.

Local storage remains specific to the browser and site origin. PDF/Excel export does not synchronise data. Once Google Forms is configured, the local records panel is hidden from the public registration flow. An invalid configured URL shows an unavailable message instead of pretending to collect online registrations.
