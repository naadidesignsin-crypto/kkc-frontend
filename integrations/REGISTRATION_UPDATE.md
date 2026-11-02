# Wider KKC form and Dakshina reports

The styled registration now uses up to 1120px of desktop width, the original embedded KKC logo, and four mandatory Seva choices: INR 10116, 5116, 2116 and 516. Selection follows the registrant through their details, QR payment, review and receipt. The amount reported paid appears after they acknowledge paying the selected amount; bank verification remains manual.

New submissions record Seva / సేవ, Dakshina (INR), Reported paid amount (INR), Payment reference and Payment acknowledgement in the existing linked response Sheet. The server derives both monetary values from the allowed Seva after acknowledgement; browser-supplied monetary values are ignored.

The existing PDF export now creates a wider landscape Google document and PDF, with a summary grouped by all four amounts and registration details under each group. Selected totals and self-reported paid totals are labelled separately. Missing old amounts remain missing; inconsistent or older unclassified records are included under Uncategorised. Export displays both the private Google document link and PDF link.

## Apply to existing Google projects

Repeat separately for _local first, then _prod:

1. Replace Code.gs with integrations/google-forms-setup.gs.
2. Replace the Registration HTML file with integrations/Registration.html. It includes the real logo; no extra image hosting or file is needed.
3. Run configureKkcStyledRegistration in the existing bound project. This adds missing fields without recreating the Form, changing its Sheet, or deleting old responses.
4. Deploy > Manage deployments > Edit > New version > Deploy. Preserve the existing /exec URL.
5. Use that environment's web-app /exec URL as VITE_REGISTRATION_WEBAPP_URL_LOCAL or VITE_REGISTRATION_WEBAPP_URL_PROD respectively. Restart the local server, or redeploy Vercel for production.
6. Test _local without real money. In the linked Sheet, verify the selected Seva, Dakshina, reported paid amount and test reference.
7. Reopen the Sheet and use KKC Registrations > Export registrations to PDF. Open the new document/PDF links shown by the export. Previously generated documents are snapshots and do not update automatically.

Production is configured with its separate styled Apps Script /exec URL in .env.production. The Google Forms page itself cannot receive this project's custom width/logo styling; the updated KKC Apps Script form must be configured to show it. A frontend Git push does not deploy Google Apps Script.

Local visual previews (no submissions):
- http://localhost:5173/registration-preview/english
- http://localhost:5173/registration-preview/telugu

Validated: desktop/mobile/small-mobile widths, original logo bytes, all four prices, bilingual state retention, fixed navigation, paid acknowledgement display, canonical server amounts, duplicate request caching, idempotent fields, grouped report totals and missing legacy amounts. Tests used mocked Google services and did not send real responses.

## Desktop screen-fit layout

The desktop poster viewer now uses the available viewport height. The main invitation uses readable two/three-column text according to screen width; the programme image and date cards fit side by side. All six original Telugu paragraphs and all schedule dates are retained.

Registration uses side-by-side personal/optional details, QR/payment information, and compact review rows. Address/note can be expanded without needing to scroll on the desktop sizes tested. Footer navigation stays visible. Mobile keeps its readable single-column layout and natural scrolling; zoomed or unusually small windows can still scroll rather than losing content.

Verified no vertical or horizontal overflow in all three poster views and all four form steps at 1366x768, 1280x720, 1536x864, 1024x768 and 1280x650. Telugu labels were checked at three sizes, and the actual parent popup with a locally mocked Google iframe was checked at 1366x768 and 1280x650. No real registrations/payments were submitted.

Deploy the frontend CSS through Vercel. For the Google-hosted form, replace only the Registration HTML file with the updated integrations/Registration.html and deploy a New version of the existing web app. This layout update does not change Code.gs, payment values, response destinations, or existing registrations.
