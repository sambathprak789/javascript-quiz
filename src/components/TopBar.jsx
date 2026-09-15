export default function TopBar({ onHome, onRestart }) {
  return (
    <div className="top-bar">
      <button className="stats-link" type="button" onClick={onHome}>
        🏠 Home
      </button>
      {onRestart ? (
        <button className="stats-link" type="button" onClick={onRestart}>
          ↻ Restart
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
