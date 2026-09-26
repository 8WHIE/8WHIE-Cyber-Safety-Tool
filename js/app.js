const checks = [
  "Use a unique password for important accounts.",
  "Enable multi-factor authentication where available.",
  "Keep your phone, tablet and computer updated.",
  "Check the website address before entering sensitive information.",
  "Never share OTPs, passwords or recovery codes.",
  "Review app permissions and remove unnecessary access.",
  "Keep important files backed up.",
  "Avoid installing software from unknown sources.",
  "Verify unexpected messages before opening links or files.",
  "Know how to report suspicious accounts, messages or websites."
];

// Load persisted state
let savedState = [];
try {
  const data = localStorage.getItem("checklistState");
  if (data) {
    savedState = JSON.parse(data);
  }
} catch (e) {
  console.error("Could not load state from localStorage");
}

const list = document.getElementById("list");

if (list) {
  checks.forEach((text, i) => {
    const row = document.createElement("div");
    row.className = "item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "c" + i;
    // Restore state if available
    if (savedState && savedState[i]) {
      checkbox.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = "c" + i;
    label.textContent = text;

    row.appendChild(checkbox);
    row.appendChild(label);

    list.appendChild(row);

    checkbox.addEventListener("change", update);
  });

  // Initial update call to set the bar and text
  update();
}

function update() {
  const inputs = [...document.querySelectorAll("#list input[type='checkbox']")];
  const done = inputs.filter(x => x.checked).length;

  const scoreEl = document.getElementById("score");
  if (scoreEl) {
    scoreEl.textContent = done + " / " + checks.length + " completed";
  }

  const barEl = document.getElementById("bar");
  if (barEl) {
    barEl.style.width = (done / checks.length * 100) + "%";
  }

  // Persist state
  const state = inputs.map(x => x.checked);
  try {
    localStorage.setItem("checklistState", JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state to localStorage");
  }
}

// Attach these to the global window object so onclick attributes still work,
// though we'll transition to proper event listeners if needed.
window.allDone = function() {
  document.querySelectorAll("#list input[type='checkbox']").forEach(x => x.checked = true);
  update();
};

window.resetList = function() {
  document.querySelectorAll("#list input[type='checkbox']").forEach(x => x.checked = false);
  update();
};

// Password Checker Integration
const passwordInput = document.getElementById("password-input");
if (passwordInput && typeof checkPasswordStrength === 'function') {
  passwordInput.addEventListener("input", (e) => {
    const result = checkPasswordStrength(e.target.value);

    const labelEl = document.getElementById("password-label");
    if (labelEl) labelEl.textContent = result.label;

    const barEl = document.getElementById("password-bar");
    if (barEl) {
      barEl.style.width = (result.score / 6 * 100) + "%";

      // Update color based on strength
      if (result.label === "Weak") {
        barEl.style.background = "#ff3b3b"; // red
      } else if (result.label === "Moderate") {
        barEl.style.background = "#ffb020"; // orange
      } else if (result.label === "Strong") {
        barEl.style.background = "#10b981"; // green
      } else {
        barEl.style.background = "var(--primary-color)";
      }
    }

    const feedbackEl = document.getElementById("password-feedback");
    if (feedbackEl) {
      feedbackEl.textContent = ''; // clear existing
      result.feedback.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        feedbackEl.appendChild(li);
      });
    }
  });
}

// URL Checker Integration
const analyzeUrlBtn = document.getElementById("analyze-url-btn");
if (analyzeUrlBtn && typeof analyzeURL === 'function') {
  analyzeUrlBtn.addEventListener("click", () => {
    const urlInput = document.getElementById("url-input");
    if (!urlInput) return;

    const result = analyzeURL(urlInput.value);

    const resultContainer = document.getElementById("url-result");
    if (resultContainer) resultContainer.style.display = "block";

    const statusEl = document.getElementById("url-status");
    if (statusEl) {
      if (!result.valid) {
        statusEl.textContent = "Invalid";
        statusEl.style.color = "#ff3b3b";
      } else if (result.isSuspicious) {
        statusEl.textContent = "Suspicious";
        statusEl.style.color = "#ffb020";
      } else {
        statusEl.textContent = "Looks OK";
        statusEl.style.color = "#10b981";
      }
    }

    const domainEl = document.getElementById("url-domain");
    if (domainEl) {
      domainEl.textContent = result.domain ? `Domain: ${result.domain}` : '';
    }

    const feedbackEl = document.getElementById("url-feedback");
    if (feedbackEl) {
      feedbackEl.textContent = ''; // clear existing
      result.feedback.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        feedbackEl.appendChild(li);
      });
    }
  });
}
