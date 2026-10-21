/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Singleton AudioContext management for Web Audio API synthesis
let audioCtx: AudioContext | null = null;
let lastKeyClickTime = 0;

/**
 * Lazily obtains or creates the shared AudioContext instance.
 * Automatically attempts to resume if in suspended state due to browser autoplay policies.
 */
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Safe silence if browser blocks resume before direct gesture
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Primes and resumes the audio context upon early user gestures (e.g. potion or keyboard tap),
 * overcoming mobile browser (iOS Safari / Android) autoplay unlock restrictions.
 */
export function primeAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {}
}

/**
 * A. Typing sound:
 * A subtle, short retro keyboard key-switch click (~20ms).
 * Combines a micro bandpass noise transient with a decaying pitch-drop transient.
 */
export function playKeyClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Debounce guard to prevent audio clipping on extremely rapid machine input
    if (now - lastKeyClickTime < 0.035) return;
    lastKeyClickTime = now;

    // 1. Transient click oscillator (pitch drop from ~280Hz to ~90Hz)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    // Slight analog pitch variance (+/- 4%) so consecutive keystrokes feel organic
    const pitchOffset = (Math.random() - 0.5) * 20;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260 + pitchOffset, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.022);

    oscGain.gain.setValueAtTime(0.09, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);

    // 2. Micro burst of filtered white noise for tactile key-contact snap
    const bufferSize = Math.floor(ctx.sampleRate * 0.015); // 15ms buffer
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1600 + (Math.random() - 0.5) * 100, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.02);

    // Clean up nodes after playback
    osc.onended = () => {
      osc.disconnect();
      oscGain.disconnect();
    };
    noiseSource.onended = () => {
      noiseSource.disconnect();
      noiseFilter.disconnect();
      noiseGain.disconnect();
    };
  } catch {
    // Fail silently without disrupting user interaction
  }
}

/**
 * B. Fax / receipt printing sound:
 * An authentic vintage mechanical printer / fax feed sound (~400ms).
 * Features a rapid rhythmic train of delicate mechanical gear teeth clicks,
 * a light stepper roller whirr, and paper friction against the platen.
 * No low-frequency boomy drones or explosions.
 */
export function playReceiptFeedSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.40;

    // 1. Train of rapid, fine mechanical stepper gear-tooth micro-clicks
    // Schedules 10 crisp, restrained micro-ticks across the feed cycle
    const tickTimes = [0.01, 0.045, 0.082, 0.12, 0.16, 0.20, 0.24, 0.285, 0.33, 0.375];

    tickTimes.forEach((offset, idx) => {
      const tickTime = now + offset;
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();

      // Slightly varying pitch per tooth to sound authentically mechanical
      const toothPitch = 900 + (idx % 3) * 140 + (Math.random() - 0.5) * 60;
      tickOsc.type = 'triangle';
      tickOsc.frequency.setValueAtTime(toothPitch, tickTime);
      tickOsc.frequency.exponentialRampToValueAtTime(320, tickTime + 0.012);

      tickGain.gain.setValueAtTime(0.048, tickTime);
      tickGain.gain.exponentialRampToValueAtTime(0.0008, tickTime + 0.012);

      tickOsc.connect(tickGain);
      tickGain.connect(ctx.destination);

      tickOsc.start(tickTime);
      tickOsc.stop(tickTime + 0.014);

      tickOsc.onended = () => {
        tickOsc.disconnect();
        tickGain.disconnect();
      };
    });

    // 2. Light mechanical roller gear hum (light, retro, mid-range ~460Hz, NO heavy sub-bass)
    const rollerOsc = ctx.createOscillator();
    const rollerFilter = ctx.createBiquadFilter();
    const rollerGain = ctx.createGain();

    rollerOsc.type = 'triangle';
    rollerOsc.frequency.setValueAtTime(460, now);
    rollerOsc.frequency.linearRampToValueAtTime(510, now + duration * 0.5);
    rollerOsc.frequency.linearRampToValueAtTime(440, now + duration);

    rollerFilter.type = 'bandpass';
    rollerFilter.frequency.setValueAtTime(480, now);
    rollerFilter.Q.setValueAtTime(2.0, now);

    rollerGain.gain.setValueAtTime(0.001, now);
    rollerGain.gain.linearRampToValueAtTime(0.022, now + 0.03);
    rollerGain.gain.setValueAtTime(0.022, now + duration - 0.05);
    rollerGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    rollerOsc.connect(rollerFilter);
    rollerFilter.connect(rollerGain);
    rollerGain.connect(ctx.destination);

    rollerOsc.start(now);
    rollerOsc.stop(now + duration);

    rollerOsc.onended = () => {
      rollerOsc.disconnect();
      rollerFilter.disconnect();
      rollerGain.disconnect();
    };

    // 3. Paper sliding friction across the slot opening (gentle high-frequency texture)
    const noiseDuration = duration * 0.9;
    const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const paperNoise = ctx.createBufferSource();
    paperNoise.buffer = noiseBuffer;

    const paperFilter = ctx.createBiquadFilter();
    paperFilter.type = 'bandpass';
    paperFilter.frequency.setValueAtTime(2100, now);
    paperFilter.Q.setValueAtTime(1.4, now);

    const paperGain = ctx.createGain();
    paperGain.gain.setValueAtTime(0.001, now);
    paperGain.gain.linearRampToValueAtTime(0.024, now + 0.04);
    paperGain.gain.setValueAtTime(0.024, now + noiseDuration - 0.06);
    paperGain.gain.exponentialRampToValueAtTime(0.0008, now + noiseDuration);

    paperNoise.connect(paperFilter);
    paperFilter.connect(paperGain);
    paperGain.connect(ctx.destination);

    paperNoise.start(now);
    paperNoise.stop(now + noiseDuration);

    paperNoise.onended = () => {
      paperNoise.disconnect();
      paperFilter.disconnect();
      paperGain.disconnect();
    };
  } catch {
    // Fail silently without disrupting interactions
  }
}

