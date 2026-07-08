export type EventVideo = {
  id: string;
  title: string;
  source: string;
  fileName: string;
  type: string;
};

const videoModules = import.meta.glob<string>("../assets/videos/*.{mp4,webm}", {
  eager: true,
  import: "default",
});

function formatVideoTitle(path: string, index: number) {
  const fileName = path.split("/").pop() || `event-video-${index + 1}`;
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

  const cleaned = nameWithoutExt
    .replace(/^\d+[-_\s]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return `Event Video ${index + 1}`;
  }

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const eventVideos: EventVideo[] = Object.entries(videoModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, source], index) => {
    const fileName = path.split("/").pop() || `event-video-${index + 1}.mp4`;
    const ext = fileName.split(".").pop()?.toLowerCase() || "mp4";

    return {
      id: `${index + 1}-${fileName}`,
      title: formatVideoTitle(path, index),
      source,
      fileName,
      type: ext === "webm" ? "video/webm" : "video/mp4",
    };
  });
