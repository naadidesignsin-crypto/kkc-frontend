export const ASTROLOGY_CHAT_EVENT = 'kkc:open-astrology-chat';
export function openAstrologyChat(query = ''): void {
  window.dispatchEvent(new CustomEvent(ASTROLOGY_CHAT_EVENT, { detail: { query } }));
}
