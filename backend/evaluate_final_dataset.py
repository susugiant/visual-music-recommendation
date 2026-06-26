import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from vibe_engine import predict_image_vibe

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CSV_PATH = os.path.join(DATA_DIR, "ground_truth.csv")
MATRIX_OUTPUT_PATH = os.path.join(DATA_DIR, "confusion_matrix.png")

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

    # 📊 1. Initialize arrays to track actual labels vs AI guesses
    y_true = []
    y_pred = []

    print("🤖 STARTING CUSTOM DATASET ACCURACY TEST...")
    print("---------------------------------------------------------")

    for index, row in df.iterrows():
        folder_col = row['Folder']
        number_col = row['Number']
        final_vibe = str(row['Final']).strip()

        # Skip the voting ties flagged by your dataset squad
        if final_vibe == "DISCARD_TIE" or pd.isna(row['Final']):
            skipped_ties += 1
            continue

        # Find the image file path string directly
        image_path = find_image_path(folder_col, number_col)

        if not image_path:
            print(f"⚠️ Warning: Could not find image file for folder [{folder_col}] number [{number_col}]. Skipping.")
            continue

        try:
            total_evaluated += 1

            # Pass the image_path string directly to your engine
            # and unpack its true tuple return format cleanly
            _, vibe_scores = predict_image_vibe(image_path)

            if not vibe_scores:
                total_evaluated -= 1
                continue

            # Extract the highest prediction string from your engine dictionary keys
            ai_prediction = max(vibe_scores, key=vibe_scores.get).lower().strip()
            clean_human_vibe = final_vibe.lower().strip()

            # 📊 2. Store coordinates for the matrix mapping
            y_true.append(clean_human_vibe)
            y_pred.append(ai_prediction)

            # Compare the AI's top guess against the 'Final' consensus label
            if ai_prediction == clean_human_vibe:
                correct_predictions += 1
                print(f"✅ Folder: {folder_col} | Img: {number_col} -> AI Matched Human ({ai_prediction})")
            else:
                print(f"❌ Folder: {folder_col} | Img: {number_col} -> AI guessed '{ai_prediction}', Human column said '{clean_human_vibe}'")

        except Exception as e:
            print(f"💥 Error evaluating image row {index}: {str(e)}")
            total_evaluated -= 1

    # Compile the metric summary for your presentation slides
    print("\n---------------------------------------------------------")
    print("📊 LIVE ACCURACY TESTING REPORT COMPLETE!")
    print(f"➖ Total Discarded Ties (Skipped): {skipped_ties}")

    if total_evaluated > 0:
        final_accuracy = (correct_predictions / total_evaluated) * 100
        print(f"🎯 Clean Images Evaluated: {total_evaluated}")
        print(f"✨ Correct AI Classifications: {correct_predictions}")
        print(f"🏆 FINAL PRESENTATION GRADE ACCURACY: {final_accuracy:.2f}%")

        # 📊 3. AUTOMATED VISUAL HEATMAP CONFIGURATION
        print("\n🎨 Generating professional confusion matrix heatmap...")

        # Pull clean categorical string elements dynamically
        labels = sorted(list(set(y_true + y_pred)))

        # Execute mathematical grid positioning
        cm = confusion_matrix(y_true, y_pred, labels=labels)

        # Render the canvas framework
        plt.figure(figsize=(10, 8))
        sns.set_theme(style="darkgrid")

        sns.heatmap(
            cm,
            annot=True,
            fmt='d',
            cmap='Blues',
            xticklabels=labels,
            yticklabels=labels,
            cbar=True,
            square=True
        )

        # Customize aesthetic typography axes
        plt.title('CLIP Model Aesthetic Confusion Matrix Across 7 Core Vibes', fontsize=14, pad=15)
        plt.ylabel('Actual Human Consensus Label', fontsize=12)
        plt.xlabel('AI Predicted Label Guess', fontsize=12)
        plt.xticks(rotation=45, ha='right')
        plt.yticks(rotation=0)
        plt.tight_layout()

        # Save output image
        plt.savefig(MATRIX_OUTPUT_PATH, dpi=300)
        plt.close()
        print(f"💾 Success! Confusion matrix chart graphic saved to: {MATRIX_OUTPUT_PATH}")

    else:
        print("❌ No valid image files were successfully evaluated. Check directory connections.")

if __name__ == "__main__":
    main()