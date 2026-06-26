import { useRef, useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";
import CreativePreview from "./components/CreativePreview";
import SongSelectorPanel from "./components/SongSelectorPanel";
import EditorToolbar from "./components/EditorToolbar";
import FinalPreviewModal from "./components/FinalPreviewModal";
import AIAnalysisPanel from "./components/AIAnalysisPanel";
import { getImageRecommendations } from "./services/recommendationApi";
import { exportElementAsPng } from "./utils/exportPreview";

function App() {
  const previewRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [overlayText, setOverlayText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("✨");
  const [errorMessage, setErrorMessage] = useState("");

  const [textPosition, setTextPosition] = useState({ x: 50, y: 63 });
  const [emojiPosition, setEmojiPosition] = useState({ x: 72, y: 30 });
  const [textScale, setTextScale] = useState(1);
  const [emojiScale, setEmojiScale] = useState(1);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState("Inter");
  const [textWeight, setTextWeight] = useState("950");
  const [isFinalPreviewOpen, setIsFinalPreviewOpen] = useState(false);

  function resetEditorState() {
    setOverlayText("");
    setSelectedEmoji("✨");
    setTextPosition({ x: 50, y: 63 });
    setEmojiPosition({ x: 72, y: 30 });
    setTextScale(1);
    setEmojiScale(1);
    setTextColor("#ffffff");
    setTextFont("Inter");
    setTextWeight("950");
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const imageElement = new Image();

    imageElement.onload = () => {
      setImageInfo({
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight
      });
    };

    imageElement.src = previewUrl;

    setSelectedFile(file);
    setImagePreview(previewUrl);
    setResult(null);
    setSelectedSong(null);
    setErrorMessage("");
    setIsFinalPreviewOpen(false);
    resetEditorState();
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

  function handleSelectSong(song) {
    setSelectedSong(song);
  }

  async function handleExportPreview() {
    try {
      await exportElementAsPng(previewRef.current, "ai-music-post-preview.png");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Unable to export preview. Please try again or use local images."
      );
    }
  }

  const analysis = result?.analysis;
  const songs = result?.recommendations || [];

  return (
    <main className="app">
      <header className="app-header">
        <div>
          {/* <p className="eyebrow">Visual Music Recommendation</p> */}
          <h1>Visual Music Recommendation</h1>
        </div>

        {/* <p>
          Analyze image mood with AI, inspect confidence scores, then match the
          visual vibe with tracks from the music dataset.
        </p> */}
      </header>

      <UploadBox
        imagePreview={imagePreview}
        imageInfo={imageInfo}
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
            Upload a photo first. The AI analysis and editor preview will appear
            after the image is analyzed.
          </p>
        </section>
      )}

      {imagePreview && (
        <section className="creator-studio">
          <div className="left-studio-stack">
            <AIAnalysisPanel analysis={analysis} isAnalyzing={isAnalyzing} />

            <EditorToolbar
              overlayText={overlayText}
              onOverlayTextChange={setOverlayText}
              selectedEmoji={selectedEmoji}
              onEmojiChange={setSelectedEmoji}
              onClearOverlay={handleClearOverlay}
              textScale={textScale}
              onTextScaleChange={setTextScale}
              emojiScale={emojiScale}
              onEmojiScaleChange={setEmojiScale}
              textColor={textColor}
              onTextColorChange={setTextColor}
              textFont={textFont}
              onTextFontChange={setTextFont}
              textWeight={textWeight}
              onTextWeightChange={setTextWeight}
            />
          </div>

          <CreativePreview
            previewRef={previewRef}
            imagePreview={imagePreview}
            selectedSong={selectedSong}
            analysis={analysis}
            overlayText={overlayText}
            selectedEmoji={selectedEmoji}
            textPosition={textPosition}
            onTextPositionChange={setTextPosition}
            emojiPosition={emojiPosition}
            onEmojiPositionChange={setEmojiPosition}
            textScale={textScale}
            emojiScale={emojiScale}
            textColor={textColor}
            textFont={textFont}
            textWeight={textWeight}
            onOpenFinalPreview={() => setIsFinalPreviewOpen(true)}
            onExportPreview={handleExportPreview}
          />

          <SongSelectorPanel
            songs={songs}
            selectedSong={selectedSong}
            onSelectSong={handleSelectSong}
          />
        </section>
      )}

      <FinalPreviewModal
        isOpen={isFinalPreviewOpen}
        onClose={() => setIsFinalPreviewOpen(false)}
        onExport={handleExportPreview}
        imagePreview={imagePreview}
        selectedSong={selectedSong}
        analysis={analysis}
        overlayText={overlayText}
        selectedEmoji={selectedEmoji}
        textPosition={textPosition}
        emojiPosition={emojiPosition}
        textScale={textScale}
        emojiScale={emojiScale}
        textColor={textColor}
        textFont={textFont}
        textWeight={textWeight}
      />
    </main>
  );
}

export default App;