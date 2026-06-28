import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

describe("Grade Calculation Logic", () => {
  let dom;
  let window;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
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

  it("displays next goal hint in status message", () => {
    const { document } = window;
    const scoreInput = document.getElementById("score");
    const status = document.getElementById("status");

    scoreInput.value = "45";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +5 TO D ]");

    scoreInput.value = "85";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +5 TO A+ ]");

    scoreInput.value = "95";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ MAX_LEVEL ]");

    scoreInput.value = "89.5";
    scoreInput.dispatchEvent(new window.Event("input"));
    expect(status.textContent).toContain("[ +0.5 TO A+ ]");
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

    expect(goalShortcut.textContent).toContain("[G] NEXT GOAL");

    goalShortcut.click();
    expect(scoreInput.value).toBe("80");
    expect(document.getElementById("res").textContent).toBe("A");
  });
});
