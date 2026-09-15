import { useEffect, useRef } from "react";
import { highlightJS } from "../utils/highlight.js";

/**
 * A textarea with transparent text sitting on top of a syntax-highlighted
 * <pre> layer, kept in sync on every keystroke and scroll event.
 */
export default function CodeEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = highlightJS(value) + "\n";
    }
  }, [value]);

  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e) => {
    // Allow Tab to insert spaces instead of moving focus
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="code-editor-wrap">
      <pre className="code-highlight" ref={highlightRef} aria-hidden="true" />
      <textarea
        ref={textareaRef}
        className="code-input"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
