import { useQuiz } from "./hooks/useQuiz.js";
import Landing from "./components/Landing.jsx";
import LevelSelect from "./components/LevelSelect.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import Results from "./components/Results.jsx";

const RESTART_WARNING =
  "Restart the quiz? This will permanently delete all your progress and answers for this level. This cannot be undone.";

export default function App() {
  const quiz = useQuiz();

  const handleRestart = () => {
    if (quiz.currentLevel && window.confirm(RESTART_WARNING)) {
      quiz.restartQuiz();
    }
  };

  let content;
  if (quiz.view === "loading") {
    content = <div className="loading">Loading quiz...</div>;
  } else if (quiz.view === "error") {
    content = (
      <div className="error">
        Couldn't load quiz-questions.json. Make sure it's in the public/ folder.
      </div>
    );
  } else if (quiz.view === "landing") {
    content = (
      <Landing
        allQuestions={quiz.allQuestions}
        savedProgress={quiz.loadSavedProgress()}
        onGetStarted={quiz.goToLevelSelect}
        onContinue={quiz.resumeSaved}
      />
    );
  } else if (quiz.view === "levelSelect") {
    content = (
      <LevelSelect
        allQuestions={quiz.allQuestions}
        sortedLevels={quiz.sortedLevels}
        onHome={quiz.goHome}
        onPick={quiz.startQuiz}
      />
    );
  } else if (quiz.view === "question") {
    const question = quiz.questions[quiz.current];
    content = (
      <QuestionScreen
        question={question}
        index={quiz.current}
        total={quiz.questions.length}
        answer={quiz.answers[quiz.current]}
        onAnswer={(value) => quiz.setAnswer(quiz.current, value)}
        onBack={quiz.goBack}
        onNext={quiz.goNext}
        onHome={quiz.goHome}
        onRestart={handleRestart}
        onViewResults={quiz.viewResultsSoFar}
      />
    );
  } else if (quiz.view === "results") {
    content = (
      <Results
        questions={quiz.questions}
        answers={quiz.answers}
        current={quiz.current}
        submitted={quiz.submitted}
        onHome={quiz.goHome}
        onRestart={handleRestart}
        onContinue={quiz.continueQuiz}
        onChangeLevel={quiz.changeLevel}
        onTryAgain={quiz.restartQuiz}
      />
    );
  }

  return <div className="card">{content}</div>;
}
