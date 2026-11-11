import { useEffect, useState } from 'react'
import EncryptedText from '../components/EncryptedText.jsx'
import ckncmLogo from '../assets/logos/ckncm_logo.svg'
import { preloadImage, waitForFonts } from '../utils/preloadAssets.js'

const EXIT_MS = 500

function Preloader({ onDone }) {
  const [exiting, setExiting] = useState(false)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const minDisplayMs = reduced ? 400 : 2150

  useEffect(() => {
    let cancelled = false
    let minTimer = null
    let exitTimer = null

    const minDelay = new Promise((resolve) => {
      minTimer = setTimeout(resolve, minDisplayMs)
    })

    // Precargar fuentes y logo principal mientras corre la animación criptográfica
    const warmUp = Promise.all([
      waitForFonts(1500),
      preloadImage(ckncmLogo, 2000),
    ])

    Promise.all([minDelay, warmUp]).then(() => {
      if (cancelled) return
      setExiting(true)
      exitTimer = setTimeout(() => {
        if (!cancelled) onDone?.()
      }, EXIT_MS)
    })

    return () => {
      cancelled = true
      if (minTimer) clearTimeout(minTimer)
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [minDisplayMs, onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-all duration-500 ease-out ${
        exiting
          ? 'pointer-events-none -translate-y-2 opacity-0'
          : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center md:gap-5">
        <EncryptedText
          text="ckncm"
          className="font-mono text-xs tracking-[0.6em] uppercase sm:text-sm"
          encryptedClassName="text-zinc-700"
          revealedClassName="text-[#827DDB]"
          delay={0}
          revealDelayMs={45}
        />
        <EncryptedText
          text="ERICK CUÁ"
          className="font-mono text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          encryptedClassName="text-zinc-800"
          revealedClassName="text-zinc-50"
          delay={450}
          revealDelayMs={55}
        />
        <EncryptedText
          text="Developer"
          className="font-mono text-sm tracking-[0.35em] uppercase sm:text-base"
          encryptedClassName="text-zinc-700"
          revealedClassName="text-[#A292F0]"
          delay={1150}
          revealDelayMs={50}
        />
      </div>
    </div>
  )
}

export default Preloader
