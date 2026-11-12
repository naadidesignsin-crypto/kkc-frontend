import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { saveCustomerReview } from '../lib/astrologyTracking';
import './CustomerReviews.css';

export default function CustomerReviews() {
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const lock = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || !rating) return;
    const data = new FormData(event.currentTarget);
    lock.current = true; setBusy(true); setError('');
    try {
      const result = await saveCustomerReview({ kind: 'review', name: String(data.get('name') || '').trim(), rating,
        comment: String(data.get('comment') || '').trim(), enquiryReference: String(data.get('enquiryReference') || '').trim(),
        publishConsent: data.get('publishConsent') === 'on' }, requestId.current);
      setReference(result);
    } catch (e) { setError(e instanceof Error ? e.message : 'Your review could not be confirmed as saved. Please retry.'); }
    finally { lock.current = false; setBusy(false); }
  }
  return <section id="customer-review" className="customer-reviews">
    <p className="eyebrow">Your experience matters / మీ అభిప్రాయం</p>
    <h2>How was your KKC consultation?</h2>
    <p>After your consultation, share honest feedback with the KKC team.</p>
    {reference ? <div role="status"><h3>Thank you for your feedback.</h3><p>Your review is saved: <strong>{reference}</strong>.</p><p>KKC will read it privately. Public display requires your permission and KKC approval.</p></div> :
      <form onSubmit={submit}>
        <fieldset disabled={busy}>
          <legend>Your rating (required)</legend>
          <div className="review-stars">{[1, 2, 3, 4, 5].map(value => <label key={value}><input type="radio" name="rating" value={value} required checked={rating === value} onChange={() => setRating(value)} /><span aria-hidden="true">{value <= rating ? '★' : '☆'}</span><span className="review-sr">{value} {value === 1 ? 'star' : 'stars'}</span></label>)}</div>
          <label>Name <input name="name" required maxLength={120} autoComplete="name" /></label>
          <label>Enquiry reference (optional) <input name="enquiryReference" maxLength={40} placeholder="ASTRO-…" /></label>
          <label>Your feedback <textarea name="comment" required minLength={5} maxLength={1500} rows={4} placeholder="What went well? What could we improve?" /></label>
          <label className="review-check"><input type="checkbox" name="publishConsent" /><span>KKC may display my first name, rating and feedback after approval. Leave this unchecked to keep my feedback private.</span></label>
          <label className="review-check"><input type="checkbox" required /><span>I agree to KKC storing this feedback in its private review register. Please do not include birth details, payment details or other sensitive information.</span></label>
          <button className="primary-btn" type="submit">{busy ? 'Saving feedback…' : error ? 'Retry saving feedback' : 'Submit feedback'}</button>
        </fieldset>
        <div role="status">{busy && <p>Please keep this page open. Saving may take up to a minute.</p>}{error && <p role="alert">{error}</p>}</div>
      </form>}
  </section>;
}
