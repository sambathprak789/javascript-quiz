import { describe, it, expect } from "vitest";
import { isAnswered, answersMatch, gradeQuestion } from "./scoring.js";

describe("isAnswered", () => {
  it("treats any selected option index as answered, including 0", () => {
    expect(isAnswered({ type: "option" }, 0)).toBe(true);
    expect(isAnswered({ type: "option" }, 2)).toBe(true);
    expect(isAnswered({ type: "option" }, null)).toBe(false);
  });

  it("requires non-empty code for code/write questions", () => {
    expect(isAnswered({ type: "code" }, { code: "   " })).toBe(false);
    expect(isAnswered({ type: "code" }, { code: "console.log(1)" })).toBe(true);
    expect(isAnswered({ type: "write" }, null)).toBe(false);
  });

  it("requires non-empty text for predict questions", () => {
    expect(isAnswered({ type: "predict" }, "")).toBe(false);
    expect(isAnswered({ type: "predict" }, "  ")).toBe(false);
    expect(isAnswered({ type: "predict" }, "5")).toBe(true);
  });
});

describe("answersMatch", () => {
  it("matches identical strings", () => {
    expect(answersMatch("Hello", "Hello")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(answersMatch("UNDEFINED", "undefined")).toBe(true);
  });

  it("matches numbers loosely regardless of formatting", () => {
    expect(answersMatch("0", "0.0")).toBe(true);
  });

  it("matches multi-line output exactly, case-insensitive", () => {
    expect(answersMatch("A\nD\nC\nB", "a\nd\nc\nb")).toBe(true);
  });

  it("rejects empty or mismatched answers", () => {
    expect(answersMatch("", "Hello")).toBe(false);
    expect(answersMatch("1", "2")).toBe(false);
  });
});

describe("gradeQuestion", () => {
  it("grades option questions against correctIndex", () => {
    const q = { type: "option", correctIndex: 1 };
    expect(gradeQuestion(q, 1)).toEqual({ answered: true, isCorrect: true });
    expect(gradeQuestion(q, 0)).toEqual({ answered: true, isCorrect: false });
  });

  it("grades code questions by comparing trimmed output", () => {
    const q = { type: "code", expectedOutput: "Hello" };
    expect(gradeQuestion(q, { code: 'console.log("Hello")', output: "Hello" }).isCorrect).toBe(true);
    expect(gradeQuestion(q, { code: 'console.log("Hi")', output: "Hi" }).isCorrect).toBe(false);
  });

  it("treats a run with an error as incorrect", () => {
    const q = { type: "code", expectedOutput: "Hello" };
    expect(gradeQuestion(q, { code: "bad()", output: "", error: "bad is not defined" }).isCorrect).toBe(false);
  });

  it("grades predict questions with answersMatch", () => {
    const q = { type: "predict", expectedOutput: "0" };
    expect(gradeQuestion(q, "0").isCorrect).toBe(true);
    expect(gradeQuestion(q, "1").isCorrect).toBe(false);
  });

  it("returns unanswered for null/undefined answers without grading them", () => {
    expect(gradeQuestion({ type: "option" }, null)).toEqual({ answered: false, isCorrect: false });
  });
});
