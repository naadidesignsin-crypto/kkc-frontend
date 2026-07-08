import logo from "../assets/Logo.png";

const planetIconModules = {
  ...import.meta.glob<string>("../assets/*.{png,jpg,jpeg,webp,svg}", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob<string>("../assets/planets/*.{png,jpg,jpeg,webp,svg}", {
    eager: true,
    import: "default",
  }),
};

function findIcon(keywords: string[]) {
  const icon = Object.entries(planetIconModules).find(([path]) => {
    const lowerPath = path.toLowerCase();
    return keywords.some((keyword) => lowerPath.includes(keyword));
  });

  return icon?.[1] || logo;
}

const sunIcon = findIcon(["sun", "surya", "ravi"]);
const moonIcon = findIcon(["moon", "chandra", "soma"]);

const navItems = [
  {
    label: "Home",
    href: "#home",
    icon: sunIcon,
    alt: "Sun icon",
  },
  {
    label: "Donation",
    href: "#donation",
    icon: moonIcon,
    alt: "Moon icon",
  },
  {
    label: "Upcoming Events",
    href: "#events",
    icon: sunIcon,
    alt: "Sun icon",
  },
  {
    label: "Contact",
    href: "#contact",
    icon: moonIcon,
    alt: "Moon icon",
  },
];

function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="KKC Home">
        <img src={logo} alt="KKC Logo" className="brand-logo" />
        <span className="brand-text">Kundalini Kriya Chaitanyam</span>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <a className="nav-link" href={item.href} key={item.label}>
            <span className="nav-icon-frame">
              <img src={item.icon} alt={item.alt} className="nav-icon" />
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;