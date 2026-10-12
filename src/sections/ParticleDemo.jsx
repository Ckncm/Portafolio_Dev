import ParticleImage from '../components/ParticleImage.jsx'
import ckncmLogo from '../assets/ckncm_logo.webp'

function ParticleDemo() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      <ParticleImage src={ckncmLogo} />
    </section>
  )
}

export default ParticleDemo
