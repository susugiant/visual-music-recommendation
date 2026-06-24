import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "spotify_songs.csv")

def get_song_recommendations(vibe_category: str, top_k: int = 5):
    """Queries the local compiled Spotify database and pulls matching songs."""
    print(f"📖 Recommender looking up songs for vibe: '{vibe_category}'")

    # 1. Guardrail: Check if the CSV dataset actually exists
    if not os.path.exists(CSV_PATH):
        print("⚠️ Warning: spotify_songs.csv not found! Falling back to emergency mock data.")
        return [{"title": f"Mock Track {i}", "artist": "AI Engine", "spotify_url": "#"} for i in range(top_k)]

    # 2. Read the dataset using pandas
    df = pd.read_csv(CSV_PATH)

    # 3. Filter rows matching the predicted AI vibe
    filtered_df = df[df['vibe_category'] == vibe_category]

    # 4. Handle edge case where a vibe has no songs
    if filtered_df.empty:
        print(f"⚠️ No songs found in database for vibe '{vibe_category}'. Pulling random entries.")
        filtered_df = df

    # 5. Take a random sample of top_k tracks so users get a fresh 're-roll' experience every time
    sample_size = min(top_k, len(filtered_df))
    sampled_tracks = filtered_df.sample(n=sample_size)

    # 6. Format the dataframe rows into a clean list of dictionaries for the FastAPI JSON response
    tracks_payload = []
    for _, row in sampled_tracks.iterrows():
        tracks_payload.append({
            "title": row['title'],
            "artist": row['artist'],
            "spotify_url": row['spotify_url']
        })

    return tracks_payload