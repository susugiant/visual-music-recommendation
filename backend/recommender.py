import os
import pandas as pd

# Define the absolute path to the CSV file inside backend/data/
CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "spotify_songs.csv")

def get_song_recommendations(predicted_vibe: str, top_k: int = 5):
    """
    Loads the Spotify CSV dataset, filters songs based on the predicted vibe string,
    and returns a randomized list of matching tracks for the 're-roll' feature.
    """
    # 1. Fallback / Guardrail: What if the dataset group hasn't finished the CSV yet?
    if not os.path.exists(CSV_PATH):
        print(f"⚠️ Warning: Dataset file not found at {CSV_PATH}. Returning dummy mock data.")
        return [
            {"title": f"Mock Track 1 ({predicted_vibe} vibe)", "artist": "AI Engine", "url": "https://spotify.com"},
            {"title": f"Mock Track 2 ({predicted_vibe} vibe)", "artist": "AI Engine", "url": "https://spotify.com"},
            {"title": f"Mock Track 3 ({predicted_vibe} vibe)", "artist": "AI Engine", "url": "https://spotify.com"},
        ]

    try:
        # 2. Load the CSV file into a Pandas DataFrame
        df = pd.read_csv(CSV_PATH)

        # 3. Filter rows where the vibe_category matches the CLIP model prediction
        # .str.lower() prevents case-sensitivity bugs
        matched_songs = df[df['vibe_category'].str.lower() == predicted_vibe.lower()]

        # 4. Handle edge-case: If no songs are found for a specific vibe category
        if matched_songs.empty:
            print(f"⚠️ No songs found matching the category: '{predicted_vibe}' in the database.")
            return []

        # 5. Shuffle and select tracks to support the TikTok "re-roll" mechanism
        # If there are fewer available songs than top_k, grab whatever is available
        sample_size = min(len(matched_songs), top_k)
        random_selection = matched_songs.sample(n=sample_size)

        # 6. Convert the Pandas dataframe rows into a clean JSON-friendly Python list of dicts
        songs_list = random_selection[['title', 'artist', 'spotify_url']].to_dict(orient='records')
        return songs_list

    except Exception as e:
        print(f"🔴 Error reading or processing the song database: {str(e)}")
        return []