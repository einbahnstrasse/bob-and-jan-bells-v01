document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".animated-title");

  function randomizeFont() {
    const wght = Math.floor(Math.random() * 300) + 200;
    const wdth = Math.floor(Math.random() * 100) + 100;

    title.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;

    const nextDelay = Math.random() * 100 + 40;
    setTimeout(randomizeFont, nextDelay);
  }

  randomizeFont();
});


let sampler;
const gainNode = new Tone.Gain().toDestination();

function createSampler(filename) {
  return new Tone.Sampler({
    urls: { C4: "./media/" + filename },
    onload: () => log("Loaded: " + filename)
  });
}

document.getElementById('mute-toggle').addEventListener('change', (e) => {
  const isMuted = e.target.checked;
  gainNode.gain.rampTo(isMuted ? 0 : 1, 0.1); // smooth fade over 100ms
  log("Audio " + (isMuted ? "muted" : "unmuted"));
});

document.getElementById("bell-select").addEventListener("change", (e) => {
  const newSample = e.target.value;
  if (sampler) {
    sampler.disconnect();
    sampler.dispose();
  }
  sampler = createSampler(newSample);
  sampler.connect(gainNode);
  log("Switched to: " + newSample);
});

function log(message) {
  const logDiv = document.getElementById("debug-log");
  if (logDiv) {
    const entry = document.createElement("div");
    entry.textContent = message;
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

const alphaData = [], betaData = [], gammaData = [];
const maxPoints = 100;

function updateGraph(ctx, dataArray, newVal) {
  if (dataArray.length >= maxPoints) dataArray.shift();
  dataArray.push(newVal);

  const min = Math.min(...dataArray);
  const max = Math.max(...dataArray);
  const range = max - min || 1;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();

  dataArray.forEach((val, i) => {
    const x = (i / maxPoints) * ctx.canvas.width;
    const y = ctx.canvas.height * (1 - (val - min) / range);
    ctx.lineTo(x, y);
  });

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent');
  ctx.stroke();
}

async function setupSampler() {
  await Tone.start();
  log("Tone.js started");

  sampler = createSampler(document.getElementById("bell-select").value);
  sampler.connect(gainNode);
}

function triggerBell(a, b, g, detune = 0, volume = 0) {
  if (!sampler) return;
  sampler.volume.value = volume;

  if (Math.abs(b) > 30) {
    const normalizedAlpha = Math.max(-180, Math.min(180, a));
    const pitchNote = pitchRange[Math.floor((normalizedAlpha + 180) / 360 * pitchRange.length)] || "C4";
    const velocity = Math.max(0.1, Math.min(1, Math.abs(b) / 90));
    sampler.triggerAttack(pitchNote, undefined, velocity);
    log(`Triggered note: ${pitchNote}, Velocity: ${velocity.toFixed(2)} (α=${a.toFixed(2)} β=${b.toFixed(2)})`);
  }

  log(`Triggered bell | Detune: ${detune.toFixed(2)} cents | Volume: ${volume.toFixed(2)} dB`);
}

document.getElementById('enable-button').addEventListener('click', async () => {
  await setupSampler();
  log("Button clicked. Triggering sound.");
  triggerBell();

  const enableGyro = () => {
    window.addEventListener('devicemotion', (event) => {
      const a = event.rotationRate.alpha || 0;
      const b = event.rotationRate.beta || 0;
      const g = event.rotationRate.gamma || 0;

      document.getElementById('alphaLabel').textContent = `Pitch (<em><b>rotate</b></em> left &#x2194; right): ${a.toFixed(2)}`;
      document.getElementById('betaLabel').textContent = `Trigger (<em><b>tilt</b></em> front &#x2194; back): ${b.toFixed(2)}`;
      document.getElementById('gammaLabel').textContent = `Volume (<em><b>lean</b></em> side &#x2194; side): ${g.toFixed(2)}`;

      updateGraph(alphaChart.getContext('2d'), alphaData, a);
      updateGraph(betaChart.getContext('2d'), betaData, b);
      updateGraph(gammaChart.getContext('2d'), gammaData, g);

      const detune = Math.max(-500, Math.min(500, b * 3));
      const volume = Math.max(-20, Math.min(0, g / 10));
      triggerBell(a, b, g, detune, volume);
    });
  };

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          log("Gyro permission granted");
          enableGyro();
        } else {
          alert('Permission denied.');
          log('Permission denied.');
        }
      })
      .catch(console.error);
  } else {
    enableGyro();
  }
});

document.getElementById('theme-toggle').addEventListener('change', (e) => {
  const isDark = e.target.checked;
  document.body.classList.toggle('light', !isDark);
  document.body.classList.toggle('dark', isDark);
  log("Theme toggled: " + (isDark ? "dark" : "light"));
});

document.getElementById('info-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('overlay').classList.add('active');
});
document.getElementById('overlay-close').addEventListener('click', () => {
  document.getElementById('overlay').classList.remove('active');
});

document.getElementById('help-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('overlay-help').classList.add('active');
});
document.getElementById('overlay-close-help').addEventListener('click', () => {
  document.getElementById('overlay-help').classList.remove('active');
});

document.getElementById('credits-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('overlay-credits').classList.add('active');
});
document.getElementById('overlay-close-credits').addEventListener('click', () => {
  document.getElementById('overlay-credits').classList.remove('active');
});

document.getElementById("howto-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("overlay-howto").classList.add("active");
});

// maybe this one is better:
// document.getElementById('howto-link').addEventListener('click', function () {
//   document.getElementById('overlay-howto').classList.add('active');
//   document.getElementById('menu-toggle').checked = false; 
// });

document.getElementById('overlay-close-howto').addEventListener('click', () => {
  document.getElementById('overlay-howto').classList.remove('active');
});

document.getElementById('howto-link').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('overlay-howto').classList.add('active');
});

document.getElementById('overlay-close-howto').addEventListener('click', function () {
  document.getElementById('overlay-howto').classList.remove('active');
});





const noteMap = Array.from({ length: 128 }, (_, i) => Tone.Frequency(i, "midi").toNote());

const pitchSlider = document.getElementById("pitch-slider");
noUiSlider.create(pitchSlider, {
  start: [48, 72],
  step: 1,
  connect: true,
  orientation: 'vertical',
  // height: calc(100vh - 100px); /* or fine-tune with px or % */
  direction: 'rtl',
  range: {
    min: 24,
    max: 96
  },
  tooltips: [true, true],
  format: {
    to: value => Math.round(value),
    from: value => Number(value)
  }
});

let pitchRange = noteMap.slice(48, 73);

pitchSlider.noUiSlider.pips({
  mode: 'values',
  values: [24, 36, 48, 60, 72, 84, 96],
  density: 10,
  format: {
    to: value => Tone.Frequency(value, "midi").toNote(),
    from: () => {}
  }
});

pitchSlider.noUiSlider.on('update', (values, handle, rawVals) => {
  const [low, high] = rawVals.map(v => Math.round(v));
  pitchRange = noteMap.slice(low, high + 1);

  const label = document.getElementById("pitch-label");
  if (label) {
    label.textContent = `Pitch Range: ${noteMap[low]} – ${noteMap[high]}`;
  }

  const tooltips = pitchSlider.querySelectorAll('.noUi-tooltip');
  if (tooltips.length === 2) {
    tooltips[0].textContent = noteMap[low];
    tooltips[1].textContent = noteMap[high];
  }
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('menu-toggle').checked = false;
  });
});

document.getElementById('menu-close').addEventListener('click', () => {
  document.getElementById('menu-toggle').checked = false;
});

