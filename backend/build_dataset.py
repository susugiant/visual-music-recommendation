import os
import pandas as pd
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# 1. Load environment keys from your absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# 2. Authenticate with Spotify
auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)

# 3. Algorithmic Search Seeds
# We use targeted search terms and genre strings to pull exact vibes safely
VIBE_SEARCH_SEEDS = {
    "chill/lofi": ["genre:lofi", "lofi chill beats", "chill hop study"],
    "hype/energetic": ["genre:edm", "hype rap workout", "energetic dance hits"],
    "melancholic": ["sad indie acoustic", "melancholic piano", "gloomy slow songs"],
    "romantic": ["romantic ballads", "love songs r&b", "cozy date night jazz"],
    "cinematic": ["epic movie soundtrack", "cinematic orchestral", "hans zimmer style"],
    "soft": ["soft ambient pop", "gentle acoustic folk", "peaceful sleep sleep"],
    "edgy": ["genre:grunge", "edgy alternative rock", "dark industrial phonk"]
}

def generate_vibe_database(vibe, search_queries):
    print(f"🔍 Searching Spotify catalog for '{vibe}' tracks...")
    collected_tracks = []

    for query in search_queries:
        # We page through results using offsets to get a highly diverse mix of tracks
        for page in range(0, 10):  # 3 pages * 50 tracks = up to 150 unique tracks per seed
            try:
                results = sp.search(q=query, type='track', limit=10, offset=page * 10)
                tracks = results.get('tracks', {}).get('items', [])

                for track in tracks:
                    if track and track.get('id'):
                        collected_tracks.append({
                            "track_id": track['id'],
                            "title": track['name'],
                            "artist": track['artists'][0]['name'],
                            "vibe_category": vibe,
                            "spotify_url": track['external_urls']['spotify']
                        })
            except Exception as e:
                print(f"⚠️ Page lookup skipped for query '{query}': {str(e)}")
                break # Break inner page loop on rate limits

    return collected_tracks

if __name__ == "__main__":
    print("🚀 INITIALIZING PUBLIC CATALOG SEARCH ENGINE (COMPLYING WITH NEW API RESTRICTIONS)...")
    print("---------------------------------------------------------------------------------")

    master_song_pool = []

    # Loop through the 7 aesthetic rules
    for vibe, queries in VIBE_SEARCH_SEEDS.items():
        vibe_songs = generate_vibe_database(vibe, queries)
        master_song_pool.extend(vibe_songs)
        print(f"✅ Successfully compiled {len(vibe_songs)} tracks for '{vibe}'\n")

    if master_song_pool:
        # Convert to Pandas Dataframe
        df = pd.DataFrame(master_song_pool)

        # Remove any duplicates that might have shown up in multiple search lists
        df = df.drop_duplicates(subset=['track_id'])

        # Establish paths and write to disk
        output_dir = os.path.join(BASE_DIR, "data")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "spotify_songs.csv")

        df.to_csv(output_path, index=False)
        print("---------------------------------------------------------------------------------")
        print(f"🎉 Success! Generated a clean dataset containing {len(df)} unique tracks.")
        print(f"💾 File saved directly to: {output_path}")
    else:
        print("\n🔴 Search routing failed. Please verify your internet connection and API keys.")