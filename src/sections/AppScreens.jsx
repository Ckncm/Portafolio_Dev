import { useEffect, useRef, useState } from 'react'
import ScreenCard from '../components/ScreenCard.jsx'
import { appScreens } from '../data/appScreens.js'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function AppScreens() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const itemRefs = useRef([])
  const reduced = useRef(prefersReducedMotion())

  useEffect(() => {
    if (reduced.current) {
      setActiveIndex(-2)
      return undefined
    }
    let raf = 0
    const measure = () => {
      raf = 0
      const vh = window.innerHeight
      const center = vh / 2
      let best = -1
      let bestDist = Infinity
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > vh) return
        const cardCenter = (rect.top + rect.bottom) / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActiveIndex(best)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-[#050505]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2"
        style={{ filter: 'blur(30px)' }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(to bottom, rgba(59,112,176,0.3) 0%, rgba(59,112,176,0.12) 40%, rgba(59,112,176,0.04) 70%, transparent 100%)',
            clipPath: 'polygon(43% 0%, 57% 0%, 92% 100%, 8% 100%)',
          }}
        />
      </div>
      <div className="relative mx-auto w-full max-w-[500px] px-6 pt-10 pb-40">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <h2 className="font-mono text-4xl font-bold tracking-[0.2em] text-zinc-100 uppercase sm:text-5xl">
            Proyectos
          </h2>
          <h3 className="font-mono text-lg tracking-[0.4em] text-[#3B70B0] uppercase">
            Calet
          </h3>
          <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">
            Programador frontend y diseño UI/UX
          </p>
        </div>
        {appScreens.map((screen, i) => (
          <ScreenCard
            key={screen.id}
            title={screen.title}
            image={screen.image}
            active={activeIndex === -2 || i === activeIndex}
            containerRef={(el) => {
              itemRefs.current[i] = el
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default AppScreens
