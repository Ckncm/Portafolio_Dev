import { useEffect, useMemo, useState } from 'react'
import Typewriter from '../components/Typewriter.jsx'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const USERNAME = 'ckncm'
const HOST = 'portfolio'

function Timed({ at, children }) {
  const [show, setShow] = useState(at === 0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShow(true)
      return
    }
    const timer = setTimeout(() => setShow(true), at)
    return () => clearTimeout(timer)
  }, [at])

  return show ? children : null
}

function AsciiBar({ duration = 1800, width = 20 }) {
  const [p, setP] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setP(100)
      return
    }
    const steps = 32
    let i = 0
    const id = setInterval(() => {
      i += 1
      setP(Math.round((i / steps) * 100))
      if (i >= steps) clearInterval(id)
    }, duration / steps)
    return () => clearInterval(id)
  }, [duration])

  const filled = Math.round((p / 100) * width)

  return (
    <div className="mt-1 font-mono text-sm">
      <span className="text-zinc-600">[</span>
      <span className="text-[#3B70B0]">
        {'█'.repeat(filled)}
        {'░'.repeat(width - filled)}
      </span>
      <span className="text-zinc-600">]</span>{' '}
      <span className="inline-block w-[4ch] text-right text-[#3B70B0]">{p}%</span>
    </div>
  )
}

function Prompt({ children }) {
  return (
    <div className="font-mono text-sm">
      <span className="text-[#3B70B0]">
        {USERNAME}@{HOST}
      </span>
      <span className="text-zinc-500">:~$</span>{' '}
      <span className="text-zinc-100">{children}</span>
    </div>
  )
}

const CMDS = ['./cargar_assets.sh', 'descargar contenido --todo', 'compilar ui']
const TYPING_SPEED = 30

const TIMELINE = [
  { cmdDelay: 300, outputAt: 1000, barAt: 1150, barDuration: 1800, okAt: 3100 },
  { cmdDelay: 3350, outputAt: 4250, barAt: 4400, barDuration: 1800, okAt: 6350 },
  { cmdDelay: 6650, outputAt: 7080, barAt: 7230, barDuration: 1600, okAt: 8930 },
]
const FINAL_MSG_AT = 9130
const EXIT_AT = 10000

function Ok() {
  return (
    <span className="ml-2 font-mono text-sm text-green-400">[OK]</span>
  )
}

function TerminalLoader({ onReveal, onDone }) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)
  const login = useMemo(
    () => `Last login: ${new Date().toDateString()} on ttys000`,
    [],
  )

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let finished = false
    const reduced = prefersReducedMotion()
    const finish = () => {
      if (finished) return
      finished = true
      setExiting(true)
      onReveal?.()
      setTimeout(onDone, 500)
    }
    const timer = setTimeout(finish, reduced ? 1400 : EXIT_AT)
    return () => clearTimeout(timer)
  }, [onReveal, onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050505] p-4 transition-opacity duration-500 ${
        visible && !exiting ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0d] shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#1c1c1c] px-4 py-2.5">
          <span className="font-mono text-xs text-zinc-400">
            {USERNAME}@{HOST}: ~ — Terminal
          </span>
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
            <span aria-hidden="true">─</span>
            <span aria-hidden="true">▢</span>
            <span aria-hidden="true">✕</span>
          </div>
        </div>

        <div className="h-[420px] overflow-y-auto p-5 font-mono text-sm leading-relaxed">
          <div className="text-zinc-600">{login}</div>

          <Prompt>
            <Typewriter text={CMDS[0]} speed={TYPING_SPEED} delay={TIMELINE[0].cmdDelay} />
          </Prompt>
          <Timed at={TIMELINE[0].outputAt}>
            <div className="text-zinc-400">
              → Descargando assets (fuentes, íconos, imágenes)...
            </div>
          </Timed>
          <Timed at={TIMELINE[0].barAt}>
            <AsciiBar duration={TIMELINE[0].barDuration} />
          </Timed>
          <Timed at={TIMELINE[0].okAt}>
            <div>
              <span className="text-zinc-400">→ Assets listos</span>
              <Ok />
            </div>
          </Timed>

          <Prompt>
            <Typewriter text={CMDS[1]} speed={TYPING_SPEED} delay={TIMELINE[1].cmdDelay} />
          </Prompt>
          <Timed at={TIMELINE[1].outputAt}>
            <div className="text-zinc-400">
              → Descargando contenido del portafolio... 42.7 MB / 128 MB
            </div>
          </Timed>
          <Timed at={TIMELINE[1].barAt}>
            <AsciiBar duration={TIMELINE[1].barDuration} />
          </Timed>
          <Timed at={TIMELINE[1].okAt}>
            <div>
              <span className="text-zinc-400">→ Contenido descargado</span>
              <Ok />
            </div>
          </Timed>

          <Prompt>
            <Typewriter text={CMDS[2]} speed={TYPING_SPEED} delay={TIMELINE[2].cmdDelay} />
          </Prompt>
          <Timed at={TIMELINE[2].outputAt}>
            <div className="text-zinc-400">→ Compilando componentes de UI...</div>
          </Timed>
          <Timed at={TIMELINE[2].barAt}>
            <AsciiBar duration={TIMELINE[2].barDuration} />
          </Timed>
          <Timed at={TIMELINE[2].okAt}>
            <div>
              <span className="text-zinc-400">→ UI compilada</span>
              <Ok />
            </div>
          </Timed>

          <Timed at={FINAL_MSG_AT}>
            <div className="mt-2 text-[#3B70B0]">Sistema listo. Iniciando...</div>
          </Timed>
        </div>
      </div>
    </div>
  )
}

export default TerminalLoader
