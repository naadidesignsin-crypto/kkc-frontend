import { astrologyNameIcon, astrologyBirthDate, astrologyBirthTime } from '../lib/astrologyMessage';
import { useState } from 'react';
import type { FormEvent } from 'react';
import paymentQr from '../assets/kkc-payment-qr.jpeg';
import './AstrologyBooking.css';

const plans = [{ minutes: 10, amount: 999 }, { minutes: 20, amount: 1500 }];
export default function AstrologyBooking() {
  const [minutes, setMinutes] = useState(10);
  const [paid, setPaid] = useState(false);
  const [unknownTime, setUnknownTime] = useState(false);
  const [ready, setReady] = useState('');
  const plan = plans.find(p => p.minutes === minutes)!;
  function changePlan(value: number) { setMinutes(value); setPaid(false); setReady(''); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') || '').replace(/[\s()+-]/g, '');
    if (!/^\d{10,15}$/.test(phone)) {
      (event.currentTarget.elements.namedItem('phone') as HTMLInputElement).focus();
      setReady('Please enter a valid phone number with 10–15 digits.'); return;
    }
    const text = [
      '🙏 *KKC Astrology Consultation*', '',
      '☎️ *Call:* ' + plan.minutes + ' minutes | 💳 *Fee:* ₹' + plan.amount.toLocaleString('en-IN'),
      astrologyNameIcon(String(data.get('gender'))) + ' *Name:* ' + String(data.get('name')).trim(),
      '👤 *Gender:* ' + String(data.get('gender')),
      '📞 *WhatsApp:* ' + phone,
      '📅 *Date of birth:* ' + astrologyBirthDate(String(data.get('dob'))),
      '📍 *Birthplace:* ' + String(data.get('birthplace')).trim(),
      '🕒 *Birth time:* ' + (unknownTime ? 'Unknown' : astrologyBirthTime(String(data.get('birthtime')))),
      '💬 *Query:* ' + String(data.get('query')).trim(),
      '🗓️ *Preferred call time:* ' + (String(data.get('time') || '').trim() || 'Please suggest an available slot'),
      paid ? '⏳ *Payment:* I report paying INR ' + plan.amount + '. Please verify payment.' : '⏳ *Payment:* Not paid yet. Please confirm availability and payment instructions.',
      '🧾 *Transaction reference:* ' + (String(data.get('reference') || '').trim() || 'Not provided'),
      'I understand that KKC must verify payment and confirm the call slot.'
    ].join('\n');
    setReady('https://wa.me/917981041123?text=' + encodeURIComponent(text));
  }
  return <section id="astrology-booking" className="astrology-booking" aria-labelledby="astrology-booking-title">
    <div><p className="eyebrow">Personal astrology consultation</p>
      <h3 id="astrology-booking-title">Ask your query. Choose your call.</h3>
      <p>Share your question with the KKC astrologer. We will confirm an available call time on WhatsApp.</p>
    </div>
    <fieldset className="astrology-plans"><legend>Choose consultation duration</legend>
      {plans.map(p => <label className={p.minutes === minutes ? 'astrology-plan selected' : 'astrology-plan'} key={p.minutes}>
        <input type="radio" name="consultation-plan" checked={p.minutes === minutes} onChange={() => changePlan(p.minutes)} />
        <span><strong>{p.minutes}-minute call</strong><span>₹{p.amount.toLocaleString('en-IN')}</span></span>
      </label>)}
    </fieldset>
    <div className="astrology-booking-grid">
    <form onSubmit={submit} onChange={() => setReady('')} className="astrology-details">
      <label>Your name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Gender<select name="gender" required defaultValue=""><option value="" disabled>Choose an option</option><option value="Male">👨 Male</option><option value="Female">👩 Female</option><option value="Prefer not to say">👤 Prefer not to say</option></select></label>
      <label>WhatsApp number<input name="phone" type="tel" required maxLength={20} autoComplete="tel" inputMode="tel" /></label>
      <label>Date of birth<input name="dob" type="date" required max={new Date().toLocaleDateString("en-CA")} /></label>
      <label>Birthplace<input name="birthplace" required maxLength={150} placeholder="City or town, state and country" /></label>
      <label>Birth time (local to birthplace)<input name="birthtime" type="time" required={!unknownTime} disabled={unknownTime} /></label>
      <label className="astrology-check"><input type="checkbox" checked={unknownTime} onChange={e => setUnknownTime(e.target.checked)} /><span>I do not know my birth time</span></label>
      <label>Your astrology query<textarea name="query" required maxLength={1500} rows={4} placeholder="What would you like to discuss with the astrologer?" /></label>
      <label>Preferred call time (optional)<input name="time" maxLength={150} placeholder="For example: tomorrow, 6–8 PM IST" /></label>
      <label>UPI transaction reference (optional)<input name="reference" maxLength={80} /></label>
      <label className="astrology-check"><input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} /><span>I have paid ₹{plan.amount.toLocaleString('en-IN')}. KKC will verify my payment.</span></label>
      <p className="astrology-note">Your query is shared with KKC only when you press Send in WhatsApp. Payment and call slots require confirmation from KKC.</p>
      <button className="primary-btn" type="submit">Prepare WhatsApp enquiry</button>
      {ready && <div role="status">{ready.startsWith('https:') ? <><p>Your enquiry is ready. Send it to KKC to request your call.</p><a className="primary-btn" href={ready} target="_blank" rel="noopener noreferrer">Open WhatsApp &amp; send enquiry</a></> : <p>{ready}</p>}</div>}
    </form>
    <aside className="astrology-payment" aria-label="Consultation payment">
      <h4>Consultation fee: ₹{plan.amount.toLocaleString('en-IN')}</h4>
      <p>{plan.minutes}-minute personal call</p>
      <p>Confirm availability with KKC before paying. Scan the QR or use a UPI app.</p>
      <img src={paymentQr} alt="KKC payment QR for Kompella Krishna Chaitanya" />
      <p>Payee: Kompella Krishna Chaitanya<br />UPI: 7981041123@axl</p>
      <a className="secondary-btn" href={'upi://pay?pa=7981041123%40axl&pn=Kompella%20Krishna%20Chaitanya&am=' + plan.amount + '&cu=INR&tn=' + encodeURIComponent('KKC astrology ' + plan.minutes + ' minute call')}>Pay ₹{plan.amount.toLocaleString('en-IN')} using UPI</a>
      <p className="astrology-note">Opening a UPI app does not confirm payment. Share your transaction reference or screenshot with KKC for verification.</p>
    </aside></div>
  </section>;
}
