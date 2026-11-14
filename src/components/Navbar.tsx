import logo from '../assets/kkc-logo.png';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'Astrology', href: '#astrology-booking' },
  { label: 'Reviews', href: '#customer-experiences' },
  { label: 'Donation', href: '#donation' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Navbar() {
  return <header className="navbar">
    <a className="brand" href="#home" aria-label="KKC home">
      <img src={logo} alt="Kundalini Kriya Chaitanyam logo" className="brand-logo" />
      <span className="brand-text">Kundalini Kriya Chaitanyam</span>
    </a>
    <nav className="nav-links" aria-label="Primary navigation">
      {navItems.map(item => <a className="nav-link" key={item.href} href={item.href}>{item.label}</a>)}
    </nav>
  </header>;
}
