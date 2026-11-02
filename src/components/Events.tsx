import { useEffect, useState } from "react";
import { upcomingEvents } from "../data/events";
import { karthikaPosters } from "../data/karthikaEvent";

const SLIDE_DURATION = 5000;

export default function Events() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEvent = upcomingEvents[activeIndex];
  const programme = karthikaPosters.find(poster => poster.id === activeEvent.posterId);

  useEffect(() => {
    if (activeEvent.posterId) return;
    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === upcomingEvents.length - 1 ? 0 : currentIndex + 1
      );
    }, SLIDE_DURATION);

    return () => window.clearInterval(timerId);
  }, [activeEvent.posterId]);

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
          <h2>Upcoming &amp; Ongoing Events</h2>
          <p>
            Come together for devotional gatherings, prayers, and community seva.

          </p>
        </div>

        <article className="ongoing-event-card upcoming-slider-card reveal-card">
          <div className="ongoing-event-media event-slide-image-wrap">
            <img
              key={activeEvent.id}
              width={activeEvent.posterId === "main" ? 1440 : 1024}
              height={activeEvent.posterId === "main" ? 814 : 1536}
              decoding="async"
              src={activeEvent.image}
              alt={activeEvent.title}
              className={activeEvent.registrationUrl ? "event-slide-image event-slide-image--poster" : "event-slide-image"}
            />

            <div className="event-slide-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {String(upcomingEvents.length).padStart(2, "0")}
            </div>
          </div>

          <div className="ongoing-event-content event-slide-content">
            <p className="eyebrow">{activeEvent.subtitle}</p>
            <h3>{activeEvent.title}</h3>
            {programme && programme.dates.length > 0 ? <>
              <p className="event-programme-timing">{programme.timing}</p>
              <ul className="event-programme-dates">{programme.dates.map(date => {
                const [day, weekday, ...occasion] = date.split(' · ');
                return <li key={date} className={date.includes('Amavasya') ? 'event-programme-special' : undefined}>
                  <strong>{day}<small>{weekday}</small></strong>
                  {occasion.length > 0 && <span>{occasion.join(' · ')}</span>}
                </li>;
              })}</ul>
            </> : <p>{activeEvent.description}</p>}

            <div className="ongoing-event-actions">
              {activeEvent.posterId && <button className="secondary-btn" type="button" onClick={() => window.dispatchEvent(new CustomEvent('kkc:open-poster', { detail: { id: activeEvent.posterId } }))}>View full poster ↗</button>}
              <a className="primary-btn donation-btn" href={activeEvent.registrationUrl || activeEvent.donationUrl}>
                {activeEvent.registrationUrl ? 'Register your interest' : 'Donate Now'}
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
