import { useEffect, useState } from 'react';
import Events from './Events';
import DailyEventVideos from './DailyEventVideos';
import Services from './Services';
import PublishedReviews from './PublishedReviews';
import CustomerReviews from './CustomerReviews';
import EventSeoLinks from './EventSeoLinks';
import PlanetOrbit from './PlanetOrbit';
import VideoGallery from './VideoGallery';
import ExpandablePanel from './ExpandablePanel';

type Section = 'events' | 'astrology' | 'reviews';
function sectionFromHash(): Section {
  const hash = location.hash;
  if (['#customer-experiences', '#customer-review'].includes(hash)) return 'reviews';
  if (['#astrology-booking', '#astrology-topics', '#services', '#astrology-services', '#planets'].includes(hash)) return 'astrology';
  return 'events';
}
export default function PageSections() {
  const [active, setActive] = useState<Section>(sectionFromHash);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const sync = () => {
      const hash = location.hash;
      if (hash === '#contact') return;
      setActive(sectionFromHash());
      clearTimeout(timer);
      timer = setTimeout(() => {
        const target = document.getElementById(hash.slice(1));
        target?.scrollIntoView({ block: 'start', behavior: 'auto' });
      }, 0);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => { clearTimeout(timer); window.removeEventListener('hashchange', sync); };
  }, []);
  const links: { id: Section; title: string; hash: string }[] = [
    { id: 'events', title: 'Events & programmes', hash: '#events' },
    { id: 'astrology', title: 'Astrology consultation', hash: '#astrology-services' },
    { id: 'reviews', title: 'Customer reviews', hash: '#customer-experiences' }
  ];
  return <div className="page-workspace section-wrap">
    <nav className="page-section-nav" aria-label="Explore KKC">
      {links.map(link => <a key={link.id} href={link.hash} aria-current={active === link.id ? 'page' : undefined}>{link.title}</a>)}
    </nav>
    <div className="page-panel" hidden={active !== 'events'}>
      <Events />
      <ExpandablePanel title="Daily Karthika Masam videos · KKCEvents" targets={['daily-events-videos']}><DailyEventVideos /></ExpandablePanel>
      <ExpandablePanel title="Programme dates, venues & directions"><EventSeoLinks /></ExpandablePanel>
      <ExpandablePanel title="Watch KKC event highlights" targets={['event-highlights']}><VideoGallery /></ExpandablePanel>
    </div>
    <div className="page-panel" hidden={active !== 'astrology'}>
      <div id="astrology-services"><Services /></div>
      <ExpandablePanel title="Explore Navagraha" targets={['planets']}><PlanetOrbit /></ExpandablePanel>
    </div>
    <div className="page-panel" hidden={active !== 'reviews'}>
      <PublishedReviews />
      <ExpandablePanel title="Share feedback after your consultation" targets={['customer-review']}><CustomerReviews /></ExpandablePanel>
    </div>
  </div>;
}
