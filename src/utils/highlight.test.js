import { describe, it, expect } from "vitest";
import { escapeHtml, highlightJS } from "./highlight.js";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;");
  });
});

describe("highlightJS", () => {
  it("wraps keywords in tok-keyword spans", () => {
    expect(highlightJS("const x = 1;")).toContain('class="tok-keyword"');
  });

  it("wraps string literals in tok-string spans", () => {
    expect(highlightJS('console.log("hi")')).toContain('class="tok-string"');
  });

  it("wraps line comments in tok-comment spans", () => {
    expect(highlightJS("// a comment")).toContain('class="tok-comment"');
  });

  it("wraps numbers in tok-number spans", () => {
    expect(highlightJS("const x = 42;")).toContain('class="tok-number"');
  });

  it("escapes HTML found inside the source instead of injecting it", () => {
    expect(highlightJS('const x = "<b>"')).toContain("&lt;b&gt;");
    expect(highlightJS('const x = "<b>"')).not.toContain("<b>");
  });

  it("handles empty input", () => {
    expect(highlightJS("")).toBe("");
    expect(highlightJS(undefined)).toBe("");
  });
});
