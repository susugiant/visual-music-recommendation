import { useEffect, useRef, useState } from "react";
import { formatMatchAccuracy } from "../utils/formatters";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function CreativePreview({
  previewRef,
  imagePreview,
  selectedSong,
  analysis,
  overlayText,
  selectedEmoji,
  textPosition,
  onTextPositionChange,
  emojiPosition,
  onEmojiPositionChange,
  textScale,
  emojiScale,
  textColor,
  textFont,
  textWeight,
  onOpenFinalPreview,
  onExportPreview
}) {
  const audioRef = useRef(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [audioStatus, setAudioStatus] = useState("");

  const moods = analysis?.detected_mood || [];

  useEffect(() => {
    if (!selectedSong) {
      setAudioStatus("");
      return;
    }

    if (!selectedSong.audio_preview_url) {
      setAudioStatus("Audio preview is not available for this track.");
      return;
    }

    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = selectedSong.audio_preview_url;

    audioElement
      .play()
      .then(() => {
        setAudioStatus("Auto-playing selected preview.");
      })
      .catch(() => {
        setAudioStatus(
          "Browser blocked autoplay. Click another track to try again."
        );
      });
  }, [selectedSong]);

  function updateOverlayPosition(event, target) {
    const previewElement = previewRef.current;

    if (!previewElement) {
      return;
    }

    const rect = previewElement.getBoundingClientRect();

    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 8, 92);

    if (target === "text") {
      onTextPositionChange({ x, y });
    }

    if (target === "emoji") {
      onEmojiPositionChange({ x, y });
    }
  }

  function handlePointerDown(event, target) {
    event.preventDefault();
    event.stopPropagation();

    setDragTarget(target);
    updateOverlayPosition(event, target);
  }

  function handlePointerMove(event) {
    if (!dragTarget) {
      return;
    }

    updateOverlayPosition(event, dragTarget);
  }

  function handlePointerUp() {
    setDragTarget(null);
  }

  return (
    <section className="creative-preview-section">
      <div className="preview-heading">
        <p className="eyebrow">Creator Preview</p>
        <h2>Social Post Output</h2>
      </div>

      <div className="phone-frame">
        <div
          className="phone-screen"
          ref={previewRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {imagePreview ? (
            <img
              className="preview-image"
              src={imagePreview}
              alt="Creative preview"
            />
          ) : (
            <div className="preview-placeholder">Upload an image to start</div>
          )}

          <div className="preview-gradient"></div>

          {selectedEmoji && (
            <div
              className="emoji-overlay draggable-overlay"
              onPointerDown={(event) => handlePointerDown(event, "emoji")}
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
              className="text-overlay draggable-overlay"
              onPointerDown={(event) => handlePointerDown(event, "text")}
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

      <audio ref={audioRef} className="hidden-audio" />

      {selectedSong && (
        <p className="audio-status">
          {audioStatus || "Click a recommended track to auto-play preview."}
        </p>
      )}

      <p className="export-note">
        Audio plays in the web preview. Exported image contains visual elements
        only.
      </p>

      <div className="preview-actions">
        <button type="button" onClick={onOpenFinalPreview}>
          Open Final Preview
        </button>

        <button type="button" onClick={onExportPreview}>
          Export Image Preview
        </button>
      </div>
    </section>
  );
}

export default CreativePreview;