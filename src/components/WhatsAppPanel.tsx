const WHATSAPP_NUMBER = '917981041123';
const DEFAULT_MESSAGE = 'Hello KKC, I want to know more about devotional events and astrology services.';

function WhatsAppPanel() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      className="whatsapp-panel"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact KKC on WhatsApp"
    >
      <svg className="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7a12 12 0 0 0 5.8 1.5h.1A11.9 11.9 0 0 0 24 11.9c0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.9 9.9 0 1 1 8.4 4.6Zm5.4-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6L9 6.8c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.1 2.9c.2.2 2 3.1 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" /></svg>
      <span>WhatsApp</span>
    </a>
  );
}

export default WhatsAppPanel;
