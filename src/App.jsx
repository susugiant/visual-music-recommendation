import { useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";
import CreativePreview from "./components/CreativePreview";
import SongSelectorPanel from "./components/SongSelectorPanel";
import EditorToolbar from "./components/EditorToolbar";
import { getImageRecommendations } from "./services/recommendationApi";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [overlayText, setOverlayText] = useState("golden hour memories");
  const [selectedEmoji, setSelectedEmoji] = useState("✨");
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
    setSelectedSong(null);
    setErrorMessage("");
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setErrorMessage("Please choose an image first.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSelectedSong(null);
    setErrorMessage("");

    try {
      const recommendationResult = await getImageRecommendations(selectedFile);

      setResult(recommendationResult);
      setSelectedSong(recommendationResult.recommendations?.[0] || null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to analyze this image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleClearOverlay() {
    setOverlayText("");
    setSelectedEmoji("");
  }

  const analysis = result?.analysis;
  const songs = result?.recommendations || [];

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Visual Music Recommendation</p>
          <h1>AI Social Music Editor</h1>
        </div>

        <p>
          Upload an image, get mood-matched songs, choose a track, and preview
          your post like a mini TikTok or Instagram editor.
        </p>
      </header>

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

      {!imagePreview && !isAnalyzing && (
        <section className="empty-state">
          <h2>Start with an image</h2>
          <p>
            Upload a photo first. The editor preview will appear after the image
            is analyzed.
          </p>
        </section>
      )}

      {imagePreview && (
        <section className="creator-studio">
          <EditorToolbar
            analysis={analysis}
            overlayText={overlayText}
            onOverlayTextChange={setOverlayText}
            selectedEmoji={selectedEmoji}
            onEmojiChange={setSelectedEmoji}
            onClearOverlay={handleClearOverlay}
          />

          <CreativePreview
            imagePreview={imagePreview}
            selectedSong={selectedSong}
            analysis={analysis}
            overlayText={overlayText}
            selectedEmoji={selectedEmoji}
          />

          <SongSelectorPanel
            songs={songs}
            selectedSong={selectedSong}
            onSelectSong={setSelectedSong}
          />
        </section>
      )}
    </main>
  );
}

export default App;