# Dakshina options and languages

The styled registration now has four steps: Seva, details, payment, confirmation. One Seva is required; no option is selected automatically.

| Seva | Dakshina (INR) |
| --- | ---: |
| Daily Abhishekam + 4 Mondays Maha Lingarchana + 5 days Homalu | 10,116 |
| Daily Abhishekam + 4 Mondays Maha Lingarchana | 5,116 |
| All 4 Mondays Maha Lingarchana only | 2,116 |
| One-day Rudrabhishekam | 516 |

English / తెలుగు switches the registration UI without losing entered details. Website paths /telugu and /english open the registration with that language when a styled web app is configured. They do not translate the rest of the website. Apps Script supports ?lang=te or ?lang=en.

Local previews (no submissions):
- http://localhost:5173/registration-preview/telugu
- http://localhost:5173/registration-preview/english

## Activate in Google

Repeat separately in your existing _local and _prod Apps Script projects:
1. Replace Code.gs with integrations/google-forms-setup.gs.
2. Replace the Registration HTML file with integrations/Registration.html (file name Registration in Apps Script).
3. Run configureKkcStyledRegistration as the organiser. It adds Seva / సేవ and Dakshina (INR) fields without replacing the form or deleting old responses. Existing registrations will have no new Seva/amount values.
4. Deploy > Manage deployments > Edit > New version > Deploy. Keep the same /exec URL.
5. Test _local first with a test reference, without a real payment. Configure the production web-app URL separately before using it on the live site. A Git push alone does not update Apps Script.

The selected Seva and amount are saved in the linked Google Sheet and included by the existing PDF export. The server derives the amount from the Seva ID and ignores any client-provided amount. The QR is unchanged: the visitor must enter the displayed amount in their UPI app. Acknowledgement means reported paid, pending manual verification; there is no bank verification or automatic payment collection.
