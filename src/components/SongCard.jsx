import { formatMatchAccuracy } from "../utils/formatters";

function SongCard({ song }) {
  return (
    <article className="song-card">
      <img
        className="song-cover"
        src={song.cover_image_url}
        alt={`${song.title} cover`}
      />

      <div className="song-content">
        <div>
          <p className="song-label">Recommended Song</p>
          <h3>{song.title}</h3>
          <p className="artist">{song.artist}</p>
        </div>

        <div className="match-box">
          <span>Match Accuracy</span>
          <strong>{formatMatchAccuracy(song.match_accuracy)}</strong>
        </div>

        <audio controls src={song.audio_preview_url}>
          Your browser does not support the audio element.
        </audio>
      </div>
    </article>
  );
}

export default SongCard;