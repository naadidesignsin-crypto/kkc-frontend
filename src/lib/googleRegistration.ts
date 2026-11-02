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
