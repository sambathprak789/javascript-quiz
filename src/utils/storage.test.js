import { describe, it, expect, beforeEach } from "vitest";
import { saveProgress, loadSavedProgress, clearProgress, hasSavedProgress } from "./storage.js";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is saved", () => {
    expect(loadSavedProgress()).toBeNull();
  });

  it("saves and loads progress", () => {
    saveProgress({ level: "beginner", current: 2 });
    expect(loadSavedProgress()).toEqual({ level: "beginner", current: 2 });
  });

  it("clears saved progress", () => {
    saveProgress({ level: "beginner" });
    clearProgress();
    expect(loadSavedProgress()).toBeNull();
  });
});

describe("hasSavedProgress", () => {
  it("is false for null or incomplete saves", () => {
    expect(hasSavedProgress(null)).toBe(false);
    expect(hasSavedProgress({ level: "beginner" })).toBe(false);
    expect(hasSavedProgress({ level: "beginner", questions: [] })).toBe(false);
  });

  it("is true when level and a non-empty question list are present", () => {
    expect(hasSavedProgress({ level: "beginner", questions: [{}] })).toBe(true);
  });
});
