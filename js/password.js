function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];

  if (!password) {
    return { score: 0, feedback: ["Enter a password to check its strength."], label: "None" };
  }

  // Length checks
  if (password.length > 8) {
    score += 1;
  } else {
    feedback.push("Password should be longer than 8 characters.");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Complexity checks
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters.");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters.");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers.");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (e.g., !@#$%^&*).");
  }

  // Define strength labels based on score (max 6)
  let label = "Weak";
  if (score >= 5) {
    label = "Strong";
  } else if (score >= 3) {
    label = "Moderate";
  }

  if (score >= 5 && feedback.length === 0) {
     feedback.push("Great! Your password is strong.");
  }

  return { score, feedback, label };
}

// Ensure it can be used in Node.js (for Jest) or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkPasswordStrength };
}
