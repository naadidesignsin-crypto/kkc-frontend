export type Registration = {id:string;eventId:string;eventName:string;fullName:string;mobile:string;email:string;attendees:number;note:string;createdAt:string};
export const REGISTRATION_STORAGE_KEY='kkc.event-registrations.v1';
export function readRegistrations(): Registration[] {
 const raw=localStorage.getItem(REGISTRATION_STORAGE_KEY); if(!raw)return [];
 const rows:unknown=JSON.parse(raw);
 if(!Array.isArray(rows)||!rows.every(r=>r&&typeof r==='object'&&['id','eventId','eventName','fullName','mobile','email','note','createdAt'].every(k=>typeof r[k]==='string')&&Number.isInteger(r.attendees)&&r.attendees>=1&&r.attendees<=50))throw new Error('Saved registrations could not be read.');
 return rows;
}
export function saveRegistration(row:Registration):Registration[]{
 const rows=readRegistrations();if(rows.some(r=>r.eventId===row.eventId&&r.mobile===row.mobile))throw new Error('This mobile number is already registered for this event in this browser.');
 const next=[...rows,row];localStorage.setItem(REGISTRATION_STORAGE_KEY,JSON.stringify(next));return next;
}
export async function createRegistrationWorkbook(rows:Registration[]){
 const {default:ExcelJS}=await import('exceljs');const workbook=new ExcelJS.Workbook();workbook.creator='KKC';
 const sheet=workbook.addWorksheet('Karthika Masam',{views:[{state:'frozen',ySplit:1}]});
 sheet.columns=[
 {header:'Registration ID',key:'id',width:40},{header:'Event',key:'eventName',width:24},{header:'Full name',key:'fullName',width:28},
 {header:'Mobile number',key:'mobile',width:20},{header:'Email',key:'email',width:32},{header:'Attendees',key:'attendees',width:14},
 {header:'Note',key:'note',width:45},{header:'Registered at (UTC)',key:'createdAt',width:30}];
 rows.forEach(r=>sheet.addRow(r));sheet.getColumn('mobile').numFmt='@';
 sheet.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};sheet.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF79551D'}};
 sheet.autoFilter={from:'A1',to:'H'+(rows.length+1)};return workbook.xlsx.writeBuffer();
}