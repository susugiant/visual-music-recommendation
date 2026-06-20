import { useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";
import AnalysisPanel from "./components/AnalysisPanel";
import RecommendationList from "./components/RecommendationList";
import { getImageRecommendations } from "./services/recommendationApi";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setImagePreview(previewUrl);
    setResult(null);
    setErrorMessage("");
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage("");

    try {
      const recommendationResult = await getImageRecommendations(selectedFile);
      setResult(recommendationResult);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to analyze this image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
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

      {errorMessage && (
        <section className="error-state">
          <h2>Something went wrong</h2>
          <p>{errorMessage}</p>
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