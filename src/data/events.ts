import { karthikaEvent, karthikaPosters, getKarthikaStatus } from './karthikaEvent';
import event1 from "../assets/events/slider-01.jpeg";
import event2 from "../assets/events/slider-02.jpeg";
import event3 from "../assets/events/slider-03.jpeg";
import event4 from "../assets/events/slider-04.jpeg";

export type EventMediaType = "image" | "video";

export type KkcEvent = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mediaType: EventMediaType;
  donationUrl: string;
  contactUrl: string;
  registrationUrl?: string;
  posterId?: string;
};

const gauSeva: KkcEvent = {
  id: 1,
  title: "Gau Seva",
  subtitle: "KKC Ongoing Event",
  description:
    "Support the current devotional seva initiative. This section will later support dynamic event slides and video panels from the backend.",
  image: event1,
  mediaType: "image",
  donationUrl: "#contact",
  contactUrl: "#contact",
};

export const ongoingEvent: KkcEvent = getKarthikaStatus() !== 'Completed' ? {
  id: 5, title: karthikaEvent.title, subtitle: getKarthikaStatus() + ' · Karthika Masam',
  description: karthikaEvent.description, image: karthikaPosters[0].image,
  mediaType: 'image', donationUrl: '#karthika-registration', contactUrl: '#contact', registrationUrl: '#karthika-registration',
} : gauSeva;

export const upcomingEvents: KkcEvent[] = [
 ...karthikaPosters.map((poster, index): KkcEvent => ({id: 5 + index, posterId: poster.id, title: poster.title, subtitle: getKarthikaStatus() + ' · Karthika Masam 2026', description: poster.id === 'main' ? karthikaEvent.description : poster.timing + '. ' + poster.dates.join('; ') + '.', image: poster.image, mediaType: 'image', donationUrl: '#contact', contactUrl: '#contact', registrationUrl: '#karthika-registration'})),
  {
    id: 2,
    title: "Yagna Seva",
    subtitle: "Upcoming Event",
    description:
      "A sacred yagna seva program planned for devotees and families seeking devotional participation and spiritual discipline.",
    image: event2,
    mediaType: "image",
    donationUrl: "#contact",
    contactUrl: "#contact",
  },
  {
    id: 3,
    title: "Dhana Seva",
    subtitle: "Upcoming Event",
    description:
      "A conscious donation support initiative for devotional activities, seva coordination, and community spiritual programs.",
    image: event3,
    mediaType: "image",
    donationUrl: "#contact",
    contactUrl: "#contact",
  },
  {
    id: 4,
    title: "Brahmana Annadanam",
    subtitle: "Upcoming Event",
    description:
      "Food offering and service initiative for spiritual gatherings, devotees, families, and community seva participation.",
    image: event4,
    mediaType: "image",
    donationUrl: "#contact",
    contactUrl: "#contact",
  },
];

export const events: KkcEvent[] = [ongoingEvent, ...upcomingEvents];
