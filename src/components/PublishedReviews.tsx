import { useEffect, useRef, useState } from 'react';
import { getPublishedReviews } from '../lib/astrologyTracking';
import type { PublishedReview } from '../lib/astrologyTracking';
import './CustomerReviews.css';

export default function PublishedReviews() {
  const section = useRef<HTMLElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [reviews, setReviews] = useState<PublishedReview[]>([]);
  useEffect(() => {
    let active = true;
    let started = false;
    function load() {
      if (started) return;
      started = true;
      setStatus('loading');
      getPublishedReviews().then(items => { if (active) { setReviews(items); setStatus('ready'); } })
        .catch(() => { if (active) setStatus('error'); });
    }
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); } }, { rootMargin: '200px' });
    if (section.current) observer.observe(section.current);
    return () => { active = false; observer.disconnect(); };
  }, [attempt]);
  return <section id="customer-experiences" className="published-reviews" ref={section}>
    <p className="eyebrow">Customer Experiences</p>
    <h2>Feedback from our customers</h2>
    <p>Shared with customer permission and reviewed by KKC.</p>
    {status === 'loading' && <p role="status">Loading customer experiences…</p>}
    {status === 'error' && <div role="status"><p>Customer experiences could not be loaded right now.</p><button type="button" className="primary-btn" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>}
    {status === 'ready' && (reviews.length ? <div className="published-review-grid">{reviews.map((review, index) => <article className="published-review-card" key={index}>
      <p className="published-review-stars" aria-label={review.rating + ' out of 5 stars'}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
      <blockquote>{review.comment}</blockquote><p className="published-review-name">{review.name}</p>
    </article>)}</div> : <p>Customer experiences will appear here once approved by KKC.</p>)}
    <a href="#customer-review" className="published-review-link">Had a consultation? Share your feedback →</a>
  </section>;
}
