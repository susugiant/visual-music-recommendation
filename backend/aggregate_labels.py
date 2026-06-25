import os
import pandas as pd
from collections import Counter

# File paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
INPUT_CSV = os.path.join(DATA_DIR, "manual_labels.csv")
OUTPUT_CSV = os.path.join(DATA_DIR, "ground_truth.csv")

def calculate_majority(row):
    """
    Gathers the 3 votes exactly based on your columns: Vy, Tram, and Linh.
    """
    votes = [
        str(row['Vy']).strip().lower(),
        str(row['Tram']).strip().lower(),
        str(row['Linh']).strip().lower()
    ]

    # Count occurrences of each vote
    vote_counts = Counter(votes)

    # Get the most common vote and its frequency
    most_common_vibe, count = vote_counts.most_common(1)[0]

    # If the top vote only appears once, it's a 3-way tie
    if count == 1:
        return "DISCARD_TIE"

    return most_common_vibe

def main():
    if not os.path.exists(INPUT_CSV):
        print(f"🔴 Error: Could not find {INPUT_CSV}. Please download your Google Sheet as a CSV first!")
        return

    # Load the team's manual entries
    df = pd.read_csv(INPUT_CSV)

    # Strip any hidden whitespace from column headers to keep mapping clean
    df.columns = df.columns.str.strip()

    print("🤖 Computing majority votes for the dataset...")

    # Apply the voting math to compute the true majority vote
    df['Calculated_Final'] = df.apply(calculate_majority, axis=1)

    # Count up the chaotic voting ties
    tie_count = len(df[df['Calculated_Final'] == "DISCARD_TIE"])
    if tie_count > 0:
        print(f"⚠️ Warning: Found {tie_count} images with complete disagreements. Filtering them out!")

    # Filter out rows that are ties
    clean_df = df[df['Calculated_Final'] != "DISCARD_TIE"].copy()

    # Create the clean dataframe with your exact structural output format
    final_df = clean_df[['Folder', 'Number']].copy()
    final_df['Final'] = clean_df['Calculated_Final']

    # Save to ground_truth.csv
    final_df.to_csv(OUTPUT_CSV, index=False)

    print(f"🎉 Success! Finalized ground truth dataset saved to {OUTPUT_CSV}")
    print(f"📊 Valid labeled images remaining: {len(final_df)} / {len(df)}")

if __name__ == "__main__":
    main()