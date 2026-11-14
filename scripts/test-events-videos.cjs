const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
let rows=[],env='local';const reads=[];
const c=vm.createContext({Date,Number,PropertiesService:{getScriptProperties:()=>({getProperty:k=>({KKC_VIDEO_SHEET_ID:'private-local',KKC_VIDEO_ENV:env})[k]})},SpreadsheetApp:{openById:id=>{assert.equal(id,'private-local');return {getSheetByName:name=>{assert.equal(name,'DailyVideos_'+env);return {getLastRow:()=>rows.length+1,getRange:(row,col,count,width)=>{reads.push({row,col,count,width});assert.equal(row,2);assert.equal(col,1);assert.equal(width,5);return {getValues:()=>rows}}}}}}},Utilities:{formatDate:()=> '2026-11-16'}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../integrations/EventsVideoFeed.gs'),'utf8'),c);
rows=[['2026-11-16','Day one','https://www.youtube.com/watch?v=abcdefghijk','Published','Public description'],['17/11/2026','Day two','https://youtu.be/ZYXWVUTSRQP?si=test','published',''],['2026-11-18','Draft','https://youtu.be/12345678901','Draft','Hidden'],['2026-11-18','Bad','https://evil.com/watch?v=12345678901','Published','Hidden'],['2026-02-30','Invalid date','https://youtu.be/12345678901','Published','Hidden'],['2026-11-19','Duplicate','https://youtu.be/abcdefghijk','Published','Duplicate']];
const list=c.getPublishedEventVideos('local').videos;assert.equal(list.length,2);assert.equal(list[0].title,'Day two');assert.deepEqual(Object.keys(list[0]).sort(),['date','description','id','title']);
assert.throws(()=>c.getPublishedEventVideos('prod'),/environment/);
for(const url of ['https://www.youtube.com/shorts/abcdefghijk','https://www.youtube.com/live/abcdefghijk','https://m.youtube.com/watch?v=abcdefghijk&feature=share'])assert.equal(c.kkcYoutubeId_(url),'abcdefghijk');
for(const url of ['http://youtu.be/abcdefghijk','https://youtube.com.evil.com/watch?v=abcdefghijk','https://www.youtube.com/@KKCEventsOfficial','javascript:bad'])assert.equal(c.kkcYoutubeId_(url),'');
rows=[];assert.equal(c.getPublishedEventVideos('local').videos.length,0);assert.ok(reads.length>0);
assert.throws(()=>c.doGet({parameter:{page:'events-video-feed',parentOrigin:'https://www.kkcorg.com',channel:'test-channel-1234567890'}}),/Unsupported/);
console.log('PASS daily videos: reads only DailyVideos_local A:E, Published-only fields, date validation, sorting, valid YouTube URLs, duplicate filtering, no registration reads/writes, environment and origin isolation.');

rows=[["13-11-2026","KKC Karthika Masam 2026 | Lingarchana | 13-11-26","youtube.com/watch?v=RKmlxWNanOg&feature=youtu.be","Published","Daily programme highlights."]];
const actual=c.getPublishedEventVideos("local").videos;assert.equal(actual.length,1);assert.equal(actual[0].id,"RKmlxWNanOg");assert.equal(actual[0].date,"2026-11-13");
assert.equal(c.kkcYoutubeId_("youtu.be/RKmlxWNanOg"),"RKmlxWNanOg");assert.equal(c.kkcYoutubeId_("youtube.com.evil.com/watch?v=RKmlxWNanOg"),"");
console.log("PASS actual customer row: dd-MM-yyyy date and YouTube link without https normalize correctly.");
