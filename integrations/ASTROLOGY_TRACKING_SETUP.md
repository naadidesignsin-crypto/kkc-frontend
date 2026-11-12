# Separate astrology customer tracking — local first

The Karthika Masam project, deployment URL, Google Form and registration sheet must stay unchanged. Astrology now uses NEW spreadsheets and NEW Apps Script projects. There is no fallback to event registration URLs.

## Local setup

1. Create a new PRIVATE Google Sheet named **KKC_Astrology_local**. Do not use the Karthika sheet.
2. In this new sheet, open Extensions > Apps Script.
3. Replace this NEW project's Code.gs with the packaged Code.gs (source: integrations/AstrologyTracking.gs).
4. Add an HTML file named **AstrologyTracker** and paste packaged AstrologyTracker.html.
5. Run **configureLocalAstrologyTracking** as the sheet owner and authorize access.
6. Deploy > New deployment > Web app. Execute as **Me**; access **Anyone**. Deploy only this NEW astrology project.
7. Copy the new **/exec** Web app URL and provide it to update VITE_ASTROLOGY_WEBAPP_URL_LOCAL in FrontEnd/.env.local. Restart the local Vite server after changing configuration.
8. Open http://127.0.0.1:5173/#astrology-booking. Complete a test enquiry, agree to saving, and choose Save enquiry & prepare WhatsApp.
9. Success shows an ASTRO-… reference. Check **AstrologyCustomers_local** in the NEW KKC_Astrology_local spreadsheet.

## Production setup (kkcorg.com / Vercel)

1. Create a NEW private Google spreadsheet named **KKC_Astrology_prod**. Keep the local and Karthika spreadsheets unchanged.
2. In this new spreadsheet choose **Extensions > Apps Script**.
3. Replace Code.gs with **integrations/AstrologyTracking.gs** (packaged as Code.gs).
4. Add an HTML file named **AstrologyTracker**, then paste **AstrologyTracker.html**.
5. Save both files. Select **configureProductionAstrologyTracking** from the function dropdown and click **Run**. Authorize as the sheet owner. Confirm the spreadsheet now contains **AstrologyCustomers_prod**.
6. Choose **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Deploy and copy the URL ending in **/exec**. This must be a NEW astrology production deployment, not the local or Karthika deployment.
7. In Vercel open **kkc-frontend > Settings > Environment Variables**. Add **VITE_ASTROLOGY_WEBAPP_URL_PROD** with this new /exec URL, selecting **Production**. Do not put a Sheet/edit URL in this value. Ensure VITE_REGISTRATION_ENV is not set to local in Production; if present, use prod.
8. Push main, then deploy/redeploy the frontend after saving the environment variable. Vite embeds this configuration during the build; changing it requires a new deployment.
9. Open **https://www.kkcorg.com/#astrology-booking**, refresh, and submit one clearly labelled test enquiry. Select consent and save. Success must show an **ASTRO-** reference. Confirm the same reference, name, birth details, chosen duration and fee appear in **KKC_Astrology_prod > AstrologyCustomers_prod**. Remove the labelled test row after checking.
10. Organisers can download the register from this private Sheet using **File > Download > Microsoft Excel (.xlsx)**, or **File > Print > Save as PDF**. Visitors cannot read this private register.

Local testing continues to use VITE_ASTROLOGY_WEBAPP_URL_LOCAL and AstrologyCustomers_local. Never copy the local deployment into the production variable. Share the new production /exec URL with the developer if configuration help is needed; do not share private customer records.

When updating Apps Script code later, use **Deploy > Manage deployments > Edit > New version > Deploy** on the astrology production project. Saving the editor alone does not update the deployed Web app.

Never paste an event registration URL into either astrology setting. The frontend rejects URLs identical to configured event endpoints. The astrology setup refuses a project containing Karthika script properties or event response tabs.

## Data recorded

Customer consent is unchecked by default. After agreement, the sheet records name, gender, phone, DOB, birthplace/time, selected topic, question, duration, server-derived fee, preferred call time, reported payment and booking status. Prices remain INR999 for 10 minutes and INR1500 for 20 minutes. Hours: 2 PM–9 PM IST; the date and appointment time require KKC confirmation.

Payment is never automatically verified. Records use not_paid or reported_paid_pending_verification and Enquiry - slot not confirmed. The website cannot read the private register. Download from Sheets using File > Download or File > Print / Save as PDF.

The browser waits for server confirmation before showing a reference. On failure, WhatsApp fallback explicitly does not confirm a saved record. Retrying reuses the request ID to avoid duplicates.

## Important correction to earlier setup

Earlier packages suggested adding the tracker to the existing event project. **Do not follow that approach.** Use this standalone package instead. Do not redeploy or edit Karthika Masam for this task. Existing Karthika website URLs are untouched.

This local code does not create or deploy private Google Sheets itself. Live saving remains unavailable until the new astrology deployment URL is configured. Local mocked browser and server tests are separate from live Google delivery.

## Customer feedback / reviews

The website feedback form is at **https://www.kkcorg.com/#customer-review**. After a completed consultation, manually send this link from the KKC WhatsApp number:

> Thank you for choosing KKC. How was your consultation? Please share your honest feedback: https://www.kkcorg.com/#customer-review

No automated WhatsApp messages are sent. Ask all customers for honest feedback, regardless of their experience.

### Activate reviews

Update BOTH Code.gs (from AstrologyTracking.gs) and AstrologyTracker.html in the existing standalone astrology project. Do this separately for local and production. Keep existing script properties and deployment URLs. Use **Deploy > Manage deployments > Edit > New version > Deploy** after saving. Do not modify the Karthika project.

The first successful review creates **CustomerReviews_local** or **CustomerReviews_prod** in the corresponding astrology spreadsheet. It records name, rating, comment, optional unverified enquiry reference, permission to publish and moderation status. No phone or birth details are requested. Download this tab through Sheets for Excel/PDF.

Every review starts **Pending - not published**. Permission to publish is unchecked by default and separate from required storage consent. The updated public review section displays only reviews with permission **Yes** and moderation status **Approved**. Review feedback for private details before approval. Reviews are not automatically verified as completed consultations.

Test locally first: submit one labelled test review, confirm its returned ASTRO-REVIEW reference in CustomerReviews_local, then activate the production deployment and frontend. A failed save must not be treated as a received review.

### Display approved reviews on the website

A **Customer Experiences** section now appears below Astrology at **/#customer-experiences**. It reads only the public first name, rating and feedback through the astrology deployment. No private sheet is published or shared.

To show a review, open **CustomerReviews_local** (testing) or **CustomerReviews_prod** (live):
1. Confirm **Permission to publish first name and feedback** is **Yes** (column H). Do not change a customer's No to Yes.
2. Review the feedback in column F for personal details and suitability, regardless of the star rating.
3. Check **Public first name** in column K. Only its first word is displayed; the private full name is never used as fallback.
4. Change **Moderation status** in column I from Pending - not published to exactly **Approved**.
5. Refresh the website and scroll to Customer Experiences. The newest 20 eligible reviews appear. Change status back to Pending (or remove consent on customer request) to hide a review on subsequent loads.

With the updated deployment AND frontend, Approved + Yes enables public display. Existing rows stay pending and private.

Update BOTH Apps Script files and deploy a New version in each astrology project before using public reviews. The URL stays the same. Karthika scripts are unchanged. New reviews do not appear immediately after submission; approval is required.
