// Web Audio API Procedural Realistic Formant Sound Generator for MeowLand

let audioCtx: AudioContext | null = null;
let soundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const toggleMute = () => {
  soundMuted = !soundMuted;
  return soundMuted;
};

export const isMuted = () => soundMuted;

// Realistic Formant Synthesized Cat Meow with Vocal Tract Filter & Vibrato
export function playMeowSound(type: 'cute' | 'kitten' | 'purr' | 'playful' | 'deep' = 'cute') {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Base frequencies and durations per cat personality
  let startFreq = 480;
  let peakFreq = 780;
  let endFreq = 520;
  let duration = 0.42;

  if (type === 'kitten') {
    startFreq = 720;
    peakFreq = 1150;
    endFreq = 800;
    duration = 0.32;
  } else if (type === 'deep') {
    startFreq = 310;
    peakFreq = 510;
    endFreq = 340;
    duration = 0.55;
  } else if (type === 'purr') {
    startFreq = 420;
    peakFreq = 620;
    endFreq = 460;
    duration = 0.48;
  } else if (type === 'playful') {
    startFreq = 550;
    peakFreq = 920;
    endFreq = 600;
    duration = 0.38;
  }

  // 1. Primary Vocal Oscillator (Sawtooth/Triangle blend)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc2.type = 'triangle';

  // Pitch Contour (Me-o-w glide)
  osc1.frequency.setValueAtTime(startFreq, now);
  osc1.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.35);
  osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  osc2.frequency.setValueAtTime(startFreq * 1.005, now);
  osc2.frequency.exponentialRampToValueAtTime(peakFreq * 1.005, now + duration * 0.35);
  osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.005, now + duration);

  // 2. Cat Vocal Tract Formant Filters (Simulate throat resonance ~1200Hz & ~2800Hz)
  const formant1 = ctx.createBiquadFilter();
  formant1.type = 'bandpass';
  formant1.frequency.value = 1250;
  formant1.Q.value = 3.5;

  const formant2 = ctx.createBiquadFilter();
  formant2.type = 'bandpass';
  formant2.frequency.value = 2700;
  formant2.Q.value = 4.0;

  // 3. Low Pass Filter to smooth out harsh high-end
  const lowPass = ctx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.setValueAtTime(1800, now);
  lowPass.frequency.exponentialRampToValueAtTime(2600, now + duration * 0.3);
  lowPass.frequency.exponentialRampToValueAtTime(1400, now + duration);

  // 4. Amplitude Envelope
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.22, now + 0.07);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Connect Nodes
  osc1.connect(formant1);
  osc2.connect(formant2);

  formant1.connect(lowPass);
  formant2.connect(lowPass);
  lowPass.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

// Play heart pop sound
export function playHeartPopSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

// Play chat pop chime
export function playChatPopSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(659.25, now); // E5
  osc.frequency.setValueAtTime(880, now + 0.06); // A5

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

// Play door chime when entering/exiting Coffee Shop
export function playDoorChimeSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C E G
  notes.forEach((freq, idx) => {
    const now = ctx.currentTime + idx * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  });
}

