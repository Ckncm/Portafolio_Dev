import { useEffect, useMemo, useRef, useState } from 'react'
import Typewriter from '../components/Typewriter.jsx'
import {
  decodeCachedImages,
  getBaseAssetUrls,
  getContentAssetUrls,
  preloadAssetGroup,
  waitForFonts,
} from '../utils/preloadAssets.js'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const USERNAME = 'ckncm'
const HOST = 'portfolio'
const TYPING_SPEED = 24

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function AsciiBar({ percent = 0, width = 20 }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  const filled = Math.round((clamped / 100) * width)

  return (
    <div className="mt-1 font-mono text-sm">
      <span className="text-zinc-600">[</span>
      <span className="text-[#3B70B0]">
        {'█'.repeat(filled)}
        {'░'.repeat(width - filled)}
      </span>
      <span className="text-zinc-600">]</span>{' '}
      <span className="inline-block w-[4ch] text-right text-[#3B70B0]">
        {clamped}%
      </span>
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

function Ok() {
  return (
    <span className="ml-2 font-mono text-sm text-green-400">[OK]</span>
  )
}

function TerminalLoader({ onReveal, onDone }) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [step1Info, setStep1Info] = useState({ loaded: 0, total: 0, pct: 0, ok: false })
  const [step2Info, setStep2Info] = useState({ loaded: 0, total: 0, pct: 0, ok: false })
  const [step3Info, setStep3Info] = useState({ loaded: 0, total: 0, pct: 0, ok: false })
  const [ready, setReady] = useState(false)

  const bodyRef = useRef(null)
  const onRevealRef = useRef(onReveal)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onRevealRef.current = onReveal
    onDoneRef.current = onDone
  }, [onReveal, onDone])

  const login = useMemo(
    () => `Last login: ${new Date().toDateString()} on ttys000`,
    []
  )

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Auto-scroll hacia abajo conforme aparecen nuevos mensajes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [step, step1Info.ok, step2Info.ok, step3Info.ok, ready])

  useEffect(() => {
    let cancelled = false
    let exitTimer = null
    const reduced = prefersReducedMotion()

    const runStage = async ({
      startStep,
      cmdLength,
      task,
      setInfo,
      minBarMs,
    }) => {
      if (cancelled) return
      setStep(startStep)

      if (!reduced) {
        await sleep(cmdLength * TYPING_SPEED + 120)
      }
      if (cancelled) return
      setStep(startStep + 1)

      let realRatio = 0
      let totalCount = 0
      let doneCount = 0
      let taskFinished = false

      const taskPromise = task((loaded, total) => {
        doneCount = loaded
        totalCount = total
        realRatio = total > 0 ? loaded / total : 1
      }).finally(() => {
        taskFinished = true
        realRatio = 1
      })

      const startTime = performance.now()
      // Actualizar barra suavemente combinando progreso real y tiempo mínimo legible
      while (!cancelled) {
        const elapsed = performance.now() - startTime
        const timeRatio = minBarMs > 0 ? Math.min(1, elapsed / minBarMs) : 1
        const visualPct = Math.min(realRatio, timeRatio) * 100

        setInfo({
          loaded: doneCount,
          total: totalCount,
          pct: visualPct,
          ok: false,
        })

        if (taskFinished && timeRatio >= 1) break
        await sleep(32)
      }

      await taskPromise
      if (cancelled) return
      setInfo({
        loaded: totalCount,
        total: totalCount,
        pct: 100,
        ok: true,
      })
    }

    const executeSequence = async () => {
      const baseUrls = getBaseAssetUrls()
      const contentUrls = getContentAssetUrls()

      if (!reduced) await sleep(200)

      // Paso 1: Precarga real de fuentes, logos e íconos de interfaz
      await runStage({
        startStep: 1,
        cmdLength: './cargar_assets.sh'.length,
        minBarMs: reduced ? 100 : 750,
        setInfo: setStep1Info,
        task: async (onProg) => {
          onProg(0, baseUrls.length + 1)
          let fontsDone = false
          let imgsLoaded = 0

          const emit = () => {
            onProg(imgsLoaded + (fontsDone ? 1 : 0), baseUrls.length + 1)
          }

          await Promise.all([
            waitForFonts(1800).then(() => {
              fontsDone = true
              emit()
            }),
            preloadAssetGroup(baseUrls, (loaded) => {
              imgsLoaded = loaded
              emit()
            }),
          ])
        },
      })

      if (!reduced) await sleep(180)

      // Paso 2: Precarga real de portadas, capturas de proyectos y certificados
      await runStage({
        startStep: 3,
        cmdLength: 'descargar contenido --todo'.length,
        minBarMs: reduced ? 100 : 850,
        setInfo: setStep2Info,
        task: (onProg) => preloadAssetGroup(contentUrls, onProg),
      })

      if (!reduced) await sleep(180)

      // Paso 3: Decodificación de imágenes en memoria y preparación de UI
      await runStage({
        startStep: 5,
        cmdLength: 'compilar ui'.length,
        minBarMs: reduced ? 100 : 650,
        setInfo: setStep3Info,
        task: (onProg) => decodeCachedImages(onProg),
      })

      if (cancelled) return
      setReady(true)

      await sleep(reduced ? 150 : 400)
      if (cancelled) return

      setExiting(true)
      onRevealRef.current?.()
      exitTimer = setTimeout(() => {
        if (!cancelled) onDoneRef.current?.()
      }, 500)
    }

    executeSequence()

    return () => {
      cancelled = true
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [])

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

        <div
          ref={bodyRef}
          className="h-[420px] overflow-y-auto p-5 font-mono text-sm leading-relaxed"
        >
          <div className="text-zinc-600">{login}</div>

          {/* Paso 1: Assets base y fuentes */}
          {step >= 1 && (
            <Prompt>
              <Typewriter text="./cargar_assets.sh" speed={TYPING_SPEED} />
            </Prompt>
          )}
          {step >= 2 && (
            <>
              <div className="text-zinc-400">
                → Cargando fuentes, íconos y logos ({step1Info.loaded}/
                {step1Info.total})...
              </div>
              <AsciiBar percent={step1Info.pct} />
              {step1Info.ok && (
                <div>
                  <span className="text-zinc-400">→ Assets listos</span>
                  <Ok />
                </div>
              )}
            </>
          )}

          {/* Paso 2: Contenido (portadas, capturas y certificados) */}
          {step >= 3 && (
            <Prompt>
              <Typewriter
                text="descargar contenido --todo"
                speed={TYPING_SPEED}
              />
            </Prompt>
          )}
          {step >= 4 && (
            <>
              <div className="text-zinc-400">
                → Precargando proyectos y certificados ({step2Info.loaded}/
                {step2Info.total})...
              </div>
              <AsciiBar percent={step2Info.pct} />
              {step2Info.ok && (
                <div>
                  <span className="text-zinc-400">→ Contenido descargado</span>
                  <Ok />
                </div>
              )}
            </>
          )}

          {/* Paso 3: Decodificación de gráficos y compilación UI */}
          {step >= 5 && (
            <Prompt>
              <Typewriter text="compilar ui" speed={TYPING_SPEED} />
            </Prompt>
          )}
          {step >= 6 && (
            <>
              <div className="text-zinc-400">
                → Decodificando recursos gráficos ({step3Info.loaded}/
                {step3Info.total})...
              </div>
              <AsciiBar percent={step3Info.pct} />
              {step3Info.ok && (
                <div>
                  <span className="text-zinc-400">→ UI compilada</span>
                  <Ok />
                </div>
              )}
            </>
          )}

          {ready && (
            <div className="mt-2 text-[#3B70B0]">Sistema listo. Iniciando...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TerminalLoader
