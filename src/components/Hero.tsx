import { ongoingEvent } from "../data/events";

function Hero() {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-feature-grid reveal-card">
        <div className="hero-text-content">
          <p className="eyebrow">{ongoingEvent.registrationUrl ? 'Karthika Masam · Sacred gatherings' : 'Aligning stars, science, and soul'}</p>

          <h1>{ongoingEvent.title}</h1>

          <p className="hero-copy">
            {ongoingEvent.description}
          </p>

          <div className="hero-actions">
            <a className="primary-btn donation-btn" href={ongoingEvent.registrationUrl || ongoingEvent.donationUrl}>
              {ongoingEvent.registrationUrl ? 'View posters & register' : 'Donate Now'}
            </a>
            <a className="secondary-btn" href="#events">
              View Event Details
            </a>
          </div>
        </div>

        <div className="hero-media-panel" aria-label="Current KKC ongoing event">
          <div className="ongoing-badge">{ongoingEvent.registrationUrl ? ongoingEvent.subtitle : 'Ongoing Event'}</div>

          <div className="hero-event-image-wrap">
            <img
              src={ongoingEvent.image}
              alt={ongoingEvent.title}
              className={ongoingEvent.registrationUrl ? "hero-event-image hero-karthika-image" : "hero-event-image"}
            />

            <div className="hero-media-overlay">
              <span>{ongoingEvent.subtitle}</span>
              <strong>{ongoingEvent.registrationUrl ? '16 Nov – 8 Dec 2026' : 'Donation support open'}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
