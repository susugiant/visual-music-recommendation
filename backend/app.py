from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil

app = FastAPI()

# --- CORS CONFIGURATION ---
# This allows your React/Vite frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default local port
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (POST, GET, etc.)
    allow_headers=["*"], # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "AI Backend is running!"}

@app.post("/upload/")
async def process_image(file: UploadFile = File(...)):
    # Dummy logic to test the connection before adding the AI
    return {
        "detected_vibe": "chill",
        "recommendations": [
            {"title": "Dummy Song 1", "artist": "Artist A"},
            {"title": "Dummy Song 2", "artist": "Artist B"}
        ]
    }