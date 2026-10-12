import { useCallback, useState } from 'react'
import Preloader from './sections/Preloader.jsx'
import TerminalLoader from './sections/TerminalLoader.jsx'

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [siteVisible, setSiteVisible] = useState(false)

  const handlePreloaderDone = useCallback(() => {
    setShowPreloader(false)
    setShowTerminal(true)
  }, [])
  const handleTerminalReveal = useCallback(() => setSiteVisible(true), [])
  const handleTerminalDone = useCallback(() => setShowTerminal(false), [])

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <main
        className={`flex h-screen items-center justify-center px-6 transition-opacity duration-500 ${
          siteVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="font-mono text-sm tracking-[0.3em] text-zinc-600 uppercase">
          Portafolio — próximamente
        </p>
      </main>
      {showPreloader && <Preloader onDone={handlePreloaderDone} />}
      {showTerminal && (
        <TerminalLoader
          onReveal={handleTerminalReveal}
          onDone={handleTerminalDone}
        />
      )}
    </div>
  )
}

export default App
