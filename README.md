# **Visual Content-Based Music Recommendation**



## Team members

|Name (Student ID)|Role|
|--|--|
|**Mai Huynh Minh Thu** (104240759)|Main Researcher/AI model|
|**Nguyen Hoang Gia An** (104240384)|Frontend|
|**Nguyen Ngoc Minh Vy** (104240475)|Frontend|
|**Nguyen Bao Tran** (104240291)|Data + Evaluation|
|**Tran Gia Linh** (104240762)|Data + Evaluation|
|**Ha Ngoc Bao Tram** (104240468)|Data + Evaluation|


---

## Project structure

```text
├── backend/                        # FastAPI Backend
│   ├── app.py                      # API server and Margin-Gap logic
│   ├── vibe_engine.py              # CLIP model inference
│   ├── recommender.py              # Song database lookup
│   ├── aggregate_labels.py         # Merges human labels using majority vote
│   ├── evaluate_final_dataset.py   # Test script to get accuracy and confusion matrix
│   ├── build_dataset.py            # Queries Spotify API search to build local song pool
│   ├── analyze_distribution.py     # Generates dataset distribution bar charts
│   ├── requirements.txt            # Python packages
│   └── data/                       # Dataset folder
│       ├── manual_labels.csv       # Raw votes from Vy, Trâm, Linh
│       ├── ground_truth.csv        # Final clean labels
│       ├── confusion_matrix.png    # Output heatmap chart
│       ├── spotify_songs.csv       # Spotify songs data
│       └── [vibe_folders]/         # 1,241 test images across 7 categories
│
├── src/                            # React Frontend
│   ├── components/
│   ├── services/
│   │   └── recommendationApi.js # Calls backend + handles iTunes backup audio
│   └── package.json

```

# **1. Backend setup**

```
cd backend
python -m venv venv

# Activate venv (Windows)
venv\Scripts\activate
# Activate venv (Mac/Linux)
source venv/bin/activate

pip install fastapi uvicorn torch transformers pillow pandas scikit-learn seaborn matplotlib
```

Start the backend server
```
uvicorn app:app --reload
```

# **2. Frontend setup**

```
cd frontend
npm install
npm run dev
```

Run evaluation
```
cd backend
python evaluate_final_dataset.py
```