// Create on-page debug console function
window.log = function (...args) {
  const debugDiv = document.getElementById("debug-console");
  if (debugDiv) {
    const line = document.createElement("div");
    line.textContent = args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" ");
    debugDiv.appendChild(line);
    debugDiv.scrollTop = debugDiv.scrollHeight;
  }
  console.log(...args);
};

// Hook into theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      log("Theme toggled. New theme:", toggle.checked ? "Dark" : "Light");
    });
  }

  // Hook into gyro enabling
  const enableButton = document.getElementById("enable-button");
  if (enableButton) {
    enableButton.addEventListener("click", () => {
      log("Enable Gyro button clicked. Waiting for motion data...");
    });

    window.addEventListener("deviceorientation", (event) => {
      if (event.alpha || event.beta || event.gamma) {
        log("Gyroscope data received:", {
          alpha: event.alpha.toFixed(2),
          beta: event.beta.toFixed(2),
          gamma: event.gamma.toFixed(2)
        });
      }
    }, { once: true }); // Only log the first reading for now
  }
});
