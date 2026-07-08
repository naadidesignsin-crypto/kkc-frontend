import { useEffect, useMemo, useState } from "react";
import { eventVideos, type EventVideo } from "../data/eventVideos";

const AUTO_SLIDE_MS = 5200;

function VideoGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<EventVideo | null>(null);
  const hasVideos = eventVideos.length > 0;

  const selectedVideo = hasVideos ? eventVideos[activeIndex] : null;

  const floatingVideos = useMemo(() => {
    if (!hasVideos) {
      return [];
    }

    return [1, 2, 3]
      .map((offset) => eventVideos[(activeIndex + offset) % eventVideos.length])
      .filter(Boolean);
  }, [activeIndex, hasVideos]);

  useEffect(() => {
    if (eventVideos.length <= 1 || activeVideo) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % eventVideos.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [activeVideo]);

  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? eventVideos.length - 1 : currentIndex - 1
    );
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % eventVideos.length);
  };

  return (
    <section className="video-slider-section" id="events">
      <div className="section-wrap">
        <div className="section-heading compact-heading video-slider-heading">
          <p className="eyebrow">Events</p>
          <h2>Event Video Gallery</h2>
          <p>
            Watch uploaded KKC event videos, devotional sessions, seva updates,
            and upcoming event highlights in a floating slideshow view.
          </p>
        </div>

        {selectedVideo ? (
          <>
            <div className="video-slider-stage reveal-card">
              <div className="video-slider-copy">
                <span className="video-slider-count">
                  Video {activeIndex + 1} of {eventVideos.length}
                </span>
                <h3>{selectedVideo.title}</h3>
                <p>
                  This section can later become dynamic from backend uploads. For
                  now, every MP4/WebM file added inside src/assets/videos appears
                  in this slideshow after build.
                </p>

                <div className="video-slider-actions">
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() => setActiveVideo(selectedVideo)}
                  >
                    Watch Video
                  </button>

                  {eventVideos.length > 1 && (
                    <div className="video-slider-buttons" aria-label="Video controls">
                      <button type="button" onClick={showPrevious} aria-label="Previous video">
                        ‹
                      </button>
                      <button type="button" onClick={showNext} aria-label="Next video">
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="video-main-card"
                type="button"
                onClick={() => setActiveVideo(selectedVideo)}
                aria-label={`Play ${selectedVideo.title}`}
              >
                <video
                  key={selectedVideo.source}
                  className="video-main-preview"
                  src={selectedVideo.source}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                />
                <span className="video-main-overlay">
                  <span className="video-play-ring">▶</span>
                  <span>Tap to watch</span>
                </span>
              </button>

              <div className="floating-video-stack" aria-hidden="true">
                {floatingVideos.map((video, index) => (
                  <div className={`floating-video-card floating-video-card-${index + 1}`} key={video.id}>
                    <video
                      src={video.source}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            </div>

            {eventVideos.length > 1 && (
              <div className="video-slide-dots" aria-label="Select video">
                {eventVideos.map((video, index) => (
                  <button
                    type="button"
                    className={index === activeIndex ? "active" : ""}
                    key={video.id}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${video.title}`}
                  />
                ))}
              </div>
            )}

            <div className="video-mini-strip" aria-label="Event video thumbnails">
              {eventVideos.map((video, index) => (
                <button
                  className={`video-mini-card ${index === activeIndex ? "active" : ""}`}
                  type="button"
                  key={video.id}
                  onClick={() => setActiveIndex(index)}
                >
                  <video src={video.source} muted playsInline preload="metadata" />
                  <span>{video.title}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="video-empty-card reveal-card">
            <h3>No event videos uploaded yet</h3>
            <p>
              Add MP4 or WebM files inside <strong>src/assets/videos</strong>.
              They will appear here automatically after rebuild.
            </p>
          </div>
        )}
      </div>

      {activeVideo && (
        <div
          className="video-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div className="video-modal" onClick={(event) => event.stopPropagation()}>
            <div className="video-modal-header">
              <h3>{activeVideo.title}</h3>
              <button
                type="button"
                className="video-modal-close"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                ×
              </button>
            </div>

            <video
              key={activeVideo.source}
              className="video-modal-player"
              controls
              autoPlay
              playsInline
            >
              <source src={activeVideo.source} type={activeVideo.type} />
              Your browser does not support this video.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoGallery;
