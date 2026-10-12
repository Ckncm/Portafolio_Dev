import { useEffect, useState } from 'react'
import EncryptedText from '../components/EncryptedText.jsx'

const EXIT_MS = 600

function Preloader({ onDone }) {
  const [exiting, setExiting] = useState(false)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const total = reduced ? 500 : 2300

  useEffect(() => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setExiting(true)
      setTimeout(onDone, EXIT_MS)
    }

    const timer = setTimeout(finish, total)
    return () => clearTimeout(timer)
  }, [total, onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-all duration-500 ease-out ${exiting
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
