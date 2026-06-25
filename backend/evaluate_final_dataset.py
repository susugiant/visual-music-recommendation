import os
import pandas as pd
# 🔑 Connected directly to your exact function name
from vibe_engine import predict_image_vibe

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CSV_PATH = os.path.join(DATA_DIR, "ground_truth.csv")

def find_image_path(folder_val, number_val):
    """
    Matches CSV values like 'cinematic/epic' directly to your physical
    folder names like 'cinematic_epic' inside the data directory.
    """
    clean_folder = str(folder_val).strip().lower().replace("/", "_")
    extensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']

    for ext in extensions:
        test_path = os.path.join(DATA_DIR, clean_folder, f"{number_val}{ext}")
        if os.path.exists(test_path):
            return test_path

    return None

def main():
    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: Cannot find your CSV file at: {CSV_PATH}")
        return

    df = pd.read_csv(CSV_PATH)

    total_evaluated = 0
    correct_predictions = 0
    skipped_ties = 0

    print("🤖 STARTING CUSTOM DATASET ACCURACY TEST...")
    print("---------------------------------------------------------")

    for index, row in df.iterrows():
        folder_col = row['Folder']
        number_col = row['Number']
        final_vibe = str(row['Final']).strip()

        # 1. Skip the voting ties flagged by your dataset squad
        if final_vibe == "DISCARD_TIE" or pd.isna(row['Final']):
            skipped_ties += 1
            continue

        # 2. Find the image file path string directly
        image_path = find_image_path(folder_col, number_col)

        if not image_path:
            print(f"⚠️ Warning: Could not find image file for folder [{folder_col}] number [{number_col}]. Skipping.")
            continue

        try:
            total_evaluated += 1

            # 🌟 FIXED: Pass the image_path string directly to your engine
            # and unpack its true tuple return format cleanly
            _, vibe_scores = predict_image_vibe(image_path)

            if not vibe_scores:
                total_evaluated -= 1
                continue

            # Extract the highest prediction string from your engine dictionary keys
            ai_prediction = max(vibe_scores, key=vibe_scores.get).lower().strip()
            clean_human_vibe = final_vibe.lower().strip()

            # 3. Compare the AI's top guess against the 'Final' consensus label
            if ai_prediction == clean_human_vibe:
                correct_predictions += 1
                print(f"✅ Folder: {folder_col} | Img: {number_col} -> AI Matched Human ({ai_prediction})")
            else:
                print(f"❌ Folder: {folder_col} | Img: {number_col} -> AI guessed '{ai_prediction}', Human column said '{clean_human_vibe}'")

        except Exception as e:
            print(f"💥 Error evaluating image row {index}: {str(e)}")
            total_evaluated -= 1

    # 4. Compile the metric summary for your presentation slides
    print("\n---------------------------------------------------------")
    print("📊 LIVE ACCURACY TESTING REPORT COMPLETE!")
    print(f"➖ Total Discarded Ties (Skipped): {skipped_ties}")

    if total_evaluated > 0:
        final_accuracy = (correct_predictions / total_evaluated) * 100
        print(f"🎯 Clean Images Evaluated: {total_evaluated}")
        print(f"✨ Correct AI Classifications: {correct_predictions}")
        print(f"🏆 FINAL PRESENTATION GRADE ACCURACY: {final_accuracy:.2f}%")
    else:
        print("❌ No valid image files were successfully evaluated. Check directory connections.")

if __name__ == "__main__":
    main()