import AstrologySpotlight from './AstrologySpotlight';

export default function Hero() {
  return <section className="hero section-wrap" id="home">
    <div className="page-welcome">
      <div><p className="eyebrow">Kundalini Kriya Chaitanyam</p><h1>Guidance. Devotion. Community.</h1></div>
      <p>Explore our programmes, speak with the KKC astrologer, or share your experience.</p>
    </div>
    <AstrologySpotlight />
  </section>;
}
