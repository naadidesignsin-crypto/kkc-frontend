# Deploy the KKC-styled registration

This version keeps your existing local/prod Google Forms and Sheets. The black-and-gold form appears inside the KKC popup and saves through Google Apps Script. Success appears only after Google confirms the response.

## Local first

1. Open the Apps Script project attached to the existing **_local Sheet**.
2. Replace **Code.gs** with the complete updated [google-forms-setup.gs](google-forms-setup.gs). Keep the same project to preserve existing setup properties and registrations.
3. Click **+ next to Files > HTML**, name it **Registration**, and paste all of [Registration.html](Registration.html). Save both files.
4. Select **configureKkcStyledRegistration**, click **Run**, and review any new Google permissions. It connects to the already-linked form and Sheet; it does not create a new Sheet.
5. **Deploy > New deployment > Web app**. Choose **Execute as: Me** and **Who has access: Anyone**. Deploy and copy the URL ending in **/exec**. Do not use the editor URL or /dev.
6. Share that local /exec URL so it can be configured as:

```env
VITE_REGISTRATION_WEBAPP_URL_LOCAL=https://script.google.com/macros/s/YOUR_LOCAL_DEPLOYMENT/exec
```

Restart Vite. Test from a signed-out browser and confirm the entry reaches only the _local response Sheet. The styled form shows LOCAL TEST.

## Production

Repeat in the existing **_prod Apps Script project** and use its separate /exec URL for:

```env
VITE_REGISTRATION_WEBAPP_URL_PROD=https://script.google.com/macros/s/YOUR_PROD_DEPLOYMENT/exec
```

Set this in Vercel's Production environment and redeploy the frontend, or put the public deployment URL in .env.production. Never include organiser/edit or response Sheet links.

After later server edits, update **Deploy > Manage deployments > Edit > New version > Deploy**. Saving alone does not update /exec.

## Behaviour and limits

- Existing Google Forms links remain active until a WEBAPP_URL is configured for that environment. A configured invalid web app URL shows unavailable.
- The popup has an **Open registration in a new tab** fallback if a browser blocks embedding. The form stays KKC-styled there. Google may show its own hosting/security notice.
- The server selects its configured form and Sheet; the visitor cannot supply destination IDs.
- Required fields, lengths, phone and email are checked on the server. Closed forms reject submissions.
- Existing PDF/Excel exports work with the same responses. Keep both Sheets private.
- Organiser setup/export functions require the project organiser. No public response listing is added.
- A script lock and short-lived receipt cache reduce duplicate retries; the cache is not a permanent uniqueness guarantee.
- Workspace policy must allow anonymous web apps. This deployment has not been performed in your account.

## Payment QR and acknowledgement
See [Payment update instructions](PAYMENT_ACKNOWLEDGEMENT.md) to add the supplied QR, transaction reference, and pending-verification acknowledgement to existing deployments.

## Four-step form
The form now has Seva, Your details, Payment, and Confirm steps with fixed navigation. Address/note are collapsed by default. The original payment image is displayed in a compact QR viewport and can still be saved unchanged.

Review the layout at http://localhost:5173/registration-preview while Vite is running. This endpoint exists only in development and cannot submit registrations. To update the actual embedded Google app, replace Registration.html in Apps Script and deploy a New version under Manage deployments. Keep Code.gs updated to the payment-aware version if not already applied.

For the wider form, original KKC logo, four Dakshina categories and grouped Google document/PDF reports, follow [Registration update](REGISTRATION_UPDATE.md).
