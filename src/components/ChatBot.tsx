import { ASTROLOGY_CHAT_EVENT } from '../lib/astrologyChat';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { findFaqAnswer } from '../data/chatbotFaq';
import facts from '../data/seoEvents.json';
import AstrologyChatIntake from './AstrologyChatIntake';

type Message = { role: 'BOT' | 'USER'; text: string };
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'astrology' | 'events'>('chat');
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ role: 'BOT', text: 'Namaste! Book an astrology call, explore the Karthika Masam programme, or ask about Seva. Choose an option above to begin.' }]);
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const open = (event: Event) => { setQuery((event as CustomEvent<{ query?: string }>).detail?.query || ''); setView('astrology'); setIsOpen(true); };
    window.addEventListener(ASTROLOGY_CHAT_EVENT, open);
    return () => window.removeEventListener(ASTROLOGY_CHAT_EVENT, open);
  }, []);
  function sendMessage(message: string) {
    const clean = message.trim(); if (!clean) return;
    const faq = findFaqAnswer(clean);
    setMessages(m => [...m, { role: 'USER', text: clean }, { role: 'BOT', text: faq.answer }]);
    setInput('');
    if (faq.category === 'Astrology') { setQuery(clean); setView('astrology'); }
    else if (faq.category === 'Events') setView('events');
    else setView('chat');
    requestAnimationFrame(() => { if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; });
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); sendMessage(input); }
  const lastQuery = [...messages].reverse().find(m => m.role === 'USER')?.text || 'Please help me with KKC events and services.';
  return <>
    {!isOpen && <button className="chatbot-launcher" onClick={() => setIsOpen(true)} type="button" aria-label="Open KKC Seva Assistant"><svg className="chatbot-launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" /><path d="M7 11h10M7 15h6" strokeLinecap="round" /></svg><span>Chat</span></button>}
    {isOpen && <aside className="chatbot-panel chatbot-panel--guided" aria-label="KKC Seva Assistant">
      <header className="chatbot-header"><div><p className="eyebrow">KKC ASSISTANT</p><h3>How can we help you?</h3></div><button className="chatbot-close" type="button" aria-label="Close chatbot" onClick={() => setIsOpen(false)}>×</button></header>
      <div className="chat-choice-grid">
        <button className="chat-choice chat-choice--featured" type="button" aria-pressed={view === 'astrology'} onClick={() => { setQuery(''); setView('astrology'); }}><span className="chat-choice-icon" aria-hidden="true">✦</span><span><strong>Astrology consultation</strong><small>10 min · ₹999 / 20 min · ₹1,500</small></span><span aria-hidden="true">↗</span></button>
        <button className="chat-choice" type="button" aria-pressed={view === 'events'} onClick={() => setView('events')}><span aria-hidden="true">▦</span><span><strong>Events &amp; venues</strong><small>Karthika Masam 2026</small></span></button>
        <button className="chat-choice" type="button" onClick={() => sendMessage('How can I donate?')}><span aria-hidden="true">♡</span><span><strong>Seva &amp; payment</strong><small>How to contribute</small></span></button>
      </div>
      <div className="chatbot-messages" ref={scroll} aria-label="Conversation">
        {view === 'astrology' ? <AstrologyChatIntake initialQuery={query} onPayment={() => setIsOpen(false)} /> : view === 'events' ? <div className="chat-event-list"><p className="chat-event-intro">Karthika Masam · 16 Nov–8 Dec 2026</p>{facts.programmes.map(p => <article className="chat-event-card" key={p.id}><h4>{p.name}</h4><p>{p.dates.map(d => new Date(d.date + 'T12:00:00+05:30').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })).join(' · ')}</p><strong>{p.timing}</strong><p>{facts.venues[p.venue as keyof typeof facts.venues].address}</p><div><a href={p.path}>Event details ↗</a><a href={facts.venues[p.venue as keyof typeof facts.venues].mapUrl} target="_blank" rel="noopener noreferrer">Directions ↗</a></div></article>)}<a className="chat-next chat-event-register" href="/telugu?register=karthika-2026&source=chat">Register for Karthika Masam →</a></div> : messages.map((m, i) => <div className={m.role === 'BOT' ? 'chat-message bot-message' : 'chat-message user-message'} key={i}>{m.text}</div>)}
      </div>
      {view !== 'astrology' && <><form className="chatbot-form" onSubmit={submit}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about events, Seva or astrology…" aria-label="Ask KKC Seva Assistant" maxLength={1500} /><button type="submit">Send →</button></form><a className="chat-support-link" href={'https://wa.me/917981041123?text=' + encodeURIComponent('Namaste KKC, ' + lastQuery)} target="_blank" rel="noopener noreferrer">Continue with KKC on WhatsApp ↗</a></>}
    </aside>}
  </>;
}
export default ChatBot;
