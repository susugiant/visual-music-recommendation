import { formatMatchAccuracy } from "../utils/formatters";

function CreativePreview({
  imagePreview,
  selectedSong,
  analysis,
  overlayText,
  selectedEmoji
}) {
  const moods = analysis?.detected_mood || [];

  return (
    <section className="creative-preview-section">
      <div className="preview-heading">
        <p className="eyebrow">Live Preview</p>
        <h2>Final Post Preview</h2>
      </div>

      <div className="phone-frame">
        <div className="phone-screen">
          {imagePreview ? (
            <img
              className="preview-image"
              src={imagePreview}
              alt="Creative preview"
            />
          ) : (
            <div className="preview-placeholder">
              Upload an image to start
            </div>
          )}

          <div className="preview-gradient"></div>

          {selectedEmoji && (
            <div className="emoji-overlay">{selectedEmoji}</div>
          )}

          {overlayText && (
            <div className="text-overlay">{overlayText}</div>
          )}

          <div className="preview-top-bar">
            <span>AI Music Match</span>
            {moods.length > 0 && <strong>{moods[0]}</strong>}
          </div>

          {selectedSong && (
            <div className="music-sticker">
              <img
                src={selectedSong.cover_image_url}
                alt={`${selectedSong.title} cover`}
              />

              <div className="music-info">
                <strong>{selectedSong.title}</strong>
                <span>{selectedSong.artist}</span>
              </div>

              <div className="music-match">
                {formatMatchAccuracy(selectedSong.match_accuracy)}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSong && (
        <audio
          className="preview-audio"
          controls
          src={selectedSong.audio_preview_url}
        >
          Your browser does not support the audio element.
        </audio>
      )}
    </section>
  );
}

export default CreativePreview;