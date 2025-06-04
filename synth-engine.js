// --- synth-engine.js ---
// Handles granular synthesis using Tone.js

let player, grainPlayer;

async function initSynth(url) {
  await Tone.start();
  player = new Tone.Player(url);
  await player.load();

  grainPlayer = new Tone.GrainPlayer({
    url: url,
    grainSize: 0.2,
    overlap: 0.1,
    loop: true
  }).toDestination();
  grainPlayer.sync().start(0);
}

function updateSynthParams({ alpha, beta, gamma }) {
  if (!grainPlayer) return;
  
  // Map gyro data to parameters
  const absMotion = Math.abs(alpha) + Math.abs(beta) + Math.abs(gamma);

  // Silence on stillness
  grainPlayer.volume.value = Tone.gainToDb(Math.min(absMotion / 60, 1) * 0.5);

  // Map beta to grain size
  grainPlayer.grainSize = 0.01 + (Math.abs(beta) / 180) * 0.5;

  // Map alpha to playback rate
  grainPlayer.playbackRate = 0.5 + (alpha + 360) % 360 / 720;

  // Map gamma to position
  const pos = ((gamma + 90) / 180) * player.buffer.duration;
  grainPlayer.set({ position: pos });
}
