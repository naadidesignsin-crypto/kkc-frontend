import { getRegistrationWebAppUrl } from './googleRegistration';
export type DailyEventVideo = { id: string; title: string; date: string; description: string };
export function readDailyEventVideos(): Promise<DailyEventVideo[]> {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname) || import.meta.env.DEV;
  const endpoint = getRegistrationWebAppUrl(local ? import.meta.env.VITE_EVENTS_VIDEO_URL_LOCAL : import.meta.env.VITE_EVENTS_VIDEO_URL_PROD);
  if (!endpoint) return Promise.reject(new Error('Daily videos are not connected yet.'));
  const protectedUrls = [import.meta.env.VITE_REGISTRATION_WEBAPP_URL_LOCAL, import.meta.env.VITE_REGISTRATION_WEBAPP_URL_PROD, import.meta.env.VITE_ASTROLOGY_WEBAPP_URL_LOCAL, import.meta.env.VITE_ASTROLOGY_WEBAPP_URL_PROD].map(getRegistrationWebAppUrl).filter(Boolean);
  if (protectedUrls.includes(endpoint)) return Promise.reject(new Error('Daily videos need their separate reader connection.'));
  return new Promise((resolve, reject) => {
    const channel = crypto.randomUUID(), url = new URL(endpoint);
    url.searchParams.set('page', 'events-video-feed'); url.searchParams.set('channel', channel); url.searchParams.set('parentOrigin', location.origin);
    const frame = document.createElement('iframe'); frame.hidden = true; frame.title = 'KKC public daily videos'; frame.src = url.href;
    const finish = (error?: string, rows?: DailyEventVideo[]) => {
      clearTimeout(timer); window.removeEventListener('message', receive); frame.remove();
      if (error) reject(new Error(error)); else resolve(rows!);
    };
    const timer = window.setTimeout(() => finish('Daily videos could not be loaded. Please retry.'), 45000);
    function receive(event: MessageEvent) {
      if (!(event.origin === 'https://script.google.com' || /^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin)) || !event.source || event.data?.channel !== channel || event.data.type !== 'kkc-events-result') return;
      if (event.data.ok !== true || !Array.isArray(event.data.videos)) return finish('Daily videos could not be loaded. Please retry.');
      const rows: DailyEventVideo[] = event.data.videos.slice(0,60).filter((v: DailyEventVideo) => v && /^[A-Za-z0-9_-]{11}$/.test(v.id) && typeof v.title === 'string' && v.title.length <= 160 && typeof v.description === 'string' && v.description.length <= 600 && /^\d{4}-\d{2}-\d{2}$/.test(v.date)).map((v: DailyEventVideo) => ({id:v.id,title:v.title,date:v.date,description:v.description}));
      finish(undefined, rows.sort((a,b)=>b.date.localeCompare(a.date)));
    }
    window.addEventListener('message', receive); document.body.appendChild(frame);
  });
}
