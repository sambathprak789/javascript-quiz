import TopBar from "./TopBar.jsx";
import ResultItem from "./ResultItem.jsx";
import { gradeQuestion } from "../utils/scoring.js";

export default function Results({
  questions,
  answers,
  current,
  submitted,
  onHome,
  onRestart,
  onContinue,
  onChangeLevel,
  onTryAgain
}) {
  const isFinal = submitted;
  let scoreCount = 0;
  let scoreTotal = 0;
  let answeredCount = 0;

  const rows = questions.map((q, i) => {
    const answer = answers[i];
    const { answered, isCorrect } = gradeQuestion(q, answer);
    if (answered) {
      answeredCount++;
      scoreTotal++;
      if (isCorrect) scoreCount++;
    }

    // Only show a question once the user has moved past it (answered or
    // skipped) or answered the one currently on screen. Once finished
    // (isFinal), everything is shown.
    const visited = isFinal || i < current || (i === current && answered);
    if (!visited) return null;

    return <ResultItem key={i} question={q} answer={answer} />;
  });

  const hasVisible = rows.some(Boolean);

  return (
    <div className="results">
      <TopBar onHome={onHome} onRestart={onRestart} />
      <h2>{isFinal ? "Results" : "Your Progress So Far"}</h2>
      <div className="score">
        Answered {answeredCount} of {questions.length} · Score: {scoreCount} / {scoreTotal} graded correct
      </div>
      {hasVisible ? (
        rows
      ) : (
        !isFinal && <div className="loading">You haven't answered any questions yet.</div>
      )}
      <div className="restart">
        <button className="btn-secondary" type="button" onClick={onChangeLevel}>
          Change Level
        </button>
        {isFinal ? (
          <button className="btn-primary" type="button" onClick={onTryAgain}>
            Try Again
          </button>
        ) : (
          <button className="btn-primary" type="button" onClick={onContinue}>
            Continue Quiz
          </button>
        )}
      </div>
    </div>
  );
}
