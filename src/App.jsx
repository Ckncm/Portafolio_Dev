import { useCallback, useEffect, useState } from 'react'
import Preloader from './sections/Preloader.jsx'
import TerminalLoader from './sections/TerminalLoader.jsx'
import ParticleDemo from './sections/ParticleDemo.jsx'
import Projects from './sections/Projects.jsx'
import PixelCurtain from './components/PixelCurtain.jsx'
import ScreenTransition from './components/ScreenTransition.jsx'
import ParallelogramButton from './components/ParallelogramButton.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import DotField from './components/DotField.jsx'
import SocialLinks from './sections/SocialLinks.jsx'
import Formacion from './sections/Formacion.jsx'

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCurtain, setShowCurtain] = useState(false)
  const [siteVisible, setSiteVisible] = useState(false)
  const [activeScreen, setActiveScreen] = useState('home')
  const [pendingScreen, setPendingScreen] = useState(null)

  // Asegurar que siempre inicie en la parte superior sin restaurar posiciones anteriores
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  const handlePreloaderDone = useCallback(() => {
    setShowPreloader(false)
    setShowTerminal(true)
  }, [])
  const handleTerminalReveal = useCallback(() => setShowCurtain(true), [])
  const handleTerminalDone = useCallback(() => setShowTerminal(false), [])
  const handleCurtainCovered = useCallback(() => {
    window.scrollTo(0, 0)
    setSiteVisible(true)
  }, [])
  const handleCurtainDone = useCallback(() => setShowCurtain(false), [])

  const navigateTo = useCallback(
    (target) => {
      if (!target || target === activeScreen || pendingScreen) return
      setPendingScreen(target)
    },
    [activeScreen, pendingScreen]
  )

  const handleTransitionCovered = useCallback(() => {
    if (pendingScreen) {
      setActiveScreen(pendingScreen)
      window.scrollTo(0, 0)
    }
  }, [pendingScreen])

  const handleTransitionDone = useCallback(() => {
    setPendingScreen(null)
  }, [])

  // Atajo ESC para regresar al menú principal cuando no hay modales abiertos
  useEffect(() => {
    if (!siteVisible || activeScreen === 'home' || pendingScreen) {
      return undefined
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) {
        navigateTo('home')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [siteVisible, activeScreen, pendingScreen, navigateTo])

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <main
        className={`min-h-screen w-full transition-opacity duration-500 ${
          siteVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {siteVisible && <DotField />}

        {/* Pantalla activa según selección del menú */}
        {siteVisible && (
          <div className="relative z-10">
            {activeScreen === 'home' && (
              <ParticleDemo
                onSelectScreen={navigateTo}
                isTransitioning={Boolean(pendingScreen)}
              />
            )}
            {activeScreen === 'projects' && <Projects />}
            {activeScreen === 'formacion' && <Formacion />}
            {activeScreen === 'contact' && <SocialLinks />}
          </div>
        )}

        {/* Botón único de regreso al menú en pantallas secundarias */}
        {siteVisible && activeScreen !== 'home' && (
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
            <ParallelogramButton
              variant="back"
              label="Menú"
              disabled={Boolean(pendingScreen)}
              onClick={() => navigateTo('home')}
            />
          </div>
        )}

        {siteVisible && <SiteHeader />}
      </main>

      {showPreloader && <Preloader onDone={handlePreloaderDone} />}
      {showTerminal && (
        <TerminalLoader
          onReveal={handleTerminalReveal}
          onDone={handleTerminalDone}
        />
      )}
      {showCurtain && (
        <PixelCurtain
          onCovered={handleCurtainCovered}
          onDone={handleCurtainDone}
        />
      )}
      {pendingScreen && (
        <ScreenTransition
          onCovered={handleTransitionCovered}
          onDone={handleTransitionDone}
        />
      )}
    </div>
  )
}

export default App
