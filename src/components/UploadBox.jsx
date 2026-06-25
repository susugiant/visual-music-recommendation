function UploadBox({
  imagePreview,
  imageInfo,
  onImageChange,
  onAnalyze,
  isAnalyzing
}) {
  return (
    <section className="upload-card">
      <div className="upload-content">
        <p className="eyebrow">Step 1</p>
        <h2>Upload your visual</h2>
        <p className="subtitle">
          Choose an image and let the AI model analyze visual mood, color, and
          atmosphere before matching it with music.
        </p>

        <div className="upload-actions">
          <label className="file-label">
            <input type="file" accept="image/*" onChange={onImageChange} />
            <span>{imagePreview ? "Change Image" : "Choose Image"}</span>
          </label>

          <button
            className="analyze-button"
            onClick={onAnalyze}
            disabled={!imagePreview || isAnalyzing}
            type="button"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>
      </div>

      <div
        className={`upload-preview-mini ${
          imageInfo?.height > imageInfo?.width ? "portrait-preview" : "landscape-preview"
        }`}
      >
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Uploaded preview" />

            {imageInfo && (
              <div className="image-info-badge">
                {imageInfo.width} × {imageInfo.height}
              </div>
            )}
          </>
        ) : (
          <span>No image selected</span>
        )}
      </div>
    </section>
  );
}

export default UploadBox;