// Voice Reaction Synthesizer for Princess Companion
export function playPrincessVoiceSound(voiceKey: string) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const keyLower = voiceKey.toLowerCase();

  // Create warm cute vocal formants with lowpass filter & soft reverb feel
  const masterFilter = ctx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(3200, now);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.3, now);
  masterFilter.connect(masterGain);
  masterGain.connect(ctx.destination);

  if (keyLower.includes('mwah') || keyLower.includes('kiss') || keyLower.includes('ummaa') || keyLower.includes('umma') || keyLower.includes('heart')) {
    // REALISTIC CUTE "UMMA" / KISS SOUND 💋
    // 1. Vocal Lips Formant Glissando ("Um-ma" lip release)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscFormant = ctx.createOscillator();
    const kissGain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    oscFormant.type = 'sine';

    // Glissando pitch sweep representing "Um-ma!" lip suction release
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(1450, now + 0.08);
    osc1.frequency.exponentialRampToValueAtTime(900, now + 0.18);

    osc2.frequency.setValueAtTime(640, now);
    osc2.frequency.exponentialRampToValueAtTime(2900, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.18);

    oscFormant.frequency.setValueAtTime(480, now);
    oscFormant.frequency.exponentialRampToValueAtTime(1900, now + 0.07);

    kissGain.gain.setValueAtTime(0.001, now);
    kissGain.gain.linearRampToValueAtTime(0.28, now + 0.035);
    kissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(kissGain);
    osc2.connect(kissGain);
    oscFormant.connect(kissGain);
    kissGain.connect(masterFilter);

    osc1.start(now);
    osc2.start(now);
    oscFormant.start(now);

    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
    oscFormant.stop(now + 0.22);

    // 2. Sweet Romantic Glockenspiel Heart Chime right after kiss (C6 - E6 - G6 - C7)
    [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, now + 0.07 + i * 0.055);

      bellGain.gain.setValueAtTime(0.14, now + 0.07 + i * 0.055);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07 + i * 0.055 + 0.35);

      bell.connect(bellGain);
      bellGain.connect(masterFilter);
      bell.start(now + 0.07 + i * 0.055);
      bell.stop(now + 0.07 + i * 0.055 + 0.38);
    });
  } else if (keyLower.includes('hurraa') || keyLower.includes('yippee') || keyLower.includes('yay')) {
    // Ultra Cute Anime Cheer Arpeggio (C5 -> E5 -> G5 -> C6 -> E6)
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      oscHarmonic.type = 'triangle';

      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      oscHarmonic.frequency.setValueAtTime(freq * 2, now + i * 0.06);

      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(masterFilter);

      osc.start(now + i * 0.06);
      oscHarmonic.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.3);
      oscHarmonic.stop(now + i * 0.06 + 0.3);
    });
  } else if (keyLower.includes('hehe') || keyLower.includes('ehehe') || keyLower.includes('giggle')) {
    // Ultra Cute Anime Girl "Hehe!" Giggle (Dual Formant Staccato Trill)
    const giggleNotes = [1046.5, 1318.5, 1174.66, 1318.5, 1567.98];
    giggleNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      subOsc.type = 'triangle';

      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      subOsc.frequency.setValueAtTime(freq * 0.5, now + i * 0.06);

      gain.gain.setValueAtTime(0.16, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.09);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(masterFilter);

      osc.start(now + i * 0.06);
      subOsc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
      subOsc.stop(now + i * 0.06 + 0.1);
    });
  } else if (keyLower.includes('nyaa') || keyLower.includes('miu') || keyLower.includes('purr')) {
    // Cute Kitten Imitation & Purr
    playMeowSound('cute');
    // Sub-purr vibration
    const purrOsc = ctx.createOscillator();
    const purrGain = ctx.createGain();
    purrOsc.type = 'triangle';
    purrOsc.frequency.setValueAtTime(140, now);
    purrGain.gain.setValueAtTime(0.08, now);
    purrGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    purrOsc.connect(purrGain);
    purrGain.connect(masterFilter);
    purrOsc.start(now);
    purrOsc.stop(now + 0.42);
  } else if (keyLower.includes('hmmm') || keyLower.includes('aww') || keyLower.includes('ehh')) {
    // Warm Soft Coo
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.32);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(masterFilter);
    osc.start(now);
    osc.stop(now + 0.4);
  } else {
    playChatPopSound();
  }
}

// Soft footstep tick

let lastFootstepTime = 0;
export function playStepSound() {
  if (soundMuted) return;
  const nowTime = Date.now();
  if (nowTime - lastFootstepTime < 280) return; // limit frequency
  lastFootstepTime = nowTime;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140 + Math.random() * 30, now);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
}
