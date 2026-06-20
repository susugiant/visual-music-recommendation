import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import the core logic you built in the previous steps
from vibe_engine import predict_image_vibe
from recommender import get_song_recommendations

app = FastAPI(
    title="Visual Music Recommender API",
    description="FastAPI backend combining CLIP zero-shot vision and Spotify song filtering.",
    version="1.0"
)

# --- CORS CONFIGURATION ---
# This permits your React/Vite frontend (running on port 5173) to securely communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers
)

# Ensure a temporary directory exists to hold uploaded images while processing
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
def read_root():
    """Simple health check endpoint."""
    return {"status": "healthy", "message": "Visual Music Recommender AI Backend is fully running!"}


@app.post("/api/recommend")
async def recommend_music_from_image(file: UploadFile = File(...)):
    """
    Main endpoint for the React Frontend.
    Accepts an uploaded image file, extracts the vibe using CLIP,
    queries the Spotify database, and returns the tracklist.
    """
    # 1. Guardrail: Validate file extension type
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid image format. Please upload a JPG, PNG, or WebP.")

    # 2. Save the uploaded file temporarily so PIL can process it from a path
    temp_file_path = os.path.join(TEMP_DIR, f"upload_{file.filename}")
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3. Fire up your CLIP AI pipeline
        winning_vibe, confidence_scores = predict_image_vibe(temp_file_path)

        if not winning_vibe:
            raise HTTPException(status_code=500, detail="AI engine failed to analyze the image.")

        # 4. Fire up your Spotify recommender system
        # top_k=5 gives them 5 songs to display. They can call this again to "re-roll"
        recommended_tracks = get_song_recommendations(winning_vibe, top_k=5)

        # 5. Send the clean payload back to the React UI team
        return {
            "success": True,
            "vibe": winning_vibe,
            "confidence_scores": confidence_scores,
            "tracks": recommended_tracks
        }

    except Exception as e:
        print(f"🔴 Critical server error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while parsing request.")

    finally:
        # 6. Cleanup: Always delete the temporary image file so your server doesn't run out of storage
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)