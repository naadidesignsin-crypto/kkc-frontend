import { useEffect, useState } from "react";
import { upcomingEvents } from "../data/events";

const SLIDE_DURATION = 5000;

export default function Events() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEvent = upcomingEvents[activeIndex];

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === upcomingEvents.length - 1 ? 0 : currentIndex + 1
      );
    }, SLIDE_DURATION);

    return () => window.clearInterval(timerId);
  }, []);

  const goToPreviousSlide = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? upcomingEvents.length - 1 : currentIndex - 1
    );
  };

  const goToNextSlide = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === upcomingEvents.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <section className="events-section" id="events">
      <div className="section-wrap">
        <div className="section-heading">
          <p className="eyebrow">Sacred Gatherings</p>
          <h2>Upcoming Events</h2>
          <p>
            Upcoming KKC event details are shown as a slideshow. Later this same
            section can load event slides and video panels dynamically from the backend.
          </p>
        </div>

        <article className="ongoing-event-card upcoming-slider-card reveal-card">
          <div className="ongoing-event-media event-slide-image-wrap">
            <img
              src={activeEvent.image}
              alt={activeEvent.title}
              className="event-slide-image"
            />

            <div className="event-slide-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {String(upcomingEvents.length).padStart(2, "0")}
            </div>
          </div>

          <div className="ongoing-event-content event-slide-content">
            <p className="eyebrow">{activeEvent.subtitle}</p>
            <h3>{activeEvent.title}</h3>
            <p>{activeEvent.description}</p>

            <div className="ongoing-event-actions">
              <a className="primary-btn donation-btn" href={activeEvent.donationUrl}>
                Donate Now
              </a>
              <a className="secondary-btn" href={activeEvent.contactUrl}>
                Contact KKC
              </a>
            </div>

            <div className="event-slider-controls" aria-label="Upcoming event slider controls">
              <button
                type="button"
                className="event-slider-btn"
                onClick={goToPreviousSlide}
                aria-label="Show previous upcoming event"
              >
                Prev
              </button>

              <div className="event-slider-dots" aria-label="Upcoming event slides">
                {upcomingEvents.map((event, index) => (
                  <button
                    type="button"
                    key={event.id}
                    className={index === activeIndex ? "event-dot active" : "event-dot"}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${event.title}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="event-slider-btn"
                onClick={goToNextSlide}
                aria-label="Show next upcoming event"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
