# Registration improvements — deploy local first

The existing bilingual Seva cards remain. This update adds event dates/timings, venue when configured, optional email, phone-use explanation, unchecked WhatsApp reminder consent, organiser help links, private invitation sharing, registration-source tracking and an optional selected-amount UPI-app link.

Payment remains self-reported and pending KKC verification. No automated WhatsApp messages are sent. Consent records permission only; organisers must honour opt-outs.

## Update the existing Google Apps Script deployment

Do this in the _local project first, then repeat in _prod after checking the local form.

1. Replace Code.gs with integrations/google-forms-setup.gs.
2. Replace the Registration HTML file with integrations/Registration.html.
3. Run configureKkcStyledRegistration from the editor. This makes email optional and adds WhatsApp reminders consent and Registration source to the existing linked form. It preserves previous responses. Do not create a new Sheet or form.
4. In Project Settings > Script properties, optionally add:
   - Venue details are in kkcVenueSummary_ in Code.gs: daily Abhishekam / Maha Lingarchana at Vijaya Lakshmi Villa; Homams at Dasa Hanuman and Durga Devi Temple. The old KKC_EVENT_VENUE property is no longer used.
   - KKC_VERIFIED_UPI_ID: optional override. The default is 7981041123@axl, supplied by the organiser.
5. Choose Deploy > Manage deployments > Edit > Version: New version > Deploy. Updating the existing deployment preserves its /exec URL.
6. Test in a signed-out browser. In _local, do not make a payment; the UPI-app link stays hidden.

Production uses 7981041123@axl for the selected-amount payment link. The existing QR and QR-download method remain available. The confirmed temple venue is included by default. Opening a UPI app is not evidence of payment; the acknowledgement still requires manual verification.

## Website and Android

Website source changes must be deployed through Git/Vercel separately. Android builds must be regenerated to include changed app text. Updating Google Apps Script changes the hosted registration form for both clients.

For campaign attribution use website links such as:
- https://kkcorg.com/?source=whatsapp
- https://kkcorg.com/?source=family
- https://kkcorg.com/?source=poster

The website forwards this source to the registration form. Android uses android. Only letters, digits, underscores and hyphens are accepted, up to 40 characters. Direct Google Form submissions do not automatically carry website campaign attribution.

## Check results

The linked response Sheet includes the new consent and source columns after migration/submission. Filter WhatsApp reminders consent to Yes before sending promotional reminders. Compare registration counts by Seva and Registration source using a pivot table. Reported paid amount is not verified revenue: reconcile each payment reference with actual received transactions first.

No invented testimonials, attendee counts or scarcity messages were added. Add real photos/testimonials only with the relevant permission.

## WhatsApp thank-you messages

New styled-form registrations automatically prepare a private row in the KKC WhatsApp tab. This does not send a message.

1. Open the organisers' registration spreadsheet, then the KKC WhatsApp tab.
2. Click Send WhatsApp thank-you beside a registration.
3. Review the prefilled recipient/message in WhatsApp and press Send.
4. Change Send status from Ready to send to Sent manually only after sending.

The message contains the registrant's name, selected Seva, reported Dakshina and reference, and says payment awaits verification. There is no paid WhatsApp API and no automatic messaging. The Sheet cannot detect whether WhatsApp sent or delivered the message.

After replacing Code.gs and updating the existing deployment, reload the spreadsheet. Use KKC Registrations > Refresh WhatsApp thank-you links once to create the tab/backfill existing registrations. This also recovers missing links and covers direct Google Form submissions. Rerunning preserves existing Sent manually statuses and does not duplicate references.

Keep the spreadsheet private: the links contain each person's phone number and registration details. Thank-you messages are transaction acknowledgements; they do not require opting in to promotional reminders. Only use the separate reminders consent for promotional follow-ups.


## Separate programme venues and PNG logo

Daily Abhishekam and Maha Lingarchana: Plot No. 26, 2nd Floor, Vijaya Lakshmi Villa, Mahadevapuram, Gajularamaram, KPHB.
Directions: https://maps.app.goo.gl/S9kyPnkr5G5kyVCZA

Purusha Suktam Homams and Rudra Homam: Dasa Hanuman and Durga Devi Temple, 119, Chandulal Baradari Colony, Nayeem Gulshan Colony, Ramnas Pura, Hyderabad, Telangana 500053.

Update both Code.gs and Registration.html, run configureKkcStyledRegistration, then update the existing Apps Script deployment. Registration.html embeds the supplied PNG logo. The public website and Android assets need their own builds/deployments.

Homam directions: https://maps.app.goo.gl/5un373U6LkZx8EYi8
