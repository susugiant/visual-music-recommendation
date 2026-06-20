const mockRecommendation = {
  status: "success",
  analysis: {
    detected_mood: ["Chill", "Nostalgic"],
    color_palette: ["#FF5733", "#33FF57", "#2E4057", "#F6C85F"]
  },
  recommendations: [
    {
      song_id: "1A2b3C",
      title: "Cruel Summer",
      artist: "Taylor Swift",
      cover_image_url:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop",
      audio_preview_url:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      match_accuracy: 0.95
    },
    {
      song_id: "4D5e6F",
      title: "Golden Hour",
      artist: "JVKE",
      cover_image_url:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop",
      audio_preview_url:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      match_accuracy: 0.89
    },
    {
      song_id: "7G8h9I",
      title: "Until I Found You",
      artist: "Stephen Sanchez",
      cover_image_url:
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop",
      audio_preview_url:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      match_accuracy: 0.84
    }
  ]
};

export default mockRecommendation;