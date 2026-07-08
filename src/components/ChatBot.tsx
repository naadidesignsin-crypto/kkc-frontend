import { FormEvent, useEffect, useRef, useState } from "react";
import { chatbotFaqs, findFaqAnswer } from "../data/chatbotFaq";

interface ChatMessage {
  id: number;
  role: "BOT" | "USER";
  text: string;
}

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "BOT",
      text:
        "Namaste. I can help you with KKC events, seva contributions, astrology consultation, video highlights, and contact support.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(message: string) {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    const faq = findFaqAnswer(cleanMessage);

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "USER",
        text: cleanMessage,
      },
      {
        id: Date.now() + 1,
        role: "BOT",
        text: faq.answer,
      },
    ]);

    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Namaste KKC, I need assistance."
  )}`;

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-launcher"
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Open KKC Seva Assistant"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <aside className="chatbot-panel" aria-label="KKC Seva Assistant">
          <div className="chatbot-header">
            <div>
              <p className="eyebrow">KKC Seva Assistant</p>
              <h3>How can we help?</h3>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="quick-question-grid">
            {chatbotFaqs.slice(0, 6).map((faq) => (
              <button
                key={faq.id}
                onClick={() => sendMessage(faq.question)}
                type="button"
              >
                {faq.question}
              </button>
            ))}
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                className={
                  message.role === "BOT"
                    ? "chat-message bot-message"
                    : "chat-message user-message"
                }
                key={message.id}
              >
                {message.text}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about seva, events, astrology..."
              aria-label="Ask KKC Seva Assistant"
            />

            <button type="submit">Send</button>
          </form>

          <a
            className="chatbot-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Continue on WhatsApp
          </a>
        </aside>
      )}
    </>
  );
}

export default ChatBot;