
import { useState } from 'react';
import abhishekamPhoto from '../assets/events/parthiva-sivalingam-abhishekam-2026.png';
import { karthikaPosters, karthikaMainContent } from '../data/karthikaEvent';

function MainInvitation() {
  return <article className="karthika-main-invitation" lang="te" aria-label="కార్తీక మాస మహోత్సవాలు">
    <header className="karthika-main-heading">
      <img className="karthika-abhishekam-image" src={abhishekamPhoto} alt="Parthiva Sivalingam Abhishekam with the KKC logo" width="260" height="174" />
      <div><span className="karthika-main-brand" lang="en">KUNDALINI KRIYA CHAITANYAM</span>
        <h3>కార్తీక మాస మహోత్సవాలు</h3>
        <span className="karthika-main-year" lang="en">KARTHIKA MASAM 2026</span></div>
      <span className="karthika-main-om" aria-hidden="true">ఓం</span>
    </header>
    <div className="karthika-main-copy">
      {karthikaMainContent.map((paragraph, i) => <section className={'karthika-main-paragraph karthika-main-paragraph--' + i} key={i}>
        <span className="karthika-main-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
        <p data-paragraph={i}>{paragraph}</p>
      </section>)}
    </div>
    <p className="karthika-main-site" lang="en">kkcorg.com</p>
  </article>;
}

function Schedule({ poster }: { poster: typeof karthikaPosters[number] }) {
  return <div className="karthika-schedule-summary">
    <p className="eyebrow">Karthika Masam 2026</p>
    <h3>{poster.title}<span lang="te">{poster.teluguTitle}</span></h3>
    <p className="karthika-poster-timing">{poster.timing}</p>
    <ul className="karthika-schedule-cards">
      {poster.dates.map(date => {
        const [day, weekday, ...occasion] = date.split(' · ');
        const amavasya = date.includes('Amavasya');
        return <li key={date} className={amavasya ? 'karthika-date-card karthika-date-card--special' : 'karthika-date-card'}>
          <strong>{day}<span>{weekday}</span></strong>
          {!!occasion.length && <p>{occasion.join(' · ')}</p>}
          <span className="karthika-date-time">{poster.id === 'lingarchana' ? '4:00 PM – 8:00 PM' : amavasya ? '9:30 AM – 12:00 PM' : '9:30 AM – 11:30 AM'} IST</span>
        </li>;
      })}
    </ul>
  </div>;
}

export default function KarthikaPosters({ compact = false, initialIndex = 0, onExpand }: {
  compact?: boolean; initialIndex?: number; onExpand?: (index: number) => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const poster = karthikaPosters[index] || karthikaPosters[0];
  const isMain = poster.id === 'main';
  return <div className={(compact ? 'karthika-posters karthika-posters--compact' : 'karthika-posters') + (isMain ? ' karthika-posters--main' : '')}>
    <div className="karthika-poster-toolbar">
      <div className="karthika-poster-tabs" role="group" aria-label="Karthika Masam posters">
        {karthikaPosters.map((item, i) => <button key={item.id} type="button"
          aria-pressed={i === index} onClick={() => setIndex(i)}>{item.title} <span lang="te">{item.teluguTitle}</span></button>)}
      </div>
      {!compact && onExpand && <button className="karthika-expand" type="button" onClick={() => onExpand(index)}>View full screen ↗</button>}
    </div>
    <div className="karthika-viewer-scroll" key={poster.id} tabIndex={compact ? 0 : undefined} role="region" aria-label={poster.title + ' details'}>
      {isMain ? <MainInvitation /> : <div className="karthika-schedule-layout">
        <img className="karthika-large-poster" src={poster.image} alt={poster.alt} width="1440" height="2560" />
        <Schedule poster={poster} />
      </div>}
    </div>
    <a className="karthika-main-download" href={poster.image} download={'kkc-' + poster.id + '-2026.' + (isMain ? 'png' : 'jpg')}>Download poster / పోస్టర్ డౌన్‌లోడ్ ↓</a>
  </div>;
}
