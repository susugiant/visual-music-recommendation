import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

# 1. Initialize the pre-trained CLIP model and processor from Hugging Face
MODEL_ID = "openai/clip-vit-base-patch32"
print("Initializing CLIP Model (this may take a minute on the first run)...")
processor = CLIPProcessor.from_pretrained(MODEL_ID)
model = CLIPModel.from_pretrained(MODEL_ID)
print("CLIP Model loaded successfully!")

# 2. Define the explicit textual prompts for our 7 social media aesthetics
VIBE_PROMPTS = [
    "a chill lofi aesthetic photo",
    "a hype energetic aesthetic photo",
    "a melancholic sad aesthetic photo",
    "a romantic in love aesthetic photo",
    "a cinematic epic aesthetic photo",
    "a soft gentle aesthetic photo",
    "an edgy individualistic aesthetic photo"
]

# 3. Clean mapping to translate the raw prompts into short frontend labels
PROMPT_TO_VIBE = {
    "a chill lofi aesthetic photo": "chill/lofi",
    "a hype energetic aesthetic photo": "hype/energetic",
    "a melancholic sad aesthetic photo": "melancholic",
    "a romantic in love aesthetic photo": "romantic",
    "a cinematic epic aesthetic photo": "cinematic/epic",
    "a soft gentle aesthetic photo": "soft",
    "an edgy individualistic aesthetic photo": "edgy/individualistic"
}

def predict_image_vibe(image_path: str):
    """
    Takes an image path, runs zero-shot classification via CLIP,
    and returns the highest scoring vibe along with all confidence scores.
    """
    try:
        # Load the image using PIL
        image = Image.open(image_path)

        # Preprocess the image and text prompts for the model
        inputs = processor(text=VIBE_PROMPTS, images=image, return_tensors="pt", padding=True)

        # Run forward pass through CLIP (disable gradients to save memory/speed)
        with torch.no_grad():
            outputs = model(**inputs)

        # Extract the relationship logits and compute softmax probabilities
        logits_per_image = outputs.logits_per_image
        probabilities = logits_per_image.softmax(dim=1).squeeze().tolist()

        # Map raw prompts to their mathematical scores
        raw_scores = dict(zip(VIBE_PROMPTS, probabilities))

        # Translate keys to our clean short labels
        clean_vibe_scores = {PROMPT_TO_VIBE[prompt]: score for prompt, score in raw_scores.items()}

        # Determine the winner based on the maximum probability score
        winning_vibe = max(clean_vibe_scores, key=clean_vibe_scores.get)

        return winning_vibe, clean_vibe_scores

    except Exception as e:
        print(f"Error processing image {image_path}: {str(e)}")
        return None, {}