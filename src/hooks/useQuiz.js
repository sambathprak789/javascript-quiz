import { useState, useEffect, useCallback } from "react";
import { shuffle } from "../utils/shuffle.js";
import { saveProgress, loadSavedProgress, clearProgress } from "../utils/storage.js";

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

/**
 * Owns the entire quiz state machine: loading questions, picking a level,
 * answering, navigating, viewing results, and persisting/restoring progress.
 * Views (Landing/LevelSelect/QuestionScreen/Results) are pure renderers of
 * whatever this hook hands them.
 */
export function useQuiz() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [view, setView] = useState("loading"); // loading | error | landing | levelSelect | question | results
  const [currentLevel, setCurrentLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/quiz-questions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quiz-questions.json");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setAllQuestions(data.questions);
        setView("landing");
      })
      .catch(() => {
        if (!cancelled) setView("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startQuiz = useCallback(
    (level) => {
      const picked = shuffle(allQuestions.filter((q) => q.level === level));
      const freshAnswers = new Array(picked.length).fill(null);
      setCurrentLevel(level);
      setQuestions(picked);
      setCurrent(0);
      setAnswers(freshAnswers);
      setSubmitted(false);
      setView("question");
      saveProgress({ level, questions: picked, current: 0, answers: freshAnswers, submitted: false });
    },
    [allQuestions]
  );

  const goHome = useCallback(() => setView("landing"), []);
  const goToLevelSelect = useCallback(() => setView("levelSelect"), []);

  const resumeSaved = useCallback(() => {
    const saved = loadSavedProgress();
    if (!saved) return;
    setCurrentLevel(saved.level);
    setQuestions(saved.questions);
    setCurrent(saved.current || 0);
    setAnswers(saved.answers || new Array(saved.questions.length).fill(null));
    setSubmitted(!!saved.submitted);
    setView("question");
  }, []);

  const setAnswer = useCallback(
    (index, value) => {
      setAnswers((prev) => {
        const next = prev.slice();
        next[index] = value;
        saveProgress({ level: currentLevel, questions, current, answers: next, submitted });
        return next;
      });
    },
    [currentLevel, questions, current, submitted]
  );

  const goBack = useCallback(() => {
    setCurrent((prev) => {
      const nextIndex = Math.max(0, prev - 1);
      saveProgress({ level: currentLevel, questions, current: nextIndex, answers, submitted });
      return nextIndex;
    });
  }, [currentLevel, questions, answers, submitted]);

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      const isLast = prev >= questions.length - 1;
      const nextIndex = isLast ? prev : prev + 1;
      const nextSubmitted = isLast ? true : submitted;
      if (isLast) {
        setSubmitted(true);
        setView("results");
      }
      saveProgress({ level: currentLevel, questions, current: nextIndex, answers, submitted: nextSubmitted });
      return nextIndex;
    });
  }, [questions, submitted, currentLevel, answers]);

  const viewResultsSoFar = useCallback(() => setView("results"), []);
  const continueQuiz = useCallback(() => setView("question"), []);

  const changeLevel = useCallback(() => {
    clearProgress();
    setView("levelSelect");
  }, []);

  const restartQuiz = useCallback(() => {
    if (currentLevel) startQuiz(currentLevel);
  }, [currentLevel, startQuiz]);

  const sortedLevels = [...new Set(allQuestions.map((q) => q.level).filter(Boolean))].sort(
    (a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b)
  );

  return {
    allQuestions,
    sortedLevels,
    view,
    currentLevel,
    questions,
    current,
    answers,
    submitted,
    startQuiz,
    goHome,
    goToLevelSelect,
    resumeSaved,
    setAnswer,
    goBack,
    goNext,
    viewResultsSoFar,
    continueQuiz,
    changeLevel,
    restartQuiz,
    loadSavedProgress
  };
}
