import { useEffect, useRef, useState } from 'react';
import { readDailyEventVideos } from '../lib/eventsVideos';
import type { DailyEventVideo } from '../lib/eventsVideos';
import logo from '../assets/kkc-logo.png';
import './DailyEventVideos.css';
export default function DailyEventVideos() {
  const root = useRef<HTMLElement>(null);
  const [videos, setVideos] = useState<DailyEventVideo[]>([]);
  const [state, setState] = useState<'loading'|'ready'|'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState('');
  useEffect(() => {
    let active = true, started = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e=>e.isIntersecting) || started) return;
      started = true; observer.disconnect(); setState('loading'); setError('');
      readDailyEventVideos().then(rows=>{if(active){setVideos(rows);setState('ready');}}).catch(e=>{if(active){setError(e instanceof Error ? e.message : 'Daily videos could not be loaded. Please retry.');setState('error');}});
    });
    if(root.current)observer.observe(root.current);
    return()=>{active=false;observer.disconnect();};
  },[attempt]);
  return <section id="daily-events-videos" className="daily-events-videos" ref={root}>
    <header className="daily-events-heading"><img src={logo} alt="KKC — Kundalini Kriya Chaitanyam" /><div><p className="eyebrow">KKCEvents</p><h2>Daily Karthika Masam videos</h2><p lang="te">కార్తీక మాస కార్యక్రమాల రోజువారీ వీడియోలు</p></div></header>
    <div className="daily-events-actions"><a className="secondary-btn" href="https://www.youtube.com/@KKCEventsOfficial" target="_blank" rel="noopener noreferrer">Visit KKCEvents on YouTube ↗</a><button type="button" className="secondary-btn" disabled={state==='loading'} onClick={()=>setAttempt(n=>n+1)}>Refresh videos</button></div>
    {state==='loading'&&<p role="status">Loading daily videos…</p>}
    {state==='error'&&<p role="status">{error} Use Refresh videos to try again, or visit our YouTube channel.</p>}
    {state==='ready'&&!videos.length&&<p>No daily videos have been published here yet. Please check back soon.</p>}
    {state==='ready'&&<div className="daily-video-grid">{videos.map(video=><article key={video.id} className="daily-video-card">
      {playing===video.id?<iframe title={video.title} src={'https://www.youtube-nocookie.com/embed/'+video.id} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />:<button type="button" className="daily-video-preview" aria-label={'Watch '+video.title} onClick={()=>setPlaying(video.id)}><img src={'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg'} alt="" loading="lazy" /><span>▶ Watch video</span></button>}
      <div className="daily-video-copy"><time dateTime={video.date}>{new Date(video.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</time><h3>{video.title}</h3>{video.description&&<p>{video.description}</p>}<a href={'https://www.youtube.com/watch?v='+video.id} target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a></div>
    </article>)}</div>}
  </section>;
}
