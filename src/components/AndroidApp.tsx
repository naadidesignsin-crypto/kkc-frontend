import { useEffect, useState } from 'react';
import { App as NativeApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import logo from '../assets/kkc-logo.png';
import photo from '../assets/events/parthiva-lingam-2026.png';
import { karthikaPosters, getKarthikaStatus, karthikaEvent } from '../data/karthikaEvent';
import { appRegistrationUrl, isLocalRegistration, openExternalLink, shareKkc, sharePoster } from '../lib/mobile';
import EventRegistration from './EventRegistration';
import VideoGallery from './VideoGallery';
import './AndroidApp.css';

type Tab = 'Home' | 'Events' | 'Register' | 'Videos' | 'Contact';
export default function AndroidApp() {
 const [tab,setTab]=useState<Tab>('Home');
 const [ready,setReady]=useState(false);
 const [online,setOnline]=useState(navigator.onLine);
 const [message,setMessage]=useState('');
 const [saved,setSaved]=useState(()=>{try{return localStorage.getItem('kkc.saved-programme')==='yes'}catch{return false}});
 useEffect(()=>{const timer=setTimeout(()=>setReady(true),900);return()=>clearTimeout(timer)},[]);
 useEffect(()=>{
  const on=()=>setOnline(navigator.onLine);
  window.addEventListener('online',on);window.addEventListener('offline',on);
  let cleanup:(()=>void)|undefined;let disposed=false;
  if(Capacitor.isNativePlatform()){
   Network.getStatus().then(s=>{if(!disposed)setOnline(s.connected)});
   Network.addListener('networkStatusChange',s=>setOnline(s.connected)).then(h=>{if(disposed)h.remove();else cleanup=()=>{void h.remove()}});
  }
  return()=>{disposed=true;cleanup?.();window.removeEventListener('online',on);window.removeEventListener('offline',on)};
 },[]);
 useEffect(()=>{
  const back=()=>{
   const close=document.querySelector<HTMLButtonElement>('.registration-close, .video-modal-close');
   if(close){close.click();return}
   if(tab!=='Home'){setTab('Home');return}
   if(Capacitor.isNativePlatform())void NativeApp.minimizeApp();
  };
  window.addEventListener('kkc:back',back);
  let cleanup:(()=>void)|undefined;let disposed=false;
  if(Capacitor.isNativePlatform())NativeApp.addListener('backButton',back).then(h=>{if(disposed)h.remove();else cleanup=()=>{void h.remove()}});
  return()=>{disposed=true;cleanup?.();window.removeEventListener('kkc:back',back)};
 },[tab]);
 useEffect(()=>{
  if(!Capacitor.isNativePlatform())return;
  const click=(event:MouseEvent)=>{
   const a=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
   if(!a)return;
   if(a.download){event.preventDefault();void sharePoster(a.href,a.download).catch(e=>setMessage(e.message));return}
   if(/^(https?:|tel:|mailto:|upi:)/.test(a.href)){event.preventDefault();void openExternalLink(a.href).catch(e=>setMessage(e.message))}
  };
  document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
 },[]);
 const register=async()=>{
  const url=appRegistrationUrl();
  if(!online){setMessage('Please connect to the internet to register.');return}
  if(!url){setMessage('Registration is unavailable. Please contact KKC.');return}
  try{await openExternalLink(url)}catch{setMessage('Could not open registration. Please try again.')}
 };
 const navigate=(next:Tab)=>{setTab(next);setMessage('');window.scrollTo(0,0)};
 const poster=(id:string)=>window.dispatchEvent(new CustomEvent('kkc:open-poster',{detail:{id}}));
 return <div className="kkc-mobile-app">
  {!ready&&<div className="kkc-launch" role="status"><img src={logo} alt="KKC"/><p>Welcome to KKC</p></div>}
  <header className="kkc-app-header"><img src={logo} alt="KKC logo"/><div><strong>KKC</strong><small>Devotion. Community. Together.</small></div></header>
  {!online&&<p className="kkc-offline" role="status">You’re offline. View the programme here; connect to register.</p>}
  {isLocalRegistration&&<p className="kkc-test-label">Test app · local registrations</p>}
  <main className="kkc-app-content">
   {tab==='Home'&&<>
    <p className="eyebrow">Namaste · Welcome to KKC</p><h1>A sacred month.<br/>A shared devotion.</h1>
    <article className="kkc-app-feature"><img src={photo} alt="Parthiva Sivalingam Abhishekam"/><div><span className="kkc-app-badge">{getKarthikaStatus()}</span><h2>Karthika Masam 2026</h2><p>16 November – 8 December</p><p>Maha Lingarchana on four Mondays and five special Homams.</p><button className="primary-btn" onClick={()=>poster('main')}>View invitation</button><button className="secondary-btn" onClick={()=>navigate('Register')}>Register for the event</button></div></article>
    <div className="kkc-quick"><button onClick={()=>navigate('Events')}>Programme & timings →</button><button onClick={()=>{void shareKkc().then(setMessage).catch(()=>setMessage('Sharing closed.'))}}>Share KKC →</button></div>
   </>}
   {tab==='Events'&&<><p className="eyebrow">Karthika Masam 2026</p><h1>Programme</h1><button className="secondary-btn" aria-pressed={saved} onClick={()=>{const next=!saved;setSaved(next);try{localStorage.setItem('kkc.saved-programme',next?'yes':'no')}catch{setMessage('Saving is unavailable on this device.')}}}>{saved?'★ Programme saved':'☆ Save programme on this device'}</button>{karthikaPosters.map(p=><article className="kkc-programme" key={p.id}><h2>{p.title}</h2><p>{p.timing}</p><ul>{p.dates.map(d=><li key={d}>{d}</li>)}</ul><button className="secondary-btn" onClick={()=>poster(p.id)}>Open poster</button></article>)}</>}
   {tab==='Register'&&<><p className="eyebrow">Karthika Masam 2026</p><h1>Register your family</h1><p>{karthikaEvent.venue}</p><p>Keep your Gothram, Namam and phone number ready. Email, address and note are optional.</p><div className="kkc-programme"><h2>Choose your Dakshina</h2><ul className="kkc-dakshina"><li><strong>₹10,116</strong>Daily Abhishekam, four Mondays Maha Lingarchana and five Homams</li><li><strong>₹5,116</strong>Daily Abhishekam and four Mondays Maha Lingarchana</li><li><strong>₹2,116</strong>Maha Lingarchana on four Mondays</li><li><strong>₹516</strong>One day Rudrabhishekam</li></ul></div><button className="primary-btn" disabled={!online} onClick={()=>void register()}>Continue to registration →</button><p>Choose English or Telugu in the registration form. Select your Dakshina, scan the payment QR and acknowledge your payment there. The KKC team confirms payments.</p></>}
   {tab==='Videos'&&<><h1>KKC highlights</h1><VideoGallery/></>}
   {tab==='Contact'&&<><p className="eyebrow">We’re here to help</p><h1>Contact KKC</h1><article className="kkc-programme"><h2>Registration & event enquiries</h2><p>{karthikaEvent.venue}</p><p>Speak with the KKC organising team for programme, venue and payment assistance.</p><button className="primary-btn" onClick={()=>void openExternalLink('tel:+917981041123').catch(()=>setMessage('Could not open the phone app.'))}>Call KKC: 7981041123</button><button className="secondary-btn" onClick={()=>void openExternalLink('https://wa.me/917981041123').catch(()=>setMessage('Could not open WhatsApp.'))}>Open WhatsApp</button><a className="secondary-btn" href="https://www.instagram.com/kundalinikriyachaitanyam/" target="_blank" rel="noopener noreferrer">Instagram: @kundalinikriyachaitanyam</a></article></>}
   {message&&<p className="kkc-app-message" role="status">{message}</p>}
  </main>
  <nav className="kkc-bottom-nav" aria-label="App navigation">{(['Home','Events','Register','Videos','Contact'] as Tab[]).map((name,i)=><button key={name} aria-current={tab===name?'page':undefined} onClick={()=>navigate(name)}><span aria-hidden="true">{['⌂','▦','＋','▷','☏'][i]}</span>{name}</button>)}</nav>
  {ready&&<EventRegistration presentation="app" onRegister={()=>navigate('Register')}/>}
 </div>;
}
