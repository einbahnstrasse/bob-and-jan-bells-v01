// synth-bridge.js

let gyroEnabled = false;

function log(msg) {
  const debugEl = document.getElementById('debug-console');
  if (debugEl) {
    const p = document.createElement('p');
    p.textContent = msg;
    debugEl.appendChild(p);
  }
  console.log(msg); // Also log to browser console
}

document.addEventListener("DOMContentLoaded", () => {
  const enableButton = document.getElementById("enable-button");
  const themeToggle = document.getElementById("theme-toggle");

  enableButton.addEventListener("click", async () => {
    log("Enable Gyro button clicked");

    try {
      // Start Tone.js (required for user gesture in mobile browsers)
      await Tone.start();
      log("Tone.js started successfully. State: " + Tone.context.state);

      // Now initialize gyroscope
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          gyroEnabled = true;
          log("Gyroscope permission granted");
          startGyro();
          enableButton.style.display = "none";
        } else {
          log("Gyroscope permission denied");
        }
      } else {
        // No permission needed (non-iOS)
        gyroEnabled = true;
        log("Gyroscope permission not required");
        startGyro();
        enableButton.style.display = "none";
      }
    } catch (e) {
      log("Tone.js failed to start or gyro setup failed: " + (e.message || e));
    }
  });

  themeToggle.addEventListener("change", () => {
    const isDark = themeToggle.checked;
    document.body.className = isDark ? "dark" : "light";
    log(`Theme switched to ${isDark ? "dark" : "light"} mode`);
  });

  // Optional inline load confirmation
  log("synth-bridge.js loaded successfully.");
});
