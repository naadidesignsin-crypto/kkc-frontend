import { Capacitor } from '@capacitor/core';
import { getRegistrationWebAppUrl, selectRegistrationFormUrl } from './googleRegistration';
export type AstrologyCustomer = {
  name: string; gender: string; phone: string; dob: string; birthplace: string;
  birthtime: string; topic: string; query: string; minutes: number;
  preferredTime?: string; reportedPaid?: boolean; paymentReference?: string;
};
export function saveAstrologyCustomer(record: AstrologyCustomer, requestId: string): Promise<string> {
  const local = (!Capacitor.isNativePlatform() && ['localhost', '127.0.0.1'].includes(location.hostname))
    || import.meta.env.VITE_REGISTRATION_ENV === 'local'
    || (import.meta.env.DEV && import.meta.env.VITE_REGISTRATION_ENV !== 'prod');
  const endpoint = getRegistrationWebAppUrl(selectRegistrationFormUrl(local, {
    local: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_LOCAL,
    prod: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_PROD,
  }));
  if (!endpoint) return Promise.reject(new Error('Customer tracking is not configured yet.'));
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
    const finish = (error?: string, reference?: string) => {
      clearTimeout(timeout); window.removeEventListener('message', receive); iframe.remove();
      if (error) reject(new Error(error)); else resolve(reference!);
    };
    const timeout = window.setTimeout(() => finish('Saving could not be confirmed. Retry, or send your details on WhatsApp.'), 20000);
    function receive(event: MessageEvent) {
      const google = event.origin === 'https://script.google.com'
        || /^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin);
      if (!google || !event.source || event.data?.channel !== channel) return;
      if (event.data.type === 'kkc-astro-ready' && !peer) {
        peer = event.source as WindowProxy; peerOrigin = event.origin;
        peer.postMessage({ type: 'kkc-astro-save', channel, payload: { ...record, consent: true, requestId, environment: local ? 'local' : 'prod' } }, peerOrigin);
      } else if (event.source === peer && event.origin === peerOrigin && event.data.type === 'kkc-astro-result') {
        if (event.data.ok === true && /^ASTRO-[A-Z0-9-]+$/.test(event.data.reference || '')) finish(undefined, event.data.reference);
        else finish(typeof event.data.error === 'string' ? event.data.error : 'The enquiry could not be saved.');
      }
    }
    window.addEventListener('message', receive);
    document.body.appendChild(iframe);
  });
}
