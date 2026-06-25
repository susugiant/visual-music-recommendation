import { formatConfidenceScore } from "../utils/formatters";

function AIAnalysisPanel({ analysis, isAnalyzing }) {
  const moods = analysis?.detected_mood || [];
  const confidenceScores = analysis?.confidence_scores || [];
  const isMultivibe = analysis?.is_multivibe || moods.length > 1;

  if (isAnalyzing) {
    return (
      <section className="ai-analysis-panel">
        <p className="eyebrow">AI Analysis</p>
        <h2>Analyzing visual mood...</h2>
        <p className="panel-description">
          The AI model is extracting image features and comparing them with
          trained vibe categories.
        </p>
      </section>
    );
  }

  if (!analysis) {
    return (
      <section className="ai-analysis-panel">
        <p className="eyebrow">AI Analysis</p>
        <h2>Waiting for image</h2>
        <p className="panel-description">
          Upload and analyze an image to see detected vibe, confidence scores,
          and recommendation signals.
        </p>
      </section>
    );
  }

  return (
    <section className="ai-analysis-panel">
      <div className="ai-panel-header">
        <div>
          <p className="eyebrow">AI Analysis</p>
          <h2>{isMultivibe ? "Multivibe Detected" : "Single Vibe Detected"}</h2>
        </div>

        <span className={`ai-status-pill ${isMultivibe ? "multi" : "single"}`}>
          {isMultivibe ? "Hybrid Mood" : "Dominant Mood"}
        </span>
      </div>

      <p className="panel-description">
        {isMultivibe
          ? "The image contains more than one close visual mood, so recommendations combine multiple vibe pools."
          : "One vibe clearly dominates the image, so recommendations focus on the strongest detected mood."}
      </p>

      <div className="detected-vibe-list">
        {moods.map((mood) => (
          <span key={mood}>{mood}</span>
        ))}
      </div>

      <div className="confidence-section">
        <h3>Confidence Scores</h3>

        {confidenceScores.length > 0 ? (
          <div className="confidence-list">
            {confidenceScores.slice(0, 5).map((item) => (
              <div className="confidence-row" key={item.raw_vibe}>
                <div className="confidence-row-top">
                  <span>{item.vibe}</span>
                  <strong>{formatConfidenceScore(item.score)}</strong>
                </div>

                <div className="confidence-bar">
                  <div
                    style={{
                      width: `${Math.min(item.score * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-text">
            Confidence scores are not available from the backend response.
          </p>
        )}
      </div>
    </section>
  );
}

export default AIAnalysisPanel;