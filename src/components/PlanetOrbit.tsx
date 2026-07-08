import type { CSSProperties } from 'react';
import { planets } from '../data/content';

function PlanetOrbit() {
  return (
    <section className="planet-section section-wrap" aria-label="Nine planetary energies">
      <div className="section-heading compact-heading">
        <p className="eyebrow">Navagraha Focus</p>
        <h2>Planetary energies represented with a clean gold system.</h2>
      </div>

      <div className="planet-grid">
        {planets.map((planet, index) => (
          <div className="planet-card" key={planet} style={{ '--delay': `${index * 0.12}s` } as CSSProperties}>
            <span className="planet-icon" aria-hidden="true" />
            <span>{planet}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlanetOrbit;
