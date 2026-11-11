export const ASTROLOGY_CHAT_EVENT = 'kkc:open-astrology-chat';
export function openAstrologyChat(): void {
  window.dispatchEvent(new Event(ASTROLOGY_CHAT_EVENT));
}
