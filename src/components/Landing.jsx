import { hasSavedProgress } from "../utils/storage.js";

export default function Landing({ allQuestions, savedProgress, onGetStarted, onContinue }) {
  const total = allQuestions.length;
  const levelCount = new Set(allQuestions.map((q) => q.level).filter(Boolean)).size;
  const typeCount = new Set(allQuestions.map((q) => q.type).filter(Boolean)).size;
  const hasSaved = hasSavedProgress(savedProgress);

  return (
    <>
      <h1>JavaScript Quiz</h1>
      <div className="landing-tagline">
        Test your JavaScript knowledge with multiple choice, live code you write and run, and
        output-prediction challenges.
      </div>
      <div className="landing-stats">
        <div className="stat-box">
          <span className="stat-num">{total}</span>
          <span className="stat-label">Questions</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{levelCount}</span>
          <span className="stat-label">Levels</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{typeCount}</span>
          <span className="stat-label">Question Types</span>
        </div>
      </div>
      <ul className="landing-features">
        <li>
          <span className="icon">🎯</span>
          <span>
            <strong>Pick your level</strong> — Beginner, Intermediate, or Advanced, shuffled each time.
          </span>
        </li>
        <li>
          <span className="icon">💻</span>
          <span>
            <strong>Write real code</strong> — run it in-browser and get graded against the expected output.
          </span>
        </li>
        <li>
          <span className="icon">🔮</span>
          <span>
            <strong>Predict the output</strong> — read a snippet and guess what it prints.
          </span>
        </li>
        <li>
          <span className="icon">📊</span>
          <span>
            <strong>Check progress anytime</strong> — see your score before you finish.
          </span>
        </li>
        <li>
          <span className="icon">💾</span>
          <span>
            <strong>Pick up where you left off</strong> — progress is saved automatically.
          </span>
        </li>
      </ul>
      {hasSaved ? (
        <>
          <div className="resume-banner">
            You have saved progress on the{" "}
            <strong style={{ textTransform: "capitalize" }}>{savedProgress.level}</strong> level —
            question {(savedProgress.current || 0) + 1} of {savedProgress.questions.length}
            {savedProgress.submitted ? " (finished)" : ""}.
          </div>
          <button className="btn-primary btn-large" type="button" onClick={onContinue}>
            Continue Where You Left Off
          </button>
          <button
            className="btn-secondary btn-large"
            type="button"
            style={{ marginTop: 10 }}
            onClick={onGetStarted}
          >
            Start a New Quiz
          </button>
        </>
      ) : (
        <button className="btn-primary btn-large" type="button" onClick={onGetStarted}>
          Get Started
        </button>
      )}
    </>
  );
}
