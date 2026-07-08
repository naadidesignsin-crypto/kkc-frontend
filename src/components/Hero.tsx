import { ongoingEvent } from "../data/events";

function Hero() {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-feature-grid reveal-card">
        <div className="hero-text-content">
          <p className="eyebrow">Aligning stars, science, and soul</p>

          <h1>{ongoingEvent.title}</h1>

          <p className="hero-copy">
            {ongoingEvent.description}
          </p>

          <div className="hero-actions">
            <a className="primary-btn donation-btn" href={ongoingEvent.donationUrl}>
              Donate Now
            </a>
            <a className="secondary-btn" href="#events">
              View Event Details
            </a>
          </div>
        </div>

        <div className="hero-media-panel" aria-label="Current KKC ongoing event">
          <div className="ongoing-badge">Ongoing Event</div>

          <div className="hero-event-image-wrap">
            <img
              src={ongoingEvent.image}
              alt={ongoingEvent.title}
              className="hero-event-image"
            />

            <div className="hero-media-overlay">
              <span>{ongoingEvent.subtitle}</span>
              <strong>Donation support open</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
