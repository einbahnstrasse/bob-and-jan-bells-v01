// --- synth-bridge.js ---
// Connect gyro motion to synthesis engine

let baseAlpha = null, baseBeta = null, baseGamma = null;

function enableGyroAndSynth() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') startSensors();
      });
  } else {
    startSensors();
  }
}

function startSensors() {
  setupGraphs();
  initSynth("https://www.dropbox.com/scl/fi/zxydx1cw718q9qlzzsc4o/archeos-bell.wav?rlkey=shbjs89f380k4wmj9i0uanjo0&dl=1");
  window.addEventListener("deviceorientation", (event) => {
    const { alpha, beta, gamma } = event;

    // Establish base on first motion
    if (baseAlpha === null) {
      baseAlpha = alpha;
      baseBeta = beta;
      baseGamma = gamma;
    }

    const relAlpha = alpha - baseAlpha;
    const relBeta = beta - baseBeta;
    const relGamma = gamma - baseGamma;

    const data = { alpha: relAlpha, beta: relBeta, gamma: relGamma };
    feedGyro(data);
    updateSynthParams(data);
  });
}

document.getElementById("enable-button").addEventListener("click", enableGyroAndSynth);
document.getElementById("theme-toggle").addEventListener("change", e => {
  document.body.classList.toggle("light", !e.target.checked);
});
document.getElementById("info-link").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("overlay").classList.add("active");
});
document.getElementById("overlay-close").addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("active");
});