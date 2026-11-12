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
        .addItem('Refresh WhatsApp thank-you links', 'refreshKkcWhatsAppThankYous')
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
      assertKkcOrganiser_();
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
        ensureKkcPaymentFields_(existing);
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
      form.setDescription((environment === 'local' ? 'TEST REGISTRATIONS ONLY. ' : '') + 'Register for the KKC Karthika Masam devotional gathering. 16 November–8 December 2026. Venues: Daily Abhishekam / Maha Lingarchana: Plot No. 26, 2nd Floor, Vijaya Lakshmi Villa, Mahadevapuram, Gajularamaram, KPHB. Purusha Suktam / Rudra Homams: Dasa Hanuman and Durga Devi Temple, 119, Chandulal Baradari Colony, Nayeem Gulshan Colony, Ramnas Pura, Hyderabad, Telangana 500053. Gothram, Namam and phone number are required. Email, address and note are optional. Your details are shared with the KKC organising team.');
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
      form.addTextItem().setTitle('Email ID').setRequired(false)
        .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
      form.addParagraphTextItem().setTitle('Address (optional)').setRequired(false);
      form.addParagraphTextItem().setTitle('Note (optional)').setRequired(false);
      ensureKkcPaymentFields_(form);
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
      assertKkcOrganiser_();
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
      body.setPageWidth(842).setPageHeight(595);
      appendKkcRegistrationReport_(body, responses);
      const documentId = doc.getId();
      doc.saveAndClose();
      const pdf = DriveApp.createFile(DocumentApp.openById(documentId).getAs(MimeType.PDF).setName(title + '.pdf'));
      // No public sharing is enabled. Only your account/team should receive this URL.
      SpreadsheetApp.getUi().alert('Registration document:\nhttps://docs.google.com/document/d/' + documentId + '/edit\n\nPDF:\n' + pdf.getUrl());
    }


    // --- KKC styled registration web app ---
    // Run configureKkcStyledRegistration in the editor once for each local/prod project.
    function assertKkcOrganiser_() {
      const active = Session.getActiveUser().getEmail();
      const effective = Session.getEffectiveUser().getEmail();
      if (!active || active !== effective) throw new Error('Open this function from the organiser Apps Script editor.');
    }

    function configureKkcStyledRegistration() {
      assertKkcOrganiser_();
      const documentProperties = PropertiesService.getDocumentProperties();
      const sheet = SpreadsheetApp.getActiveSpreadsheet();
      if (!sheet || !documentProperties || documentProperties.getProperty('KKC_FORM_READY') !== 'true') {
        throw new Error('Complete the local/prod form setup in this Sheet first.');
      }
      const environment = documentProperties.getProperty('KKC_ENVIRONMENT');
      const formId = documentProperties.getProperty('KKC_FORM_ID');
      if (environment !== 'local' && environment !== 'prod') throw new Error('Invalid registration environment.');
      const form = FormApp.openById(formId);
      if (form.getDestinationId() !== sheet.getId()) throw new Error('The form belongs to a different Sheet.');
      ensureKkcPaymentFields_(form);
      form.setDescription('KKC Karthika Masam 2026. Venues: ' + kkcVenueSummary_() + ' Gothram, Namam and phone are required. Email, address and note are optional.');
      PropertiesService.getScriptProperties().setProperties({
        KKC_WEBAPP_FORM_ID: formId,
        KKC_WEBAPP_SHEET_ID: sheet.getId(),
        KKC_WEBAPP_ENVIRONMENT: environment
      });
      SpreadsheetApp.getUi().alert('Styled registration configured for _' + environment + '. Now deploy as a Web app: Execute as Me; access Anyone. Use the /exec deployment URL.');
    }

    function kkcWebAppConfiguration_() {
      const properties = PropertiesService.getScriptProperties();
      const formId = properties.getProperty('KKC_WEBAPP_FORM_ID');
      const sheetId = properties.getProperty('KKC_WEBAPP_SHEET_ID');
      const environment = properties.getProperty('KKC_WEBAPP_ENVIRONMENT');
      if (!formId || !sheetId || (environment !== 'local' && environment !== 'prod')) {
        throw new Error('The registration form is not ready. Please contact KKC.');
      }
      return { formId: formId, sheetId: sheetId, environment: environment };
    }

    function doGet(event) {
      const config = kkcWebAppConfiguration_();
      const template = HtmlService.createTemplateFromFile('Registration');
      template.environment = config.environment;
      const settings = PropertiesService.getScriptProperties();
      const upi = settings.getProperty('KKC_VERIFIED_UPI_ID') || '7981041123@axl';
      template.verifiedUpi = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upi) ? upi : '';
      template.venue = kkcVenueSummary_();
      const source = event && event.parameter && event.parameter.source;
      template.initialSource = typeof source === 'string' && /^[a-zA-Z0-9_-]{1,40}$/.test(source) ? source : 'direct';
      template.initialLanguage = event && event.parameter && event.parameter.lang === 'te' ? 'te' : 'en';
      return template.evaluate()
        .setTitle('KKC - Karthika Masam Registration')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    function submitKkcRegistration(input) {
      const config = kkcWebAppConfiguration_();
      if (!input || typeof input !== 'object') throw new Error('Please fill in the registration form.');
      const seva = kkcDakshinaOptions_().find(option => option.id === input.sevaId);
      if (!seva) throw new Error('Please select a valid Seva.');
      const limits = { gothram: 120, namam: 120, phone: 10, email: 150, address: 1000, note: 1000, paymentReference: 64 };
      const data = {};
      Object.keys(limits).forEach(function(key) {
        const value = typeof input[key] === 'string' ? input[key].trim() : '';
        if (value.length > limits[key]) throw new Error('Please shorten the ' + key + ' field.');
        data[key] = value;
      });
      if (!data.gothram || data.namam.length < 2) throw new Error('Please enter your Gothram and Namam.');
      if (!/^[6-9][0-9]{9}$/.test(data.phone)) throw new Error('Enter a valid 10-digit Indian phone number.');
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Enter a valid email ID.');
      if (input.paymentCompleted !== true) throw new Error('Please acknowledge that you have completed the payment.');
      if (!/^[A-Za-z0-9][A-Za-z0-9 /_-]{5,63}$/.test(data.paymentReference)) {
        throw new Error('Enter the UPI transaction/reference number from your payment app (6–64 characters).');
      }
      if (input.website) throw new Error('Registration could not be submitted.');
      const requestId = typeof input.requestId === 'string' ? input.requestId : '';
      if (!/^[a-zA-Z0-9-]{20,80}$/.test(requestId)) throw new Error('Please reopen the registration form and try again.');

      const lock = LockService.getScriptLock();
      if (!lock.tryLock(10000)) throw new Error('Registration is busy. Please try again shortly.');
      try {
        const cache = CacheService.getScriptCache();
        const cacheKey = 'kkc-registration-' + requestId;
        const prior = cache.get(cacheKey);
        if (prior) return JSON.parse(prior);
        const form = FormApp.openById(config.formId);
        if (form.getDestinationId() !== config.sheetId) throw new Error('The registration destination has changed. Please contact KKC.');
        if (!form.isAcceptingResponses()) throw new Error('Registration is currently closed.');
        const values = {
          'Gothram / గోత్రం': data.gothram,
          'Namam / నామం': data.namam,
          'Phone number': data.phone,
          'Email ID': data.email,
          'Address (optional)': data.address,
          'Note (optional)': data.note,
          'Seva / సేవ': seva.en + ' / ' + seva.te + ' — INR ' + seva.amount,
          'Dakshina (INR)': String(seva.amount),
          'Reported paid amount (INR)': String(seva.amount),
          'Payment reference': data.paymentReference,
          'Payment acknowledgement': 'Reported paid - pending manual verification',
          'WhatsApp reminders consent': input.reminderConsent === true ? 'Yes' : 'No',
          'Registration source': typeof input.source === 'string' && /^[a-zA-Z0-9_-]{1,40}$/.test(input.source) ? input.source : 'direct'
        };
        const items = form.getItems();
        const expected = Object.keys(values);
        expected.forEach(function(title) {
          if (!items.some(function(item) { return item.getTitle() === title; })) {
            throw new Error('The registration fields have changed. Please contact KKC.');
          }
        });
        let response = form.createResponse();
        items.forEach(function(item) {
          const title = item.getTitle();
          if (!Object.prototype.hasOwnProperty.call(values, title) || !values[title]) return;
          const typedItem = (title === 'Payment acknowledgement' || title === 'Seva / సేవ' || title === 'WhatsApp reminders consent') ? item.asMultipleChoiceItem()
            : title === 'Address (optional)' || title === 'Note (optional)'
              ? item.asParagraphTextItem() : item.asTextItem();
          response = response.withItemResponse(typedItem.createResponse(values[title]));
        });
        const saved = response.submit();
        const result = {
          ok: true, reference: saved.getId(), environment: config.environment,
          paymentStatus: 'reported_paid_pending_verification', sevaId: seva.id, dakshina: seva.amount, reportedPaidAmount: seva.amount
        };
        // Receipt saving must never fail if the optional organiser queue is unavailable.
        try { kkcQueueThankYou_(config, {date: new Date(), name: data.namam, phone: data.phone, seva: seva.en, amount: seva.amount, reference: saved.getId()}); } catch (ignored) { /* Recover with Refresh WhatsApp thank-you links. */ }
        // Cache only a receipt, never the registrant's personal details.
        try { cache.put(cacheKey, JSON.stringify(result), 21600); } catch (ignored) { /* The response was already saved. */ }
        return result;
      } finally {
        lock.releaseLock();
      }
    }


    // Adds payment fields once without replacing the existing form or response history.
    function ensureKkcPaymentFields_(form) {
      ensureKkcDakshinaFields_(form);
      ensureKkcEngagementFields_(form);
      const items = form.getItems();
      const reference = items.find(function(item) { return item.getTitle() === 'Payment reference'; });
      const referenceItem = reference ? reference.asTextItem() : form.addTextItem().setTitle('Payment reference');
      referenceItem.setRequired(true).setHelpText('UPI transaction/reference number from your payment app.')
        .setValidation(FormApp.createTextValidation()
          .requireTextMatchesPattern('^[A-Za-z0-9][A-Za-z0-9 /_-]{5,63}$')
          .setHelpText('Enter the payment reference (6–64 characters).').build());
      const acknowledgement = items.find(function(item) { return item.getTitle() === 'Payment acknowledgement'; });
      const acknowledgementItem = acknowledgement ? acknowledgement.asMultipleChoiceItem()
        : form.addMultipleChoiceItem().setTitle('Payment acknowledgement');
      acknowledgementItem.setChoiceValues(['Reported paid - pending manual verification'])
        .setRequired(true).setHelpText('Self-reported by the registrant. KKC must verify the payment manually.');
    }

    // Prices are derived here, never accepted from the browser.
    function kkcDakshinaOptions_() { return [{"id":"full_month_homalu","amount":10116,"en":"Daily Abhishekam, 4 Mondays Maha Lingarchana and 5 days of Homalu","te":"ప్రతిరోజూ అభిషేకం, 4 సోమవారాల మహా లింగార్చన మరియు 5 రోజుల హోమాలు"},{"id":"daily_mondays","amount":5116,"en":"Daily Abhishekam and 4 Mondays Maha Lingarchana","te":"ప్రతిరోజూ అభిషేకం మరియు 4 సోమవారాల మహా లింగార్చన"},{"id":"four_mondays","amount":2116,"en":"Maha Lingarchana on all 4 Mondays only","te":"4 సోమవారాల మహా లింగార్చన మాత్రమే"},{"id":"one_day","amount":516,"en":"Rudrabhishekam for one day","te":"ఒక రోజు రుద్రాభిషేకం"}]; }
    function ensureKkcDakshinaFields_(form) {
     const paid = form.getItems().find(item => item.getTitle() === "Reported paid amount (INR)");
     (paid ? paid.asTextItem() : form.addTextItem().setTitle("Reported paid amount (INR)")).setRequired(true).setHelpText("Self-reported amount paid for the selected Seva. Not bank-verified.");
     const items = form.getItems();
     const existing = items.find(item => item.getTitle() === "Seva / సేవ");
     const seva = existing ? existing.asMultipleChoiceItem() : form.addMultipleChoiceItem().setTitle("Seva / సేవ");
     seva.setChoiceValues(kkcDakshinaOptions_().map(option => option.en + " / " + option.te + " — INR " + option.amount)).setRequired(true);
     const amount = items.find(item => item.getTitle() === "Dakshina (INR)");
     (amount ? amount.asTextItem() : form.addTextItem().setTitle("Dakshina (INR)")).setRequired(true).setHelpText("Dakshina for the selected Seva. Payment is subject to manual verification.");
    }

    function kkcRegistrationReport_(responses) {
      const groups = kkcDakshinaOptions_().map(option => ({
        option: option, registrations: [], selectedTotal: 0, reportedTotal: 0, missingPaid: 0
      }));
      const uncategorised = [];
      responses.forEach(response => {
        const fields = {};
        response.getItemResponses().forEach(item => fields[item.getItem().getTitle()] = String(item.getResponse() || '').trim());
        const group = groups.find(group =>
          fields['Dakshina (INR)'] === String(group.option.amount) &&
          fields['Seva / సేవ'] === group.option.en + ' / ' + group.option.te + ' — INR ' + group.option.amount);
        const paidText = fields['Reported paid amount (INR)'] || '';
        const reportedPaid = /^[0-9]+$/.test(paidText) && Number(paidText) > 0 && Number(paidText) <= 1000000
          && fields['Payment acknowledgement'] === 'Reported paid - pending manual verification'
          ? Number(paidText) : null;
        const record = { response: response, fields: fields, reportedPaid: reportedPaid };
        if (group) {
          group.registrations.push(record);
          group.selectedTotal += group.option.amount;
          if (reportedPaid !== null) group.reportedTotal += reportedPaid;
          else group.missingPaid++;
        } else uncategorised.push(record);
      });
      return { groups: groups, uncategorised: uncategorised };
    }

    function appendKkcRegistrationReport_(body, responses) {
      const report = kkcRegistrationReport_(responses);
      body.appendParagraph('Dakshina categories').setHeading(DocumentApp.ParagraphHeading.HEADING2);
      body.appendParagraph('Amounts paid are self-reported and await manual verification. Totals are not verified collections.');
      const rows = [['Dakshina (INR)', 'Registrations', 'Selected total (INR)', 'Reported paid total (INR)', 'Paid amount missing']];
      report.groups.forEach(group => rows.push([
        String(group.option.amount), String(group.registrations.length), String(group.selectedTotal),
        String(group.reportedTotal), String(group.missingPaid)
      ]));
      body.appendTable(rows);
      body.appendParagraph('Older or inconsistent records without a matching Seva and Dakshina: ' + report.uncategorised.length + '. Their category is not inferred.');
      const appendRecord = (record, label) => {
        body.appendPageBreak();
        body.appendParagraph(label).setHeading(DocumentApp.ParagraphHeading.HEADING2);
        body.appendParagraph('Selected Seva: ' + (record.fields['Seva / సేవ'] || 'Not recorded')).setBold(true);
        body.appendParagraph('Selected Dakshina (INR): ' + (record.fields['Dakshina (INR)'] || 'Not recorded'));
        body.appendParagraph('Amount reported paid (INR): ' + (record.reportedPaid === null ? 'Not recorded / not acknowledged' : record.reportedPaid)).setBold(true);
        body.appendParagraph('Payment status: awaiting manual verification. This report does not verify bank transactions.');
        record.response.getItemResponses().forEach(item => {
          const title = item.getItem().getTitle();
          if (['Seva / సేవ', 'Dakshina (INR)', 'Reported paid amount (INR)'].indexOf(title) >= 0) return;
          body.appendParagraph(title).setBold(true);
          body.appendParagraph(String(item.getResponse() || 'Not provided')).setBold(false);
        });
        body.appendParagraph('Submitted: ' + Utilities.formatDate(record.response.getTimestamp(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm') + ' IST');
      };
      report.groups.forEach(group => group.registrations.forEach((record, index) =>
        appendRecord(record, 'INR ' + group.option.amount + ' category — Registration ' + (index + 1))));
      report.uncategorised.forEach((record, index) => appendRecord(record, 'Uncategorised — Registration ' + (index + 1)));
    }

    // Run configureKkcStyledRegistration after updating to migrate the existing form.
    function ensureKkcEngagementFields_(form) {
     const items = form.getItems();
     const email = items.find(item => item.getTitle() === 'Email ID');
     if (email) email.asTextItem().setRequired(false);
     const consent = items.find(item => item.getTitle() === 'WhatsApp reminders consent');
     (consent ? consent.asMultipleChoiceItem() : form.addMultipleChoiceItem().setTitle('WhatsApp reminders consent'))
     .setChoiceValues(['Yes', 'No']).setRequired(false)
     .setHelpText('Optional permission for KKC event reminders on WhatsApp.');
     const source = items.find(item => item.getTitle() === 'Registration source');
     (source ? source.asTextItem() : form.addTextItem().setTitle('Registration source')).setRequired(false);
    }

    /** Private organiser queue. Opening a link does not send or mark a message sent. */
    function kkcThankYouQueue_(sheetId) {
      const book = SpreadsheetApp.openById(sheetId);
      let sheet = book.getSheetByName('KKC WhatsApp');
      if (!sheet) {
        sheet = book.insertSheet('KKC WhatsApp');
        sheet.getRange(1, 1, 1, 8).setValues([['Registered', 'Namam', 'Phone', 'Seva', 'Dakshina (INR)', 'Registration reference', 'WhatsApp thank-you', 'Send status']]);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
        sheet.setColumnWidth(2, 180); sheet.setColumnWidth(4, 300);
        sheet.setColumnWidth(7, 230); sheet.setColumnWidth(8, 180);
      }
      return sheet;
    }

    function kkcThankYouUrl_(record, environment) {
      if (!/^[6-9][0-9]{9}$/.test(record.phone)) return null;
      const lines = [
        environment === 'local' ? 'TEST REGISTRATION — not a live event registration.' : '🙏 Namaste ' + record.name + ' garu,',
        'Thank you for registering for KKC Karthika Masam 2026.',
        'మీ నమోదుకు ధన్యవాదాలు.',
        'Seva: ' + record.seva,
        'Dakshina reported: INR ' + record.amount,
        'Registration reference: ' + record.reference,
        environment === 'local' ? 'Test acknowledgement only. No payment has been verified.' : 'Payment is awaiting manual verification by the KKC team.',
        'Venues: ' + kkcVenueSummary_(),
        'For assistance: 7981041123'
      ];
      return 'https://wa.me/91' + record.phone + '?text=' + encodeURIComponent(lines.join('\n'));
    }

    function kkcAddThankYouRow_(sheet, record, environment, knownReferences) {
      const url = kkcThankYouUrl_(record, environment);
      if (!url || knownReferences.has(record.reference)) return;
      const row = sheet.getLastRow() + 1;
      // Plain-text formatting prevents spreadsheet formulas from user-provided text.
      sheet.getRange(row, 2, 1, 3).setNumberFormat('@');
      sheet.getRange(row, 6).setNumberFormat('@');
      sheet.getRange(row, 1, 1, 8).setValues([[record.date, record.name.replace(/^[=+@-]/, "'$&"), record.phone, record.seva, record.amount, record.reference, '', 'Ready to send']]);
      sheet.getRange(row, 7).setRichTextValue(SpreadsheetApp.newRichTextValue().setText('Send WhatsApp thank-you ↗').setLinkUrl(url).build());
      sheet.getRange(row, 8).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Ready to send', 'Sent manually'], true).setAllowInvalid(false).build());
      knownReferences.add(record.reference);
    }

    function kkcQueueThankYou_(config, record) {
      const sheet = kkcThankYouQueue_(config.sheetId);
      const known = new Set(sheet.getLastRow() > 1 ? sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getDisplayValues().map(row => row[0]) : []);
      kkcAddThankYouRow_(sheet, record, config.environment, known);
    }

    // Backfill/recover links, including registrations submitted directly through Google Forms.
    function refreshKkcWhatsAppThankYous() {
      assertKkcOrganiser_();
      const config = kkcWebAppConfiguration_();
      const lock = LockService.getScriptLock();
      if (!lock.tryLock(10000)) throw new Error('Registrations are busy. Please try again shortly.');
      try {
        const sheet = kkcThankYouQueue_(config.sheetId);
        const known = new Set(sheet.getLastRow() > 1 ? sheet.getRange(2, 6, sheet.getLastRow()-1, 1).getDisplayValues().map(row => row[0]) : []);
        FormApp.openById(config.formId).getResponses().forEach(response => {
          const values = {};
          response.getItemResponses().forEach(item => values[item.getItem().getTitle()] = String(item.getResponse()));
          kkcAddThankYouRow_(sheet, {
            date: response.getTimestamp(), name: values['Namam / నామం'] || '',
            phone: values['Phone number'] || '', seva: values['Seva / సేవ'] || 'Karthika Masam registration',
            amount: values['Dakshina (INR)'] || '', reference: response.getId()
          }, config.environment, known);
        });
        SpreadsheetApp.getUi().alert('Thank-you links are ready in the KKC WhatsApp tab. Open a link, review the message, press Send in WhatsApp, then change its Send status to Sent manually.');
      } finally { lock.releaseLock(); }
    }

function kkcVenueSummary_() {
  return "Daily Abhishekam / Maha Lingarchana: Plot No. 26, 2nd Floor, Vijaya Lakshmi Villa, Mahadevapuram, Gajularamaram, KPHB. Purusha Suktam / Rudra Homams: Dasa Hanuman and Durga Devi Temple, 119, Chandulal Baradari Colony, Nayeem Gulshan Colony, Ramnas Pura, Hyderabad, Telangana 500053.";
}
