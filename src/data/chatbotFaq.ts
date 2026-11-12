import { findAstrologyTopic } from './astrologyTopics';
import facts from './seoEvents.json';
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
      "For Karthika Masam Seva, use the registration form and its payment QR. For astrology, choose the INR 999 / 10-minute or INR 1,500 / 20-minute call in Astrology Services. KKC verifies payments manually.",
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
      "Karthika Masam 2026: 16 November–8 December. " + facts.programmes.map(programme => programme.description).join(" "),
    category: "Events",
    keywords: ["events", "upcoming", "program", "schedule", "event"],
  },
  {
    id: "astrology-consultation",
    question: "How do I book astrology consultation?",
    answer:
      "Astrology calls cost INR 999 for 10 minutes or INR 1,500 for 20 minutes. Choose a call below, share your question, and send your enquiry to KKC on WhatsApp. KKC confirms availability and verifies payment manually. Personal readings are provided by the astrologer during the call.",
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

  if (findAstrologyTopic(normalized)) return chatbotFaqs.find(faq => faq.id === "astrology-consultation")!;

  if (/astrolog|kundali|horoscope|jyotish|marriage|career|birth chart|zodiac|జ్యోతిష|జాతక|999|1500|1,500|10 min|20 min/.test(normalized)) {
    return chatbotFaqs.find(faq => faq.id === "astrology-consultation")!;
  }

  if (/event|homam|lingarchana|karthika|karthik|venue|schedule|కార్తీక|హోమ|లింగార్చన/.test(normalized)) {
    return chatbotFaqs.find(faq => faq.id === "upcoming-events")!;
  }

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
