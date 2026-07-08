export interface ChatbotFaq {
  id: string;
  question: string;
  answer: string;
  category: "Donation" | "Events" | "Astrology" | "Contact" | "General";
  keywords: string[];
}

export const chatbotFaqs: ChatbotFaq[] = [
  {
    id: "what-is-kkc",
    question: "What is KKC?",
    answer:
      "KKC stands for Kundalini Kriya Chaitanyam. It focuses on devotional events, seva initiatives, astrology guidance, and conscious spiritual support.",
    category: "General",
    keywords: ["kkc", "kundalini", "kriya", "chaitanyam", "about", "what"],
  },
  {
    id: "how-to-donate",
    question: "How can I donate?",
    answer:
      "For now, please use the Donate button or WhatsApp option on the website. Online payment gateway integration is parked and will be added later after Razorpay setup.",
    category: "Donation",
    keywords: ["donate", "donation", "payment", "seva", "amount", "razorpay"],
  },
  {
    id: "gau-seva",
    question: "What is Gau Seva?",
    answer:
      "Gau Seva is a devotional seva initiative. Please contact the KKC team on WhatsApp for current seva details and contribution instructions.",
    category: "Donation",
    keywords: ["gau", "cow", "seva"],
  },
  {
    id: "upcoming-events",
    question: "Where can I see upcoming events?",
    answer:
      "Upcoming events are shown on the website under the Upcoming Events section. More event and video panels can be added dynamically in the next phase.",
    category: "Events",
    keywords: ["events", "upcoming", "program", "schedule", "event"],
  },
  {
    id: "astrology-consultation",
    question: "How do I book astrology consultation?",
    answer:
      "Use the Contact section or WhatsApp button to send your name, phone number, and requirement. The KKC team will respond with available consultation timings.",
    category: "Astrology",
    keywords: ["astrology", "consultation", "booking", "kundali", "horoscope", "jyotish"],
  },
  {
    id: "contact",
    question: "How can I contact KKC?",
    answer:
      "Use the Contact section or the WhatsApp button on the website. For urgent enquiries, WhatsApp is recommended.",
    category: "Contact",
    keywords: ["contact", "phone", "whatsapp", "call", "number"],
  },
];

export function findFaqAnswer(message: string): ChatbotFaq {
  const normalized = message.trim().toLowerCase();

  const exactMatch = chatbotFaqs.find(
    (faq) => faq.question.toLowerCase() === normalized
  );

  if (exactMatch) {
    return exactMatch;
  }

  const keywordMatch = chatbotFaqs.find((faq) =>
    faq.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    keywordMatch || {
      id: "fallback",
      question: "Fallback",
      answer:
        "I can help with donations, upcoming events, astrology consultation, Gau Seva, and contact details. For direct help, please use the WhatsApp button.",
      category: "General",
      keywords: [],
    }
  );
}
