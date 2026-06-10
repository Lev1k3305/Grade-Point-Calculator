import { describe, it, expect } from "vitest";

// Function to calculate GPA (extracted from script.js logic for testing)
export const calculateGPAValue = (courses) => {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((course) => {
    const grade = parseFloat(course.grade);
    const credits = parseFloat(course.credits) || 0;
    totalPoints += grade * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
};

describe("GPA Calculation", () => {
  it("should calculate correct GPA for single course", () => {
    const courses = [{ grade: "4.0", credits: "3" }];
    expect(calculateGPAValue(courses)).toBe("4.00");
  });

  it("should calculate correct GPA for multiple courses", () => {
    const courses = [
      { grade: "4.0", credits: "3" },
      { grade: "3.0", credits: "3" },
    ];
    expect(calculateGPAValue(courses)).toBe("3.50");
  });

  it("should handle zero credits", () => {
    const courses = [{ grade: "4.0", credits: "0" }];
    expect(calculateGPAValue(courses)).toBe("0.00");
  });

  it("should calculate correct GPA for mixed grades and credits", () => {
    const courses = [
      { grade: "4.0", credits: "4" },
      { grade: "2.0", credits: "2" },
    ];
    // (4*4 + 2*2) / 6 = (16+4)/6 = 20/6 = 3.333...
    expect(calculateGPAValue(courses)).toBe("3.33");
  });
});
