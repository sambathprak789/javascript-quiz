import { useMemo } from "react";
import { highlightJS } from "../utils/highlight.js";

export default function PredictQuestion({ question, answer, onAnswer }) {
  const highlighted = useMemo(() => highlightJS(question.code || ""), [question.code]);

  return (
    <>
      <pre className="snippet-code" dangerouslySetInnerHTML={{ __html: highlighted }} />
      <textarea
        className="predict-input"
        placeholder="What will this print? (one line per console.log output)"
        autoComplete="off"
        spellCheck={false}
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
      />
    </>
  );
}
