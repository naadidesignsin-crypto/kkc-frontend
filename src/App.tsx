import AndroidApp from './components/AndroidApp';
import { isAndroidApp } from './lib/mobile';
import GalaxyBackground from './components/GalaxyBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Contact from './components/Contact';
import WhatsAppPanel from './components/WhatsAppPanel';
import ChatBot from "./components/ChatBot";

import EventRegistration from './components/EventRegistration';
import PageSections from './components/PageSections';
import './PageLayout.css';
function App() {
  if (isAndroidApp) return <AndroidApp />;
  return (
    <>
    <main className="app-shell professional-layout">
      <GalaxyBackground />
      <Navbar />
      <Hero />
      <EventRegistration presentation="notice" />
      <PageSections />
      <WhatsAppPanel />
      <ChatBot />
    </main>
    <Contact />
    </>
  );
}

export default App;
