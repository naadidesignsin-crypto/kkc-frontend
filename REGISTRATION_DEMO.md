# Karthika Masam registrations

Required fields: Gothram, Namam, phone number (10-digit Indian number), email ID.
Optional fields: address and note. Attendee count is no longer collected.

## Activate shared registration without Render

A Google Docs link (`docs.google.com/document/...`) is not a registration form.
Use Google Forms and its linked private Google Sheet. Only the responder form URL goes into the frontend; never publish the responses Sheet or any organiser/edit links.

1. In the KKC Google account, create **two separate new private Google Sheets**. Do not duplicate an already linked Sheet.
2. Open **Extensions > Apps Script** and paste [google-forms-setup.gs](integrations/google-forms-setup.gs).
3. In the test Sheet, run `setupLocalKarthikaRegistration`. In the live Sheet, run `setupProductionKarthikaRegistration`. These name the Sheets `KKC_Karthika_Masam_local` and `KKC_Karthika_Masam_prod`, with separately linked forms. Google will request authorisation to create the form, link the Sheet, and create PDF reports in Drive.
4. Copy the **Responder link (website)** from the new **KKC Setup** tab. Check that the form has all six fields, required/optional status, and accepts a test submission from a signed-out browser. Workspace policies may require adjusting responder access in Google Forms.
5. Set `VITE_REGISTRATION_FORM_URL_LOCAL` to the test responder link in `.env.local`, then restart Vite. In Vercel, set `VITE_REGISTRATION_FORM_URL_PROD` to the live responder link for the **Production** environment, then redeploy. Google Forms responder URLs and `forms.gle` short links are accepted.
6. The website popup now links to the Google Form. Submitting the form saves to the shared Sheet. The website does not claim a registration succeeded merely because the form was opened.
7. Your authorised team can open the Sheet from any system. Reopen the Sheet after setup to see **KKC Registrations > Export registrations to PDF**. It creates a private PDF in the current user's Drive. You can also use **File > Download > PDF** or **Microsoft Excel** in Sheets.

The script is prepared locally, not executed in a Google account. If setup is interrupted, open the saved form link to inspect it; do not clear its stored ID and rerun blindly. No email is sent by this setup or export.

Google Forms does not apply the local demo's duplicate-phone check. Existing local browser records are not automatically imported into Google Forms or its Sheet; export them separately first.

## Local demo while Google is not configured

Without the selected environment's responder URL, the existing browser-only demo remains clearly labelled. Existing saved entries are preserved; absent Gothram/address values show “Not provided”.

Open **Demo registrations & PDF / Excel export** below the event card:
- **Print / Save PDF** opens a formatted report. Click **Print / Save as PDF** in that tab and choose **Save as PDF** in the browser dialog.
- **Download Excel (.xlsx)** includes the updated fields.

Local storage remains specific to the browser and site origin. PDF/Excel export does not synchronise data. Once Google Forms is configured, the local records panel is hidden from the public registration flow. An invalid configured URL shows an unavailable message instead of pretending to collect online registrations.

## Local and production stay separate

| Use | Google Sheet | Frontend variable |
| --- | --- | --- |
| Local Vite development | KKC_Karthika_Masam_local | VITE_REGISTRATION_FORM_URL_LOCAL |
| Production build / kkcorg.com | KKC_Karthika_Masam_prod | VITE_REGISTRATION_FORM_URL_PROD |

Put the local responder link in `FrontEnd/.env.local`:

```env
VITE_REGISTRATION_FORM_URL_LOCAL=https://docs.google.com/forms/d/e/YOUR_LOCAL_FORM/viewform
```

Set the production responder link under Vercel > kkc-frontend > Settings > Environment Variables:

```env
VITE_REGISTRATION_FORM_URL_PROD=https://docs.google.com/forms/d/e/YOUR_PROD_FORM/viewform
```

These example URLs are placeholders, not created forms. The script must be run in your Google account to create the actual two forms/Sheets.

The frontend currently runs on **Vercel**. Adding these variables only to the Render backend does not configure Vercel. If you later host the frontend on Render instead, set PROD in that frontend build service's environment and rebuild there.

Vite development selects LOCAL. Production builds, including a locally previewed production build, select PROD. There is no fallback from LOCAL to PROD or PROD to LOCAL. If the selected variable is missing, the labelled browser-only demo appears. Preview deployments also build in production mode: leave PROD unset in Vercel Preview to use the demo, or set it to the test form specifically for Preview.

The old unsuffixed `VITE_REGISTRATION_FORM_URL` variable is no longer used. Move any existing value to the correct suffixed variable and rebuild. The values are compiled at build time; a push alone does not update existing environment configuration.

PDF report filenames include the Sheet environment. The setup script rejects changing an existing linked Sheet from local to prod and rejects form IDs belonging to another Sheet. Keep both response Sheets private.

The public production responder URL is now configured in .env.production, which can be committed because it contains no organiser links or secrets. New production builds use it automatically. A same-named variable configured directly in Vercel takes precedence; update or remove any stale override. Local development continues using the separate .env.local setting.

## KKC-styled form
See [Styled registration deployment](integrations/STYLED_REGISTRATION.md) for the embedded black-and-gold form using the same local/prod Forms and Sheets. Existing responder links remain active until the web apps are deployed.
