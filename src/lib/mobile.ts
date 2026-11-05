
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getGoogleRegistrationUrl, getRegistrationWebAppUrl, selectRegistrationFormUrl } from './googleRegistration';

export const isAndroidApp = Capacitor.isNativePlatform()
  || import.meta.env.VITE_APP_SHELL === 'true'
  || (import.meta.env.DEV && new URLSearchParams(window.location.search).get('app-preview') === '1');

export const isLocalRegistration = import.meta.env.VITE_REGISTRATION_ENV === 'local'
  || (import.meta.env.DEV && import.meta.env.VITE_REGISTRATION_ENV !== 'prod');

export function appRegistrationUrl(): string | null {
  const webApp = selectRegistrationFormUrl(isLocalRegistration, {
    local: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_LOCAL,
    prod: import.meta.env.VITE_REGISTRATION_WEBAPP_URL_PROD,
  });
  const form = selectRegistrationFormUrl(isLocalRegistration, {
    local: import.meta.env.VITE_REGISTRATION_FORM_URL_LOCAL,
    prod: import.meta.env.VITE_REGISTRATION_FORM_URL_PROD,
  });
  const result = webApp ? getRegistrationWebAppUrl(webApp) : getGoogleRegistrationUrl(form);
  if (!result) return null;
  const url = new URL(result); url.searchParams.set('source', 'android'); return url.toString();
}

export async function openExternalLink(value: string): Promise<void> {
  const url = new URL(value);
  if (!['https:', 'http:', 'tel:', 'mailto:', 'upi:'].includes(url.protocol)) throw new Error('This link is unavailable.');
  if (Capacitor.isNativePlatform() && ['https:', 'http:'].includes(url.protocol)) {
    await Browser.open({ url: url.href, toolbarColor: '#100c06' });
  } else if (['tel:', 'mailto:', 'upi:'].includes(url.protocol)) {
    window.location.href = url.href;
  } else {
    window.open(url.href, '_blank', 'noopener,noreferrer');
  }
}

export async function shareKkc(): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    await Share.share({ title: 'KKC', text: 'KKC devotional events and registration', url: 'https://kkcorg.com/' });
    return 'KKC link shared.';
  }
  if (navigator.share) {
    await navigator.share({ title: 'KKC', url: 'https://kkcorg.com/' });
    return 'KKC link shared.';
  }
  await navigator.clipboard.writeText('https://kkcorg.com/');
  return 'KKC link copied.';
}

export async function sharePoster(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not open the poster.');
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-') || 'kkc-poster.png';
  const file = await Filesystem.writeFile({ path: 'shared/' + safeName, directory: Directory.Cache, data: base64, recursive: true });
  await Share.share({ title: 'KKC event poster', files: [file.uri] });
}
