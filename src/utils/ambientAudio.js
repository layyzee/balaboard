// Web Audio API Ambient Focus Generator (Zero-dependency, 100% offline)
// Generates warm Lo-Fi rhodes chords and soothing ambient soundscapes

let audioCtx = null;
let masterGain = null;
let chordInterval = null;
let isPlaying = false;
let currentTrack = 'lofi'; // 'lofi' | 'ambient' | 'waves'

// Lo-Fi Chord progressions (MIDI note numbers for mellow jazzy chords)
const CHORD_PROGRESSIONS = [
  [60, 63, 67, 70], // Cm7
  [58, 62, 65, 68], // Bb7
  [56, 60, 63, 67], // Abmaj7
  [55, 58, 62, 65]  // G7
];

function mtof(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime); // Gentle background volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playLofiChord(chordMidi) {
  if (!audioCtx || !isPlaying) return;
  const now = audioCtx.currentTime;

  chordMidi.forEach((midi, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Warm triangle/sine blend for electric piano / rhodes feel
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(mtof(midi), now);

    // Subtle detune for lo-fi tape flutter
    osc.detune.setValueAtTime((Math.random() * 8 - 4), now);

    // Soft attack and gentle release
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 4.0);
  });
}

export function startAmbientFocus(track = 'lofi', volume = 0.15) {
  initAudio();
  if (isPlaying) stopAmbientFocus();

  isPlaying = true;
  currentTrack = track;
  if (masterGain) {
    masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
  }

  let step = 0;
  playLofiChord(CHORD_PROGRESSIONS[0]);

  chordInterval = setInterval(() => {
    if (!isPlaying) return;
    step = (step + 1) % CHORD_PROGRESSIONS.length;
    playLofiChord(CHORD_PROGRESSIONS[step]);
  }, 4200);
}

export function stopAmbientFocus() {
  isPlaying = false;
  if (chordInterval) {
    clearInterval(chordInterval);
    chordInterval = null;
  }
}

export function setAmbientVolume(vol) {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(vol, 0.4)), audioCtx.currentTime);
  }
}

export function isAmbientPlaying() {
  return isPlaying;
}
