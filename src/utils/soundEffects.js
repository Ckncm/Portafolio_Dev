let audioCtx = null
let soundEnabled = true

// Inicializar preferencia desde localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('ckncm_sound_enabled')
  if (stored !== null) {
    soundEnabled = stored === 'true'
  }
}

const listeners = new Set()

export function isSoundEnabled() {
  return soundEnabled
}

export function toggleSound() {
  soundEnabled = !soundEnabled
  if (typeof window !== 'undefined') {
    localStorage.setItem('ckncm_sound_enabled', String(soundEnabled))
  }
  listeners.forEach((fn) => fn(soundEnabled))
  if (soundEnabled) {
    playConfirm()
  }
  return soundEnabled
}

export function subscribeSound(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// Notas de la Canción de Saria (The Legend of Zelda: Ocarina of Time)
// Notas 1, 2, 3: C-Abajo (Fa), C-Derecha (La), C-Izquierda (Si)
// Notas 4, 5:    C-Abajo (Fa), C-Derecha (La)
const SARIA_SONG_NOTES = [
  { note: 'F4', freq: 349.23 },
  { note: 'A4', freq: 440.00 },
  { note: 'B4', freq: 493.88 },
]

/**
 * Sintetizador acústico de nota de ocarina estilo N64
 * (onda fundamental pura, ataque de respiración, sutil vibrato y armónico suave)
 */
function playOcarinaTone(ctx, freq, startTime, duration = 0.22, volume = 0.14) {
  // Oscilador fundamental estilo ocarina
  const oscMain = ctx.createOscillator()
  const gainMain = ctx.createGain()
  oscMain.type = 'sine'
  oscMain.frequency.setValueAtTime(freq, startTime)

  // Sutil vibrato después del ataque inicial (5.8 Hz)
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.setValueAtTime(5.8, startTime)
  lfoGain.gain.setValueAtTime(0, startTime)
  lfoGain.gain.setValueAtTime(0, startTime + 0.04)
  lfoGain.gain.linearRampToValueAtTime(3.2, startTime + 0.12)
  lfo.connect(oscMain.frequency)

  // Envolvente de volumen: ataque ágil de aire y decaimiento musical
  gainMain.gain.setValueAtTime(0.001, startTime)
  gainMain.gain.linearRampToValueAtTime(volume, startTime + 0.018)
  gainMain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscMain.connect(gainMain)
  gainMain.connect(ctx.destination)

  // Segundo armónico suave (octava) para presencia y brillo acústico
  const oscHarm = ctx.createOscillator()
  const gainHarm = ctx.createGain()
  oscHarm.type = 'sine'
  oscHarm.frequency.setValueAtTime(freq * 2, startTime)
  gainHarm.gain.setValueAtTime(0.001, startTime)
  gainHarm.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.018)
  gainHarm.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscHarm.connect(gainHarm)
  gainHarm.connect(ctx.destination)

  lfo.start(startTime)
  oscMain.start(startTime)
  oscHarm.start(startTime)

  lfo.stop(startTime + duration)
  oscMain.stop(startTime + duration)
  oscHarm.stop(startTime + duration)
}

/**
 * Reproduce una de las 3 primeras notas de la Canción de Saria (Lost Woods)
 * al navegar entre las 3 opciones del menú.
 * @param {number} index - 0 (F4 - Fa), 1 (A4 - La), 2 (B4 - Si)
 */
export function playSariaSongNote(index = 0) {
  if (!soundEnabled) return
  try {
    const ctx = getContext()
    if (!ctx) return

    const noteIndex = Math.max(0, Math.min(2, index % SARIA_SONG_NOTES.length))
    const { freq } = SARIA_SONG_NOTES[noteIndex]
    const now = ctx.currentTime

    playOcarinaTone(ctx, freq, now, 0.22, 0.14)
  } catch {
    // Ignorar si el audio no está listo
  }
}

// Mantener compatibilidad de importación
export const playSongOfTimeNote = playSariaSongNote

/**
 * Sonido de confirmación / selección de opción:
 * Reproduce las notas agudas Mi' (E5) y Re' (D5) de la Canción de Saria
 * siguiendo el compás de Ocarina of Time (~140 BPM).
 */
export function playConfirm() {
  if (!soundEnabled) return
  try {
    const ctx = getContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Nota Mi' (E5 = 659.25 Hz)
    playOcarinaTone(ctx, 659.25, now, 0.22, 0.14)

    // Nota Re' (D5 = 587.33 Hz) a los 220ms
    playOcarinaTone(ctx, 587.33, now + 0.22, 0.32, 0.14)
  } catch {
    // Ignorar si el audio no está listo
  }
}

/**
 * Sonido nítido, ágil y claramente audible de navegación secundaria (click / tick)
 */
export function playNavTick() {
  if (!soundEnabled) return
  try {
    const ctx = getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // Tono más agudo, presente y definido (760Hz -> 480Hz)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(760, now)
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.03)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.032)
  } catch {
    // Silencio seguro si el navegador bloquea audio antes de interacción
  }
}

/**
 * Sonido de regreso / tecla Escape:
 * Reproduce la nota "Si" (B4 = 493.88 Hz / Botón C-Izquierda de Ocarina of Time)
 * completando la frase musical de la Canción de Saria (Fa - La - Si ... Mi' - Re' ... ¡Si!).
 */
export function playCancel() {
  if (!soundEnabled) return
  try {
    const ctx = getContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Nota Si (B4 = 493.88 Hz) con timbre de ocarina
    playOcarinaTone(ctx, 493.88, now, 0.28, 0.14)
  } catch {
    // Ignorar si el audio no está listo
  }
}
