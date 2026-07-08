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

function App() {
  return (
    <main className="app-shell">
      <GalaxyBackground />
      <Navbar />
      <Hero />
      <PlanetOrbit />
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
