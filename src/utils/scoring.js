export function isAnswered(question, answer) {
  if (answer === null || answer === undefined) return false;
  if (question.type === "option") return true;
  if (question.type === "code" || question.type === "write") {
    return !!(answer.code && answer.code.trim());
  }
  if (question.type === "predict") {
    return typeof answer === "string" && answer.trim() !== "";
  }
  return false;
}

/**
 * Forgiving comparison for predict-type answers: exact match after
 * trimming, case-insensitive, with a loose numeric comparison for
 * single-line numeric answers (so "0" matches "0.0").
 */
export function answersMatch(user, expected) {
  const u = (user || "").trim();
  const e = (expected || "").trim();
  if (u === "" || e === "") return false;
  const isSingleLine = u.indexOf("\n") === -1 && e.indexOf("\n") === -1;
  if (isSingleLine) {
    const uNum = Number(u);
    const eNum = Number(e);
    if (!isNaN(uNum) && !isNaN(eNum)) return uNum === eNum;
  }
  return u.toLowerCase() === e.toLowerCase();
}

/**
 * Grades a single question against its answer. Single source of truth
 * used both for the per-question badge and the aggregate score.
 */
export function gradeQuestion(question, answer) {
  const answered = isAnswered(question, answer);
  if (!answered) return { answered: false, isCorrect: false };

  if (question.type === "option") {
    return { answered: true, isCorrect: answer === question.correctIndex };
  }

  if (question.type === "code" || question.type === "write") {
    const hasError = !!answer.error;
    const output = answer.output !== undefined ? answer.output : null;
    const isCorrect =
      !hasError && output !== null && output.trim() === (question.expectedOutput || "").trim();
    return { answered: true, isCorrect };
  }

  if (question.type === "predict") {
    return { answered: true, isCorrect: answersMatch(answer, question.expectedOutput) };
  }

  return { answered: true, isCorrect: false };
}
