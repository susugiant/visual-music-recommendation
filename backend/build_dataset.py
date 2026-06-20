import os
import pandas as pd
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# 1. Load environment keys from your .env file
load_dotenv()

# 2. Authenticate with Spotify
auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)

# 3. This dictionary represents the playlist links your Dataset squad is collecting.
# Replace these placeholder links with real Spotify playlist links!
PLAYLIST_MAP = {
    "chill/lofi": [
        "https://open.spotify.com/playlist/37i9dQZF1DX8Ueb7vEAqPV" # Example: Lofi Beats
    ],
    "hype/energetic": [
        "https://open.spotify.com/playlist/37i9dQZF1DX76t638V6eg8" # Example: RapCaviar
    ],
    "melancholic": [
        "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma56Gj6" # Example: Sad Songs
    ],
    "romantic": [
        "https://open.spotify.com/playlist/37i9dQZF1DX72D65vPM9gM"
    ],
    "cinematic": [
        "https://open.spotify.com/playlist/37i9dQZF1DX1tz9O4Xv0h3"
    ],
    "soft": [
        "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO"
    ],
    "edgy": [
        "https://open.spotify.com/playlist/37i9dQZF1DX3LDZC0GxI07"
    ]
}

def extract_playlist_tracks(vibe, playlist_url):
    print(f"Parsing '{vibe}' playlist...")
    all_tracks_data = []

    try:
        # Extract tracks from playlist (handles up to 100 tracks per playlist)
        results = sp.playlist_tracks(playlist_url)
        items = results['items']

        # Batch extract track IDs for rapid audio feature extraction
        track_ids = []
        metadata_map = {}

        for item in items:
            track = item['track']
            if not track: continue

            t_id = track['id']
            track_ids.append(t_id)
            metadata_map[t_id] = {
                "track_id": t_id,
                "title": track['name'],
                "artist": track['artists'][0]['name'],
                "vibe_category": vibe,
                "spotify_url": track['external_urls']['spotify']
            }

        # Call Spotify API audio features endpoint in a single batch request
        # This gives us energy, valence, tempo, and instrumentalness instantly
        features_list = sp.audio_features(track_ids)

        for features in features_list:
            if features is None: continue
            t_id = features['id']

            # Merge track metadata with its numerical audio features
            full_data = metadata_map[t_id]
            full_data.update({
                "energy": features['energy'],
                "valence": features['valence'],
                "tempo": features['tempo'],
                "instrumentalness": features['instrumentalness']
            })
            all_tracks_data.append(full_data)

    except Exception as e:
        print(f"Error reading playlist {playlist_url}: {str(e)}")

    return all_tracks_data

if __name__ == "__main__":
    master_song_pool = []

    # Iterate through every category and build the dataset rows
    for vibe, urls in PLAYLIST_MAP.items():
        for url in urls:
            tracks = extract_playlist_tracks(vibe, url)
            master_song_pool.extend(tracks)

    # Convert our master list to a Pandas DataFrame
    df = pd.DataFrame(master_song_pool)

    # Save directly to the destination folder expected by recommender.py
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "spotify_songs.csv")

    df.to_csv(output_path, index=False)
    print(f"\n🎉 Success! Compiled database containing {len(df)} tracks saved directly to {output_path}")