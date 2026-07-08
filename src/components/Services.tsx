import { services } from '../data/content';

function Services() {
  return (
    <section id="services" className="content-section section-wrap">
      <div className="section-heading">
        <p className="eyebrow">Astrology Services</p>
        <h2>Practical guidance supported by timing, discipline, and clear communication.</h2>
      </div>

      <div className="card-grid">
        {services.map((service) => (
          <article className="info-card highlighted-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;
