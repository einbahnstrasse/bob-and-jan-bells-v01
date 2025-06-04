import SynthEngine from './synth-engine.js';

let synth;
let isAudioStarted = false;

function log(msg) {
  const logDiv = document.getElementById('log-content');
  if (logDiv) {
    const line = document.createElement('div');
    line.textContent = msg;
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

function setupGyroListener() {
  window.addEventListener('deviceorientation', (event) => {
    if (synth) {
      synth.processGyroData(event.alpha, event.beta, event.gamma);
    }
  });
  log("Gyro listener set up.");
}

document.getElementById('enable-button').addEventListener('click', async () => {
  try {
    await Tone.start();
    isAudioStarted = true;
    log("Tone.js AudioContext started");

    const selectedURL = document.getElementById('sound-selector').value;
    synth = new SynthEngine(selectedURL, log);
    log("SynthEngine initialized with sound file.");

    setupGyroListener();
    document.getElementById('enable-button').style.display = 'none';
  } catch (err) {
    log("Error starting audio or synth engine: " + err.message);
  }
});
