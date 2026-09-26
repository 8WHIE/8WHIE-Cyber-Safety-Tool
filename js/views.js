function switchView(viewId) {
  // Hide all sections inside main
  const sections = document.querySelectorAll("main.content > section");
  sections.forEach(section => {
    section.classList.add("hidden");
  });

  // Show the target section
  const target = document.getElementById(viewId + "-view");
  if (target) {
    target.classList.remove("hidden");
  }

  // Update sidebar active state
  const links = document.querySelectorAll("nav.sidebar a");
  links.forEach(link => link.classList.remove("active"));

  const activeLink = document.getElementById("nav-" + viewId);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Attach event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const views = ["checklist", "password", "url", "tips", "settings"];

  views.forEach(viewId => {
    const link = document.getElementById("nav-" + viewId);
    if (link) {
      link.addEventListener("click", () => {
        switchView(viewId);
      });
    }
  });

  // Settings: Clear Data button
  const clearBtn = document.getElementById("clear-data-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all saved data?")) {
        localStorage.clear();
        alert("Data cleared. The page will now reload.");
        location.reload();
      }
    });
  }
});
