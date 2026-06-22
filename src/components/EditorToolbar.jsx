const emojiOptions = ["✨", "🌅", "💫", "🎧", "❤️", "🔥", "🌊", "🪩"];

const fontOptions = [
  "Inter",
  "Arial",
  "Georgia",
  "Trebuchet MS",
  "Courier New"
];

function EditorToolbar({
  analysis,
  overlayText,
  onOverlayTextChange,
  selectedEmoji,
  onEmojiChange,
  onClearOverlay,
  textScale,
  onTextScaleChange,
  emojiScale,
  onEmojiScaleChange,
  textColor,
  onTextColorChange,
  textFont,
  onTextFontChange,
  textWeight,
  onTextWeightChange
}) {
  const moods = analysis?.detected_mood || [];
  const colors = analysis?.color_palette || [];

  return (
    <section className="editor-toolbar">
      <div className="panel-header">
        <p className="eyebrow">Editor Tools</p>
        <h2>Create Your Post</h2>
        <p className="panel-description">
          Add text, emoji, and simple styling to make the preview feel like a
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
        <h3>Text Style</h3>

        <label className="control-label">
          Text size
          <input
            type="range"
            min="0.7"
            max="1.8"
            step="0.1"
            value={textScale}
            onChange={(event) => onTextScaleChange(Number(event.target.value))}
          />
        </label>

        <label className="control-label">
          Text color
          <input
            className="color-input"
            type="color"
            value={textColor}
            onChange={(event) => onTextColorChange(event.target.value)}
          />
        </label>

        <label className="control-label">
          Font
          <select
            className="select-input"
            value={textFont}
            onChange={(event) => onTextFontChange(event.target.value)}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>

        <label className="control-label">
          Weight
          <select
            className="select-input"
            value={textWeight}
            onChange={(event) => onTextWeightChange(event.target.value)}
          >
            <option value="600">Regular</option>
            <option value="800">Bold</option>
            <option value="950">Extra Bold</option>
          </select>
        </label>
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

        <label className="control-label emoji-size-control">
          Emoji size
          <input
            type="range"
            min="0.6"
            max="2"
            step="0.1"
            value={emojiScale}
            onChange={(event) => onEmojiScaleChange(Number(event.target.value))}
          />
        </label>
      </div>

      <button className="clear-button" type="button" onClick={onClearOverlay}>
        Clear Text & Emoji
      </button>

      <p className="drag-hint">
        Tip: drag the text or emoji directly on the phone preview.
      </p>
    </section>
  );
}

export default EditorToolbar;