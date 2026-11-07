# Invitation and registration QR

Destination: https://kkcorg.com/telugu?invite=karthika-2026&source=poster_qr

Scanning opens the main Karthika Masam invitation on KKC. The Register button opens the configured registration form in Telugu. The source is forwarded as poster_qr for registration attribution. This QR is for the invitation, not UPI payment.

The invite=karthika-2026 parameter explicitly opens the invitation even when automatic event notices are no longer active. The event status remains truthful; the Google form controls whether registrations are accepted.

Public standalone QR image: /kkc-invitation-registration-qr.png

The three bilingual poster JPGs under src/assets/events include this same QR. WhatsApp sharing exports are saved in the workspace at output/posters/karthika-2026-bilingual-v3. The QR was generated with Q error correction and a four-module quiet zone; do not crop that white border.

Validation: decoded the QR from all three exported JPGs at original and half resolution; checked the production-build mobile invitation and registration flow, language and source forwarding. Real phone camera and WhatsApp compression testing is still useful before printing a large batch.
