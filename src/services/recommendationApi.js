const API_BASE_URL = "http://localhost:8000";

async function fetchSongPreview(title, artist) {
  try {
    const searchQuery = encodeURIComponent(`${title} ${artist}`);
    const url = `https://itunes.apple.com/search?term=${searchQuery}&entity=song&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      return {
        previewUrl: "",
        artworkUrl: ""
      };
    }

    const data = await response.json();
    const firstResult = data.results?.[0];

    return {
      previewUrl: firstResult?.previewUrl || "",
      artworkUrl:
        firstResult?.artworkUrl100?.replace("100x100bb", "400x400bb") || ""
    };
  } catch (error) {
    console.error(`Preview lookup failed for ${title}:`, error);

    return {
      previewUrl: "",
      artworkUrl: ""
    };
  }
}

function formatVibeLabel(vibe) {
  if (!vibe || typeof vibe !== "string") {
    return "Unknown";
  }

  return vibe
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeConfidenceScores(confidenceScores) {
  if (!confidenceScores || typeof confidenceScores !== "object") {
    return [];
  }

  return Object.entries(confidenceScores)
    .map(([vibe, score]) => ({
      raw_vibe: vibe,
      vibe: formatVibeLabel(vibe),
      score: typeof score === "number" ? score : Number(score) || 0
    }))
    .sort((a, b) => b.score - a.score);
}

function createFallbackSongId(track, index) {
  const title = track.title || "unknown-title";
  const artist = track.artist || "unknown-artist";

  return `${title}-${artist}-${index}`;
}

function normalizeMatchAccuracy(track, index) {
  const rawScore = track.match_score ?? track.match_accuracy;

  if (typeof rawScore === "number") {
    return Math.min(Math.max(rawScore, 0), 1);
  }

  return Math.max(0.98 - index * 0.03, 0.7);
}

export async function getImageRecommendations(imageFile) {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`${API_BASE_URL}/api/recommend`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const liveData = await response.json();

    console.log("Backend raw response:", liveData);

    const rawVibes =
      liveData.vibes || (liveData.vibe ? [liveData.vibe] : ["Unknown"]);

    const confidenceList = normalizeConfidenceScores(
      liveData.confidence_scores
    );

    const detectedMoods = rawVibes.map(formatVibeLabel);

    const mappedRecommendations = await Promise.all(
      (liveData.tracks || []).map(async (track, index) => {
        const songPreview = await fetchSongPreview(track.title, track.artist);

        return {
          song_id:
            track.track_id ||
            track.song_id ||
            createFallbackSongId(track, index),

          title: track.title || "Unknown Title",
          artist: track.artist || "Unknown Artist",

          spotify_url: track.spotify_url || "",

          cover_image_url:
            track.cover_image_url ||
            songPreview.artworkUrl ||
            "https://placehold.co/400x400/191414/FFFFFF?text=No+Cover",

          audio_preview_url:
            track.audio_preview_url ||
            track.preview_url ||
            songPreview.previewUrl ||
            "",

          match_accuracy: normalizeMatchAccuracy(track, index)
        };
      })
    );

    console.log("Mapped recommendations:", mappedRecommendations);

    return {
      status: liveData.success ? "success" : "error",
      analysis: {
        detected_mood: detectedMoods,
        color_palette: ["#1DB954", "#191414", "#212121"],

        // Extra frontend analysis fields.
        // These do not break the old API contract.
        is_multivibe: rawVibes.length > 1,
        confidence_scores: confidenceList,
        primary_vibe: detectedMoods[0] || "Unknown",
        secondary_vibe: detectedMoods[1] || null
      },
      recommendations: mappedRecommendations
    };
  } catch (error) {
    console.error("Live AI connection failed:", error);
    throw error;
  }
}