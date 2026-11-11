import ParticleImage from '../components/ParticleImage.jsx'
import GameMenu from '../components/GameMenu.jsx'
import ckncmLogo from '../assets/logos/ckncm_logo.svg'

function ParticleDemo({ onSelectScreen, isTransitioning = false }) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-10 md:h-screen md:flex-row md:px-12 md:pt-0 md:pb-0 lg:px-20">
      {/* Lado izquierdo: Logo interactivo con partículas */}
      <div className="h-[36vh] w-full shrink-0 sm:h-[42vh] md:h-full md:w-1/2">
        <ParticleImage src={ckncmLogo} align="center" sizeRatio={0.68} />
      </div>

      {/* Lado derecho: Menú estilo videojuego */}
      <div className="flex w-full items-center justify-center md:w-1/2 md:justify-start md:pl-4 lg:pl-10">
        <GameMenu onSelectScreen={onSelectScreen} disabled={isTransitioning} />
      </div>
    </section>
  )
}

export default ParticleDemo
