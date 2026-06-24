import os
import pandas as pd
import matplotlib.pyplot as plt

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SONGS_CSV = os.path.join(BASE_DIR, "data", "spotify_songs.csv")
IMAGES_CSV = os.path.join(BASE_DIR, "data", "ground_truth.csv") # Generated from your Google Sheet

def analyze_dataset(file_path, title, label_column):
    if not os.path.exists(file_path):
        print(f"⚠️ Could not find {os.path.basename(file_path)} yet. Skipping analysis.")
        return

    # Load dataset
    df = pd.read_csv(file_path)

    print(f"\n📊 --- {title} Distribution ---")
    counts = df[label_column].value_counts()
    print(counts)

    # Generate and save a clean bar chart for your report slides
    plt.figure(figsize=(8, 4))
    counts.plot(kind='bar', color=['#1DB954', '#191414', '#4a4e69', '#9a8c98', '#c9ada7'])
    plt.title(f"Distribution of Categories in {title}")
    plt.ylabel("Count")
    plt.xlabel("Vibe Categories")
    plt.xticks(rotation=45)
    plt.tight_layout()

    chart_name = f"{title.lower().replace(' ', '_')}_distribution.png"
    plt.savefig(os.path.join(BASE_DIR, "data", chart_name))
    print(f"💾 Saved distribution chart to: data/{chart_name}")

if __name__ == "__main__":
    print("🤖 RUNNING DESCRIPTIVE DATA AUDIT...")
    analyze_dataset(SONGS_CSV, "Spotify Songs Pool", "vibe_category")
    analyze_dataset(IMAGES_CSV, "Manual Image Dataset", "ground_truth_vibe")