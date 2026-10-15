import { useCallback, useEffect, useRef, useState } from 'react'
import WaterCard from '../components/WaterCard.jsx'
import { certificates } from '../data/certificates.js'

function Formacion() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const touchStart = useRef(null)

  const goTo = useCallback((index, dir) => {
    setDirection(dir || 'next')
    setActiveIndex((index + certificates.length) % certificates.length)
  }, [])

  const goNext = useCallback(() => goTo(activeIndex + 1, 'next'), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1, 'prev'), [activeIndex, goTo])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStart.current = null
  }

  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center">
        <h2 className="font-mono text-4xl font-bold tracking-[0.2em] text-zinc-100 uppercase sm:text-5xl">
          Formación
        </h2>

        <div
          className="mt-6 w-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <WaterCard certificate={certificates[activeIndex]} direction={direction} />
        </div>

        <div className="mt-28 flex items-center gap-4">
          <button
            onClick={goPrev}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-white/25 hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {certificates.map((cert, i) => (
            <button
              key={cert.id}
              onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
              aria-label={cert.title}
              className={`overflow-hidden rounded-lg border transition-all duration-300 ${
                i === activeIndex
                  ? 'border-[#D62D32] opacity-100'
                  : 'border-white/10 opacity-40 hover:opacity-70'
              }`}
              style={{ width: 56, height: 38 }}
            >
              {cert.image ? (
                <img
                  src={cert.image}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#111B5E] to-[#3B70B0]" />
              )}
            </button>
          ))}

          <button
            onClick={goNext}
            aria-label="Siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-white/25 hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {certificates.map((cert, i) => (
            <span
              key={cert.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-[#D62D32]' : 'w-1.5 bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Formacion
