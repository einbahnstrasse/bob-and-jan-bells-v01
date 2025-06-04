// SynthBridge.js
import { initSynth, triggerBell } from './SynthEngine.js';
import { startGyroTracking } from './GyroGraph.js';

console.log('[SynthBridge] Loaded');

const enableBtn = document.getElementById('enable-button');

enableBtn.addEventListener('click', async () => {
  console.log('[SynthBridge] User interaction detected');
  await initSynth();
  startGyroTracking();
  triggerBell();
  enableBtn.style.display = 'none';
});
