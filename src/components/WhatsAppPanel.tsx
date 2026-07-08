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
      <span className="whatsapp-dot" />
      <span>WhatsApp</span>
    </a>
  );
}

export default WhatsAppPanel;
