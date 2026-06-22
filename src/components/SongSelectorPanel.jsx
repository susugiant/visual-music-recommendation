import { formatMatchAccuracy } from "../utils/formatters";

function SongSelectorPanel({ songs, selectedSong, onSelectSong }) {
  if (!songs || songs.length === 0) {
    return (
      <section className="song-selector-panel">
        <p className="eyebrow">Songs</p>
        <h2>No songs yet</h2>
        <p className="panel-description">
          Analyze an image to get song recommendations.
        </p>
      </section>
    );
  }

  return (
    <section className="song-selector-panel">
      <div className="panel-header">
        <p className="eyebrow">Music Options</p>
        <h2>Change Song</h2>
        <p className="panel-description">
          Pick a track and the preview will update instantly.
        </p>
      </div>

      <div className="selector-song-list">
        {songs.map((song) => {
          const isSelected = selectedSong?.song_id === song.song_id;

          return (
            <button
              className={`selector-song-card ${isSelected ? "selected" : ""}`}
              key={song.song_id}
              onClick={() => onSelectSong(song)}
              type="button"
            >
              <img
                src={song.cover_image_url}
                alt={`${song.title} cover`}
              />

              <div className="selector-song-info">
                <strong>{song.title}</strong>
                <span>{song.artist}</span>
                <small>{formatMatchAccuracy(song.match_accuracy)} match</small>
              </div>

              <span className="use-song-label">
                {isSelected ? "Using" : "Use"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SongSelectorPanel;