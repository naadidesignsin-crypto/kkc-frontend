const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../integrations/google-forms-setup.gs'),'utf8');
const titles=['Gothram / గోత్రం','Namam / నామం','Phone number','Email ID','Address (optional)','Note (optional)','Seva / సేవ','Dakshina (INR)','Reported paid amount (INR)','Payment reference','Payment acknowledgement','WhatsApp reminders consent','Registration source'];
let recorded={};
const items=titles.map(title=>({getTitle:()=>title,asTextItem:()=>({createResponse:value=>({title,value})}),asParagraphTextItem:()=>({createResponse:value=>({title,value})}),asMultipleChoiceItem:()=>({createResponse:value=>({title,value})})}));
const form={getDestinationId:()=> 'sheet',isAcceptingResponses:()=>true,getItems:()=>items,createResponse:()=>({withItemResponse(item){recorded[item.title]=item.value;return this},submit:()=>({getId:()=> 'test-reference'})})};
const context=vm.createContext({
 PropertiesService:{getScriptProperties:()=>({getProperty:key=>({KKC_WEBAPP_FORM_ID:'form',KKC_WEBAPP_SHEET_ID:'sheet',KKC_WEBAPP_ENVIRONMENT:'local'})[key]})},
 LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},
 CacheService:{getScriptCache:()=>({get:()=>null,put(){}})},
 FormApp:{openById:()=>form}
});
vm.runInContext(source,context);
const data={gothram:'Test',namam:'Test Devotee',phone:'9876543210',email:'',sevaId:'one_day',paymentCompleted:true,paymentReference:'TEST123456',requestId:'test-registration-request-1234',reminderConsent:false,source:'family'};
const result=context.submitKkcRegistration(data);
assert.equal(result.dakshina,516);
assert.equal(result.paymentStatus,'reported_paid_pending_verification');
assert.equal(recorded['WhatsApp reminders consent'],'No');
assert.equal(recorded['Registration source'],'family');
assert.equal(recorded['Email ID'],undefined);
assert.throws(()=>context.submitKkcRegistration({...data,email:'invalid'}),/email/);
assert.throws(()=>context.submitKkcRegistration({...data,paymentCompleted:false}),/acknowledge/);
context.submitKkcRegistration({...data,reminderConsent:true,sevaId:'full_month_homalu',dakshina:1,source:'=IMPORTDATA()'});
assert.equal(recorded['WhatsApp reminders consent'],'Yes');
assert.equal(recorded['Registration source'],'direct');
assert.equal(recorded['Dakshina (INR)'],'10116');
console.log('PASS: optional email, invalid email, consent opt-in/out, source allowlist, server-derived price and manual verification status.');

const thankYou = new URL(context.kkcThankYouUrl_({name:'Test Devotee',phone:'9876543210',seva:'One day Rudrabhishekam',amount:516,reference:'REF-123'},'prod'));
assert.equal(thankYou.pathname,'/919876543210');
const message=thankYou.searchParams.get('text');
assert.match(message,/Test Devotee garu/);
assert.match(message,/INR 516/);
assert.match(message,/REF-123/);
assert.match(message,/awaiting manual verification/);
assert.equal(context.kkcThankYouUrl_({phone:'invalid'},'prod'),null);
assert.match(new URL(context.kkcThankYouUrl_({name:'Test',phone:'9876543210',seva:'Test',amount:516,reference:'TEST'},'local')).searchParams.get('text'),/TEST REGISTRATION/);
let writtenRows=0, link='';
context.SpreadsheetApp={
 newRichTextValue:()=>({setText(){return this},setLinkUrl(value){link=value;return this},build(){return {}}}),
 newDataValidation:()=>({requireValueInList(){return this},setAllowInvalid(){return this},build(){return {}}})
};
const queue={getLastRow:()=>1,getRange:()=>({setNumberFormat(){return this},setValues(values){writtenRows++;assert.equal(values[0][7],'Ready to send');return this},setRichTextValue(){return this},setDataValidation(){return this}})};
const known=new Set(),record={date:new Date(),name:'Test',phone:'9876543210',seva:'Test Seva',amount:516,reference:'TEST'};
context.kkcAddThankYouRow_(queue,record,'prod',known);
context.kkcAddThankYouRow_(queue,record,'prod',known);
assert.equal(writtenRows,1);
assert.ok(link.startsWith('https://wa.me/919876543210?text='));
console.log('PASS: correct WhatsApp recipient, message details, pending payment, local test warning, invalid-number rejection and duplicate prevention.');
