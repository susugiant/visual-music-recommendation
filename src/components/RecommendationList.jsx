import SongCard from "./SongCard";

function RecommendationList({ songs }) {
  return (
    <section className="recommendation-section">
      <div className="section-title">
        <p className="eyebrow">Recommendations</p>
        <h2>Matching Songs</h2>
      </div>

      <div className="song-list">
        {songs.map((song) => (
          <SongCard song={song} key={song.song_id} />
        ))}
      </div>
    </section>
  );
}

export default RecommendationList;