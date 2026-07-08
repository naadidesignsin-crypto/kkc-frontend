import GalaxyBackground from './components/GalaxyBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanetOrbit from './components/PlanetOrbit';
import Events from './components/Events';
import Services from './components/Services';
import Contact from './components/Contact';
import WhatsAppPanel from './components/WhatsAppPanel';

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
    </main>
  );
}

export default App;
