import { useCallback, useState } from 'react'
import Preloader from './sections/Preloader.jsx'
import TerminalLoader from './sections/TerminalLoader.jsx'
import ParticleDemo from './sections/ParticleDemo.jsx'
import AppScreens from './sections/AppScreens.jsx'
import PixelCurtain from './components/PixelCurtain.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import DotField from './components/DotField.jsx'
import PageTurn from './components/PageTurn.jsx'
import SocialLinks from './sections/SocialLinks.jsx'

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCurtain, setShowCurtain] = useState(false)
  const [siteVisible, setSiteVisible] = useState(false)

  const handlePreloaderDone = useCallback(() => {
    setShowPreloader(false)
    setShowTerminal(true)
  }, [])
  const handleTerminalReveal = useCallback(() => setShowCurtain(true), [])
  const handleTerminalDone = useCallback(() => setShowTerminal(false), [])
  const handleCurtainCovered = useCallback(() => setSiteVisible(true), [])
  const handleCurtainDone = useCallback(() => setShowCurtain(false), [])

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <main
        className={`min-h-screen w-full transition-opacity duration-500 ${
          siteVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {siteVisible && <DotField />}
        <div className="relative z-10">
        {siteVisible && <ParticleDemo />}
        {siteVisible && <PageTurn />}
        {siteVisible && <AppScreens />}
        {siteVisible && <SocialLinks />}
        </div>
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
    </div>
  )
}

export default App
