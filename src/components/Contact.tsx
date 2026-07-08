import { useState } from 'react';

const WHATSAPP_NUMBER = '919999999999';

type ContactForm = {
  name: string;
  phone: string;
  service: string;
  message: string;
};

function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    phone: '',
    service: 'Astrology Consultation',
    message: ''
  });

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const sendToWhatsApp = () => {
    const text = [
      'KKC Enquiry',
      `Name: ${form.name || '-'}`,
      `Phone: ${form.phone || '-'}`,
      `Service: ${form.service}`,
      `Message: ${form.message || '-'}`
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="contact-section section-wrap">
      <div className="contact-card reveal-card">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h2>Start with a clear enquiry.</h2>
          <p className="contact-copy">
            Share your requirement for devotional events, astrology sessions, products, or booking support.
            The first version sends enquiries through WhatsApp. Backend storage will be added in the next phase.
          </p>
        </div>

        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="Enter phone number"
            />
          </label>

          <label>
            Requirement
            <select value={form.service} onChange={(event) => updateField('service', event.target.value)}>
              <option>Astrology Consultation</option>
              <option>Devotional Event</option>
              <option>Kriya Session</option>
              <option>Product Enquiry</option>
              <option>Payment / Booking Support</option>
            </select>
          </label>

          <label>
            Message
            <textarea
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder="Write your message"
              rows={4}
            />
          </label>

          <button className="primary-btn full-btn" type="button" onClick={sendToWhatsApp}>
            Send Enquiry on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
