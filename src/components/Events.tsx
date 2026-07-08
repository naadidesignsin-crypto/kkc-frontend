import { events } from "../data/events";

export default function Events() {
  return (
    <section className="events-section" id="events">
      <div className="section-heading">
        <p className="eyebrow">Sacred Gatherings</p>
        <h2>Devotional Events</h2>
        <p>
          Explore our spiritual events, astrology sessions, kriya programs, and
          guided devotional experiences.
        </p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <img src={event.image} alt={event.title} />
            <div className="event-content">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}