const videoModules = import.meta.glob<string>(
  "../assets/videos/*.{mp4,webm}",
  {
    eager: true,
    import: "default",
  }
);

export type EventVideo = {
  id: string;
  title: string;
  description: string;
  source: string;
  type: string;
};

const videoTitles = [
  {
    title: "KKC Spiritual Gathering",
    description:
      "A sacred glimpse of devotional participation, prayer, guidance, and community connection.",
  },
  {
    title: "Gau Seva Highlights",
    description:
      "Moments from seva activities dedicated to care, contribution, and dharmic support.",
  },
  {
    title: "Kundalini Kriya Session",
    description:
      "Highlights from guided kriya practice focused on discipline, awareness, and inner transformation.",
  },
  {
    title: "Astrology Guidance Moments",
    description:
      "Selected moments from astrology guidance sessions focused on clarity, timing, and personal direction.",
  },
  {
    title: "Devotional Satsang",
    description:
      "A devotional gathering with prayer, reflection, guidance, and spiritual participation.",
  },
  {
    title: "Sacred Event Highlights",
    description:
      "Captured moments from KKC spiritual programs, seva initiatives, and devotional events.",
  },
];

export const eventVideos: EventVideo[] = Object.entries(videoModules).map(
  ([path, source], index) => {
    const extension = path.split(".").pop()?.toLowerCase();
    const content = videoTitles[index] ?? {
      title: `KKC Event Highlight ${index + 1}`,
      description:
        "A selected moment from KKC devotional events, seva activities, and spiritual programs.",
    };

    return {
      id: `event-video-${index + 1}`,
      title: content.title,
      description: content.description,
      source,
      type: extension === "webm" ? "video/webm" : "video/mp4",
    };
  }
);