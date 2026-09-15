// Questions are loaded from quiz-questions.json (same folder as this file)
let allQuestions = [];
let questions = [];
let currentLevel = null;
let current = 0;
let answers = [];
let submitted = false;
let viewingResults = false;

const app = document.getElementById("app");
const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];
const STORAGE_KEY = "js-quiz-progress-v1";

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      level: currentLevel,
      questions,
      current,
      answers,
      submitted
    }));
  } catch (e) {
    // Storage can fail (private browsing, quota, disabled) — quiz still works, just won't persist.
  }
}

function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

async function loadQuestions() {
  app.innerHTML = `<div class="loading">Loading quiz...</div>`;
  try {
    const res = await fetch("quiz-questions.json");
    if (!res.ok) throw new Error("Failed to load questions.json");
    const data = await res.json();
    allQuestions = data.questions;
    renderLanding();
  } catch (err) {
    app.innerHTML = `<div class="error">Couldn't load quiz-questions.json. Make sure it's in the same folder as this file.</div>`;
  }
}

function renderLanding() {
  const total = allQuestions.length;
  const levelCount = new Set(allQuestions.map(q => q.level).filter(Boolean)).size;
  const typeCount = new Set(allQuestions.map(q => q.type).filter(Boolean)).size;
  const saved = loadSavedProgress();
  const hasSaved = !!(saved && saved.level && Array.isArray(saved.questions) && saved.questions.length);

  app.innerHTML = `
    <h1>JavaScript Quiz</h1>
    <div class="landing-tagline">
      Test your JavaScript knowledge with multiple choice, live code you write and run, and output-prediction challenges.
    </div>
    <div class="landing-stats">
      <div class="stat-box"><span class="stat-num">${total}</span><span class="stat-label">Questions</span></div>
      <div class="stat-box"><span class="stat-num">${levelCount}</span><span class="stat-label">Levels</span></div>
      <div class="stat-box"><span class="stat-num">${typeCount}</span><span class="stat-label">Question Types</span></div>
    </div>
    <ul class="landing-features">
      <li><span class="icon">🎯</span><span><strong>Pick your level</strong> — Beginner, Intermediate, or Advanced, shuffled each time.</span></li>
      <li><span class="icon">💻</span><span><strong>Write real code</strong> — run it in-browser and get graded against the expected output.</span></li>
      <li><span class="icon">🔮</span><span><strong>Predict the output</strong> — read a snippet and guess what it prints.</span></li>
      <li><span class="icon">📊</span><span><strong>Check progress anytime</strong> — see your score before you finish.</span></li>
      <li><span class="icon">💾</span><span><strong>Pick up where you left off</strong> — progress is saved automatically.</span></li>
    </ul>
    ${hasSaved ? `
      <div class="resume-banner">
        You have saved progress on the <strong style="text-transform:capitalize">${saved.level}</strong> level — question ${(saved.current || 0) + 1} of ${saved.questions.length}${saved.submitted ? " (finished)" : ""}.
      </div>
      <button class="btn-primary btn-large" id="continueBtn" type="button">Continue Where You Left Off</button>
      <button class="btn-secondary btn-large" id="getStartedBtn" type="button" style="margin-top:10px;">Start a New Quiz</button>
    ` : `
      <button class="btn-primary btn-large" id="getStartedBtn" type="button">Get Started</button>
    `}
  `;

  if (hasSaved) {
    document.getElementById("continueBtn").addEventListener("click", () => {
      currentLevel = saved.level;
      questions = saved.questions;
      current = saved.current || 0;
      answers = saved.answers || new Array(questions.length).fill(null);
      submitted = !!saved.submitted;
      viewingResults = false;
      render();
    });
  }
  document.getElementById("getStartedBtn").addEventListener("click", () => {
    renderLevelSelect();
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderTopBar(includeRestart) {
  return `
    <div class="top-bar">
      <button class="stats-link" id="homeBtn" type="button">🏠 Home</button>
      ${includeRestart ? `<button class="stats-link" id="restartTopBtn" type="button">↻ Restart</button>` : "<span></span>"}
    </div>
  `;
}

function wireTopBar(includeRestart) {
  document.getElementById("homeBtn").addEventListener("click", () => {
    renderLanding();
  });
  if (includeRestart) {
    document.getElementById("restartTopBtn").addEventListener("click", () => {
      if (currentLevel && confirm("Restart the quiz? This will permanently delete all your progress and answers for this level. This cannot be undone.")) {
        startQuiz(currentLevel);
      }
    });
  }
}

function renderLevelSelect() {
  const levels = [...new Set(allQuestions.map(q => q.level).filter(Boolean))]
    .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));

  app.innerHTML = `
    ${renderTopBar(false)}
    <h1>Quick Quiz</h1>
    <div class="progress">Choose a difficulty to begin</div>
    <div class="level-select">
      ${levels.map(lvl => {
        const count = allQuestions.filter(q => q.level === lvl).length;
        return `
          <button class="level-card level-card-${lvl}" data-level="${lvl}" type="button">
            <span class="level-card-name">${lvl}</span>
            <span class="level-card-count">${count} question${count === 1 ? "" : "s"}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;

  wireTopBar(false);

  app.querySelectorAll(".level-card").forEach(btn => {
    btn.addEventListener("click", () => startQuiz(btn.dataset.level));
  });
}

function startQuiz(level) {
  currentLevel = level;
  questions = shuffle(allQuestions.filter(q => q.level === level));
  current = 0;
  answers = new Array(questions.length).fill(null);
  submitted = false;
  viewingResults = false;
  saveProgress();
  render();
}

function formatLogArg(arg) {
  if (typeof arg === "string") return arg;
  if (arg === undefined) return "undefined";
  try {
    if (Array.isArray(arg)) return "[ " + arg.map(formatLogArg).join(", ") + " ]";
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

async function runUserCode(code) {
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.map(formatLogArg).join(" "));
  };

  let error = null;
  try {
    // Wrap in an async IIFE so top-level await works in user code
    const runner = new Function(`
      "use strict";
      return (async () => {
        ${code}
      })();
    `);
    await runner();
  } catch (err) {
    error = err.message;
  } finally {
    console.log = originalLog;
  }

  return { output: logs.join("\n"), error };
}

function render() {
  if (submitted || viewingResults) {
    renderResults();
    return;
  }
  const q = questions[current];
  let bodyHtml = "";

  const isCodeType = q.type === "code" || q.type === "write";
  const isPredictType = q.type === "predict";

  if (q.type === "option") {
    bodyHtml = `<div class="options">` + q.options.map((opt, i) => `
      <label class="${answers[current] === i ? "selected" : ""}" data-index="${i}">
        <input type="radio" name="opt" ${answers[current] === i ? "checked" : ""}>
        ${escapeHtml(opt)}
      </label>
    `).join("") + `</div>`;
  } else if (isCodeType) {
    bodyHtml = `
      <div class="code-editor-wrap">
        <pre class="code-highlight" id="codeHighlight" aria-hidden="true"></pre>
        <textarea class="code-input" id="codeInput" spellcheck="false"></textarea>
      </div>
      <div class="code-actions">
        <button class="run-btn" id="runBtn" type="button">▶ Run Code</button>
      </div>
      <div class="code-output-label">Output</div>
      <div class="code-output" id="codeOutput">Click "Run Code" to see the output here.</div>
    `;
  } else if (isPredictType) {
    bodyHtml = `
      <pre class="snippet-code">${highlightJS(q.code || "")}</pre>
      <textarea class="predict-input" id="predictInput" placeholder="What will this print? (one line per console.log output)" autocomplete="off" spellcheck="false"></textarea>
    `;
  }

  app.innerHTML = `
    ${renderTopBar(true)}
    <h1>Quick Quiz</h1>
    <div class="progress">Question ${current + 1} of ${questions.length}</div>
    <div class="level ${q.level || ""}">${q.level || ""}</div>
    <div class="question">${escapeHtml(q.question)}</div>
    ${bodyHtml}
    <div class="nav">
      <button class="btn-secondary" id="prevBtn" ${current === 0 ? "disabled" : ""}>Back</button>
      <button class="btn-primary" id="nextBtn">${current === questions.length - 1 ? "Finish" : "Next"}</button>
    </div>
    <div style="text-align:center; margin-top:14px;">
      <button class="stats-link" id="statsBtn" type="button" style="margin-bottom:0;">View results so far</button>
    </div>
  `;

  wireTopBar(true);

  if (q.type === "option") {
    app.querySelectorAll(".options label").forEach(label => {
      label.addEventListener("click", () => {
        answers[current] = parseInt(label.dataset.index, 10);
        saveProgress();
        render();
      });
    });
  } else if (isCodeType) {
    const saved = answers[current];
    const codeInput = document.getElementById("codeInput");
    const codeOutput = document.getElementById("codeOutput");
    const codeHighlight = document.getElementById("codeHighlight");
    codeInput.value = (saved && saved.code) || q.starterCode || "";

    const updateHighlight = () => {
      codeHighlight.innerHTML = highlightJS(codeInput.value) + "\n";
    };
    updateHighlight();

    codeInput.addEventListener("input", () => {
      answers[current] = { ...(answers[current] || {}), code: codeInput.value };
      saveProgress();
      updateHighlight();
    });
    codeInput.addEventListener("scroll", () => {
      codeHighlight.scrollTop = codeInput.scrollTop;
      codeHighlight.scrollLeft = codeInput.scrollLeft;
    });
    codeInput.addEventListener("keydown", (e) => {
      // Allow Tab to insert spaces instead of moving focus
      if (e.key === "Tab") {
        e.preventDefault();
        const start = codeInput.selectionStart, end = codeInput.selectionEnd;
        codeInput.value = codeInput.value.slice(0, start) + "  " + codeInput.value.slice(end);
        codeInput.selectionStart = codeInput.selectionEnd = start + 2;
        updateHighlight();
      }
    });

    if (saved && saved.output !== undefined) {
      codeOutput.textContent = saved.output;
      codeOutput.classList.toggle("error-output", !!saved.error);
    }

    document.getElementById("runBtn").addEventListener("click", async () => {
      codeOutput.textContent = "Running...";
      codeOutput.classList.remove("error-output");
      const result = await runUserCode(codeInput.value);
      codeOutput.textContent = result.error ? `Error: ${result.error}` : (result.output || "(no output — did you use console.log?)");
      codeOutput.classList.toggle("error-output", !!result.error);
      answers[current] = { code: codeInput.value, output: result.output, error: result.error };
      saveProgress();
    });
  } else if (isPredictType) {
    const predictInput = document.getElementById("predictInput");
    predictInput.value = answers[current] || "";
    predictInput.addEventListener("input", () => {
      answers[current] = predictInput.value;
      saveProgress();
    });
  }

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (current > 0) { current--; saveProgress(); render(); }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (current < questions.length - 1) {
      current++;
    } else {
      submitted = true;
    }
    saveProgress();
    render();
  });
  document.getElementById("statsBtn").addEventListener("click", () => {
    viewingResults = true;
    render();
  });
}

