# Karthika Masam registration demo

The homepage shows a registration popup once per browser tab session, a dedicated event card, and a Karthika Masam entry in Upcoming Events.

Edit event name, description, date, time, and venue in `src/data/karthikaEvent.ts`. Dates and venue are currently "To be announced". The slideshow entry is in `src/data/events.ts` and reuses an existing event photo.

Registration collects full name, a 10-digit Indian mobile number, attendee count (1–50), optional email, and an optional note. A duplicate mobile number for the same event is rejected within this browser.

Open "Demo registrations & Excel export" below the event card to view records and download an actual `.xlsx` workbook. The spreadsheet library is loaded only when exporting. Excel columns include registration ID, event, name, mobile, email, attendees, note, and UTC registration timestamp.

Data is stored under `kkc.event-registrations.v1` in localStorage. It is specific to this browser and website origin; clearing browser data removes it. No information is submitted to KKC or shared between visitors. The demo panel has no admin authentication. Shared collection and protected administration need a backend or another shared registration service before public use.

Validation completed: TypeScript check, Vite production build, and browser checks for required/mobile validation, persistence, duplicates, XLSX content, formula-safe string cells, mobile width, keyboard focus trapping, and corrupt storage handling.

No backend changes are required for this demo.
