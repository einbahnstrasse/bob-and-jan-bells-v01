// Debug logger
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

// Gyro setup
function enableGyro() {
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    // iOS 13+ requires permission
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          startGyro();
        } else {
          log("Gyro permission denied.");
        }
      })
      .catch(err => {
        log("Error requesting gyro permission:", err);
      });
  } else {
    // Non-iOS browsers
    startGyro();
  }
}

// Begin listening to gyro
function startGyro() {
  log("Gyroscope permission granted. Listening for data...");
  window.addEventListener("deviceorientation", handleGyro);
}

// Actual handler
function handleGyro(event) {
  if (event.alpha === null && event.beta === null && event.gamma === null) {
    log("No gyroscope data available.");
    return;
  }

  const alpha = parseFloat(event.alpha.toFixed(2));
  const beta = parseFloat(event.beta.toFixed(2));
  const gamma = parseFloat(event.gamma.toFixed(2));

  log("Gyroscope data received:", { alpha, beta, gamma });

  // TODO: trigger synth and visualization updates here
}

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      log("Theme toggled. New theme:", toggle.checked ? "Dark" : "Light");
    });
  }

  const enableButton = document.getElementById("enable-button");
  if (enableButton) {
    enableButton.addEventListener("click", () => {
      log("Enable Gyro button clicked. Waiting for motion data...");
      enableGyro();
    });
  }
});
