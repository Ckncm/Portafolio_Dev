import { useEffect, useState } from 'react'
import { isSoundEnabled, toggleSound, subscribeSound } from '../utils/soundEffects.js'

function HudFooter() {
  const [timeStr, setTimeStr] = useState('')
  const [soundOn, setSoundOn] = useState(isSoundEnabled())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('es-GT', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    return subscribeSound((enabled) => setSoundOn(enabled))
  }, [])

  return (
    <footer
      aria-label="Barra de estado HUD"
      className="pointer-events-none fixed bottom-2 sm:bottom-4 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 select-none"
    >
      {/* Lado izquierdo: Telemetría de sistema y reloj */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded border border-zinc-800/80 bg-[#050505]/90 px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        <span className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden xs:inline">SYS:</span> ONLINE
        </span>
        <span className="text-zinc-600 font-mono text-[10px]">|</span>
        <span className="font-mono text-[9px] sm:text-[11px] font-semibold tracking-widest text-zinc-300">
          {timeStr || '00:00:00'}
        </span>
      </div>

      {/* Centro (en pantallas grandes): Guía de atajos de teclado de videojuego */}
      <div className="hidden lg:flex items-center gap-2 rounded border border-zinc-800/80 bg-[#050505]/90 px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.9)] backdrop-blur-sm font-mono text-[10px] tracking-wider text-zinc-400">
        <span className="text-[#3B70B0] font-bold">[1, 2, 3]</span> Acceso Rápido
        <span className="text-zinc-700">·</span>
        <span className="text-[#3B70B0] font-bold">[↑↓]</span> Mover
        <span className="text-zinc-700">·</span>
        <span className="text-[#3B70B0] font-bold">[↵]</span> Confirmar
        <span className="text-zinc-700">·</span>
        <span className="text-[#D62D32] font-bold">[ESC]</span> Volver
      </div>

      {/* Lado derecho: Botón interactivo de sonido (Mute / Unmute) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.currentTarget.blur()
          toggleSound()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        aria-label={soundOn ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
        className="pointer-events-auto group flex cursor-pointer items-center gap-1.5 rounded border border-zinc-800/80 bg-[#050505]/90 px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.9)] transition-colors hover:border-[#3B70B0] hover:text-white backdrop-blur-sm outline-none"
      >
        <span className="font-mono text-xs transition-transform group-hover:scale-110">
          {soundOn ? '🔊' : '🔇'}
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] font-bold tracking-widest text-zinc-300 uppercase group-hover:text-white">
          {soundOn ? 'AUDIO: ON' : 'AUDIO: OFF'}
        </span>
      </button>
    </footer>
  )
}

export default HudFooter