function answersMatch(user, expected) {
  const u = (user || "").trim();
  const e = (expected || "").trim();
  if (u === "" || e === "") return false;
  const isSingleLine = u.indexOf("\n") === -1 && e.indexOf("\n") === -1;
  if (isSingleLine) {
    const uNum = Number(u), eNum = Number(e);
    if (!isNaN(uNum) && !isNaN(eNum)) return uNum === eNum;
  }
  return u.toLowerCase() === e.toLowerCase();
}

function isAnswered(q, userAnswer) {
  if (userAnswer === null || userAnswer === undefined) return false;
  if (q.type === "option") return true;
  if (q.type === "code" || q.type === "write") return !!(userAnswer.code && userAnswer.code.trim());
  if (q.type === "predict") return typeof userAnswer === "string" && userAnswer.trim() !== "";
  return false;
}

function renderResults() {
  let scoreCount = 0;
  let scoreTotal = 0;
  let answeredCount = 0;
  const isFinal = submitted;

  const itemsHtml = questions.map((q, i) => {
    const userAnswer = answers[i];
    const answered = isAnswered(q, userAnswer);
    if (answered) answeredCount++;
    // Show a question once the user has moved past it (answered or skipped),
    // or answered the one currently on screen. Hide ones not yet reached.
    const visited = isFinal || i < current || (i === current && answered);
    if (!visited) return "";

    if (q.type === "option") {
      const isCorrect = answered && userAnswer === q.correctIndex;
      if (answered) { scoreTotal++; if (isCorrect) scoreCount++; }
      const answerText = userAnswer === null ? "No answer" : escapeHtml(q.options[userAnswer]);
      return `
        <div class="result-item">
          <div class="level ${q.level || ""}">${q.level || ""}</div>
          <div class="result-q">${escapeHtml(q.question)}</div>
          <div class="result-a">
            Your answer: ${answerText}
            <span class="badge ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Correct" : "Incorrect"}</span>
            ${!isCorrect ? `<div class="result-a">Correct answer: ${escapeHtml(q.options[q.correctIndex])}</div>` : ""}
          </div>
        </div>
      `;
    } else if (q.type === "code" || q.type === "write") {
      const ranOutput = userAnswer && userAnswer.output !== undefined ? userAnswer.output : null;
      const hasError = userAnswer && userAnswer.error;
      const isCorrect = answered && !hasError && ranOutput !== null && ranOutput.trim() === (q.expectedOutput || "").trim();
      if (answered) { scoreTotal++; if (isCorrect) scoreCount++; }
      const codeText = userAnswer && userAnswer.code ? userAnswer.code : (q.starterCode || "");
      return `
        <div class="result-item">
          <div class="level ${q.level || ""}">${q.level || ""}</div>
          <div class="result-q">${escapeHtml(q.question)}</div>
          <pre class="result-code">${highlightJS(codeText)}</pre>
          <div class="result-a">
            Output: ${ranOutput === null ? "Not run" : escapeHtml(hasError ? "Error: " + userAnswer.error : ranOutput)}
            <span class="badge ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Correct" : "Incorrect"}</span>
            ${!isCorrect ? `<div class="result-a">Expected output: ${escapeHtml(q.expectedOutput || "")}</div>` : ""}
          </div>
        </div>
      `;
    } else if (q.type === "predict") {
      const isCorrect = answered && answersMatch(userAnswer, q.expectedOutput);
      if (answered) { scoreTotal++; if (isCorrect) scoreCount++; }
      const answerText = userAnswer && userAnswer.trim() ? escapeHtml(userAnswer) : "No answer";
      return `
        <div class="result-item">
          <div class="level ${q.level || ""}">${q.level || ""}</div>
          <div class="result-q">${escapeHtml(q.question)}</div>
          <pre class="snippet-code">${highlightJS(q.code || "")}</pre>
          <div class="result-a">
            Your answer: ${answerText}
            <span class="badge ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Correct" : "Incorrect"}</span>
            ${!isCorrect ? `<div class="result-a">Expected output: ${escapeHtml(q.expectedOutput || "")}</div>` : ""}
          </div>
        </div>
      `;
    } else {
      return "";
    }
  }).join("");

  app.innerHTML = `
    <div class="results">
      ${renderTopBar(true)}
      <h2>${isFinal ? "Results" : "Your Progress So Far"}</h2>
      <div class="score">
        Answered ${answeredCount} of ${questions.length} · Score: ${scoreCount} / ${scoreTotal} graded correct
      </div>
      ${itemsHtml || (isFinal ? "" : `<div class="loading">You haven't answered any questions yet.</div>`)}
      <div class="restart">
        ${isFinal
          ? `<button class="btn-secondary" id="changeLevelBtn">Change Level</button>
             <button class="btn-primary" id="restartBtn">Try Again</button>`
          : `<button class="btn-secondary" id="changeLevelBtn">Change Level</button>
             <button class="btn-primary" id="continueBtn">Continue Quiz</button>`
        }
      </div>
    </div>
  `;

  wireTopBar(true);

  if (isFinal) {
    document.getElementById("restartBtn").addEventListener("click", () => {
      startQuiz(currentLevel);
    });
  } else {
    document.getElementById("continueBtn").addEventListener("click", () => {
      viewingResults = false;
      render();
    });
  }
  document.getElementById("changeLevelBtn").addEventListener("click", () => {
    viewingResults = false;
    clearProgress();
    renderLevelSelect();
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

const JS_KEYWORDS = "const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|yield|import|export|default|from|static|get|set|delete|void|null|undefined|true|false|super";
const JS_TOKEN_PATTERN = new RegExp(
  "(\\/\\/[^\\n]*)" +                          // 1: line comment
  "|(\\/\\*[\\s\\S]*?\\*\\/)" +                 // 2: block comment
  "|(`(?:\\\\.|[^`\\\\])*`)" +                  // 3: template string
  "|(\"(?:\\\\.|[^\"\\\\])*\")" +               // 4: double-quoted string
  "|('(?:\\\\.|[^'\\\\])*')" +                  // 5: single-quoted string
  "|(\\b\\d+\\.?\\d*\\b)" +                     // 6: number
  "|(\\b(?:" + JS_KEYWORDS + ")\\b)" +          // 7: keyword
  "|(\\b[A-Za-z_$][\\w$]*(?=\\s*\\())",         // 8: function call name
  "g"
);

function highlightJS(code) {
  code = code || "";
  let result = "";
  let lastIndex = 0;
  let m;
  JS_TOKEN_PATTERN.lastIndex = 0;
  while ((m = JS_TOKEN_PATTERN.exec(code)) !== null) {
    result += escapeHtml(code.slice(lastIndex, m.index));
    const [match, comment1, comment2, template, dstring, sstring, number, keyword, func] = m;
    let cls = null;
    if (comment1 || comment2) cls = "tok-comment";
    else if (template || dstring || sstring) cls = "tok-string";
    else if (number) cls = "tok-number";
    else if (keyword) cls = "tok-keyword";
    else if (func) cls = "tok-function";
    const escapedMatch = escapeHtml(match);
    result += cls ? `<span class="${cls}">${escapedMatch}</span>` : escapedMatch;
    lastIndex = JS_TOKEN_PATTERN.lastIndex;
    if (m.index === JS_TOKEN_PATTERN.lastIndex) JS_TOKEN_PATTERN.lastIndex++; // guard against zero-width matches
  }
  result += escapeHtml(code.slice(lastIndex));
  return result;
}

loadQuestions();
