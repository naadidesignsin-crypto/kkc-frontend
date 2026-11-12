import { Capacitor } from '@capacitor/core';
import { getRegistrationWebAppUrl, selectRegistrationFormUrl } from './googleRegistration';
export type AstrologyCustomer = {
  name: string; gender: string; phone: string; dob: string; birthplace: string;
  birthtime: string; topic: string; query: string; minutes: number;
  preferredTime?: string; reportedPaid?: boolean; paymentReference?: string;
};
export type CustomerReview = { kind: 'review'; name: string; rating: number; comment: string; enquiryReference: string; publishConsent: boolean };
export function saveAstrologyCustomer(record: AstrologyCustomer, requestId: string, onProgress?: (stage: 'connecting' | 'saving') => void): Promise<string> {
  return saveCustomerRecord<string>(record, requestId, onProgress);
}
export function saveCustomerReview(record: CustomerReview, requestId: string): Promise<string> {
  return saveCustomerRecord<string>(record, requestId);
}
export type PublishedReview = { name: string; rating: number; comment: string };
export function getPublishedReviews(): Promise<PublishedReview[]> {
  return saveCustomerRecord<PublishedReview[]>({ kind: "list-reviews" }, crypto.randomUUID());
}
function saveCustomerRecord<T extends string | PublishedReview[]>(record: AstrologyCustomer | CustomerReview | { kind: "list-reviews" }, requestId: string, onProgress?: (stage: 'connecting' | 'saving') => void): Promise<T> {
  const local = (!Capacitor.isNativePlatform() && ['localhost', '127.0.0.1'].includes(location.hostname))
    || import.meta.env.VITE_REGISTRATION_ENV === 'local'
    || (import.meta.env.DEV && import.meta.env.VITE_REGISTRATION_ENV !== 'prod');
  const endpoint = getRegistrationWebAppUrl(selectRegistrationFormUrl(local, {
    local: import.meta.env.VITE_ASTROLOGY_WEBAPP_URL_LOCAL,
    prod: import.meta.env.VITE_ASTROLOGY_WEBAPP_URL_PROD,
  }));
  if (!endpoint) return Promise.reject(new Error('The separate astrology tracker is not connected yet. Your Karthika Masam registration is unaffected.'));
  const eventEndpoints = [import.meta.env.VITE_REGISTRATION_WEBAPP_URL_LOCAL, import.meta.env.VITE_REGISTRATION_WEBAPP_URL_PROD].map(getRegistrationWebAppUrl).filter(Boolean);
  if (eventEndpoints.includes(endpoint)) return Promise.reject(new Error('Astrology needs its own Apps Script deployment URL. Do not reuse the Karthika Masam registration URL.'));
  onProgress?.('connecting');
  return new Promise((resolve, reject) => {
    const channel = crypto.randomUUID();
    const url = new URL(endpoint);
    url.searchParams.set('page', 'astrology-tracker');
    url.searchParams.set('channel', channel);
    url.searchParams.set('parentOrigin', location.origin);
    const iframe = document.createElement('iframe');
    iframe.hidden = true; iframe.title = 'KKC private customer record submission'; iframe.src = url.href;
    let peer: WindowProxy | null = null;
    let peerOrigin = '';
    const finish = (error?: string, reference?: T) => {
      clearTimeout(timeout); window.removeEventListener('message', receive); iframe.remove();
      if (error) reject(new Error(error)); else resolve(reference!);
    };
    let timeout = window.setTimeout(() => finish('The astrology service did not connect in time. Please retry.'), 30000);
    function receive(event: MessageEvent) {
      const google = event.origin === 'https://script.google.com'
        || /^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin);
      if (!google || !event.source || event.data?.channel !== channel) return;
      if (event.data.type === 'kkc-astro-ready' && !peer) {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => finish('Google Sheets has not confirmed the save yet. The save may still finish; retry this enquiry to check without creating a duplicate.'), 60000);
        onProgress?.('saving');
        peer = event.source as WindowProxy; peerOrigin = event.origin;
        peer.postMessage({ type: 'kkc-astro-save', channel, payload: { ...record, consent: true, requestId, environment: local ? 'local' : 'prod' } }, peerOrigin);
      } else if (event.source === peer && event.origin === peerOrigin && event.data.type === 'kkc-astro-result') {
        if ('kind' in record && record.kind === 'list-reviews' && event.data.ok === true && Array.isArray(event.data.reviews)) {
          const reviews: PublishedReview[] = event.data.reviews.slice(0, 20).filter((r: PublishedReview) => r && typeof r.name === 'string' && r.name.length <= 120 && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 && typeof r.comment === 'string' && r.comment.length <= 1500).map((r: PublishedReview) => ({ name: r.name, rating: r.rating, comment: r.comment }));
          finish(undefined, reviews as T);
        } else if (event.data.ok === true && /^ASTRO-[A-Z0-9-]+$/.test(event.data.reference || '')) finish(undefined, event.data.reference as T);
        else finish(typeof event.data.error === 'string' ? event.data.error : 'The enquiry could not be saved.');
      }
    }
    window.addEventListener('message', receive);
    document.body.appendChild(iframe);
  });
}
