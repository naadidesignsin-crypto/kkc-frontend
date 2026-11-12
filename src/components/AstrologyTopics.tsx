import { astrologyTopics, astrologyTopicQuery } from '../data/astrologyTopics';
import { openAstrologyChat } from '../lib/astrologyChat';

export default function AstrologyTopics({ compact = false }: { compact?: boolean }) {
  const buttons = <div className={compact ? 'astrology-topic-chips' : 'astrology-topic-grid'}>
    {astrologyTopics.map((topic, i) => <button type="button" className="astrology-topic-card" key={topic.id} onClick={() => openAstrologyChat(astrologyTopicQuery(topic.id))}>
      {!compact && <span className="astrology-topic-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>}
      <span><strong lang="te">{topic.te}</strong><span>{topic.en}</span>{!compact && <small>{topic.description}</small>}</span>
      <span aria-hidden="true">↗</span>
    </button>)}
  </div>;
  if (compact) return <details className="astrology-topic-preview"><summary>Explore 9 consultation topics <span lang="te">జ్యోతిష్య సంప్రదింపులు</span></summary>{buttons}</details>;
  return <div className="astrology-topics" id="astrology-topics"><h3>What would you like to discuss?</h3><p>Choose a topic to start your consultation enquiry.</p>{buttons}<p className="astrology-health-note">Health and parenthood consultations offer spiritual guidance and do not replace medical advice or treatment.</p></div>;
}
