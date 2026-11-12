// Add this file to the existing Sheet-bound KKC Apps Script project.
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
  assertKkcOrganiser_();
  var config = kkcWebAppConfiguration_();
  kkcAstrologySheet_(config);
  SpreadsheetApp.getUi().alert('Customer register ready: AstrologyCustomers_' + config.environment + '. Deploy a new web app version after adding AstrologyTracker.html and updating Code.gs.');
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
  var config = kkcWebAppConfiguration_();
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
