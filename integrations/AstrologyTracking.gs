// STANDALONE ASTROLOGY PROJECT ONLY. Do not add to the Karthika Masam script.
function kkcAstrologyOrganiser_() {
  var active = Session.getActiveUser().getEmail();
  var effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective) throw new Error('Run setup from the astrology spreadsheet owner account.');
}
function configureLocalAstrologyTracking() { kkcConfigureAstrology_("local"); }
function configureProductionAstrologyTracking() { kkcConfigureAstrology_("prod"); }
function kkcConfigureAstrology_(environment) {
  kkcAstrologyOrganiser_();
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book || !book.getName().endsWith("_" + environment)) throw new Error("Use a NEW astrology sheet named KKC_Astrology_" + environment + ". Do not use the event registration sheet.");
  var properties = PropertiesService.getScriptProperties();
  if (properties.getProperty("KKC_WEBAPP_FORM_ID") || properties.getProperty("KKC_WEBAPP_SHEET_ID")) throw new Error("This is the Karthika Masam project. Create a separate astrology project.");
  var sheets = book.getSheets();
  if (sheets.some(function(sheet) { return /^(Form Responses|KKC Setup|WhatsApp)/i.test(sheet.getName()); })) throw new Error("Do not use the Karthika Masam spreadsheet. Create a new astrology spreadsheet.");
  properties.setProperties({KKC_ASTRO_SHEET_ID:book.getId(), KKC_ASTRO_ENVIRONMENT:environment});
  kkcAstrologySheet_({sheetId:book.getId(), environment:environment});
  SpreadsheetApp.getUi().alert("Astrology tracker ready for _" + environment + ". Deploy this ASTROLOGY project as a new Web app. Do not update the Karthika Masam deployment.");
}
function kkcAstrologyConfiguration_() {
  var properties = PropertiesService.getScriptProperties();
  var sheetId = properties.getProperty("KKC_ASTRO_SHEET_ID");
  var environment = properties.getProperty("KKC_ASTRO_ENVIRONMENT");
  if (!sheetId || ["local","prod"].indexOf(environment) < 0) throw new Error("Configure this separate astrology project first.");
  return {sheetId:sheetId, environment:environment};
}
function doGet(event) {
  if (event && event.parameter && event.parameter.page === "astrology-tracker") return kkcAstrologyBridge_(event);
  var config = kkcAstrologyConfiguration_();
  return HtmlService.createHtmlOutput("KKC Astrology tracker _" + config.environment + " is configured. Submit enquiries from kkcorg.com.").setTitle("KKC Astrology Tracking");
}
function kkcAstrologyBridge_(event) {
  var p = event && event.parameter || {};
  var origin = typeof p.parentOrigin === 'string' ? p.parentOrigin : '';
  var allowed = ['https://kkcorg.com', 'https://www.kkcorg.com'];
  var extras = (PropertiesService.getScriptProperties().getProperty('KKC_ASTRO_ALLOWED_ORIGINS') || '').split(',').map(function(x) { return x.trim(); }).filter(Boolean);
  if (allowed.indexOf(origin) < 0 && extras.indexOf(origin) < 0 && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) throw new Error('Unsupported booking site.');
  if (!/^[a-zA-Z0-9-]{20,80}$/.test(p.channel || '')) throw new Error('Invalid submission channel.');
  var template = HtmlService.createTemplateFromFile('AstrologyTracker');
  template.parentOrigin = origin;
  template.channel = p.channel;
  return template.evaluate().setTitle('KKC customer enquiry').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function kkcAstrologyHeaders_() {
  return ['Registered at (IST)', 'Enquiry reference', 'Request ID', 'Name', 'Gender', 'WhatsApp', 'Date of birth', 'Birthplace', 'Birth time (local)', 'Consultation topic', 'Query', 'Call duration (minutes)', 'Fee (INR)', 'Preferred call time (IST)', 'Reported paid', 'Payment reference', 'Payment status', 'Booking status', 'Environment'];
}
function configureKkcAstrologyTracking() {
  kkcAstrologyOrganiser_();
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var match = book && book.getName().match(/_(local|prod)$/);
  if (!match) throw new Error('Name your NEW astrology sheet KKC_Astrology_local or KKC_Astrology_prod.');
  kkcConfigureAstrology_(match[1]);
}
function kkcAstrologySheet_(config) {
  var book = SpreadsheetApp.openById(config.sheetId);
  var name = 'AstrologyCustomers_' + config.environment;
  var sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, kkcAstrologyHeaders_().length).setValues([kkcAstrologyHeaders_()]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, kkcAstrologyHeaders_().length).setFontWeight('bold');
  }
  return sheet;
}
function saveKkcAstrologyCustomer(input) {
  var config = kkcAstrologyConfiguration_();
  if (!input || input.consent !== true) throw new Error('Please agree to saving your consultation details.');
  if (input.environment !== config.environment) throw new Error('The local/prod tracking configuration does not match. Please contact KKC.');
  if (!/^[a-zA-Z0-9-]{20,80}$/.test(input.requestId || '') || input.website) throw new Error('Invalid enquiry. Please reopen the booking page.');
  var minutes = Number(input.minutes);
  var fee = minutes === 10 ? 999 : minutes === 20 ? 1500 : 0;
  if (!fee) throw new Error('Choose a 10-minute or 20-minute call.');
  var limits = {name:120,gender:30,phone:20,dob:10,birthplace:200,birthtime:80,topic:40,query:1500,preferredTime:150,paymentReference:80};
  var data = {};
  Object.keys(limits).forEach(function(key) {
    var value = typeof input[key] === 'string' ? input[key].trim() : '';
    if (value.length > limits[key]) throw new Error('Please shorten the ' + key + ' field.');
    data[key] = value;
  });
  if (!data.name || !data.birthplace || !data.query) throw new Error('Please complete name, birthplace and your query.');
  data.phone = data.phone.replace(/[\s()+-]/g, '');
  if (!/^\d{10,15}$/.test(data.phone)) throw new Error('Enter a valid phone number.');
  if (['Male','Female','Prefer not to say'].indexOf(data.gender) < 0) throw new Error('Choose a valid gender option.');
  var today = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  var parsed = new Date(data.dob + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob) || isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== data.dob || data.dob > today || data.dob < '1900-01-01') throw new Error('Enter a valid date of birth.');
  if (data.birthtime !== 'Unknown' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthtime)) throw new Error('Enter birth time or choose unknown.');
  var topics = {horoscope:'Full horoscope',education:'Education',marriage:'Marriage concerns',business:'Business growth',overseas:'Overseas travel',health:'Health concerns',home:'Owning a home',property:'Property concerns',parenthood:'Children & parenthood'};
  if (data.topic && !topics[data.topic]) throw new Error('Choose a valid consultation topic.');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('Enquiries are busy. Please retry.');
  try {
    var sheet = kkcAstrologySheet_(config);
    var last = sheet.getLastRow();
    if (last > 1) {
      var rows = sheet.getRange(2, 2, last - 1, 2).getDisplayValues();
      for (var i = 0; i < rows.length; i++) if (rows[i][1] === input.requestId) return {ok:true,reference:rows[i][0],environment:config.environment};
    }
    var reference = 'ASTRO-' + Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
    var safe = function(value) { return /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value; };
    var row = [Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'), reference, input.requestId, data.name, data.gender, data.phone, data.dob, data.birthplace, data.birthtime, topics[data.topic] || 'General consultation', data.query, minutes, fee, data.preferredTime || 'KKC to confirm (2 PM–9 PM IST)', input.reportedPaid === true ? 'Yes, unverified' : 'No', data.paymentReference, input.reportedPaid === true ? 'reported_paid_pending_verification' : 'not_paid', 'Enquiry - slot not confirmed', config.environment].map(function(value) { return typeof value === 'string' ? safe(value) : value; });
    var range = sheet.getRange(last + 1, 1, 1, row.length);
    range.setNumberFormat('@').setValues([row]);
    sheet.getRange(last + 1, 12, 1, 2).setNumberFormat('0');
    return {ok:true,reference:reference,environment:config.environment};
  } finally { lock.releaseLock(); }
}

