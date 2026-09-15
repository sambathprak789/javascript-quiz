import { useState } from "react";
import CodeEditor from "./CodeEditor.jsx";
import { runUserCode } from "../utils/runCode.js";

export default function CodeQuestion({ question, answer, onAnswer }) {
  const [running, setRunning] = useState(false);
  const code = (answer && answer.code) || question.starterCode || "";
  const output = answer && answer.output !== undefined ? answer.output : null;
  const error = answer && answer.error;

  const handleChange = (newCode) => {
    onAnswer({ ...(answer || {}), code: newCode });
  };

  const handleRun = async () => {
    setRunning(true);
    const result = await runUserCode(code);
    onAnswer({ code, output: result.output, error: result.error });
    setRunning(false);
  };

  let outputText;
  if (running) outputText = "Running...";
  else if (output === null) outputText = 'Click "Run Code" to see the output here.';
  else if (error) outputText = `Error: ${error}`;
  else outputText = output || "(no output — did you use console.log?)";

  return (
    <>
      <CodeEditor value={code} onChange={handleChange} />
      <div className="code-actions">
        <button className="run-btn" type="button" onClick={handleRun} disabled={running}>
          ▶ Run Code
        </button>
      </div>
      <div className="code-output-label">Output</div>
      <div className={`code-output${error && !running ? " error-output" : ""}`}>{outputText}</div>
    </>
  );
}
