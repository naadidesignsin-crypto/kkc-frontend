import logo from '../assets/Logo.png';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'Astrology', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="KKC home">
        <img
          src={logo}
          alt="Kundalini Kriya Chaitanyam logo"
          className="brand-logo"
        />
        <span className="brand-text">Kundalini Kriya Chaitanyam</span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
