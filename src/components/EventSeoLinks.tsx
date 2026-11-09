import facts from '../data/seoEvents.json';
import '../seo.css';

export default function EventSeoLinks() {
  return <section className="seo-discovery section-wrap" aria-labelledby="programme-pages-title">
    <p className="eyebrow">Karthika Masam 2026 · Hyderabad</p>
    <h2 id="programme-pages-title">Programme dates, locations &amp; registration</h2>
    <p lang="te">కార్యక్రమ తేదీలు, వేదికలు మరియు నమోదు వివరాలు</p>
    <div className="seo-card-grid">{facts.programmes.map(programme => <article className="seo-panel" key={programme.id}>
      <h3><a href={programme.path}>{programme.name}</a></h3><p lang="te">{programme.teluguName}</p>
      <p>{programme.timing}</p><p>{facts.venues[programme.venue as keyof typeof facts.venues].name}</p>
      <a href={programme.path}>Dates, directions &amp; registration →</a>
    </article>)}</div>
    <p><a href={facts.overview.path}>View the complete Karthika Masam 2026 programme →</a></p>
  </section>;
}
