import { formatMatchAccuracy } from "../utils/formatters";

function FinalPreviewModal({
  isOpen,
  onClose,
  onExport,
  imagePreview,
  selectedSong,
  analysis,
  overlayText,
  selectedEmoji,
  textPosition,
  emojiPosition,
  textScale,
  emojiScale,
  textColor,
  textFont,
  textWeight
}) {
  if (!isOpen) {
    return null;
  }

  const moods = analysis?.detected_mood || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="final-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Final Preview</p>
            <h2>Your music post is ready</h2>
          </div>

          <button className="modal-close-button" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-phone-frame">
            <div className="modal-phone-screen">
              {imagePreview && (
                <img
                  className="preview-image"
                  src={imagePreview}
                  alt="Final preview"
                />
              )}

              <div className="preview-gradient"></div>

              {selectedEmoji && (
                <div
                  className="emoji-overlay"
                  style={{
                    left: `${emojiPosition.x}%`,
                    top: `${emojiPosition.y}%`,
                    transform: `translate(-50%, -50%) scale(${emojiScale})`
                  }}
                >
                  {selectedEmoji}
                </div>
              )}

              {overlayText && (
                <div
                  className="text-overlay"
                  style={{
                    left: `${textPosition.x}%`,
                    top: `${textPosition.y}%`,
                    color: textColor,
                    fontFamily: textFont,
                    fontWeight: textWeight,
                    transform: `translate(-50%, -50%) scale(${textScale})`
                  }}
                >
                  {overlayText}
                </div>
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
                    crossOrigin="anonymous"
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

          <div className="modal-summary">
            <h3>Preview details</h3>

            <p>
              <strong>Selected song:</strong>{" "}
              {selectedSong ? selectedSong.title : "No song selected"}
            </p>

            <p>
              <strong>Artist:</strong>{" "}
              {selectedSong ? selectedSong.artist : "None"}
            </p>

            <p>
              <strong>Mood:</strong>{" "}
              {moods.length > 0 ? moods.join(", ") : "No mood detected"}
            </p>

            <div className="modal-actions">
              <button type="button" onClick={onExport}>
                Export Image Preview
              </button>

              <button type="button" onClick={onClose}>
                Back to editor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FinalPreviewModal;