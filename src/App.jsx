import { useState } from "react";
import "./App.css";
import mockRecommendation from "./data/mockRecommendation";
import UploadBox from "./components/UploadBox";
import AnalysisPanel from "./components/AnalysisPanel";
import RecommendationList from "./components/RecommendationList";

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setResult(null);
  }

  function handleAnalyze() {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setResult(mockRecommendation);
      setIsAnalyzing(false);
    }, 1200);
  }

  return (
    <main className="app">
      <UploadBox
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {isAnalyzing && (
        <section className="loading-card">
          <div className="loader"></div>
          <p>Analyzing image mood and finding matching songs...</p>
        </section>
      )}

      {!imagePreview && (
        <section className="empty-state">
          <h2>Start with an image</h2>
          <p>
            Upload a photo first. The result section will appear after the image
            is analyzed.
          </p>
        </section>
      )}

      {result?.status === "success" && (
        <section className="result-layout">
          <AnalysisPanel analysis={result.analysis} />
          <RecommendationList songs={result.recommendations} />
        </section>
      )}
    </main>
  );
}

export default App;