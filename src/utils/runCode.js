function formatLogArg(arg) {
  if (typeof arg === "string") return arg;
  if (arg === undefined) return "undefined";
  try {
    if (Array.isArray(arg)) return "[ " + arg.map(formatLogArg).join(", ") + " ]";
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

/**
 * Runs user-submitted JS in an async wrapper, capturing console.log output
 * instead of letting it hit the real console. Returns { output, error }.
 */
export async function runUserCode(code) {
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.map(formatLogArg).join(" "));
  };

  let error = null;
  try {
    // Wrap in an async IIFE so top-level await works in user code
    const runner = new Function(`
      "use strict";
      return (async () => {
        ${code}
      })();
    `);
    await runner();
  } catch (err) {
    error = err.message;
  } finally {
    console.log = originalLog;
  }

  return { output: logs.join("\n"), error };
}
