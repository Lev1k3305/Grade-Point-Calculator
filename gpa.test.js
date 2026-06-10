import { describe, it, expect, beforeEach } from "vitest";
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
});
