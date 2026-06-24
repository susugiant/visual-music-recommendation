import os
import pandas as pd
from collections import Counter

# File paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
INPUT_CSV = os.path.join(DATA_DIR, "manual_labels.csv")
OUTPUT_CSV = os.path.join(DATA_DIR, "ground_truth.csv")

def calculate_majority(row):
    # Gather the 3 votes, cleaning up any accidental whitespaces
    votes = [str(row['annotator_1']).strip().lower(),
             str(row['annotator_2']).strip().lower(),
             str(row['annotator_3']).strip().lower()]

    # Count occurrences of each vote
    vote_counts = Counter(votes)

    # Get the most common vote and its frequency
    most_common_vibe, count = vote_counts.most_common(1)[0]

    # If the top vote only appears once, it means all 3 people voted differently (a 3-way tie)
    if count == 1:
        return "DISCARD_TIE"

    return most_common_vibe

def main():
    if not os.path.exists(INPUT_CSV):
        print(f"🔴 Error: Could not find {INPUT_CSV}. Please download your Google Sheet as a CSV first!")
        return

    # Load the team's manual entries
    df = pd.read_csv(INPUT_CSV)

    print("🤖 Computing majority votes for the dataset..."dafasdf
    # Apply our voting rule across every row
    df['ground_truth_vibe'] = df.apply(calculate_majority, axis=1)

    # Check if there are any chaotic ties we need to throw away
    tie_count = len(df[df['ground_truth_vibe'] == "DISCARD_TIE"])
    if tie_count > 0:
        print(f"⚠️ Warning: Found {tie_count} images with complete disagreements. You should replace these!")

    # Save a clean dataset that only contains the file name and the verified label
    final_df = df[df['ground_truth_vibe'] != "DISCARD_TIE"][['image_filename', 'ground_truth_vibe']]
    final_df.to_csv(OUTPUT_CSV, index=False)

    print(f"🎉 Success! Finalized ground truth dataset saved to {OUTPUT_CSV}")
    print(f"📊 Valid labeled images remaining: {len(final_df)} / {len(df)}")

if __name__ == "__main__":
    main()