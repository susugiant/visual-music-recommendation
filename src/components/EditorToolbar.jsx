const emojiOptions = ["✨", "🌅", "💫", "🎧", "❤️", "🔥", "🌊", "🪩"];

function EditorToolbar({
  analysis,
  overlayText,
  onOverlayTextChange,
  selectedEmoji,
  onEmojiChange,
  onClearOverlay
}) {
  const moods = analysis?.detected_mood || [];
  const colors = analysis?.color_palette || [];

  return (
    <section className="editor-toolbar">
      <div className="panel-header">
        <p className="eyebrow">Editor Tools</p>
        <h2>Create Your Post</h2>
        <p className="panel-description">
          Add simple text and emoji overlays to make the preview feel like a
          social media post.
        </p>
      </div>

      <div className="tool-block">
        <h3>Detected Mood</h3>

        {moods.length > 0 ? (
          <div className="compact-mood-list">
            {moods.map((mood) => (
              <span key={mood}>{mood}</span>
            ))}
          </div>
        ) : (
          <p className="muted-text">No mood detected yet.</p>
        )}
      </div>

      <div className="tool-block">
        <h3>Color Palette</h3>

        {colors.length > 0 ? (
          <div className="compact-palette-list">
            {colors.map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                title={color}
              ></span>
            ))}
          </div>
        ) : (
          <p className="muted-text">No palette available yet.</p>
        )}
      </div>

      <div className="tool-block">
        <h3>Overlay Text</h3>

        <input
          className="text-input"
          type="text"
          value={overlayText}
          onChange={(event) => onOverlayTextChange(event.target.value)}
          placeholder="Type something like: golden hour"
          maxLength={40}
        />

        <p className="input-hint">{overlayText.length}/40 characters</p>
      </div>

      <div className="tool-block">
        <h3>Emoji Sticker</h3>

        <div className="emoji-list">
          {emojiOptions.map((emoji) => (
            <button
              className={`emoji-button ${
                selectedEmoji === emoji ? "active" : ""
              }`}
              key={emoji}
              onClick={() => onEmojiChange(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        className="clear-button"
        type="button"
        onClick={onClearOverlay}
      >
        Clear Text & Emoji
      </button>
    </section>
  );
}

export default EditorToolbar;