import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

describe("Grade Calculation Logic", () => {
  let dom;
  let window;

  beforeEach(() => {
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost",
    });
    window = dom.window;
  });

  it("calculates A+ for score >= 90", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(95)).toBe("A+");
    expect(calculateGrade(90)).toBe("A+");
  });

  it("calculates A for score 80-89", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(85)).toBe("A");
    expect(calculateGrade(80)).toBe("A");
  });

  it("calculates B for score 70-79", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(75)).toBe("B");
    expect(calculateGrade(70)).toBe("B");
  });

  it("calculates C for score 60-69", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(65)).toBe("C");
    expect(calculateGrade(60)).toBe("C");
  });

  it("calculates D for score 50-59", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(55)).toBe("D");
    expect(calculateGrade(50)).toBe("D");
  });

  it("calculates F for score < 50", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(45)).toBe("F");
    expect(calculateGrade(0)).toBe("F");
  });

  it("returns INVALID for scores out of range", () => {
    const { calculateGrade } = window;
    expect(calculateGrade(101)).toBe("INVALID");
    expect(calculateGrade(-1)).toBe("INVALID");
  });

  it("returns -- for empty input", () => {
    const { calculateGrade } = window;
    expect(calculateGrade("")).toBe("--");
    expect(calculateGrade(null)).toBe("--");
  });

  it("updates aria-label on result element", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const res = document.getElementById("res");

    scoreInput.value = "95";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(res.getAttribute("aria-label")).toBe("Grade: A plus");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(res.getAttribute("aria-label")).toBe("Grade: A");

    scoreInput.value = "105";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(res.getAttribute("aria-label")).toBe("Grade: None");
  });

  it("updates stability bar width and color", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const stabilityFill = document.getElementById("stability-fill");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.style.width).toBe("85%");
    expect(stabilityFill.classList.contains("stable")).toBe(true);

    scoreInput.value = "55";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.style.width).toBe("55%");
    expect(stabilityFill.classList.contains("warn")).toBe(true);

    scoreInput.value = "30";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.style.width).toBe("30%");
    expect(stabilityFill.classList.contains("crit")).toBe(true);

    scoreInput.value = "";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.style.width).toBe("0%");
  });

  it("has correct accessibility attributes on stability bar", () => {
    const { document } = window;
    const stabilityFill = document.getElementById("stability-fill");

    expect(stabilityFill.getAttribute("role")).toBe("progressbar");
    expect(stabilityFill.getAttribute("aria-valuemin")).toBe("0");
    expect(stabilityFill.getAttribute("aria-valuemax")).toBe("100");
    expect(stabilityFill.getAttribute("aria-label")).toBe("Score progress");
  });

  it("updates aria-valuenow on stability bar during input", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const stabilityFill = document.getElementById("stability-fill");

    scoreInput.value = "75";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.getAttribute("aria-valuenow")).toBe("75");

    scoreInput.value = "100";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.getAttribute("aria-valuenow")).toBe("100");
  });

  it("displays special PERFECT status for score of 100", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const status = document.getElementById("status");

    scoreInput.value = "100";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("PERFECT // CRITICAL_SUCCESS");
  });

  it("displays next goal hint in status message", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const status = document.getElementById("status");

    scoreInput.value = "45";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +5 TO D ] [G]");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +5 TO A+ ] [G]");

    scoreInput.value = "95";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ MAX_LEVEL ]");

    scoreInput.value = "89.5";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +0.5 TO A+ ] [G]");
  });

  it("sets score when clicking next goal button", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const status = document.getElementById("status");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    const nextGoalBtn = status.querySelector(".status-link");
    expect(nextGoalBtn).not.toBeNull();
    expect(nextGoalBtn.textContent).toContain("A+");

    nextGoalBtn.click();
    expect(scoreInput.value).toBe("90");
    expect(document.getElementById("res").textContent).toBe("A+");
    expect(document.activeElement).toBe(scoreInput);
  });

  it("triggers next goal on 'g' keydown", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    // Ensure it doesn't trigger if input is focused
    scoreInput.focus();
    const event1 = new window.KeyboardEvent("keydown", {
      key: "g",
      bubbles: true,
    });
    window.dispatchEvent(event1);
    expect(scoreInput.value).toBe("85");

    // Ensure it triggers if input is not focused
    scoreInput.blur();
    const event2 = new window.KeyboardEvent("keydown", {
      key: "g",
      bubbles: true,
    });
    window.dispatchEvent(event2);
    expect(scoreInput.value).toBe("90");
    expect(document.activeElement).toBe(scoreInput);
  });

  it("triggers actions when clicking shortcut buttons", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const shortcutCalc = document.getElementById("shortcut-calc");
    const shortcutReset = document.getElementById("shortcut-reset");

    // Test calc shortcut
    scoreInput.value = "75";
    shortcutCalc.click();
    expect(document.getElementById("res").textContent).toBe("B");

    // Test reset shortcut
    shortcutReset.click();
    expect(scoreInput.value).toBe("");
    expect(document.getElementById("res").textContent).toBe("--");
    expect(document.activeElement).toBe(scoreInput);
  });

  it("triggers copy on 'c' keydown", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");

    // Mock clipboard
    window.navigator.clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    scoreInput.value = "90";
    scoreInput.dispatchEvent(new window.Event("input"));

    // Ensure it doesn't trigger if input is focused
    scoreInput.focus();
    const event1 = new window.KeyboardEvent("keydown", { key: "c" });
    window.dispatchEvent(event1);
    expect(window.navigator.clipboard.writeText).not.toHaveBeenCalled();

    // Ensure it triggers if input is not focused
    scoreInput.blur();
    const event2 = new window.KeyboardEvent("keydown", { key: "c" });
    window.dispatchEvent(event2);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith("A+");
  });

  it("triggers pulse animations on shortcut hints during keyboard interaction", () => {
    const { document } = window;
    const shortcutCalc = document.getElementById("shortcut-calc");
    const shortcutReset = document.getElementById("shortcut-reset");
    const scoreInput = document.getElementById("score");

    // Mock animate
    shortcutCalc.animate = vi.fn();
    shortcutReset.animate = vi.fn();

    // Trigger Enter (Calc)
    scoreInput.focus();
    const enterEvent = new window.KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    scoreInput.dispatchEvent(enterEvent);
    expect(shortcutCalc.animate).toHaveBeenCalled();

    // Trigger Escape (Reset)
    const escEvent = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    window.dispatchEvent(escEvent);
    expect(shortcutReset.animate).toHaveBeenCalled();
  });

  it("triggers pulse animations on 'c' and 'g' shortcuts", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");

    // Mock clipboard for 'c' shortcut
    window.navigator.clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    // Set value so 'C' and 'G' are available/visible
    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    const shortcutCopy = document.getElementById("shortcut-copy");
    const nextGoalBtn = document.getElementById("next-goal-btn");

    shortcutCopy.animate = vi.fn();
    nextGoalBtn.animate = vi.fn();

    scoreInput.blur();

    // Trigger 'c'
    const cEvent = new window.KeyboardEvent("keydown", {
      key: "c",
      bubbles: true,
    });
    window.dispatchEvent(cEvent);
    expect(shortcutCopy.animate).toHaveBeenCalled();

    // Trigger 'g'
    const gEvent = new window.KeyboardEvent("keydown", {
      key: "g",
      bubbles: true,
    });
    window.dispatchEvent(gEvent);
    expect(nextGoalBtn.animate).toHaveBeenCalled();
  });
});
