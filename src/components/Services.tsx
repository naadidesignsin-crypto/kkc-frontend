import { openAstrologyChat } from '../lib/astrologyChat';
import AstrologyBooking from './AstrologyBooking';
import { services } from '../data/content';

function Services() {
  return (
    <section id="services" className="content-section section-wrap">
      <div className="section-heading">
        <p className="eyebrow">Astrology Services</p>
        <h2>Personal astrology guidance. Choose a call that suits you.</h2>
        <p>10 minutes for ₹999 or 20 minutes for ₹1,500. Share your birth details and questions with KKC.</p>
        <button className="primary-btn" type="button" onClick={openAstrologyChat}>Start consultation in chat ↗</button>
      </div>

      <div className="card-grid">
        {services.map((service) => (
          <article className="info-card highlighted-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
      <AstrologyBooking />
    </section>
  );
}

export default Services;
