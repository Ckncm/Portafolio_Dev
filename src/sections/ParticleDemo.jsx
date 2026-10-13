import ParticleImage from '../components/ParticleImage.jsx'
import ckncmLogo from '../assets/ckncm_logo.webp'

function ParticleDemo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <ParticleImage src={ckncmLogo} />
    </section>
  )
}

export default ParticleDemo
