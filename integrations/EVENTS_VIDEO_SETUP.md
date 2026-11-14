# Daily KKCEvents videos — local first

The private local spreadsheet is KKC_Karthika_Masam_local (ID 1W7vUGqgteYPYDJXha2ZygdKCeMfHXNCzkPwoEsivKrg). The reader reads ONLY A:E of DailyVideos_local. It never writes rows or reads registration tabs. Do not publish or share the whole spreadsheet.

1. Open https://script.google.com/home and click New project. Name it KKCEvents_VideoReader_local. This must be a NEW standalone project, not Extensions > Apps Script in the existing registration sheet.
2. Replace Code.gs with EventsVideoFeed.gs from this folder (packaged as Code.gs).
3. Save, select configureLocalEventsVideos, then click Run. Authorize using an account that can read your spreadsheet.
4. Confirm the execution log says Video reader configured for local.
5. Deploy > New deployment > Web app. Execute as Me; access Anyone. Copy the /exec URL.
6. Send this URL to the developer. It belongs in VITE_EVENTS_VIDEO_URL_LOCAL in FrontEnd/.env.local. Restart Vite after configuration.
7. Open http://127.0.0.1:5173/#daily-events-videos. Close the opening invitation. The Daily Karthika Masam videos panel opens.
8. Only Published rows appear, newest date first. Click Watch video to embed a video, or Open on YouTube. Refresh videos reloads the sheet.

Headers in A1:E1 must be exactly:
Date | Video title | YouTube video link | Status | Description

Dates can be normal Google Sheets dates, yyyy-MM-dd, dd/MM/yyyy or dd-MM-yyyy. Links may be standard YouTube watch, Shorts, live or youtu.be links. Recognised YouTube links missing https:// are normalized automatically. Use the link to an individual video, not a channel. Public or Unlisted videos with embedding enabled can play; Private videos cannot be played by visitors. Status must be Published (case insensitive). Draft/blank rows, invalid links, missing titles and invalid dates are hidden. Description is optional. The newest 60 valid unique video links are displayed.

To remove a video, change its status to Draft, then refresh the page. Updating rows does not require a deployment or website code change.

Production needs its own reader URL; never reuse the local, registration or astrology deployment URL.

After future script edits: Deploy > Manage deployments > Edit > New version > Deploy. Keep the /exec URL. Saving the editor alone does not update the deployment.

## Production setup

1. Open the EXISTING production Karthika spreadsheet: https://docs.google.com/spreadsheets/d/1IMTRH1AdbV3lVMxSmo2p5rgUCd3cOknIxeIhGr5Tv4I/edit . Use the Google account that owns it. Keep all registration tabs unchanged.
2. Create a new tab named DailyVideos_prod. Copy the five headers and video rows from DailyVideos_local. A sample CSV is included in the production package. Keep the full spreadsheet private.
3. Open https://script.google.com/home and create a NEW standalone project named KKCEvents_VideoReader_prod. Do not reuse the local project or registration script.
4. Paste Code.gs from the production package. Save and run configureProductionEventsVideos. Authorize with the spreadsheet owner account.
5. Deploy > New deployment > Web app > Execute as Me > Access Anyone. Copy the /exec URL. Send that URL to configure VITE_EVENTS_VIDEO_URL_PROD in the frontend production settings. Never put the local URL in this value.
6. Deploy the frontend after configuring the URL. If Vercel already defines VITE_EVENTS_VIDEO_URL_PROD, make sure it matches the new URL; environment variables override .env.production.
7. Open https://www.kkcorg.com/#daily-events-videos and verify the Published video. Test rows on localhost still come only from DailyVideos_local.

Daily use: upload to YouTube, add a row to DailyVideos_prod, set Published, then refresh videos. No script redeployment is needed for row changes. The current reader exposes the newest 60 valid unique videos, with no registration data.
