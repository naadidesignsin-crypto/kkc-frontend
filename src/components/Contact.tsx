import './Contact.css';

export default function Contact() {
  return <footer id="contact" className="site-footer">
    <div className="section-wrap site-footer-content">
      <h2>Contact Us</h2>
      <nav className="contact-direct-links" aria-label="Contact KKC">
        <a href="tel:+917981041123" aria-label="Call KKC at +91 79810 41123">+91 79810 41123</a>
        <a href="https://wa.me/917981041123" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="https://www.instagram.com/kundalinikriyachaitanyam/" target="_blank" rel="noopener noreferrer" aria-label="KKC Instagram: kundalinikriyachaitanyam">@kundalinikriyachaitanyam</a>
      </nav>
    </div>
  </footer>;
}
