const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'Astrology', href: '#services' },
  { label: 'Contact', href: '#contact' }
];

function Navbar() {
  return (
    <header className="navbar">
      <a href="#home" className="brand" aria-label="KKC home">
        <span className="brand-mark">KKC</span>
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

export default Navbar;
