import AstrologyCustomerRecord from './AstrologyCustomerRecord';
import { astrologyTopics, findAstrologyTopic, astrologyTopicLabel, astrologyTopicQuery } from '../data/astrologyTopics';
import { astrologyNameIcon, astrologyBirthDate, astrologyBirthTime } from '../lib/astrologyMessage';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

const questions = [
  { key: 'name', label: 'What is your full name?', type: 'text', hint: 'Enter the name of the person requesting the reading.' },
  { key: 'gender', label: 'Which name icon should we use?', type: 'text', hint: 'Choose your gender for the consultation message.' },
  { key: 'phone', label: 'What is your WhatsApp number?', type: 'tel', hint: 'Use 10–15 digits, with country code if outside India.' },
  { key: 'dob', label: 'What is your date of birth?', type: 'date', hint: 'Use your actual birth date.' },
  { key: 'place', label: 'Where were you born?', type: 'text', hint: 'City or town, state and country.' },
  { key: 'time', label: 'What time were you born?', type: 'time', hint: 'Enter the local time at your birthplace, or choose “I do not know”.' },
  { key: 'query', label: 'What would you like to ask?', type: 'text', hint: 'Share the question you would like to discuss with the astrologer.' },
] as const;
type Details = Record<typeof questions[number]['key'], string>;
export default function AstrologyChatIntake({ initialQuery = '', onPayment }: { initialQuery?: string; onPayment: () => void }) {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>({ name: '', gender: '', phone: '', dob: '', place: '', time: '', query: initialQuery });
  const [topic, setTopic] = useState(findAstrologyTopic(initialQuery)?.id || '');
  useEffect(() => { setTopic(findAstrologyTopic(initialQuery)?.id || ''); setDetails(d => ({ ...d, query: initialQuery })); }, [initialQuery]);
  const [minutes, setMinutes] = useState(10);
  const [unknown, setUnknown] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const question = questions[step];
  const totalSteps = questions.length + 2;
  const amount = minutes === 10 ? 999 : 1500;
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  useEffect(() => { input.current?.focus({ preventScroll: true }); }, [step]);
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (question && question.key !== 'time' && !details[question.key].trim()) return;
    setStep(s => s + 1);
  }
  const text = ['🙏 *KKC Astrology Consultation*', '',
    astrologyNameIcon(details.gender) + ' *Name:* ' + details.name,
    '👤 *Gender:* ' + details.gender,
    '📞 *WhatsApp:* ' + details.phone,
    '📅 *Date of birth:* ' + astrologyBirthDate(details.dob),
    '📍 *Birthplace:* ' + details.place,
    '🕒 *Birth time:* ' + (unknown ? 'Unknown' : astrologyBirthTime(details.time)),
    '✦ *Consultation topic:* ' + astrologyTopicLabel(topic),
    '💬 *Query:* ' + details.query, '',
    '☎️ *Call:* ' + minutes + ' minutes',
    '💳 *Fee:* ₹' + amount.toLocaleString('en-IN'),
    '⏳ *Payment:* Not confirmed. Please confirm availability and payment instructions.'
  ].join('\n');
  return <div className="astrology-intake">
    <div className="chat-step-label">ASTROLOGY CONSULTATION <span>{Math.min(step + 1, totalSteps)} / {totalSteps}</span></div>
    <progress max={totalSteps} value={step + 1} aria-label="Consultation details progress" />
    <p className="chat-privacy">Details stay in this chat until you choose to send them to KKC on WhatsApp.</p>
    {question ? <form onSubmit={next}>
      {question.key === "query" && <div className="chat-topic-choice"><label htmlFor="chat-topic">Choose a consultation topic</label><select id="chat-topic" value={topic} onChange={e => { setTopic(e.target.value); setDetails(d => ({ ...d, query: astrologyTopicQuery(e.target.value) })); }}><option value="">General / another question</option>{astrologyTopics.map(item => <option key={item.id} value={item.id}>{item.te} / {item.en}</option>)}</select>{["health", "parenthood"].includes(topic) && <p className="chat-privacy">Spiritual guidance does not replace medical advice or treatment.</p>}</div>}
      <label htmlFor="chat-birth-field"><strong>{question.label}</strong></label>
      <p>{question.hint}</p>
      {question.key === "gender" ? <select id="chat-birth-field" required value={details.gender} onChange={e => setDetails(d => ({ ...d, gender: e.target.value }))}><option value="">Choose an option</option><option value="Male">👨 Male</option><option value="Female">👩 Female</option><option value="Prefer not to say">👤 Prefer not to say</option></select> : <input ref={input} id="chat-birth-field" key={question.key} type={question.type} pattern={question.key === "phone" ? "[+]?[0-9]{10,15}" : undefined} required={!(question.key === 'time' && unknown)}
        disabled={question.key === 'time' && unknown} max={question.type === 'date' ? today : undefined}
        maxLength={question.key === 'query' ? 1500 : 150} autoComplete={question.key === 'name' ? 'name' : 'off'}
        value={details[question.key]} onChange={e => setDetails(d => ({ ...d, [question.key]: e.target.value }))} />}
      {question.key === 'time' && <label className="chat-unknown"><input type="checkbox" checked={unknown} onChange={e => setUnknown(e.target.checked)} />I do not know my birth time</label>}
      <div className="chat-step-actions">{step > 0 && <button type="button" onClick={() => setStep(s => s - 1)}>Back</button>}<button className="chat-next" type="submit">Continue →</button></div>
    </form> : step === questions.length ? <div>
      <h4>Choose your consultation</h4>
      <div className="chat-call-options">{[10, 20].map(n => <button type="button" aria-pressed={minutes === n} key={n} onClick={() => setMinutes(n)}><strong>{n} minutes</strong><span>₹{n === 10 ? '999' : '1,500'}</span></button>)}</div>
      <div className="chat-step-actions"><button type="button" onClick={() => setStep(questions.length - 1)}>Back</button><button className="chat-next" type="button" onClick={() => setStep(questions.length + 1)}>Review details →</button></div>
    </div> : <div>
      <h4>Review your details</h4>
      <dl className="chat-details"><div><dt>Consultation topic</dt><dd>{astrologyTopicLabel(topic)}</dd></div>{questions.map(q => <div key={q.key}><dt>{q.key === 'time' ? 'Birth time' : q.key === 'dob' ? 'Date of birth' : q.key === 'place' ? 'Birthplace' : q.key === 'name' ? 'Name' : q.key === 'gender' ? 'Gender' : q.key === 'phone' ? 'WhatsApp number' : 'Your query'}</dt><dd>{q.key === 'time' && unknown ? 'Unknown' : details[q.key]}</dd></div>)}<div><dt>Call fee</dt><dd>{minutes} minutes · ₹{amount.toLocaleString('en-IN')}</dd></div></dl>
      <p>Consultation hours: 2 PM–9 PM IST. KKC will confirm the call slot and verify payment.</p>
      <AstrologyCustomerRecord record={{ name: details.name, gender: details.gender, phone: details.phone, dob: details.dob, birthplace: details.place, birthtime: unknown ? "Unknown" : details.time, topic, query: details.query, minutes }} whatsappUrl={"https://wa.me/917981041123?text=" + encodeURIComponent(text)} />
      <button className="chat-edit-details" type="button" onClick={() => setStep(0)}>Edit details</button>
      <a className="chat-payment-link" href="#astrology-booking" onClick={onPayment}>View QR &amp; payment options below ↓</a>
    </div>}
  </div>;
}
