import { useState } from "react";
import { eventVideos, type EventVideo } from "../data/eventVideos";

function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState<EventVideo | null>(null);

  return (
    <section className="video-gallery-section" id="events">
      <div className="section-wrap">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Events</p>
          <h2>Event Video Gallery</h2>
          <p>
            Watch uploaded KKC event videos, devotional sessions, seva updates,
            and upcoming event highlights.
          </p>
        </div>

        {eventVideos.length > 0 ? (
          <div className="video-gallery-grid">
            {eventVideos.map((video, index) => (
              <article className="video-card" key={video.id}>
                <button
                  className="video-preview-button"
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Play ${video.title}`}
                >
                  <video
                    className="video-preview"
                    src={video.source}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <span className="video-overlay">
                    <span className="video-play-icon">▶</span>
                    <span>Watch Video</span>
                  </span>
                </button>

                <div className="video-card-content">
                  <span className="video-count">Video {index + 1}</span>
                  <h3>{video.title}</h3>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="video-empty-card reveal-card">
            <h3>No event videos uploaded yet</h3>
            <p>
              Add MP4 or WebM videos inside <strong>src/assets/videos</strong>.
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
          <div
            className="video-modal"
            onClick={(event) => event.stopPropagation()}
          >
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
