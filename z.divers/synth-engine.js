export default class SynthEngine {
  constructor(audioURL, log) {
    this.log = log || console.log;
    this.log("Initializing SynthEngine...");
    this.audioURL = audioURL;

    this.player = new Tone.GrainPlayer({
      url: audioURL,
      loop: true,
      grainSize: 0.2,
      overlap: 0.1,
      playbackRate: 1
    }).toDestination();

    this.player.on('load', () => {
      this.log("Audio file loaded.");
      this.player.start();
    });

    this.movementThreshold = 5;
  }

  processGyroData(alpha, beta, gamma) {
    const motionMagnitude = Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2);
    if (motionMagnitude < this.movementThreshold) {
      this.player.volume.value = -80; // mute when still
      return;
    }

    this.player.volume.value = -10 + (Math.min(motionMagnitude, 90) / 90) * 10; // fade in with movement
    this.player.grainSize = 0.05 + (Math.abs(beta) % 30) / 300; // e.g., control with beta
    this.player.playbackRate = 0.5 + (Math.abs(gamma) % 90) / 180; // gamma controls transposition

    this.log(`Motion: α=${alpha.toFixed(1)} β=${beta.toFixed(1)} γ=${gamma.toFixed(1)} | GrainSize=${this.player.grainSize.toFixed(3)} PlaybackRate=${this.player.playbackRate.toFixed(2)}`);
  }
}
