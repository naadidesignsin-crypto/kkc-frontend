import EventSeoLinks from './components/EventSeoLinks';
import AndroidApp from './components/AndroidApp';
import { isAndroidApp } from './lib/mobile';
import GalaxyBackground from './components/GalaxyBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanetOrbit from './components/PlanetOrbit';
import Events from './components/Events';
import Services from './components/Services';
import Contact from './components/Contact';
import WhatsAppPanel from './components/WhatsAppPanel';
import ChatBot from "./components/ChatBot";
import VideoGallery from "./components/VideoGallery";

import EventRegistration from './components/EventRegistration';
function App() {
  if (isAndroidApp) return <AndroidApp />;
  return (
    <main className="app-shell">
      <GalaxyBackground />
      <Navbar />
      <Hero />
      <EventSeoLinks />
      <PlanetOrbit />
      <EventRegistration />
      <Events />
      <Services />
      <Contact />
      <WhatsAppPanel />
      <ChatBot />
      <VideoGallery />
    </main>
  );
}

export default App;
