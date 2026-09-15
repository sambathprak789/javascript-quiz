import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Landing from "./Landing.jsx";

const questions = [
  { level: "beginner", type: "option" },
  { level: "intermediate", type: "code" }
];

describe("Landing", () => {
  it("shows the Get Started button when there is no saved progress", () => {
    render(
      <Landing allQuestions={questions} savedProgress={null} onGetStarted={() => {}} onContinue={() => {}} />
    );
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.queryByText("Continue Where You Left Off")).not.toBeInTheDocument();
  });

  it("calls onGetStarted when the button is clicked", async () => {
    const onGetStarted = vi.fn();
    const { getByText } = render(
      <Landing allQuestions={questions} savedProgress={null} onGetStarted={onGetStarted} onContinue={() => {}} />
    );
    getByText("Get Started").click();
    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });

  it("offers to continue when progress is saved", () => {
    const saved = { level: "beginner", current: 2, questions: [1, 2, 3], submitted: false };
    render(
      <Landing allQuestions={questions} savedProgress={saved} onGetStarted={() => {}} onContinue={() => {}} />
    );
    expect(screen.getByText("Continue Where You Left Off")).toBeInTheDocument();
    expect(screen.getByText("Start a New Quiz")).toBeInTheDocument();
  });
});