/**
 * C. Little Devil Stamp sound ("小恶魔盖章"):
 * A crisp, weighted physical rubber-stamp slap on paper with paper compression friction,
 * followed by a very subtle, playful little imp micro-flourish (~140ms).
 */
export function playStampSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Physical rubber stamp contact impact ("啪／咚")
    // Fast downward pitch-drop (190Hz -> 50Hz over 38ms) giving solid rubber mass without muddiness
    const slapOsc = ctx.createOscillator();
    const slapGain = ctx.createGain();

    slapOsc.type = 'triangle';
    slapOsc.frequency.setValueAtTime(190, now);
    slapOsc.frequency.exponentialRampToValueAtTime(48, now + 0.038);

    slapGain.gain.setValueAtTime(0.24, now);
    slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    slapOsc.connect(slapGain);
    slapGain.connect(ctx.destination);

    slapOsc.start(now);
    slapOsc.stop(now + 0.045);

    // 2. High-frequency paper snap (crisp fibrous impact at 1200Hz)
    const snapBufferSize = Math.floor(ctx.sampleRate * 0.028);
    const snapBuffer = ctx.createBuffer(1, snapBufferSize, ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapBufferSize; i++) {
      snapData[i] = Math.random() * 2 - 1;
    }

    const snapSource = ctx.createBufferSource();
    snapSource.buffer = snapBuffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(1250, now);
    snapFilter.Q.setValueAtTime(2.2, now);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.13, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

    snapSource.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapSource.start(now);
    snapSource.stop(now + 0.03);

    // 3. Playful, slightly eerie little devil accent (+35ms after impact)
    // A subtle ascending chromatic imp trill (587Hz -> 740Hz) with gentle vibrato
    const devilTime = now + 0.035;
    const devilOsc = ctx.createOscillator();
    const devilGain = ctx.createGain();

    devilOsc.type = 'triangle';
    devilOsc.frequency.setValueAtTime(587.3, devilTime); // D5
    devilOsc.frequency.linearRampToValueAtTime(739.9, devilTime + 0.09); // F#5

    devilGain.gain.setValueAtTime(0.001, devilTime);
    devilGain.gain.linearRampToValueAtTime(0.042, devilTime + 0.015);
    devilGain.gain.exponentialRampToValueAtTime(0.0008, devilTime + 0.14);

    devilOsc.connect(devilGain);
    devilGain.connect(ctx.destination);

    devilOsc.start(devilTime);
    devilOsc.stop(devilTime + 0.15);

    // Node cleanups
    slapOsc.onended = () => {
      slapOsc.disconnect();
      slapGain.disconnect();
    };
    snapSource.onended = () => {
      snapSource.disconnect();
      snapFilter.disconnect();
      snapGain.disconnect();
    };
    devilOsc.onended = () => {
      devilOsc.disconnect();
      devilGain.disconnect();
    };
  } catch {
    // Fail gracefully
  }
}

// Backward compatibility alias if needed
export const playFinishChime = playStampSound;

