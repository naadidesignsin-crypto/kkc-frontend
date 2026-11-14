// NEW standalone Apps Script project. Do not paste into any registration project.
function configureLocalEventsVideos() {
  kkcConfigureEventsVideos_("1W7vUGqgteYPYDJXha2ZygdKCeMfHXNCzkPwoEsivKrg", "local");
}
function configureProductionEventsVideos() {
  kkcConfigureEventsVideos_("1IMTRH1AdbV3lVMxSmo2p5rgUCd3cOknIxeIhGr5Tv4I", "prod");
}
function kkcConfigureEventsVideos_(sheetId, environment) {
  var active = Session.getActiveUser().getEmail();
  if (!active || active !== Session.getEffectiveUser().getEmail()) throw new Error("Run setup as the owner.");
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty("KKC_WEBAPP_SHEET_ID") || props.getProperty("KKC_ASTRO_SHEET_ID")) throw new Error("Create a NEW standalone video-reader project.");
  var existingEnvironment = props.getProperty("KKC_VIDEO_ENV");
  if (existingEnvironment && existingEnvironment !== environment) throw new Error("Use a NEW separate video-reader project for " + environment + ". Do not replace the other environment.");
  var tab = SpreadsheetApp.openById(sheetId).getSheetByName("DailyVideos_" + environment);
  if (!tab) throw new Error("Create the DailyVideos_" + environment + " tab first.");
  var expected = ["Date", "Video title", "YouTube video link", "Status", "Description"];
  var headers = tab.getRange(1, 1, 1, 5).getDisplayValues()[0];
  if (headers.join("|") !== expected.join("|")) throw new Error("Check the five headers in A1:E1.");
  props.setProperties({KKC_VIDEO_SHEET_ID:sheetId, KKC_VIDEO_ENV:environment});
  console.log("Video reader configured for " + environment + ". Existing tabs and registration deployments were not changed.");
}
function kkcVideoConfig_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("KKC_VIDEO_SHEET_ID"), env = props.getProperty("KKC_VIDEO_ENV");
  if (!id || ["local","prod"].indexOf(env) < 0) throw new Error("Configure the video reader first.");
  return {sheetId:id, environment:env};
}
function kkcYoutubeId_(value) {
  var link = String(value || "").trim();
  if (["youtube.com/", "www.youtube.com/", "m.youtube.com/", "youtu.be/"].some(function(host) { return link.indexOf(host) === 0; })) link = "https://" + link;
  var match = link.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/);
  return match ? match[1] : "";
}
function getPublishedEventVideos(environment) {
  var config = kkcVideoConfig_();
  if (environment !== config.environment) throw new Error("Video environment mismatch.");
  var tab = SpreadsheetApp.openById(config.sheetId).getSheetByName("DailyVideos_" + config.environment);
  if (!tab || tab.getLastRow() < 2) return {ok:true,videos:[]};
  var rows = tab.getRange(2, 1, tab.getLastRow()-1, 5).getValues();
  var videos = [], seen = {};
  rows.forEach(function(row) {
    if (String(row[3]).trim().toLowerCase() !== "published") return;
    var id = kkcYoutubeId_(row[2]), title = String(row[1] || "").trim(), description = String(row[4] || "").trim();
    var date = row[0] instanceof Date ? Utilities.formatDate(row[0],"Asia/Kolkata","yyyy-MM-dd") : String(row[0] || "").trim();
    var shortDate = date.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (shortDate) date = shortDate[3]+"-"+("0"+shortDate[2]).slice(-2)+"-"+("0"+shortDate[1]).slice(-2);
    var parsed = new Date(date+"T00:00:00Z");
    if (!id || seen[id] || !title || title.length > 160 || description.length > 600 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) return;
    seen[id] = true; videos.push({id:id,title:title,date:date,description:description});
  });
  videos.sort(function(a,b) {return b.date.localeCompare(a.date);});
  return {ok:true,videos:videos.slice(0,60)};
}
function doGet(event) {
  var config = kkcVideoConfig_(), p = event && event.parameter || {};
  if (p.page !== "events-video-feed") return HtmlService.createHtmlOutput("KKC Events video reader: " + config.environment + ". Published videos only.");
  var origin = String(p.parentOrigin || ""), channel = String(p.channel || "");
  var localOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  var prodOrigin = ["https://www.kkcorg.com","https://kkcorg.com"].indexOf(origin) >= 0;
  if (!(config.environment === "local" ? localOrigin : prodOrigin) || !/^[a-zA-Z0-9-]{20,80}$/.test(channel)) throw new Error("Unsupported video page.");
  var script = '(function(){var origin='+JSON.stringify(origin)+',channel='+JSON.stringify(channel)+';google.script.run.withSuccessHandler(function(result){window.top.postMessage({type:"kkc-events-result",channel:channel,ok:true,videos:result.videos},origin)}).withFailureHandler(function(){window.top.postMessage({type:"kkc-events-result",channel:channel,ok:false},origin)}).getPublishedEventVideos('+JSON.stringify(config.environment)+');})();';
  return HtmlService.createHtmlOutput('<!doctype html><html><head><base target="_top"></head><body><script>'+script+'</script></body></html>').setTitle("KKC Events videos").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
