# QR payment acknowledgement

The styled registration includes the exact supplied PhonePe image for **KOMPELLA KRISHNA CHAITANYA**. The original JPEG is preserved in [assets/kkc-phonepe-qr.jpeg](assets/kkc-phonepe-qr.jpeg). The HTML embeds the same bytes directly, so it needs no image hosting or extra Apps Script file.

Flow:
1. Fill the registration details.
2. Scan the QR in the UPI app, or use **Save QR image** on the same phone.
3. Enter the transaction/reference number and tick the payment acknowledgement.
4. Submit. Success appears only after the registration and acknowledgement are saved.

No amount is set by this form. It does not initiate payments or check a bank/payment provider. The saved acknowledgement is always **Reported paid - pending manual verification**. KKC must match the transaction reference with its actual payment records. An acknowledgement is not proof that money arrived.

## Update the existing local deployment

1. Replace **Code.gs** with all of [google-forms-setup.gs](google-forms-setup.gs).
2. Replace **Registration.html** with all of [Registration.html](Registration.html). This file includes the QR image; copy the entire file.
3. Save and run **configureKkcStyledRegistration** once. It adds **Payment reference** and **Payment acknowledgement** to the existing linked form without recreating the form/Sheet or deleting old registrations.
4. **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**.
5. Reopen the existing local /exec URL or localhost registration popup. In LOCAL TEST mode, do not make a real payment; use a test reference and checkbox to test the flow.

Repeat in the production Apps Script project when ready. Updating an existing deployment keeps the same /exec URL, so the website URL setting need not change.

New form setup also includes the two payment fields. The old Google Forms fallback asks these questions once the script setup is refreshed, but the QR display is in the KKC-styled form.

The Sheet response tab receives the payment reference and acknowledgement alongside each registration. Existing Google Sheets Excel downloads and the PDF export include the form's payment answers. Older registrations have no payment answers; do not interpret them as paid or verified.

The local browser-only demo remains a separate preview; it is not the QR/payment collection flow. No real payment or Google registration was made during local checks.
