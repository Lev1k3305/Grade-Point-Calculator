document.addEventListener("DOMContentLoaded", () => {
  const courseList = document.getElementById("course-list");
  const addCourseBtn = document.getElementById("add-course");
  const resetFormBtn = document.getElementById("reset-form");
  const gpaDisplay = document.getElementById("gpa-display");

  let courseCount = 1;

  const createCourseRow = (index) => {
    const row = document.createElement("div");
    row.className = "course-row";
    row.setAttribute("role", "listitem");
    row.innerHTML = `
            <div class="field">
                <label for="course-${index}-name">Course Name</label>
                <input type="text" id="course-${index}-name" name="course-name" placeholder="e.g. Mathematics">
            </div>
            <div class="field">
                <label for="course-${index}-grade">Grade</label>
                <select id="course-${index}-grade" name="grade">
                    <option value="4.0">A</option>
                    <option value="3.7">A-</option>
                    <option value="3.3">B+</option>
                    <option value="3.0">B</option>
                    <option value="2.7">B-</option>
                    <option value="2.3">C+</option>
                    <option value="2.0">C</option>
                    <option value="1.7">C-</option>
                    <option value="1.3">D+</option>
                    <option value="1.0">D</option>
                    <option value="0.0">F</option>
                </select>
            </div>
            <div class="field">
                <label for="course-${index}-credits">Credits</label>
                <input type="number" id="course-${index}-credits" name="credits" min="0" step="0.5" value="3">
            </div>
            <button type="button" class="remove-course" aria-label="Remove course">
                &times;
            </button>
        `;

    row.querySelector(".remove-course").addEventListener("click", () => {
      row.remove();
      calculateGPA();
    });

    return row;
  };

  const calculateGPA = () => {
    const rows = document.querySelectorAll(".course-row");
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach((row) => {
      const grade = parseFloat(row.querySelector('select[name="grade"]').value);
      const credits =
        parseFloat(row.querySelector('input[name="credits"]').value) || 0;

      totalPoints += grade * credits;
      totalCredits += credits;
    });

    const gpa =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    updateResults(gpa);
  };

  const updateResults = (gpa) => {
    gpaDisplay.innerText = gpa;
    const val = parseFloat(gpa);

    gpaDisplay.classList.remove("gpa-high", "gpa-mid", "gpa-low");

    if (val >= 3.5) {
      gpaDisplay.classList.add("gpa-high");
    } else if (val >= 2.0) {
      gpaDisplay.classList.add("gpa-mid");
    } else if (val > 0) {
      gpaDisplay.classList.add("gpa-low");
    }
  };

  addCourseBtn.addEventListener("click", () => {
    const newRow = createCourseRow(courseCount++);
    courseList.appendChild(newRow);

    // UX Improvement: Focus the first input of the new row
    const firstInput = newRow.querySelector("input");
    if (firstInput) firstInput.focus();

    calculateGPA();
  });

  resetFormBtn.addEventListener("click", () => {
    courseList.innerHTML = "";
    courseCount = 0;
    courseList.appendChild(createCourseRow(courseCount++));
    calculateGPA();
  });

  courseList.addEventListener("input", calculateGPA);

  // Initial calculation
  calculateGPA();
});
