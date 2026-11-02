import { FormEvent, useEffect, useRef, useState } from 'react';
import { karthikaEvent as event } from '../data/karthikaEvent';
import { readRegistrations, saveRegistration, createRegistrationWorkbook, type Registration } from '../lib/registrations';

const empty = { fullName: '', mobile: '', email: '', attendees: '1', note: '' };
const noticeKey = 'kkc.karthika-notice.v1';
export default function EventRegistration() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState<Registration[]>([]);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [success, setSuccess] = useState<Registration | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  function dismiss() {
    setOpen(false);
    try { sessionStorage.setItem(noticeKey, 'seen'); } catch { /* Dismissal still works. */ }
  }
  useEffect(() => {
    const refresh = () => {
      try { setRows(readRegistrations().filter(r => r.eventId === event.id)); setStorageError(''); }
      catch { setStorageError('Browser storage is unavailable or saved registrations could not be read.'); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    let seen = false;
    try { seen = sessionStorage.getItem(noticeKey) === 'seen'; } catch { /* Show notice. */ }
    const timer = window.setTimeout(() => { if (!seen) setOpen(true); }, 1400);
    return () => { window.clearTimeout(timer); window.removeEventListener('storage', refresh); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
      if (e.key !== 'Tab') return;
      const items = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input,textarea');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError('');
    if (form.fullName.trim().length < 2) { setError('Please enter your full name (at least 2 characters).'); return; }
    try {
      const row: Registration = {
        id: crypto.randomUUID(), eventId: event.id, eventName: event.title,
        fullName: form.fullName.trim(), mobile: form.mobile.trim(), email: form.email.trim(),
        attendees: Number(form.attendees), note: form.note.trim(), createdAt: new Date().toISOString(),
      };
      setRows(saveRegistration(row).filter(r => r.eventId === event.id));
      setSuccess(row); setForm(empty); close.current?.focus();
      try { sessionStorage.setItem(noticeKey, 'seen'); } catch { /* Already saved. */ }
    } catch (err) {
      setError(err instanceof Error && err.message.includes('already registered') ? err.message : 'Could not save. Check browser storage and try again.');
    }
  }
  async function exportExcel() {
    setExporting(true); setExportStatus('');
    try {
      const latest = readRegistrations().filter(r => r.eventId === event.id);
      if (!latest.length) throw new Error('No registrations');
      const buffer = await createRegistrationWorkbook(latest);
      const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'kkc-karthika-masam-registrations-' + new Date().toISOString().slice(0, 10) + '.xlsx';
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportStatus('Excel download started for ' + latest.length + ' registrations.');
    } catch { setExportStatus('Export failed. Check saved registrations and try again.'); }
    finally { setExporting(false); }
  }
  const details = <dl className="karthika-details">{(['date', 'time', 'venue'] as const).map(key => <div key={key}><dt>{key}</dt><dd>{event[key]}</dd></div>)}</dl>;
  return <section className="karthika-section section-wrap" id="karthika-registration" aria-labelledby="karthika-heading">
    <article className="karthika-feature reveal-card">
      <div className="karthika-emblem" aria-hidden="true">✦</div>
      <div className="karthika-copy">
        <p className="eyebrow">Upcoming special gathering</p><h2 id="karthika-heading">{event.title}</h2>
        <p className="karthika-subtitle">{event.subtitle}</p><p>{event.description}</p>{details}
        <button className="primary-btn" type="button" onClick={() => { setSuccess(null); setError(''); setOpen(true); }}>Register for Karthika Masam ↗</button>
        <p className="registration-demo-note">Demo registration: saved in this browser only. Your details are not sent to KKC.</p>
      </div>
    </article>
    <details className="registration-records">
      <summary>Demo registrations &amp; Excel export <span>{rows.length} saved</span></summary>
      <div className="registration-records-body">
        <p>Records are available only in this browser on this device. Clearing browser data removes them. This demo panel has no admin sign-in.</p>
        {storageError && <p className="registration-error" role="alert">{storageError}</p>}
        <div className="registration-toolbar"><p><strong>{rows.length}</strong> registrations · <strong>{rows.reduce((n,r) => n + r.attendees, 0)}</strong> attendees</p>
          <button className="secondary-btn" type="button" disabled={!rows.length || exporting || !!storageError} onClick={exportExcel}>{exporting ? 'Preparing Excel…' : 'Download Excel (.xlsx)'}</button>
        </div><p role="status">{exportStatus}</p>
        {rows.length ? <div className="registration-table-wrap"><table className="registration-table">
          <thead><tr>{['Name','Mobile','Email','Attendees','Note','Registered'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><td>{r.fullName}</td><td>{r.mobile}</td><td>{r.email || '—'}</td><td>{r.attendees}</td><td>{r.note || '—'}</td><td>{new Date(r.createdAt).toLocaleString('en-IN')}</td></tr>)}</tbody>
        </table></div> : <p>No registrations yet. Register above to try the demo.</p>}
      </div>
    </details>
    {open && <div className="registration-backdrop" onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>
      <div ref={dialog} className="registration-dialog" role="dialog" aria-modal="true" aria-labelledby="registration-title" aria-describedby="registration-description">
        <button ref={close} className="registration-close" type="button" aria-label="Close registration" onClick={dismiss}>×</button>
        <p className="eyebrow">You’re invited · KKC</p><h2 id="registration-title">{success ? 'Your interest is saved' : event.title}</h2>
        <p id="registration-description">Come together in devotion. Register your interest for our upcoming gathering.</p>
        {success ? <div className="registration-success" role="status">
          <p><strong>{success.fullName}</strong>, your registration for <strong>{success.attendees}</strong> {success.attendees === 1 ? 'attendee' : 'attendees'} is saved in this browser.</p>
          <p className="registration-reference">Reference: {success.id}</p>
          <p>This is a local demo record. It has not been sent to KKC. Date, time, and venue are to be announced.</p>
          <button type="button" className="primary-btn" onClick={dismiss}>Done</button>
        </div> : <>{details}<form className="registration-form" onSubmit={submit}>
          <label>Full name *<input name="fullName" autoComplete="name" required minLength={2} maxLength={120} value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} /></label>
          <div className="registration-form-row">
            <label>Mobile number *<input name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" required pattern="[6-9][0-9]{9}" maxLength={10} title="Enter a 10-digit Indian mobile number starting with 6, 7, 8, or 9" placeholder="10-digit Indian mobile" value={form.mobile} onChange={e => setForm({...form,mobile:e.target.value})} /></label>
            <label>Attendees *<input name="attendees" type="number" required min={1} max={50} step={1} value={form.attendees} onChange={e => setForm({...form,attendees:e.target.value})} /></label>
          </div>
          <label>Email (optional)<input name="email" type="email" autoComplete="email" maxLength={150} value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
          <label>Anything you’d like us to know? (optional)<textarea name="note" rows={2} maxLength={1000} value={form.note} onChange={e => setForm({...form,note:e.target.value})} /></label>
          <p className="registration-demo-note">Demo only. Details stay in this browser and can be viewed or exported from the demo panel. No registration is sent to KKC.</p>
          {(error || storageError) && <p className="registration-error" role="alert">{error || storageError}</p>}
          <button className="primary-btn full-btn" type="submit" disabled={!!storageError}>Save demo registration</button>
          <button className="registration-later" type="button" onClick={dismiss}>Maybe later</button>
        </form></>}
      </div>
    </div>}
  </section>;
}
