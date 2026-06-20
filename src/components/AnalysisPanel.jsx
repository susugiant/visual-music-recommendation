function AnalysisPanel({ analysis }) {
  return (
    <section className="analysis-card">
      <div className="card-header">
        <p className="eyebrow">AI Analysis</p>
        <h2>Image Mood</h2>
      </div>

      <div className="analysis-block">
        <h3>Detected Mood</h3>

        <div className="mood-list">
          {analysis.detected_mood.map((mood) => (
            <span className="mood-tag" key={mood}>
              {mood}
            </span>
          ))}
        </div>
      </div>

      <div className="analysis-block">
        <h3>Color Palette</h3>

        <div className="palette-list">
          {analysis.color_palette.map((color) => (
            <div className="color-item" key={color}>
              <div
                className="color-dot"
                style={{ backgroundColor: color }}
              ></div>
              <span>{color}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnalysisPanel;