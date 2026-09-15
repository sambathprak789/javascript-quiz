import TopBar from "./TopBar.jsx";

export default function LevelSelect({ allQuestions, sortedLevels, onHome, onPick }) {
  return (
    <>
      <TopBar onHome={onHome} />
      <h1>Quick Quiz</h1>
      <div className="progress">Choose a difficulty to begin</div>
      <div className="level-select">
        {sortedLevels.map((lvl) => {
          const count = allQuestions.filter((q) => q.level === lvl).length;
          return (
            <button
              key={lvl}
              className={`level-card level-card-${lvl}`}
              type="button"
              onClick={() => onPick(lvl)}
            >
              <span className="level-card-name">{lvl}</span>
              <span className="level-card-count">
                {count} question{count === 1 ? "" : "s"}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
