# JavaScript Quiz

An interactive JavaScript quiz app with multiple question types, difficulty levels, an in-browser code runner, and progress that persists across reloads.

## Features

- **Difficulty levels** — Beginner, Intermediate, and Advanced. Pick a level to start; questions are shuffled within that level only.
- **Four question types:**
  - **Option** — standard multiple choice.
  - **Write** — write JavaScript code from a prompt, run it, and match the output.
  - **Code** — same as Write: write and run code, graded against an expected output.
  - **Predict** — read a code snippet (not editable) and type what you think it will print.
- **Live code execution** — a sandboxed runner captures `console.log` output (including `async`/`await`) so Write/Code answers are graded automatically.
- **Progress stats anytime** — click "View results so far" mid-quiz to see how you're doing without finishing. Only questions you've reached (answered or skipped) are shown.
- **Persistence** — your level, question order, answers, and position are saved to `localStorage`, so refreshing the page resumes exactly where you left off. Progress clears when you switch levels.

## Files

| File | Purpose |
|---|---|
| `quiz-app.html` | The app — UI, code runner, scoring, and persistence logic. |
| `quiz-questions.json` | The question bank, organized by `level` and `type`. |

## Running it

The app loads questions via `fetch("quiz-questions.json")`, which requires a real HTTP origin — opening `quiz-app.html` directly as a `file://` URL will fail due to browser CORS restrictions.

Serve the folder with any static file server, for example:

```bash
npx serve .
```

or

```bash
python3 -m http.server
```

Then open the printed `http://localhost` URL in your browser.

## Adding questions

Add entries to the `questions` array in `quiz-questions.json`. Each entry needs a `level` (`beginner`, `intermediate`, or `advanced`) and a `type`:

**Option**
```json
{
  "type": "option",
  "level": "beginner",
  "question": "Which keyword declares a block-scoped variable?",
  "options": ["var", "let", "function", "global"],
  "correctIndex": 1
}
```

**Write / Code**
```json
{
  "type": "code",
  "level": "beginner",
  "question": "Write JavaScript code to print \"Hello\"",
  "starterCode": "// write your code below\n",
  "expectedOutput": "Hello"
}
```

**Predict**
```json
{
  "type": "predict",
  "level": "beginner",
  "question": "What is the output of this code?",
  "code": "console.log(\"1\" - 1);",
  "expectedOutput": "0"
}
```

No changes to `quiz-app.html` are needed — new questions are picked up automatically on the next load.

## Notes

- Grading for Write/Code/Predict answers is based on an exact (trimmed) match against `expectedOutput`, with a case-insensitive and loose-numeric comparison for Predict answers.
- `localStorage` persistence works when the app is served and opened directly in a browser. It will not persist if viewed inside a sandboxed preview panel (e.g. an embedded artifact viewer) — self-hosting as described above is the reliable way to use it.
