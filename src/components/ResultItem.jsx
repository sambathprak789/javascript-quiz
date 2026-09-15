import { useMemo } from "react";
import { highlightJS } from "../utils/highlight.js";
import { gradeQuestion } from "../utils/scoring.js";

export default function ResultItem({ question, answer }) {
  const { isCorrect } = gradeQuestion(question, answer);
  const codeText = (answer && answer.code) || question.starterCode || "";
  const highlightedCode = useMemo(() => highlightJS(codeText), [codeText]);
  const highlightedSnippet = useMemo(() => highlightJS(question.code || ""), [question.code]);

  if (question.type === "option") {
    const answerText =
      answer === null || answer === undefined ? "No answer" : question.options[answer];
    return (
      <div className="result-item">
        <div className={`level ${question.level || ""}`}>{question.level || ""}</div>
        <div className="result-q">{question.question}</div>
        <div className="result-a">
          Your answer: {answerText}
          <span className={`badge ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
          {!isCorrect && (
            <div className="result-a">Correct answer: {question.options[question.correctIndex]}</div>
          )}
        </div>
      </div>
    );
  }

  if (question.type === "code" || question.type === "write") {
    const ranOutput = answer && answer.output !== undefined ? answer.output : null;
    const hasError = answer && answer.error;
    return (
      <div className="result-item">
        <div className={`level ${question.level || ""}`}>{question.level || ""}</div>
        <div className="result-q">{question.question}</div>
        <pre className="result-code" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        <div className="result-a">
          Output: {ranOutput === null ? "Not run" : hasError ? `Error: ${answer.error}` : ranOutput}
          <span className={`badge ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
          {!isCorrect && <div className="result-a">Expected output: {question.expectedOutput || ""}</div>}
        </div>
      </div>
    );
  }

  if (question.type === "predict") {
    const answerText = typeof answer === "string" && answer.trim() ? answer : "No answer";
    return (
      <div className="result-item">
        <div className={`level ${question.level || ""}`}>{question.level || ""}</div>
        <div className="result-q">{question.question}</div>
        <pre className="snippet-code" dangerouslySetInnerHTML={{ __html: highlightedSnippet }} />
        <div className="result-a">
          Your answer: {answerText}
          <span className={`badge ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
          {!isCorrect && <div className="result-a">Expected output: {question.expectedOutput || ""}</div>}
        </div>
      </div>
    );
  }

  return null;
}
