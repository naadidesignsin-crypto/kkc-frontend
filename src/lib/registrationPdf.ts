import type { Registration } from './registrations';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]!));
}

export function registrationPrintHtml(rows: Registration[]) {
  const fields: [string, keyof Registration][] = [
    ['Gothram / గోత్రం', 'gothram'], ['Namam / నామం', 'fullName'],
    ['Phone number', 'mobile'], ['Email ID', 'email'],
    ['Address', 'address'], ['Note', 'note'],
  ];
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8">
<title>KKC - Karthika Masam Registrations</title>
<style>
@page{size:A4;margin:16mm}*{box-sizing:border-box}
body{font:14px/1.6 "Nirmala UI","Noto Sans Telugu",Arial,sans-serif;color:#222;margin:0}
h1{font-size:25px;margin-bottom:4px}h2{font-size:17px;margin:0 0 12px}
.meta{color:#555;font-size:12px}.record{border:1px solid #ccc;padding:18px;margin:18px 0;break-inside:avoid}
dl{margin:0}dt{font-weight:bold}dd{margin:0 0 10px;white-space:pre-wrap;overflow-wrap:anywhere}
button{padding:12px 20px;cursor:pointer}.notice{padding:12px;background:#fff5d7}
@media print{.print-controls{display:none}}
</style></head><body>
<div class="print-controls"><p class="notice">Choose Print, then “Save as PDF” as the destination. These are records saved in this browser only.</p>
<button id="print-button" type="button">Print / Save as PDF</button></div>
<h1>KKC · Karthika Masam</h1><p>Registration report · ${rows.length} registrations</p>
<p class="meta">Local browser records · Generated ${escapeHtml(new Date().toLocaleString('en-IN'))}</p>
${rows.map((row, index) => `<section class="record"><h2>${index + 1}. ${escapeHtml(row.fullName)}</h2>
<dl>${fields.map(([label, key]) => `<dt>${label}</dt><dd>${escapeHtml(String(row[key] || 'Not provided'))}</dd>`).join('')}</dl>
<p class="meta">Reference: ${escapeHtml(row.id)}<br>Registered at: ${escapeHtml(row.createdAt)}</p></section>`).join('')}
</body></html>`;
}

export function printRegistrations(rows: Registration[]) {
  if (!rows.length) throw new Error('There are no registrations to print.');
  const report = window.open('', '_blank');
  if (!report) throw new Error('Allow pop-ups for this site to open the PDF report.');
  // The new report contains only escaped data and never executes registration text.
  report.opener = null;
  report.document.open();
  report.document.write(registrationPrintHtml(rows));
  report.document.close();
  report.document.getElementById('print-button')?.addEventListener('click', () => report.print());
  return report;
}
