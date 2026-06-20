from vibe_engine import predict_image_vibe
from recommender import get_song_recommendations
import json

# Replace with whatever test image you dropped in
IMAGE_FILE = "test.jpg"

print("==== 1. RUNNING COMPUTER VISION ENGINE ====")
winner, all_scores = predict_image_vibe(IMAGE_FILE)

print("\n📊 Full Confidence Breakdown:")
print(json.dumps(all_scores, indent=4))

print(f"🏆 DETECTED VIBE: {winner.upper()}")

print("\n==== 2. RUNNING MUSIC RECOMMENDATION SYSTEM ====")
recommended_songs = get_song_recommendations(winner, top_k=3)

print("\n🎵 MATCHED TRACKS SENT TO FRONTEND UI:")
print(json.dumps(recommended_songs, indent=4))