import { useRef, useState } from 'react';
import { saveAstrologyCustomer } from '../lib/astrologyTracking';
import type { AstrologyCustomer } from '../lib/astrologyTracking';
export default function AstrologyCustomerRecord({ record, whatsappUrl }: { record: AstrologyCustomer; whatsappUrl: string }) {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const lock = useRef(false);
  async function save() {
    if (!consent || lock.current) return;
    lock.current = true; setStatus('saving'); setError('');
    try { const ref = await saveAstrologyCustomer(record, requestId.current); setReference(ref); setStatus('saved'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Saving could not be confirmed.'); setStatus('error'); }
    finally { lock.current = false; }
  }
  const target = new URL(whatsappUrl);
  if (reference) target.searchParams.set('text', (target.searchParams.get('text') || '') + '\n📋 *KKC enquiry reference:* ' + reference);
  return <div className="astrology-customer-record" onChange={event => event.stopPropagation()}>
    <p>Consultation hours: <strong>2 PM–9 PM IST</strong>. KKC confirms your date and time on WhatsApp.</p>
    {status !== 'saved' && <><label className="astrology-record-consent"><input type="checkbox" checked={consent} disabled={status === 'saving'} onChange={e => setConsent(e.target.checked)} /><span>I agree to KKC saving my consultation details, including name, birth details and selected call price, in its private customer register.</span></label>
    <button className="chat-next astrology-record-save" type="button" disabled={!consent || status === 'saving'} onClick={save}>{status === 'saving' ? 'Saving enquiry…' : status === 'error' ? 'Retry saving enquiry' : 'Save enquiry & prepare WhatsApp'}</button></>}
    <div role="status">{status === 'saved' ? <p>Enquiry saved: <strong>{reference}</strong>. Payment and call time are awaiting confirmation.</p> : status === 'error' ? <p>{error} Your enquiry has not been confirmed as saved.</p> : null}</div>
    {status === 'saved' && <a className="chat-send-whatsapp" href={target.href} target="_blank" rel="noopener noreferrer">Send details on WhatsApp ↗</a>}
    {status === 'error' && <a className="chat-send-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continue on WhatsApp without save confirmation ↗</a>}
  </div>;
}
