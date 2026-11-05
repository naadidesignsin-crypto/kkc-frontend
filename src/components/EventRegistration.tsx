import { isLocalRegistration } from '../lib/mobile';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { karthikaEvent as event, getKarthikaStatus, karthikaPosters } from '../data/karthikaEvent';
import KarthikaPosters from './KarthikaPosters';
import { readRegistrations, saveRegistration, createRegistrationWorkbook, type Registration } from '../lib/registrations';
import { printRegistrations } from '../lib/registrationPdf';
import { getGoogleRegistrationUrl, getRegistrationWebAppUrl, selectRegistrationFormUrl } from '../lib/googleRegistration';

const empty = { gothram: '', fullName: '', mobile: '', email: '', address: '', note: '' };
const noticeKey = 'kkc.karthika-notice.v1';
const configuredForm = selectRegistrationFormUrl(isLocalRegistration, {
  local: import.meta.env.VITE_REGISTRATION_FORM_URL_LOCAL,
  prod: import.meta.env.VITE_REGISTRATION_FORM_URL_PROD,
});
const configuredWebApp = selectRegistrationFormUrl(isLocalRegistration, {
  local: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_LOCAL,
  prod: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_PROD,
});
const registrationLanguage = window.location.pathname === '/telugu' ? 'te' : 'en';
const validatedWebAppUrl = getRegistrationWebAppUrl(configuredWebApp);
const webAppUrl = validatedWebAppUrl ? (() => { const url = new URL(validatedWebAppUrl); url.searchParams.set('lang', registrationLanguage); const source = new URLSearchParams(window.location.search).get('source'); if (source && /^[a-zA-Z0-9_-]{1,40}$/.test(source)) url.searchParams.set('source', source); return url.toString(); })() : null;
const googleFormUrl = configuredWebApp ? null : getGoogleRegistrationUrl(configuredForm);
const sharedRegistrationConfigured = !!(configuredWebApp || configuredForm);

