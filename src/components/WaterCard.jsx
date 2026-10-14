import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function WaterCard({ certificate, direction }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [animClass, setAnimClass] = useState('')
  const reduced = useRef(prefersReducedMotion())
  const prevCertId = useRef(certificate.id)

  useEffect(() => {
    if (reduced.current) return
    if (prevCertId.current !== certificate.id) {
      prevCertId.current = certificate.id
      setAnimClass(direction === 'next' ? 'cert-enter-next' : 'cert-enter-prev')
      const timer = setTimeout(() => setAnimClass(''), 500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [certificate.id, direction])

  useEffect(() => {
    if (!expanded) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const handleMouseMove = (e) => {
    if (reduced.current || !cardRef.current || expanded) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const px = (e.clientX - cx) / (rect.width / 2)
    const py = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: -py * 12, y: px * 12 })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const floatStyle = reduced.current || expanded
    ? {}
    : {
        animation: 'cert-float 7s ease-in-out infinite',
        animationPlayState: hovered ? 'paused' : 'running',
      }

  const cardAnimStyle = animClass
    ? { animation: `${animClass} 450ms cubic-bezier(0.22, 0.61, 0.36, 1)` }
    : {}

  const tiltStyle = expanded
    ? {}
    : hovered && !reduced.current
      ? {
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.08)`,
        }
      : {
          transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        }

  const certContent = certificate.image ? (
    <img
      src={certificate.image}
      alt={certificate.title}
      className="h-full w-full object-cover"
      draggable={false}
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#111B5E] via-[#1a2a6e] to-[#3B70B0]">
      <svg
        className="h-12 w-12 text-white/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <span className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
        {certificate.title}
      </span>
    </div>
  )

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="mb-6 text-center">
        <p className="font-sans text-sm font-semibold text-zinc-200">
          {certificate.title}
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          {certificate.issuer}
        </p>
      </div>

      <div className="relative" style={floatStyle}>
        <div
          ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setExpanded(true)}
          className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
          style={{
            ...tiltStyle,
            ...cardAnimStyle,
            width: 'min(340px, 80vw)',
            height: 'min(220px, 52vw)',
          }}
        >
          {certContent}
        </div>

        <div
          className="pointer-events-none absolute left-0 top-full w-full overflow-hidden"
          style={{
            height: '60%',
            transform: 'scaleY(-1)',
            maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 100%)',
            filter: 'blur(3px)',
            opacity: 0.5,
          }}
          aria-hidden="true"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10"
            style={{
              width: 'min(340px, 80vw)',
              height: 'min(220px, 52vw)',
            }}
          >
            {certificate.image ? (
              <img
                src={certificate.image}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#111B5E] via-[#1a2a6e] to-[#3B70B0]" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label={certificate.title}
        >
          <div
            className="relative w-full max-w-3xl"
            style={{ animation: 'cert-zoom-in 350ms cubic-bezier(0.22, 0.61, 0.36, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              {certificate.image ? (
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="h-auto w-full"
                  draggable={false}
                />
              ) : (
                <div className="flex h-80 w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#111B5E] via-[#1a2a6e] to-[#3B70B0]">
                  <svg
                    className="h-16 w-16 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span className="font-mono text-sm tracking-[0.2em] text-white/40 uppercase">
                    {certificate.title}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Cerrar"
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-zinc-300 transition-colors duration-200 hover:bg-black hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaterCard
