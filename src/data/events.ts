import event1 from '../assets/events/slider-01.jpeg';
import event2 from '../assets/events/slider-02.jpeg';
import event3 from '../assets/events/slider-03.jpeg';
import event4 from '../assets/events/slider-04.jpeg';

export type EventItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export const events: EventItem[] = [
  {
    id: 1,
    title: 'Devotional Event',
    description:
      'Spiritual gathering with kriya, guidance, and devotional practices.',
    image: event1,
  },
  {
    id: 2,
    title: 'Astrology Session',
    description:
      'Personal guidance through astrology, planetary understanding, and conscious consultation.',
    image: event2,
  },
  {
    id: 3,
    title: 'Kundalini Kriya',
    description:
      'Inner transformation through focused kriya, discipline, and spiritual practice.',
    image: event3,
  },
  {
    id: 4,
    title: 'Special Program',
    description:
      'Exclusive devotional and astrology-based program for seekers and families.',
    image: event4,
  },
];
