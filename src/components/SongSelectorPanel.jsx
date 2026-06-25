import { formatMatchAccuracy } from "../utils/formatters";

const LOW_MATCH_THRESHOLD = 0.7;

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
        <p className="eyebrow">Music Dataset</p>
        <h2>Recommended Tracks</h2>
        <p className="panel-description">
          Click a track to select it. The preview audio will play automatically
          when available.
        </p>
      </div>

      <div className="match-warning-note">
        If the match score is low, the selected track may not perfectly match
        the uploaded image mood.
      </div>

      <div className="selector-song-list">
        {songs.map((song) => {
          const isSelected = selectedSong?.song_id === song.song_id;
          const isLowMatch = song.match_accuracy < LOW_MATCH_THRESHOLD;

          return (
            <button
              className={`selector-song-card ${isSelected ? "selected" : ""} ${
                isLowMatch ? "low-match" : ""
              }`}
              key={song.song_id}
              onClick={() => onSelectSong(song)}
              type="button"
            >
              <img src={song.cover_image_url} alt={`${song.title} cover`} />

              <div className="selector-song-info">
                <strong>{song.title}</strong>
                <span>{song.artist}</span>
                <small>{formatMatchAccuracy(song.match_accuracy)} match</small>

                {isLowMatch && (
                  <em>Low match</em>
                )}
              </div>

              <span className="use-song-label">
                {isSelected ? "Playing" : "Play"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SongSelectorPanel;