# JavaScript Quiz (React)

A React + Vite rewrite of the original vanilla-JS quiz app, split into small,
independently testable components, hooks, and utility modules.

## Running it

```bash
npm install
npm run dev
```

Then open the printed `http://localhost` URL.

## Running the tests

```bash
npm test        # run once
npm run test:watch   # watch mode
```

Uses [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react).
Every `*.test.js` / `*.test.jsx` file sits next to the file it tests.

## Building for production

```bash
npm run build
npm run preview   # serve the production build locally
```

## Project structure

```
public/
  quiz-questions.json      # the question bank (unchanged format)

src/
  main.jsx                 # React entry point
  App.jsx                  # top-level screen router, wires useQuiz() to views
  index.css                # all app styles (global, class-based)

  hooks/
    useQuiz.js              # ALL quiz state + transitions live here:
                             # loading questions, picking a level, answering,
                             # navigating, results, localStorage persistence.
                             # Components never touch state directly — they
                             # only call the functions this hook returns.

  utils/                    # pure functions — the easiest layer to test
    shuffle.js               # Fisher-Yates shuffle
    highlight.js              # HTML escaping + JS syntax-highlighting tokenizer
    runCode.js                 # sandboxed console.log-capturing code runner
    scoring.js                  # isAnswered / answersMatch / gradeQuestion
    storage.js                   # localStorage save/load/clear wrappers
    *.test.js                     # unit tests for each of the above

  components/
    Landing.jsx               # intro screen (stats, features, resume banner)
    LevelSelect.jsx            # difficulty picker
    QuestionScreen.jsx          # active question shell (nav, top bar)
    OptionQuestion.jsx           # multiple-choice body
    CodeQuestion.jsx              # write/run code body (uses CodeEditor)
    CodeEditor.jsx                 # textarea + syntax-highlight overlay
    PredictQuestion.jsx             # read-snippet + guess-output body
    Results.jsx                      # score summary + list of ResultItem
    ResultItem.jsx                    # single graded question row
    TopBar.jsx                         # Home / Restart links
    *.test.jsx                          # component tests (RTL)
```

## Why it's organized this way

- **State lives in one place** (`useQuiz`), not scattered across components or
  global variables. Every component is a plain function of props — easy to
  reason about and easy to unit-test in isolation with mock props/callbacks.
- **Grading logic lives in `utils/scoring.js`**, not duplicated between the
  per-question badge and the aggregate score — `gradeQuestion()` is the single
  source of truth, used by both `ResultItem` and `Results`.
- **Side-effecting code (code execution, syntax highlighting, storage) is
  isolated in `utils/`** as plain functions with no React dependency, so it's
  testable with plain Vitest — no rendering required.
- **Question-type components are separate** (`OptionQuestion`,
  `CodeQuestion`, `PredictQuestion`) so adding a new question type later means
  adding one new component + one branch in `QuestionScreen`, without touching
  the others.

## Adding questions

Same format as before — add entries to `public/quiz-questions.json`. See the
original project's README for the schema of each question `type`
(`option`, `code`/`write`, `predict`).
