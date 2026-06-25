import os
import shutil
import random
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    Accepts an uploaded image file, computes multi-vibe classification,
    queries the local track pools, and returns a tailored playlist.
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

        if not winning_vibe or not confidence_scores:
            raise HTTPException(status_code=500, detail="AI engine failed to analyze the image.")

        # 4. 🧠 MULTI-VIBE LOGIC: Sort categories from highest to lowest score
        sorted_vibes = sorted(confidence_scores.items(), key=lambda item: item[1], reverse=True)

        primary_vibe, primary_score = sorted_vibes[0]
        secondary_vibe, secondary_score = sorted_vibes[1]

        primary_score = float(primary_score)
        secondary_score = float(secondary_score)

        recommended_tracks = []
        top_vibes = []

        # Margin rule: Is second place close enough to count as a runner-up?
        VIBE_GAP_THRESHOLD = 0.15
        actual_gap = primary_score - secondary_score

        # Case A: Close Race -> Trigger Hybrid Multi-Vibe state
        if actual_gap <= VIBE_GAP_THRESHOLD:
            print(f"🌟 Multi-Vibe triggered! Gap is {actual_gap:.3f} between {primary_vibe} and {secondary_vibe}")
            top_vibes = [primary_vibe, secondary_vibe]

            # Fetch 3 tracks from primary and 2 tracks from secondary to make a total of 5
            primary_tracks = get_song_recommendations(primary_vibe, top_k=3)
            secondary_tracks = get_song_recommendations(secondary_vibe, top_k=2)

            # Inject matching accuracy attributes into the dictionary blocks
            for track in primary_tracks:
                track["match_score"] = primary_score
            for track in secondary_tracks:
                track["match_score"] = secondary_score

            recommended_tracks.extend(primary_tracks)
            recommended_tracks.extend(secondary_tracks)
            random.shuffle(recommended_tracks) # Mix them cleanly

        # Case B: Blowout Win -> Single vibe dominates completely
        else:
            print(f"🎯 Single Vibe Dominates! Gap is {actual_gap:.3f}. Winner: {primary_vibe}")
            top_vibes = [primary_vibe]

            # Maximize diversity by grabbing all 5 tracks from the winning class pool
            primary_tracks = get_song_recommendations(primary_vibe, top_k=5)
            for track in primary_tracks:
                track["match_score"] = primary_score

            recommended_tracks.extend(primary_tracks)

        # 5. Send payload back to the React UI team
        return {
            "success": True,
            "vibe": primary_vibe,               # Kept for single-vibe backwards compatibility
            "vibes": top_vibes,                 # Array containing 1 or 2 items dynamically
            "confidence_scores": confidence_scores,
            "tracks": recommended_tracks
        }

    except Exception as e:
        print(f"🔴 Critical server error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while parsing request.")

    finally:
        # 6. Cleanup: Delete temporary files to safeguard storage limits
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)