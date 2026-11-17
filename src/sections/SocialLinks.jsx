import { useState, useEffect, useCallback } from 'react'
import githubLogo from '../assets/logos/github_logo_icon_229278.webp'
import instagramLogo from '../assets/logos/Instagram_logo_2022.svg.webp'
import gmailLogo from '../assets/logos/Gmail_icon_(2026).svg.webp'
import { playSariaSongNote, playConfirm } from '../utils/soundEffects.js'

function SocialLinks() {
  const [copied, setCopied] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const email = 'ckncmm@gmail.com'

  const handleCopyEmail = useCallback(async (e) => {
    if (e?.stopPropagation) e.stopPropagation()
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = email
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch {
      // Fallback silencioso
    }
    playConfirm()
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [email])

  // Navegación silenciosa con flechas del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Evitar interceptar si el usuario está en un input/textarea activo
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = (prev + 1) % 3
          playSariaSongNote(next)
          return next
        })
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = (prev - 1 + 3) % 3
          playSariaSongNote(next)
          return next
        })
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          e.preventDefault()
          handleCopyEmail()
        } else if (selectedIndex === 1) {
          e.preventDefault()
          playConfirm()
          window.open('https://github.com/Ckncm', '_blank', 'noopener,noreferrer')
        } else if (selectedIndex === 2) {
          e.preventDefault()
          playConfirm()
          window.open('https://instagram.com/erickcua_19', '_blank', 'noopener,noreferrer')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, handleCopyEmail])

  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-20">
      {/* Luz ambiental sutil en el fondo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #D62D32 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Encabezado */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-mono text-3xl sm:text-5xl font-black tracking-[0.2em] text-zinc-100 uppercase">
            Hablemos
          </h2>
          <p className="mt-3 max-w-lg font-mono text-xs sm:text-sm tracking-wider text-zinc-400">
            ¿Tienes una idea en mente o buscas colaborar en un proyecto? Elige el canal que prefieras.
          </p>
        </div>

        {/* Grid de 3 Tarjetas Simétricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* TARJETA 01: CORREO ELECTRÓNICO (Canal Principal) */}
          <div
            onMouseEnter={() => {
              setSelectedIndex(0)
              playSariaSongNote(0)
            }}
            onClick={() => setSelectedIndex(0)}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
              selectedIndex === 0
                ? '-translate-y-2 border-[#D62D32] bg-[#120506]/95 shadow-[8px_8px_0px_rgba(214,45,50,0.4)] ring-1 ring-[#D62D32]/50'
                : 'border-zinc-800 bg-[#090909]/95 opacity-85 hover:opacity-100 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:border-zinc-700'
            }`}
          >
            {/* Tag destacado */}
            <div className="absolute top-4 right-4">
              <span className="rounded-full border border-[#D62D32]/50 bg-[#D62D32]/20 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#D62D32] uppercase">
                Directo
              </span>
            </div>

            <div>
              {/* Icono */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border p-3 shadow-inner transition-all ${
                  selectedIndex === 0
                    ? 'border-[#D62D32]/60 bg-zinc-900 scale-105'
                    : 'border-zinc-700/60 bg-zinc-900/90 group-hover:scale-105 group-hover:border-[#D62D32]/60'
                }`}
              >
                <img
                  src={gmailLogo}
                  alt="Gmail"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Textos */}
              <div className="mt-5">
                <h3
                  className={`font-mono text-lg font-bold uppercase tracking-wide transition-colors ${
                    selectedIndex === 0 ? 'text-[#D62D32]' : 'text-zinc-100 group-hover:text-[#D62D32]'
                  }`}
                >
                  Correo
                </h3>
                <p className="mt-1 font-mono text-xs text-zinc-400">
                  Para propuestas de trabajo, colaboraciones o consultas técnicas.
                </p>
                <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 font-mono text-xs font-semibold text-zinc-200 break-all select-all">
                  {email}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-2 font-mono text-xs font-bold uppercase transition-all duration-200 ${
                  copied
                    ? 'border-emerald-500 bg-emerald-500/25 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-[#D62D32] hover:bg-[#D62D32]/20 hover:text-white'
                }`}
              >
                <span>{copied ? '✓ ¡Copiado!' : 'Copiar'}</span>
              </button>

              <a
                href={`mailto:${email}`}
                onClick={(e) => {
                  e.stopPropagation()
                  playConfirm()
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#D62D32] bg-[#D62D32] px-4 py-2 font-mono text-xs font-bold text-white uppercase transition-all hover:bg-[#b52429] hover:shadow-[0_0_15px_rgba(214,45,50,0.4)] active:translate-y-0.5"
              >
                <span>Escribir</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* TARJETA 02: GITHUB */}
          <a
            href="https://github.com/Ckncm"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              setSelectedIndex(1)
              playSariaSongNote(1)
            }}
            onClick={() => {
              setSelectedIndex(1)
              playConfirm()
            }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
              selectedIndex === 1
                ? '-translate-y-2 border-[#3B70B0] bg-[#070e1c]/95 shadow-[8px_8px_0px_rgba(59,112,176,0.4)] ring-1 ring-[#3B70B0]/50'
                : 'border-zinc-800 bg-[#090909]/95 opacity-85 hover:opacity-100 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:border-zinc-700'
            }`}
          >
            <div>
              {/* Icono */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border p-3 shadow-inner transition-all ${
                  selectedIndex === 1
                    ? 'border-[#3B70B0]/60 bg-zinc-900 scale-105'
                    : 'border-zinc-700/60 bg-zinc-900/90 group-hover:scale-105 group-hover:border-[#3B70B0]/60'
                }`}
              >
                <img
                  src={githubLogo}
                  alt="GitHub"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Textos */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-mono text-lg font-bold uppercase tracking-wide transition-colors ${
                      selectedIndex === 1 ? 'text-[#3B70B0]' : 'text-zinc-100 group-hover:text-[#3B70B0]'
                    }`}
                  >
                    GitHub
                  </h3>
                  <span className="font-mono text-xs text-zinc-500 font-bold">@Ckncm</span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-400">
                  Explora el código fuente, repositorios de mis proyectos y experimentos open source.
                </p>
              </div>
            </div>

            {/* Acción inferior */}
            <div
              className={`mt-6 flex items-center justify-between pt-4 border-t border-zinc-800/80 font-mono text-xs font-bold transition-colors ${
                selectedIndex === 1 ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
            >
              <span>Ver repositorios</span>
              <span
                className={`text-sm transition-transform ${
                  selectedIndex === 1
                    ? 'translate-x-1 -translate-y-0.5 text-[#3B70B0]'
                    : 'text-zinc-500 group-hover:text-[#3B70B0] group-hover:translate-x-1 group-hover:-translate-y-0.5'
                }`}
              >
                ↗
              </span>
            </div>
          </a>

          {/* TARJETA 03: INSTAGRAM */}
          <a
            href="https://instagram.com/erickcua_19"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              setSelectedIndex(2)
              playSariaSongNote(2)
            }}
            onClick={() => {
              setSelectedIndex(2)
              playConfirm()
            }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
              selectedIndex === 2
                ? '-translate-y-2 border-[#D62D32] bg-[#120506]/95 shadow-[8px_8px_0px_rgba(214,45,50,0.4)] ring-1 ring-[#D62D32]/50'
                : 'border-zinc-800 bg-[#090909]/95 opacity-85 hover:opacity-100 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:border-zinc-700'
            }`}
          >
            <div>
              {/* Icono */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border p-3 shadow-inner transition-all ${
                  selectedIndex === 2
                    ? 'border-[#D62D32]/60 bg-zinc-900 scale-105'
                    : 'border-zinc-700/60 bg-zinc-900/90 group-hover:scale-105 group-hover:border-[#D62D32]/60'
                }`}
              >
                <img
                  src={instagramLogo}
                  alt="Instagram"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Textos */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-mono text-lg font-bold uppercase tracking-wide transition-colors ${
                      selectedIndex === 2 ? 'text-[#D62D32]' : 'text-zinc-100 group-hover:text-[#D62D32]'
                    }`}
                  >
                    Instagram
                  </h3>
                  <span className="font-mono text-xs text-zinc-500 font-bold">@erickcua_19</span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-400">
                  Actualizaciones visuales, procesos de diseño, proyectos y contacto casual.
                </p>
              </div>
            </div>

            {/* Acción inferior */}
            <div
              className={`mt-6 flex items-center justify-between pt-4 border-t border-zinc-800/80 font-mono text-xs font-bold transition-colors ${
                selectedIndex === 2 ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
            >
              <span>Enviar mensaje / Seguir</span>
              <span
                className={`text-sm transition-transform ${
                  selectedIndex === 2
                    ? 'translate-x-1 -translate-y-0.5 text-[#D62D32]'
                    : 'text-zinc-500 group-hover:text-[#D62D32] group-hover:translate-x-1 group-hover:-translate-y-0.5'
                }`}
              >
                ↗
              </span>
            </div>
          </a>

        </div>

        {/* Footer sutil */}
        <div className="mt-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
            Erick Cuá · 2026
          </p>
        </div>
      </div>
    </section>
  )
}

export default SocialLinks
