import AstrologyTopics from './AstrologyTopics';
import { openAstrologyChat } from '../lib/astrologyChat';

export default function AstrologySpotlight() {
  return <aside className="astrology-spotlight" aria-labelledby="astrology-spotlight-title">
    <div className="astrology-spotlight-copy"><span className="astrology-spotlight-symbol" aria-hidden="true">✦</span><div><p>PERSONAL ASTROLOGY CONSULTATION</p><h2 id="astrology-spotlight-title">Speak with the KKC astrologer</h2><span>2 PM–9 PM IST · Share your birth details and query. KKC confirms your call on WhatsApp.</span></div></div>
    <div className="astrology-spotlight-actions"><div className="astrology-spotlight-prices"><span><strong>₹999</strong> / 10 min</span><span><strong>₹1,500</strong> / 20 min</span></div><button className="primary-btn" type="button" onClick={() => openAstrologyChat()}>Start consultation ↗</button></div>
    <AstrologyTopics compact />
  </aside>;
}
