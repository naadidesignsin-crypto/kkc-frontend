import rudraHomamPoster from '../assets/events/rudra-homam-bilingual-2026.jpg';
import mainPoster from '../assets/events/karthika-masam-main-2026.png';

import lingarchanaPoster from '../assets/events/lingarchana-bilingual-2026.jpg';
import homamPoster from '../assets/events/purusha-suktam-bilingual-2026.jpg';

export const karthikaVenues = {
  lingarchana: { address: "Plot No. 26, 2nd Floor, Vijaya Lakshmi Villa, Mahadevapuram, Gajularamaram, KPHB", mapUrl: 'https://maps.app.goo.gl/S9kyPnkr5G5kyVCZA' },
  homam: { address: "Dasa Hanuman and Durga Devi Temple, 119, Chandulal Baradari Colony, Nayeem Gulshan Colony, Ramnas Pura, Hyderabad, Telangana 500053", mapUrl: 'https://maps.app.goo.gl/5un373U6LkZx8EYi8' },
};

export const karthikaEvent = {
  id: 'karthika-masam-2026',
  title: 'Karthika Masam 2026',
  subtitle: 'Maha Lingarchana & sacred Homams',
  description: 'Join KKC for Maha Lingarchana on four Mondays and five special Homams, concluding with Amavasya Rudra Homam and Maha Poornahuti.',
  date: '16 November – 8 December 2026',
  time: 'Mondays 4–8 PM · Homams 9:30–11:30 AM · Amavasya until 12 PM (IST)',
  venue: 'Daily Abhishekam / Maha Lingarchana: ' + karthikaVenues.lingarchana.address + '. Homams: ' + karthikaVenues.homam.address,
};

// Programme status follows the event dates in India, independent of visitor timezone.
export function getKarthikaStatus(now = new Date()): 'Upcoming' | 'Ongoing' | 'Completed' {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find(value => value.type === type)?.value;
  const date = part('year') + '-' + part('month') + '-' + part('day');
  return date < '2026-11-16' ? 'Upcoming' : date <= '2026-12-08' ? 'Ongoing' : 'Completed';
}

export const karthikaMainContent: string[] = [
  "ప్రతిరోజూ సాయంకాలము ప్రదోష వేలలో పుట్ట మట్టితో శివలింగాన్ని తయారు చేసి ఉమాపార్థీవేశ్వర స్వామివారిని ప్రాణప్రతిష్ఠ చేసి నమక చమకములతో, పంచ సూక్తాలతో అభిషేకము చేయడము.",
  "4 సోమవారాలు - మహా లింగార్చన విశేషంగా జరుపబడును",
  "365 శివలింగాలను ఏర్పాటు చేసి 11ఆవరణార్చనతో మహాత్రిపురసుందరీ సమేతంగా మహాలింగ పరమశివునికి అభిషేకాదులు,విశేష అర్చనాదులు జరుగును.",
  "ఒక్కరోజు శివారాధన ఫలితం సంవత్సరం కృత పాపములు తొలుగును. అలా నెల రోజులు చేయుటవలన ఇంకెంత గొప్ప ఫలితం  పొందగలం? మరీ దేన్ని ఆశించని, సత్ చిత్ ఆనంద మహా ఫలితాన్ని ఈ భక్తితో ఆచరించి శివానుగ్రహం పొందగలరు.",
  "కార్తీక దామోదర ప్రీత్యర్థంగా,భక్తజనులందరికీ సకల శ్రేయస్సుకలగాలని, వారి సత్సంకల్పాలు నెరవేరాలని శుక్లపక్షంలో వచ్చే ఏకాదశి అలాగే పౌర్ణమి నాడు, కృష్ణపక్షంలో వచ్చే ఏకాదశీ ,ద్వాదశి నాడు పురుషసూక్త హోమాలు నిర్వహించబడును.",
  "చివరిగా కార్తీక మాసంలో ఆచరించిన అభిషేకాదులు,అర్చనలు, హవనాదుల సంపూర్ణ సిద్ధి మరియు ఉమాపార్థిశేశ్వర స్వామి ప్రీత్యర్థం ,కార్తీక దామోదర దేవతా ప్రీత్యర్థం కార్తీక అమావాస్య నాడు రుద్రహోమము నిర్వహించి సకల దేవతా ప్రీత్యర్థంగా మహాపూర్ణహుతి నిర్వహించబడును."
];

export const karthikaPosters = [
  {
    id: 'main', title: 'Main poster', teluguTitle: 'కార్తీక మాసం',
    image: mainPoster, timing: 'కార్తీక మాస మహోత్సవాలు · KKC', dates: [] as string[],
    alt: 'KKC Karthika Masam 2026 main invitation: daily Abhishekam, four Mondays Maha Lingarchana, Purusha Suktam Homams and Amavasya Rudra Homam with Maha Poornahuti. The complete Telugu programme is typeset on screen.',
  },
  {
    id: 'lingarchana', title: 'Maha Lingarchana', teluguTitle: 'మహా లింగార్చన',
    image: lingarchanaPoster,
    timing: '4:00 PM – 8:00 PM · Four Mondays · IST',
    dates: ['16-11-2026 · Monday', '23-11-2026 · Monday', '30-11-2026 · Monday', '07-12-2026 · Monday'],
    alt: 'KKC Maha Lingarchana: 16, 23, 30 November and 7 December 2026, Mondays, 4 PM to 8 PM.',
  },
  {
    id: 'homam', title: 'Purusha Suktam Homams', teluguTitle: 'పురుషసూక్త హోమాలు',
    image: homamPoster,
    timing: '9:30 AM – 11:30 AM · IST',
    dates: [
      '20-11-2026 · Friday · Shukla Ekadashi · Purusha Suktam Homam',
      '24-11-2026 · Tuesday · Poornima · Purusha Suktam Homam',
      '04-12-2026 · Friday · Krishna Ekadashi · Purusha Suktam Homam',
      '05-12-2026 · Saturday · Krishna Dwadashi · Purusha Suktam Homam',

    ],
    alt: 'KKC Purusha Suktam Homams: 20 and 24 November, 4 and 5 December 2026, 9:30 AM to 11:30 AM. Bilingual poster with Seva options, Dakshina, venue, contact and registration website.',
  },
  {
    id: 'rudra-homam', title: 'Rudra Homam', teluguTitle: 'రుద్రహోమం',
    image: rudraHomamPoster,
    timing: '9:30 AM – 12:00 PM · IST',
    dates: ['08-12-2026 · Tuesday · Amavasya · Rudra Homam & Maha Poornahuti'],
    alt: 'KKC Rudra Homam and Maha Poornahuti, 8 December 2026, 9:30 AM to noon. Bilingual poster with Seva options, Dakshina, venue, contact and registration website.',
  },
];
