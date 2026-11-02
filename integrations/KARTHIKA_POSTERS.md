# Karthika Masam 2026 posters

Created using the built-in image_gen tool with src/assets/Logo.png as the KKC logo reference. The saved generation prompts are in POSTER_PROMPTS.json.

Final assets:
- src/assets/events/maha-lingarchana-2026.png
- src/assets/events/homam-2026.png

Maha Lingarchana: 16, 23 and 30 November and 7 December 2026, Mondays, 4 PM–8 PM.
Purusha Suktam Homams: 20 November (Shukla Ekadashi), 24 November (Poornima), 4 December (Krishna Ekadashi), 5 December (Krishna Dwadashi), 9:30 AM–11:30 AM.
Amavasya Rudra Homam and Maha Poornahuti: 8 December, 9:30 AM–12 PM.
All timings are IST. Occasion labels and dates follow organiser-supplied details. Venue has not been provided.

The homepage opens a dismissible poster announcement after 1.4 seconds on each page launch. It starts on Maha Lingarchana, with a Homam switch, download link and registration button. Full schedules also appear below in the page. The existing styled registration/Google Forms configuration is preserved. Direct /telugu and /english links continue to open registration in that language.

Status is Upcoming before 16 November, Ongoing from 16 November through 8 December, and Completed from 9 December, using Asia/Kolkata dates. The automatic poster popup stops after the programme. Posters remain accessible in the event section. The homepage hero highlights this programme until it is completed.

Validation: TypeScript and production build passed. Browser checks covered 390×844, 360×640 and 1440×1000 layouts, both posters, uncropped viewport-fit popup, registration handoff, close/Escape and scroll restoration, reloading, and upcoming/ongoing/completed states. All nine supplied weekdays match their calendar dates. No registrations or payments were submitted.

These changes are local. The website needs a Git push/Vercel deployment to publish them. Posters and page schedules do not require a backend or Apps Script redeployment. Changes to the registration HTML/payment options from the previous task still require their separate Apps Script update.

## Main invitation update

The first screen is now src/assets/events/karthika-masam-main-2026.png, generated with the KKC logo and organiser-supplied Telugu programme copy. The two choices are Register / నమోదు and Go to homepage / హోమ్ పేజీ. The main invitation opens first on language entry links too; Register preserves their configured registration language.

Read full Telugu details displays the supplied copy as selectable, accessible text at a readable mobile font size, with the action buttons remaining visible. The main poster, Maha Lingarchana and Homam posters remain available in the homepage event gallery. The hero also uses the main poster. Existing date-based status and completion handling are preserved.

Corrected the main poster and readable text sentence to: మరేదీ ఆశించకుండా ఇట్టి భక్తితో ఆచరించిన వారు సచ్చిదానంద స్వరూపమైన మహత్ఫలితాన్ని, భగవదనుగ్రహాన్ని పొందగలరు.

The organiser subsequently requested their exact original paragraph. It now supersedes the earlier grammatical rewrite in both the image and selectable Telugu text.

## Current main poster: exact typeset Telugu

The main invitation now uses native HTML/CSS text and the actual KKC logo. It replaces the image-only main popup and generated lettering. The dialog fills the viewport; desktop uses two columns with 20px paragraph text, mobile uses one column with 19px text and one vertical content scroll. Register and Homepage actions remain visible. All six paragraphs appear directly, without a Read details toggle.

The downloadable PNG is exported from the same browser-rendered invitation at 1440px width, with no image-model text generation. Both the UI and PNG use this latest exact paragraph:

ఒక్కరోజు శివారాధన ఫలితం సంవత్సరం కృత పాపములు తొలుగును. అలా నెల రోజులు చేయుటవలన ఇంకెంత గొప్ప ఫలితం  పొందగలం? మరీ దేన్ని ఆశించని, సత్ చిత్ ఆనంద మహా ఫలితాన్ని ఈ భక్తితో ఆచరించి శివానుగ్రహం పొందగలరు.

Verified the complete paragraph character-for-character, six paragraph blocks, desktop/mobile/small-mobile layouts, visible footer controls, registration handoff and homepage dismissal. No real registrations or payments submitted.

## Abhishekam image and consistent viewer

Added src/assets/events/parthiva-sivalingam-abhishekam-2026.png, generated with the built-in image_gen tool using the actual KKC logo as reference. It depicts an earthen Parthiva Sivalingam receiving milk Abhishekam. The image sits at the upper-left of the native main invitation. The main PNG download was re-exported from the typeset invitation with this image; the exact approved Telugu copy is unchanged. Generation prompt: POSTER_PROMPTS.json > parthivaAbhishekamImage.

All three posters share the same full-screen viewer and switch buttons. Homam/Lingarchana artwork now uses the full available column width without the old 260px thumbnail limit or a height cap, alongside readable date/time cards. Phone layouts show a full-width poster and stacked readable schedules. Register/Homepage actions remain visible. View full screen opens the selected poster from the inline gallery; View full poster opens it from the event carousel. Poster slides pause automatic advancement while being read; their image overlays no longer darken the content.

Validated desktop 1440x1000, mobile 390x844 and small mobile 360x640: photograph loads, exact Telugu paragraph preserved, all 9 schedule dates and the noon Amavasya time, image widths, no horizontal overflow, stable action footer, full-screen handoffs from gallery/carousel, and registration handoff. No registrations or payments sent.