export default function EventRegistration({ presentation = 'website', onRegister }: { presentation?: 'website' | 'app'; onRegister?: () => void } = {}) {
  const [open, setOpen] = useState(() => getKarthikaStatus() !== 'Completed' || ['/telugu', '/english'].includes(window.location.pathname));
  const [showPosters, setShowPosters] = useState(true);
  const [posterIndex, setPosterIndex] = useState(0);
  const [eventStatus, setEventStatus] = useState(getKarthikaStatus);
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState<Registration[]>([]);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [success, setSuccess] = useState<Registration | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  function expandPoster(index: number) {
    setPosterIndex(index);
    setShowPosters(true);
    setOpen(true);
  }

  function beginRegistration() {
    if (onRegister) { dismiss(); onRegister(); return; }
    setShowPosters(false); setSuccess(null); setError(''); setOpen(true);
  }

  function dismiss() {
    setOpen(false);
    try { sessionStorage.setItem(noticeKey, 'seen'); } catch { /* Dismissal still works. */ }
  }

  useEffect(() => {
    const showPoster = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id;
      const index = karthikaPosters.findIndex(poster => poster.id === id);
      if (index >= 0) expandPoster(index);
    };
    window.addEventListener('kkc:open-poster', showPoster);
    return () => window.removeEventListener('kkc:open-poster', showPoster);
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (sharedRegistrationConfigured) return;
      try {
        setRows(readRegistrations().filter(row => row.eventId === event.id));
        setStorageError('');
      } catch { setStorageError('Browser storage is unavailable or saved registrations could not be read.'); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    const statusTimer = window.setInterval(() => setEventStatus(getKarthikaStatus()), 60000);
    return () => { window.clearInterval(statusTimer); window.removeEventListener('storage', refresh); };
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
      const items = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href],iframe');
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
    e.preventDefault();
    setError('');
    try {
      const row: Registration = {
        id: crypto.randomUUID(), eventId: event.id, eventName: event.title,
        gothram: form.gothram.trim(), fullName: form.fullName.trim(),
        mobile: form.mobile.trim(), email: form.email.trim(),
        address: form.address.trim(), note: form.note.trim(), createdAt: new Date().toISOString(),
      };
      setRows(saveRegistration(row).filter(record => record.eventId === event.id));
      setSuccess(row);
      setForm(empty);
      close.current?.focus();
      try { sessionStorage.setItem(noticeKey, 'seen'); } catch { /* Already saved. */ }
    } catch (err) {
      setError(err instanceof Error && (err.message.includes('already registered') || err.message.startsWith('Enter Gothram'))
        ? err.message : 'Could not save. Check browser storage and try again.');
    }
  }

  async function exportExcel() {
    setExporting(true);
    setExportStatus('');
    try {
      const latest = readRegistrations().filter(row => row.eventId === event.id);
      if (!latest.length) throw new Error('No registrations');
      const buffer = await createRegistrationWorkbook(latest);
      const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kkc-karthika-masam-registrations-' + new Date().toISOString().slice(0, 10) + '.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportStatus('Excel download started for ' + latest.length + ' registrations.');
    } catch { setExportStatus('Export failed. Check saved registrations and try again.'); }
    finally { setExporting(false); }
  }

  function exportPdf() {
    try {
      printRegistrations(readRegistrations().filter(row => row.eventId === event.id));
      setExportStatus('Report opened in a new tab. Choose Print / Save as PDF, then select Save as PDF.');
    } catch (err) {
      setExportStatus(err instanceof Error ? err.message : 'Could not open the PDF report.');
    }
  }

  const details = <dl className="karthika-details">
    {(['date', 'time', 'venue'] as const).map(key => <div key={key}><dt>{key}</dt><dd>{event[key]}</dd></div>)}
  </dl>;

  return <section className={presentation === "app" ? "karthika-section--app" : "karthika-section section-wrap"} id="karthika-registration" aria-labelledby="karthika-heading">
    {presentation !== "app" && <article className="karthika-feature reveal-card">
      <div className="karthika-emblem" aria-hidden="true">✦</div>
      <div className="karthika-copy">
        <p className="eyebrow">{eventStatus} · Karthika Masam programme</p>
        <h2 id="karthika-heading">{event.title}</h2>
        <p className="karthika-subtitle">{event.subtitle}</p>
        <p>{event.description}</p>
        {details}
        <KarthikaPosters onExpand={expandPoster} />
        <button className="primary-btn" type="button" onClick={beginRegistration}>
          Register for Karthika Masam ↗
        </button>
        <p className="registration-demo-note">{webAppUrl
          ? 'Register here. Your details are shared privately with the KKC organising team.'
          : googleFormUrl
          ? 'Registration opens securely in Google Forms. Your details will be shared with the KKC organising team.'
          : sharedRegistrationConfigured ? 'Online registration is temporarily unavailable. Please contact KKC.'
          : 'Demo registration: saved in this browser only. Your details are not sent to KKC.'}</p>
      </div>
    </article>}

    {presentation !== "app" && !sharedRegistrationConfigured && <details className="registration-records">
      <summary>Demo registrations &amp; PDF / Excel export <span>{rows.length} saved</span></summary>
      <div className="registration-records-body">
        <p>Records are available only in this browser on this device. Clearing browser data removes them. This demo panel has no admin sign-in.</p>
        {storageError && <p className="registration-error" role="alert">{storageError}</p>}
        <div className="registration-toolbar">
          <p><strong>{rows.length}</strong> registrations</p>
          <div className="registration-export-actions">
            <button className="secondary-btn" type="button" disabled={!rows.length || !!storageError} onClick={exportPdf}>Print / Save PDF</button>
            <button className="secondary-btn" type="button" disabled={!rows.length || exporting || !!storageError} onClick={exportExcel}>
              {exporting ? 'Preparing Excel…' : 'Download Excel (.xlsx)'}
            </button>
          </div>
        </div>
        <p role="status">{exportStatus}</p>
        {rows.length ? <div className="registration-table-wrap"><table className="registration-table">
          <thead><tr>{['Gothram', 'Namam', 'Phone number', 'Email ID', 'Address', 'Note', 'Registered'].map(heading => <th key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.id}>
            <td>{row.gothram || 'Not provided'}</td><td>{row.fullName}</td><td>{row.mobile}</td>
            <td>{row.email || 'Not provided'}</td><td>{row.address || '—'}</td><td>{row.note || '—'}</td>
            <td>{new Date(row.createdAt).toLocaleString('en-IN')}</td>
          </tr>)}</tbody>
        </table></div> : <p>No registrations yet. Register above to try the demo.</p>}
      </div>
    </details>}

    {open && <div className={!showPosters && webAppUrl ? "registration-backdrop registration-backdrop--embedded" : showPosters ? "registration-backdrop registration-backdrop--posters" : "registration-backdrop"} onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>
      <div ref={dialog} className={showPosters ? "registration-dialog registration-dialog--posters" : webAppUrl ? "registration-dialog registration-dialog--embedded" : "registration-dialog"} role="dialog" aria-modal="true" aria-labelledby="registration-title" aria-describedby="registration-description">
        <button ref={close} className="registration-close" type="button" aria-label="Close registration" onClick={dismiss}>×</button>
        <header className="registration-dialog-header">
          {showPosters ? <p className="eyebrow">{eventStatus} · KKC</p> : !webAppUrl && <p className="eyebrow">You’re invited · KKC</p>}
          <h2 id="registration-title">{success && !showPosters ? 'Your interest is saved' : event.title}</h2>
          <p id="registration-description" className={showPosters || webAppUrl ? 'registration-sr-only' : undefined}>Register your Gothram and Namam for our upcoming devotional gathering.</p>
        </header>
        {showPosters ? <>
          <KarthikaPosters compact initialIndex={posterIndex} />
          <footer className="karthika-poster-actions">
            <button className="primary-btn" type="button" onClick={beginRegistration}>Register / నమోదు ↗</button>
            <button className="registration-later" type="button" onClick={() => { dismiss(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Go to homepage / హోమ్ పేజీ</button>
          <a className="registration-later" href="https://wa.me/917981041123?text=Hello%20KKC%2C%20please%20help%20me%20register%20for%20Karthika%20Masam." target="_blank" rel="noopener noreferrer">Need help? WhatsApp KKC / సహాయం</a></footer>
        </> : sharedRegistrationConfigured ? <>
          {!webAppUrl && details}
          {webAppUrl ? <div className="registration-embedded">
            <iframe src={webAppUrl} title="KKC Karthika Masam registration form" className="registration-webapp-frame" referrerPolicy="strict-origin-when-cross-origin" />
            <a className="registration-new-tab" href={webAppUrl} target="_blank" rel="noopener noreferrer">Open registration in a new tab ↗</a>
          </div> : googleFormUrl ? <div className="registration-online">
            <p>Enter your Gothram, Namam, phone number in our Google Form. Email, address and note are optional.</p>
            <a className="primary-btn full-btn" href={googleFormUrl} target="_blank" rel="noopener noreferrer">Continue to registration ↗</a>
            <p className="registration-demo-note">Complete and submit the Google Form to register. The KKC team can access the shared registrations; personal details are not displayed publicly.</p>
          </div> : <p role="alert" className="registration-error">Online registration is temporarily unavailable. <a href="#contact" onClick={dismiss}>Contact KKC</a> for assistance.</p>}
        </> : success ? <div className="registration-success" role="status">
          <p><strong>{success.fullName}</strong>, your registration under <strong>{success.gothram}</strong> Gothram is saved in this browser.</p>
          <p className="registration-reference">Reference: {success.id}</p>
          <p>This is a local demo record. It has not been sent to KKC. Date, time, and venue are to be announced.</p>
          <button type="button" className="primary-btn" onClick={dismiss}>Done</button>
        </div> : <>{details}
          <form className="registration-form" onSubmit={submit}>
            <div className="registration-form-row">
              <label>Gothram / గోత్రం *<input name="gothram" required maxLength={120} value={form.gothram} onChange={e => setForm({ ...form, gothram: e.target.value })} /></label>
              <label>Namam / నామం *<input name="fullName" autoComplete="name" required minLength={2} maxLength={120} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></label>
            </div>
            <label>Phone number *<input name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" required pattern="[6-9][0-9]{9}" maxLength={10} title="Enter a 10-digit Indian phone number starting with 6, 7, 8, or 9" placeholder="10-digit Indian phone number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} /></label>
            <label>Email ID (optional)<input name="email" type="email" autoComplete="email" maxLength={150} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            <label>Address (optional)<textarea name="address" autoComplete="street-address" rows={2} maxLength={1000} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></label>
            <label>Note (optional)<textarea name="note" rows={2} maxLength={1000} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></label>
            <p className="registration-demo-note">Demo only. Details stay in this browser and can be exported as PDF or Excel from the demo panel. No registration is sent to KKC.</p>
            {(error || storageError) && <p className="registration-error" role="alert">{error || storageError}</p>}
            <button className="primary-btn full-btn" type="submit" disabled={!!storageError}>Save demo registration</button>
            <button className="registration-later" type="button" onClick={dismiss}>Maybe later</button>
          </form>
        </>}
      </div>
    </div>}
  </section>;
}
