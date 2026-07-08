import { events } from '../data/events';

export default function Events() {
  return (
    <section className="events-section" id="events">
      <div className="section-wrap">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Sacred Gatherings</p>
          <h2>Devotional Events</h2>
          <p>
            Explore spiritual events, astrology sessions, kriya programs, and
            guided devotional experiences.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div className="event-image-wrap">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                  loading="lazy"
                />
              </div>

              <div className="event-content">
                <p className="eyebrow card-eyebrow">KKC Event</p>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
