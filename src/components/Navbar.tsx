import logo from "../assets/Logo.png";
import { getPlanetIcon } from "../data/planets";

const sunIcon = getPlanetIcon("surya");
const moonIcon = getPlanetIcon("chandra");

const navItems = [
  {
    label: "Home",
    href: "#home",
    icon: sunIcon,
    iconText: "S",
    alt: "Sun icon",
  },
  {
    label: "Donation",
    href: "#donation",
    icon: moonIcon,
    iconText: "M",
    alt: "Moon icon",
  },
  {
    label: "Upcoming Events",
    href: "#events",
    icon: sunIcon,
    iconText: "S",
    alt: "Sun icon",
  },
  {
    label: "Contact",
    href: "#contact",
    icon: moonIcon,
    iconText: "M",
    alt: "Moon icon",
  },
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
          <a className="nav-link" key={item.href} href={item.href}>
            <span className="nav-icon-frame" aria-hidden="true">
              {item.icon ? (
                <img src={item.icon} alt="" className="nav-icon" />
              ) : (
                <span className="nav-icon-fallback">{item.iconText}</span>
              )}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
