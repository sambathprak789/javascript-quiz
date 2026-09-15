import TopBar from "./TopBar.jsx";
import OptionQuestion from "./OptionQuestion.jsx";
import CodeQuestion from "./CodeQuestion.jsx";
import PredictQuestion from "./PredictQuestion.jsx";

export default function QuestionScreen({
  question,
  index,
  total,
  answer,
  onAnswer,
  onBack,
  onNext,
  onHome,
  onRestart,
  onViewResults
}) {
  return (
    <>
      <TopBar onHome={onHome} onRestart={onRestart} />
      <h1>Quick Quiz</h1>
      <div className="progress">
        Question {index + 1} of {total}
      </div>
      <div className={`level ${question.level || ""}`}>{question.level || ""}</div>
      <div className="question">{question.question}</div>

      {question.type === "option" && (
        <OptionQuestion question={question} answer={answer} onAnswer={onAnswer} />
      )}
      {(question.type === "code" || question.type === "write") && (
        <CodeQuestion question={question} answer={answer} onAnswer={onAnswer} />
      )}
      {question.type === "predict" && (
        <PredictQuestion question={question} answer={answer} onAnswer={onAnswer} />
      )}

      <div className="nav">
        <button className="btn-secondary" type="button" onClick={onBack} disabled={index === 0}>
          Back
        </button>
        <button className="btn-primary" type="button" onClick={onNext}>
          {index === total - 1 ? "Finish" : "Next"}
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <button className="stats-link" type="button" style={{ marginBottom: 0 }} onClick={onViewResults}>
          View results so far
        </button>
      </div>
    </>
  );
}
