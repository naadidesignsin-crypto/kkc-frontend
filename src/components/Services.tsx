import { openAstrologyChat } from '../lib/astrologyChat';
import AstrologyBooking from './AstrologyBooking';
import AstrologyTopics from './AstrologyTopics';
import ExpandablePanel from './ExpandablePanel';

export default function Services() {
  return <section id="services" className="content-section section-wrap">
    <div className="section-heading">
      <p className="eyebrow">Astrology Services</p>
      <h2>Personal guidance, a conversation away.</h2>
      <p>10 minutes for ₹999 · 20 minutes for ₹1,500 · 2 PM–9 PM IST</p>
      <button className="primary-btn" type="button" onClick={() => openAstrologyChat()}>Start consultation in chat ↗</button>
    </div>
    <AstrologyTopics compact />
    <ExpandablePanel title="Prefer a form? Enter your consultation details" targets={['astrology-booking']}>
      <AstrologyBooking />
    </ExpandablePanel>
  </section>;
}