function saveKkcCustomerReview(input) {
  var config = kkcAstrologyConfiguration_();
  if (!input || input.consent !== true) throw new Error('Please agree to saving your feedback.');
  if (input.environment !== config.environment) throw new Error('The local/prod review configuration does not match.');
  if (input.kind !== 'review' || !/^[a-zA-Z0-9-]{20,80}$/.test(input.requestId || '') || input.website) throw new Error('Invalid review. Please reopen the feedback page.');
  var rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Choose a rating from 1 to 5.');
  var name = typeof input.name === 'string' ? input.name.trim() : '';
  var comment = typeof input.comment === 'string' ? input.comment.trim() : '';
  var reference = typeof input.enquiryReference === 'string' ? input.enquiryReference.trim() : '';
  if (!name || name.length > 120 || comment.length < 5 || comment.length > 1500) throw new Error('Complete your name and feedback (5 to 1500 characters).');
  if (reference && !/^ASTRO-[A-Z0-9-]{4,34}$/.test(reference)) throw new Error('Check your optional ASTRO enquiry reference, or leave it blank.');
  var safe = function(value) { return /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value; };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('Reviews are busy. Please retry.');
  try {
    var book = SpreadsheetApp.openById(config.sheetId);
    var tab = 'CustomerReviews_' + config.environment;
    var sheet = book.getSheetByName(tab);
    if (!sheet) sheet = book.insertSheet(tab);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 11).setValues([['Submitted at (IST)', 'Review reference', 'Request ID', 'Name (private)', 'Rating', 'Feedback', 'Enquiry reference (unverified)', 'Permission to publish first name and feedback', 'Moderation status', 'Environment', 'Public first name']]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    }
    var last = sheet.getLastRow();
    if (last > 1) {
      var previous = sheet.getRange(2, 2, last - 1, 2).getDisplayValues();
      for (var i = 0; i < previous.length; i++) if (previous[i][1] === input.requestId) return {ok:true, reference:previous[i][0], environment:config.environment};
    }
    var id = 'ASTRO-REVIEW-' + Utilities.getUuid().replace(/-/g, '').slice(0,12).toUpperCase();
    sheet.getRange(last + 1, 1, 1, 11).setValues([[Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'), id, input.requestId, safe(name), rating, safe(comment), reference, input.publishConsent === true ? 'Yes' : 'No', 'Pending - not published', config.environment, safe(name.split(/\s+/)[0])]]);
    return {ok:true, reference:id, environment:config.environment};
  } finally { lock.releaseLock(); }
}

function getKkcPublishedReviews(input) {
  var config = kkcAstrologyConfiguration_();
  if (!input || input.environment !== config.environment) throw new Error('The local/prod review configuration does not match.');
  var sheet = SpreadsheetApp.openById(config.sheetId).getSheetByName('CustomerReviews_' + config.environment);
  if (!sheet || sheet.getLastRow() < 2) return {ok:true, reviews:[]};
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getDisplayValues();
  var reviews = [];
  for (var i = rows.length - 1; i >= 0 && reviews.length < 20; i--) {
    var row = rows[i];
    if (row[7] !== 'Yes' || String(row[8]).trim().toLowerCase() !== 'approved' || row[9] !== config.environment) continue;
    var rating = Number(row[4]);
    // Public name is explicitly selected by the organiser. Never fall back to the private full name.
    var name = String(row[10] || '').trim().replace(/^'(?=[=+@-])/, '').split(/\s+/)[0];
    var comment = String(row[5] || '').trim().replace(/^'(?=[=+@-])/, '');
    if (!name || name.length > 120 || !comment || comment.length > 1500 || !Number.isInteger(rating) || rating < 1 || rating > 5) continue;
    reviews.push({name:name, rating:rating, comment:comment});
  }
  // Return only the public display fields. Never expose the full row, request ID or enquiry reference.
  return {ok:true, reviews:reviews};
}
