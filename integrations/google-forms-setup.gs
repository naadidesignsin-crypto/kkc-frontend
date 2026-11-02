/**
 * Paste into Extensions > Apps Script in a new, private Google Sheet.
 * In separate new Sheets, run setupLocalKarthikaRegistration or setupProductionKarthikaRegistration.
 * Reopening the Sheet adds the KKC Registrations menu.
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('KKC Registrations')
    .addItem('Create / show _local test form', 'setupLocalKarthikaRegistration')
    .addItem('Create / show _prod live form', 'setupProductionKarthikaRegistration')
    .addItem('Export registrations to PDF', 'exportKarthikaRegistrationsPdf')
    .addToUi();
}

function setupLocalKarthikaRegistration() {
  setupKarthikaRegistrationForEnvironment_('local');
}

function setupProductionKarthikaRegistration() {
  setupKarthikaRegistrationForEnvironment_('prod');
}

// Retain the original entry point for sheets already named with a suffix.
function setupKarthikaRegistration() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const match = sheet && sheet.getName().match(/_(local|prod)$/);
  if (!match) throw new Error('Choose setupLocalKarthikaRegistration or setupProductionKarthikaRegistration.');
  setupKarthikaRegistrationForEnvironment_(match[1]);
}

function setupKarthikaRegistrationForEnvironment_(environment) {
  if (environment !== 'local' && environment !== 'prod') throw new Error('Invalid environment.');
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet) throw new Error('Open this script from a Google Sheet using Extensions > Apps Script.');
  const properties = PropertiesService.getDocumentProperties();
  const savedEnvironment = properties.getProperty('KKC_ENVIRONMENT');
  if (savedEnvironment && savedEnvironment !== environment) {
    throw new Error('This Sheet is already used for _' + savedEnvironment + '. Create a separate new Sheet for _' + environment + '.');
  }
  const sheetName = 'KKC_Karthika_Masam_' + environment;
  const formName = 'KKC - Karthika Masam Registration_' + environment;
  const savedId = properties.getProperty('KKC_FORM_ID');
  if (savedId) {
    const existing = FormApp.openById(savedId);
    if (existing.getDestinationId() !== sheet.getId()) {
      throw new Error('This form belongs to another Sheet. Create a new Sheet and paste the script again; do not copy an existing linked Sheet.');
    }
    if (properties.getProperty('KKC_FORM_READY') !== 'true') {
      throw new Error('Previous setup did not finish. Inspect the saved form and its destination before continuing.');
    }
    sheet.setName(sheetName);
    existing.setTitle(formName);
    properties.setProperty('KKC_ENVIRONMENT', environment);
    SpreadsheetApp.getUi().alert('Responder link: ' + existing.getPublishedUrl() + '\n\nEdit form: ' + existing.getEditUrl());
    return;
  }
  if (sheet.getFormUrl()) throw new Error('This spreadsheet already has a linked form. Use a new private Google Sheet.');
  sheet.setName(sheetName);
  properties.setProperty('KKC_ENVIRONMENT', environment);
  const form = FormApp.create(formName);
  // Store immediately so rerunning after an interruption never creates duplicate forms.
  properties.setProperty('KKC_FORM_ID', form.getId());
  if (form.supportsAdvancedResponderPermissions()) form.setPublished(false);
  form.setDescription((environment === 'local' ? 'TEST REGISTRATIONS ONLY. ' : '') + 'Register for the KKC Karthika Masam devotional gathering. Date, time, and venue will be announced. Gothram, Namam, phone number, and email ID are required. Address and note are optional. Your details are shared with the KKC organising team.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setPublishingSummary(false);
  form.setAllowResponseEdits(false);
  form.addTextItem().setTitle('Gothram / గోత్రం').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextMatchesPattern('.*\\S.*').setHelpText('Enter your Gothram.').build());
  form.addTextItem().setTitle('Namam / నామం').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextMatchesPattern('.*\\S.*').setHelpText('Enter your name.').build());
  form.addTextItem().setTitle('Phone number').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextMatchesPattern('^[6-9][0-9]{9}$').setHelpText('Enter a 10-digit Indian phone number without a country code.').build());
  form.addTextItem().setTitle('Email ID').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  form.addParagraphTextItem().setTitle('Address (optional)').setRequired(false);
  form.addParagraphTextItem().setTitle('Note (optional)').setRequired(false);
  form.setConfirmationMessage(environment === 'local' ? 'Test registration received in the _local Sheet. This is not a live event registration.' : 'Thank you. Your Karthika Masam registration has been received by KKC.');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  if (form.supportsAdvancedResponderPermissions()) form.setPublished(true);
  else form.setAcceptingResponses(true);
  const links = sheet.insertSheet('KKC Setup');
  links.getRange(1, 1, 5, 2).setValues([
    ['Purpose', 'URL'],
    ['Environment', '_' + environment],
    ['Responder link (website)', form.getPublishedUrl()],
    ['Edit form (organisers only)', form.getEditUrl()],
    ['Registration spreadsheet (organisers only)', sheet.getUrl()]
  ]);
  links.setColumnWidth(1, 280);
  links.setColumnWidth(2, 700);
  links.setFrozenRows(1);
  properties.setProperty('KKC_FORM_READY', 'true');
  SpreadsheetApp.getUi().alert('Form created. Copy the responder link from the KKC Setup tab. Test it in a signed-out browser before linking it to the website.\n\n' + form.getPublishedUrl());
}

function exportKarthikaRegistrationsPdf() {
  const properties = PropertiesService.getDocumentProperties();
  const formId = properties.getProperty('KKC_FORM_ID');
  if (!formId || properties.getProperty('KKC_FORM_READY') !== 'true') throw new Error('Complete form setup first.');
  const form = FormApp.openById(formId);
  const responses = form.getResponses();
  if (!responses.length) {
    SpreadsheetApp.getUi().alert('No registrations have been submitted yet.');
    return;
  }
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH-mm');
  const environment = properties.getProperty('KKC_ENVIRONMENT') || 'legacy';
  const title = 'KKC - Karthika Masam Registrations_' + environment + ' - ' + timestamp;
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.appendParagraph('KKC - Karthika Masam').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Environment: _' + environment + ' | Total registrations: ' + responses.length);
  body.appendParagraph('Generated: ' + timestamp + ' IST');
  responses.forEach(function(response, index) {
    if (index > 0) body.appendPageBreak();
    body.appendParagraph('Registration ' + (index + 1)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    response.getItemResponses().forEach(function(item) {
      body.appendParagraph(item.getItem().getTitle()).setBold(true);
      body.appendParagraph(String(item.getResponse() || 'Not provided')).setBold(false);
    });
    body.appendParagraph('Submitted: ' + Utilities.formatDate(response.getTimestamp(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm') + ' IST');
  });
  const documentId = doc.getId();
  doc.saveAndClose();
  const pdf = DriveApp.createFile(DocumentApp.openById(documentId).getAs(MimeType.PDF).setName(title + '.pdf'));
  // No public sharing is enabled. Only your account/team should receive this URL.
  SpreadsheetApp.getUi().alert('PDF created in your Google Drive:\n\n' + pdf.getUrl());
}
