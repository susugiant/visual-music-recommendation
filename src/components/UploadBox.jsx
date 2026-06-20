function UploadBox({ imagePreview, onImageChange, onAnalyze, isAnalyzing }) {
  return (
    <section className="upload-card">
      <div className="upload-content">
        <p className="eyebrow">Upload Image</p>
        <h1>Find songs that match your visual mood</h1>
        <p className="subtitle">
          Choose an image, preview it, then let the system recommend music based
          on detected mood and color palette.
        </p>

        <label className="file-label">
          <input type="file" accept="image/*" onChange={onImageChange} />
          <span>Choose Image</span>
        </label>

        {imagePreview && (
          <button
            className="analyze-button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        )}
      </div>

      <div className="preview-panel">
        {imagePreview ? (
          <img src={imagePreview} alt="Uploaded preview" />
        ) : (
          <div className="empty-preview">
            <span>Image preview will appear here</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadBox;