import { planets } from "../data/planets";

export default function PlanetOrbit() {
  return (
    <section className="planet-section" id="planets">
      <div className="section-wrap">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Navagraha Focus</p>
          <h2>Planetary energies represented with your custom icons.</h2>
          <p>
            The nine planetary icons now use the image assets added inside the
            project. Later these can be connected to dynamic astrology content.
          </p>
        </div>

        <div className="planet-grid" aria-label="Navagraha planet icons">
          {planets.map((planet, index) => (
            <article
              className="planet-card"
              key={planet.id}
              style={{ "--delay": `${index * 0.12}s` } as React.CSSProperties}
            >
              <div className="planet-icon" aria-hidden="true">
                {planet.icon ? (
                  <img
                    src={planet.icon}
                    alt=""
                    className="planet-icon-image"
                    loading="lazy"
                  />
                ) : (
                  <span className="planet-icon-fallback">
                    {planet.name.charAt(0)}
                  </span>
                )}
              </div>

              <span className="planet-name">{planet.name}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
