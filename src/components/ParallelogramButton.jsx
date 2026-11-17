import { useState } from 'react'
import { useTextScramble } from '../hooks/useTextScramble.js'
import { playConfirm, playCancel, playNavTick } from '../utils/soundEffects.js'

const ACCENT_STYLES = {
  blue: {
    beamColor: '#3B70B0',
    baseBorder: 'bg-[#3B70B0]/50 group-hover:bg-[#3B70B0]',
    activeSurface: 'bg-[#142844]',
    hoverSurface: 'group-hover:bg-[#0c1829]',
    codeText: 'text-[#3B70B0]',
    tagBg: 'bg-[#3B70B0]/15 border-[#3B70B0]/40',
    activeTagBg: 'bg-[#3B70B0] text-white border-[#3B70B0]',
  },
  red: {
    beamColor: '#D62D32',
    baseBorder: 'bg-[#D62D32]/50 group-hover:bg-[#D62D32]',
    activeSurface: 'bg-[#3b1417]',
    hoverSurface: 'group-hover:bg-[#1a0a0c]',
    codeText: 'text-[#D62D32]',
    tagBg: 'bg-[#D62D32]/15 border-[#D62D32]/40',
    activeTagBg: 'bg-[#D62D32] text-white border-[#D62D32]',
  },
}

function ParallelogramButton({
  label,
  code,
  subtitle,
  accent = 'blue',
  variant = 'menu',
  active = false,
  disabled = false,
  soundFn,
  onClick,
  onMouseEnter,
}) {
  const palette = ACCENT_STYLES[accent] ?? ACCENT_STYLES.blue
  const [isFlashing, setIsFlashing] = useState(false)
  const scrambledLabel = useTextScramble(label, active)

  if (variant === 'back') {
    return (
      <button
        type="button"
        onClick={(e) => {
          if (disabled) return
          playCancel()
          onClick?.(e)
        }}
        onMouseEnter={() => {
          if (!disabled) playNavTick()
        }}
        disabled={disabled}
        aria-label="Volver al menú principal"
        className="group relative cursor-pointer -skew-x-[18deg] border-2 border-[#D62D32] bg-[#050505] px-4 py-2 sm:px-5 sm:py-2.5 text-zinc-100 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] transition-all duration-200 hover:-translate-x-1 hover:bg-[#D62D32] hover:text-white active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="flex skew-x-[18deg] items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>{label}</span>
          <span className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[9px] tracking-widest text-zinc-300 group-hover:bg-black/25 group-hover:text-white">
            ESC
          </span>
        </span>
      </button>
    )
  }

  const handleClick = (e) => {
    if (disabled) return
    setIsFlashing(true)
    playConfirm()
    setTimeout(() => {
      setIsFlashing(false)
      onClick?.(e)
    }, 130)
  }

  const handleMouseEnter = (e) => {
    if (!active && !disabled) {
      if (typeof soundFn === 'function') {
        soundFn()
      } else {
        playNavTick()
      }
    }
    onMouseEnter?.(e)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      className={`group relative w-full cursor-pointer -skew-x-[18deg] overflow-hidden p-[2px] text-left shadow-[5px_5px_0px_rgba(0,0,0,0.95)] transition-all duration-200 disabled:pointer-events-none ${
        active
          ? '-translate-x-2 sm:-translate-x-3'
          : 'hover:-translate-x-2'
      }`}
    >
      {/* Fondo base del borde cuando está inactivo */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-200 ${
          active ? 'opacity-0' : `opacity-100 ${palette.baseBorder}`
        }`}
      />

      {/* Franja de luz animada que da vueltas en el borde (Border Beam) */}
      {active && (
        <>
          {/* Halo difuso de la franja */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square blur-[5px] opacity-75 animate-[spin_2.4s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, ${palette.beamColor} 290deg, #FFFFFF 355deg, transparent 360deg)`,
            }}
          />
          {/* Franja de luz nítida */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square animate-[spin_2.4s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, ${palette.beamColor} 290deg, #FFFFFF 355deg, transparent 360deg)`,
            }}
          />
        </>
      )}

      {/* Interior del botón (cubre el centro dejando ver el borde de 2px) */}
      <div
        className={`relative z-10 flex h-full w-full items-center justify-between gap-4 px-5 py-3.5 sm:px-7 sm:py-4 transition-colors duration-200 ${
          active
            ? `${palette.activeSurface} text-white`
            : `bg-[#050505] text-zinc-100 ${palette.hoverSurface}`
        }`}
      >
        {/* Destello de confirmación al hacer clic */}
        {isFlashing && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 bg-white/45 animate-pulse"
          />
        )}

        <div className="relative z-10 flex skew-x-[18deg] items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Código numérico estilo HUD */}
            {code && (
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold tracking-widest transition-colors ${
                  active
                    ? palette.activeTagBg
                    : `${palette.tagBg} ${palette.codeText}`
                }`}
              >
                {code}
              </span>
            )}

            {/* Título decodificable y subtítulo */}
            <div className="flex flex-col">
              <span className="font-mono text-base sm:text-xl font-extrabold tracking-[0.18em] uppercase">
                {scrambledLabel}
              </span>
              {subtitle && (
                <span
                  className={`font-mono text-[10px] sm:text-xs tracking-[0.15em] transition-colors ${
                    active ? 'text-white/85' : 'text-zinc-500'
                  }`}
                >
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Indicador de selección */}
          <span
            className={`font-mono text-base sm:text-lg font-black transition-all duration-200 ${
              active
                ? 'translate-x-0 scale-125 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : '-translate-x-2 text-[#3B70B0] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
            }`}
          >
            ▸
          </span>
        </div>
      </div>
    </button>
  )
}

export default ParallelogramButton
