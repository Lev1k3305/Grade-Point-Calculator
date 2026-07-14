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

  it("updates aria-valuetext on stability bar", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const stabilityFill = document.getElementById("stability-fill");

    scoreInput.value = "95";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.getAttribute("aria-valuetext")).toBe(
      "Score: 95%, Grade: A plus (EXCELLENT // DISTINCTION)",
    );

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.getAttribute("aria-valuetext")).toBe(
      "Score: 85%, Grade: A (GOOD // ABOVE_AVERAGE)",
    );

    scoreInput.value = "";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.hasAttribute("aria-valuetext")).toBe(false);
  });

  it("applies perfect-glow class for score of 100", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const stabilityFill = document.getElementById("stability-fill");

    scoreInput.value = "100";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.classList.contains("perfect-glow")).toBe(true);

    scoreInput.value = "99";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(stabilityFill.classList.contains("perfect-glow")).toBe(false);
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
    const calcShortcut = document.getElementById("calc-shortcut");
    const resetShortcut = document.getElementById("reset-shortcut");

    // Test calc shortcut
    scoreInput.value = "75";
    calcShortcut.click();
    expect(document.getElementById("res").textContent).toBe("B");

    // Test reset shortcut
    resetShortcut.click();
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

  it("handles interactive shortcut buttons", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const res = document.getElementById("res");
    const calcShortcut = document.getElementById("calc-shortcut");
    const copyShortcut = document.getElementById("copy-shortcut");
    const resetShortcut = document.getElementById("reset-shortcut");

    // Mock clipboard
    window.navigator.clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    // Test Reset Shortcut
    scoreInput.value = "90";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(res.textContent).toBe("A+");
    resetShortcut.click();
    expect(scoreInput.value).toBe("");
    expect(res.textContent).toBe("--");

    // Test Calc Shortcut
    scoreInput.value = "80";
    calcShortcut.click();
    expect(res.textContent).toBe("A");

    // Test Copy Shortcut
    copyShortcut.click();
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith("A");
  });

  it("handles 'G' next goal shortcut", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const goalShortcut = document.getElementById("goal-shortcut");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    // Check goal shortcut visibility
    expect(goalShortcut.classList.contains("hidden")).toBe(false);

    // Test 'G' keydown
    scoreInput.blur();
    const event = new window.KeyboardEvent("keydown", { key: "g" });
    window.dispatchEvent(event);
    expect(scoreInput.value).toBe("90");
    expect(document.getElementById("res").textContent).toBe("A+");

    // Check goal shortcut visibility at max level
    expect(goalShortcut.classList.contains("hidden")).toBe(true);
  });

  it("updates next goal shortcut aria-label and functionality", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const goalShortcut = document.getElementById("goal-shortcut");

    scoreInput.value = "75";
    scoreInput.dispatchEvent(new window.Event("input"));

    expect(goalShortcut.textContent).toBe("[G] TO [A]");

    goalShortcut.click();
    expect(scoreInput.value).toBe("80");
    expect(document.getElementById("res").textContent).toBe("A");
  });

  it("updates shortcut text contextually", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const copyShortcut = document.getElementById("copy-shortcut");
    const goalShortcut = document.getElementById("goal-shortcut");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    expect(copyShortcut.textContent).toBe("[C] COPY [A]");
    expect(copyShortcut.getAttribute("aria-label")).toBe(
      "Press C to copy grade A",
    );
    expect(goalShortcut.textContent).toBe("[G] TO [A+]");
    expect(goalShortcut.getAttribute("aria-label")).toBe(
      "Press G to reach grade A plus",
    );

    scoreInput.value = "75";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(copyShortcut.textContent).toBe("[C] COPY [B]");
    expect(goalShortcut.textContent).toBe("[G] TO [A]");
  });

  it("triggers copy action when 'c' is pressed and input is not focused", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const copyBtn = document.getElementById("copy-btn");

    // Mock clipboard
    const writeTextMock = vi.fn().mockResolvedValue();
    Object.defineProperty(window.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    // Set a valid score to show copy button
    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(copyBtn.classList.contains("hidden")).toBe(false);

    // Focus away from input (default in JSDOM is body)
    document.body.focus();

    // Trigger 'c' keydown on window
    const event = new window.KeyboardEvent("keydown", {
      key: "c",
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(writeTextMock).toHaveBeenCalledWith("A");
  });

  it("persists score to localStorage on input", () => {
    const { document, localStorage } = window;
    const scoreInput = document.getElementById("score");

    scoreInput.value = "42";
    scoreInput.dispatchEvent(new window.Event("input"));

    expect(localStorage.getItem("gpa_score")).toBe("42");
  });

  it("restores score from localStorage on load", () => {
    // Setup localStorage before creating the JSDOM instance
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost",
      beforeParse(window) {
        window.localStorage.setItem("gpa_score", "88");
      },
    });

    const { document } = dom.window;
    const scoreInput = document.getElementById("score");
    const res = document.getElementById("res");

    expect(scoreInput.value).toBe("88");
    expect(res.textContent).toBe("A");
  });

  it("updates score when next goal button is clicked", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const status = document.getElementById("status");

    scoreInput.value = "45";
    scoreInput.dispatchEvent(new window.Event("input"));

    const nextGoalBtn = status.querySelector(".status-link");
    expect(nextGoalBtn).not.toBeNull();
    expect(nextGoalBtn.textContent).toBe("[ +5 TO D ]");

    nextGoalBtn.click();
    expect(scoreInput.value).toBe("50");
    expect(document.getElementById("res").textContent).toBe("D");
  });

  it("triggers copy on 'C' keydown when not focused on input", () => {
    const { document, window: win } = window;
    const scoreInput = document.getElementById("score");

    // Mock clipboard
    win.navigator.clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    // Set a grade first
    scoreInput.value = "95";
    scoreInput.dispatchEvent(new win.Event("input"));

    // Focus away from input
    scoreInput.blur();

    const event = new win.KeyboardEvent("keydown", { key: "c" });
    win.dispatchEvent(event);

    expect(win.navigator.clipboard.writeText).toHaveBeenCalledWith("A+");
  });

  it("applies status classes to score input based on grade tier", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");

    // Good status (A+)
    scoreInput.value = "95";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(scoreInput.classList.contains("status-good")).toBe(true);

    // Ok status (C)
    scoreInput.value = "65";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(scoreInput.classList.contains("status-ok")).toBe(true);

    // Fail status (F)
    scoreInput.value = "45";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(scoreInput.classList.contains("status-fail")).toBe(true);
  });

  it("updates input via updateInput helper", () => {
    const { document, window: win } = window;
    const scoreInput = document.getElementById("score");
    const { updateInput } = win;

    updateInput("85");
    expect(scoreInput.value).toBe("85");
    expect(document.getElementById("res").textContent).toBe("A");
    expect(document.activeElement).toBe(scoreInput);
    expect(scoreInput.classList.contains("status-good")).toBe(true);
  });

  it("handles Shift+ArrowUp and Shift+ArrowDown for jumping by 10", () => {
    const { document, window: win } = window;
    const scoreInput = document.getElementById("score");

    scoreInput.value = "50";
    scoreInput.dispatchEvent(new win.Event("input"));

    // Shift + ArrowUp
    const upEvent = new win.KeyboardEvent("keydown", {
      key: "ArrowUp",
      shiftKey: true,
      bubbles: true,
    });
    scoreInput.dispatchEvent(upEvent);
    expect(scoreInput.value).toBe("60");

    // Shift + ArrowDown
    const downEvent = new win.KeyboardEvent("keydown", {
      key: "ArrowDown",
      shiftKey: true,
      bubbles: true,
    });
    scoreInput.dispatchEvent(downEvent);
    expect(scoreInput.value).toBe("50");

    // Clamping at 100
    scoreInput.value = "95";
    scoreInput.dispatchEvent(upEvent);
    expect(scoreInput.value).toBe("100");

    // Clamping at 0
    scoreInput.value = "5";
    scoreInput.dispatchEvent(downEvent);
    expect(scoreInput.value).toBe("0");
  });

  it("resets copy state when input changes", async () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const copyBtn = document.getElementById("copy-btn");

    // Mock clipboard
    window.navigator.clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    scoreInput.value = "90";
    scoreInput.dispatchEvent(new window.Event("input"));

    copyBtn.click();
    // Wait for the clipboard promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(copyBtn.textContent).toBe("[COPIED]");

    scoreInput.value = "80";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(copyBtn.textContent).toBe("[COPY]");
  });

  it("shows ghost preview on goal button hover/focus", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const stabilityGhost = document.getElementById("stability-ghost");
    const status = document.getElementById("status");
    const goalShortcut = document.getElementById("goal-shortcut");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));

    // Dynamic goal button
    const nextGoalBtn = status.querySelector(".status-link");
    expect(nextGoalBtn).not.toBeNull();

    // Hover
    nextGoalBtn.dispatchEvent(new window.Event("mouseenter"));
    expect(stabilityGhost.style.width).toBe("90%");

    // Unhover
    nextGoalBtn.dispatchEvent(new window.Event("mouseleave"));
    expect(stabilityGhost.style.width).toBe("0%");

    // Focus
    nextGoalBtn.dispatchEvent(new window.Event("focus"));
    expect(stabilityGhost.style.width).toBe("90%");

    // Blur
    nextGoalBtn.dispatchEvent(new window.Event("blur"));
    expect(stabilityGhost.style.width).toBe("0%");

    // Goal Shortcut Hover
    goalShortcut.dispatchEvent(new window.Event("mouseenter"));
    expect(stabilityGhost.style.width).toBe("90%");

    // Goal Shortcut Unhover
    goalShortcut.dispatchEvent(new window.Event("mouseleave"));
    expect(stabilityGhost.style.width).toBe("0%");
  });
});
