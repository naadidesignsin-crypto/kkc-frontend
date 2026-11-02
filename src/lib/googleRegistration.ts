/**
 * Development uses only LOCAL; production builds use only PROD.
 * No fallback between environments: a missing URL stays in demo mode.
 */
export function selectRegistrationFormUrl(
  isDevelopment: boolean,
  urls: { local?: string; prod?: string },
): string | undefined {
  return (isDevelopment ? urls.local : urls.prod)?.trim() || undefined;
}

export function getGoogleRegistrationUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (url.hostname === 'forms.gle' && url.pathname.length > 1) return url.href;
    if (url.hostname === 'docs.google.com' && /^\/forms\/d\/(?:e\/)?[^/]+\/viewform\/?$/.test(url.pathname)) return url.href;
  } catch { /* Invalid configuration must not become a public registration link. */ }
  return null;
}

export function getRegistrationWebAppUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (url.hostname === 'script.google.com' && /^\/macros\/s\/[a-zA-Z0-9_-]+\/exec\/?$/.test(url.pathname)) return url.href;
  } catch { /* Invalid deployment URLs stay unavailable. */ }
  return null;
}
