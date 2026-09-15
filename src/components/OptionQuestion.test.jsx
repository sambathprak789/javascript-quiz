import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OptionQuestion from "./OptionQuestion.jsx";

const question = { options: ["A", "B", "C"] };

describe("OptionQuestion", () => {
  it("renders all options", () => {
    render(<OptionQuestion question={question} answer={null} onAnswer={() => {}} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("calls onAnswer with the clicked option's index", () => {
    const onAnswer = vi.fn();
    render(<OptionQuestion question={question} answer={null} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByText("B"));
    expect(onAnswer).toHaveBeenCalledWith(1);
  });

  it("marks the selected option with the selected class", () => {
    render(<OptionQuestion question={question} answer={2} onAnswer={() => {}} />);
    expect(screen.getByText("C").closest("label")).toHaveClass("selected");
    expect(screen.getByText("A").closest("label")).not.toHaveClass("selected");
  });
});
