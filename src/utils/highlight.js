export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

const JS_KEYWORDS =
  "const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|yield|import|export|default|from|static|get|set|delete|void|null|undefined|true|false|super";

const JS_TOKEN_PATTERN = new RegExp(
  "(\\/\\/[^\\n]*)" + // 1: line comment
    "|(\\/\\*[\\s\\S]*?\\*\\/)" + // 2: block comment
    "|(`(?:\\\\.|[^`\\\\])*`)" + // 3: template string
    '|("(?:\\\\.|[^"\\\\])*")' + // 4: double-quoted string
    "|('(?:\\\\.|[^'\\\\])*')" + // 5: single-quoted string
    "|(\\b\\d+\\.?\\d*\\b)" + // 6: number
    "|(\\b(?:" + JS_KEYWORDS + ")\\b)" + // 7: keyword
    "|(\\b[A-Za-z_$][\\w$]*(?=\\s*\\())", // 8: function call name
  "g"
);

/**
 * Tokenizes and HTML-escapes JS source, wrapping recognized tokens in
 * <span class="tok-*"> for CSS-driven syntax highlighting.
 */
export function highlightJS(code) {
  code = code || "";
  let result = "";
  let lastIndex = 0;
  let m;
  JS_TOKEN_PATTERN.lastIndex = 0;
  while ((m = JS_TOKEN_PATTERN.exec(code)) !== null) {
    result += escapeHtml(code.slice(lastIndex, m.index));
    const [match, comment1, comment2, template, dstring, sstring, number, keyword, func] = m;
    let cls = null;
    if (comment1 || comment2) cls = "tok-comment";
    else if (template || dstring || sstring) cls = "tok-string";
    else if (number) cls = "tok-number";
    else if (keyword) cls = "tok-keyword";
    else if (func) cls = "tok-function";
    const escapedMatch = escapeHtml(match);
    result += cls ? `<span class="${cls}">${escapedMatch}</span>` : escapedMatch;
    lastIndex = JS_TOKEN_PATTERN.lastIndex;
    if (m.index === JS_TOKEN_PATTERN.lastIndex) JS_TOKEN_PATTERN.lastIndex++;
  }
  result += escapeHtml(code.slice(lastIndex));
  return result;
}
