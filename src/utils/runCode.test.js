import { describe, it, expect } from "vitest";
import { runUserCode } from "./runCode.js";

describe("runUserCode", () => {
  it("captures console.log output", async () => {
    const result = await runUserCode('console.log("Hello")');
    expect(result.output).toBe("Hello");
    expect(result.error).toBeNull();
  });

  it("captures multiple log lines in order", async () => {
    const result = await runUserCode('console.log(1); console.log(2); console.log(3);');
    expect(result.output).toBe("1\n2\n3");
  });

  it("formats arrays without quoting string elements", async () => {
    const result = await runUserCode('console.log(["a", "b"])');
    expect(result.output).toBe("[ a, b ]");
  });

  it("captures runtime errors instead of throwing", async () => {
    const result = await runUserCode("thisIsNotDefined()");
    expect(result.error).toBeTruthy();
  });

  it("supports top-level await", async () => {
    const result = await runUserCode('await Promise.resolve(); console.log("done")');
    expect(result.output).toBe("done");
  });

  it("restores the original console.log after running", async () => {
    const original = console.log;
    await runUserCode('console.log("x")');
    expect(console.log).toBe(original);
  });
});
