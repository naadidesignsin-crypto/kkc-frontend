export type Registration = {
  id: string; eventId: string; eventName: string; gothram: string; fullName: string;
  mobile: string; email: string; address: string; note: string; createdAt: string;
  attendees?: number;
};
export const REGISTRATION_STORAGE_KEY = 'kkc.event-registrations.v1';

export function readRegistrations(): Registration[] {
  const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
  if (!raw) return [];
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows) || !rows.every(row => row && typeof row === 'object'
    && ['id', 'eventId', 'eventName', 'fullName', 'mobile', 'email', 'note', 'createdAt'].every(key => typeof row[key] === 'string')
    && (row.gothram === undefined || typeof row.gothram === 'string')
    && (row.address === undefined || typeof row.address === 'string'))) {
    throw new Error('Saved registrations could not be read.');
  }
  // Older local records stay readable; never invent missing Gothram or address.
  return rows.map(row => ({ ...row, gothram: row.gothram ?? '', address: row.address ?? '' }));
}

export function saveRegistration(row: Registration): Registration[] {
  if (!row.gothram.trim() || row.fullName.trim().length < 2
    || !/^[6-9][0-9]{9}$/.test(row.mobile) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    throw new Error('Enter Gothram, Namam, a valid Indian phone number, and email ID.');
  }
  const rows = readRegistrations();
  if (rows.some(existing => existing.eventId === row.eventId && existing.mobile === row.mobile)) {
    throw new Error('This phone number is already registered for this event in this browser.');
  }
  const next = [...rows, row];
  localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function createRegistrationWorkbook(rows: Registration[]) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'KKC';
  const sheet = workbook.addWorksheet('Karthika Masam', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = [
    { header: 'Registration ID', key: 'id', width: 40 },
    { header: 'Event', key: 'eventName', width: 24 },
    { header: 'Gothram', key: 'gothram', width: 24 },
    { header: 'Namam', key: 'fullName', width: 28 },
    { header: 'Phone number', key: 'mobile', width: 20 },
    { header: 'Email ID', key: 'email', width: 32 },
    { header: 'Address (optional)', key: 'address', width: 45 },
    { header: 'Note (optional)', key: 'note', width: 45 },
    { header: 'Registered at (UTC)', key: 'createdAt', width: 30 },
  ];
  rows.forEach(row => sheet.addRow(row));
  sheet.getColumn('mobile').numFmt = '@';
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF79551D' } };
  sheet.autoFilter = { from: 'A1', to: 'I' + (rows.length + 1) };
  return workbook.xlsx.writeBuffer();
}
