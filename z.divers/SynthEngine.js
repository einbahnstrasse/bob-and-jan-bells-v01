// SynthEngine.js
import * as Tone from 'tone';

console.log('[SynthEngine] Loaded');

let player;

export async function initSynth() {
  console.log('[SynthEngine] Initializing Tone.js...');
  await Tone.start();
  console.log('[SynthEngine] Tone.js started');

  player = new Tone.Player({
    url: './media/archeos-bell.wav',
    autostart: false,
    onload: () => console.log('[SynthEngine] Audio loaded successfully'),
  }).toDestination();
}

export function triggerBell() {
  if (player) {
    console.log('[SynthEngine] Playing bell');
    player.start();
  } else {
    console.error('[SynthEngine] Player not initialized');
  }
}
