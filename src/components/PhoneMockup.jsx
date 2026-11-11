import { useState, useRef, useEffect } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function PhoneMockup({ image, alt, title, onExpand }) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [reduced, setReduced] = useState(prefersReduced)
  const [loadedSrc, setLoadedSrc] = useState('')
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  )
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const isLoaded = loadedSrc === image

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoadedSrc(image)
    }
  }, [image])

  const handleMouseMove = (e) => {
    if (reduced || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Ángulo máximo de inclinación (grados)
    const maxTilt = 8
    const rotateY = ((x - centerX) / centerX) * maxTilt
    const rotateX = ((centerY - y) / centerY) * maxTilt

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    )

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    })
  }

  const handleMouseLeave = () => {
    setTransform(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    )
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div className="relative flex w-[min(270px,calc(100vw-11rem))] sm:w-[300px] md:w-[320px] shrink-0 items-center justify-center py-2">
      {/* Chasis exterior del smartphone - marco delgado y estilizado */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onExpand?.()
          }
        }}
        aria-label="Ver imagen en tamaño completo"
        className="group relative w-full cursor-zoom-in select-none rounded-[1.75rem] border border-zinc-800/90 bg-gradient-to-b from-zinc-950 via-black to-[#050505] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_25px_rgba(59,112,176,0.12)] transition-transform duration-200 ease-out sm:p-2 ring-1 ring-black"
        style={{
          transform,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Botones físicos: Subir y Bajar Volumen (Izquierda) */}
        <div
          title="Subir volumen"
          className="absolute -left-[3px] top-18 h-8 w-[3px] rounded-l-sm bg-zinc-800 border-l border-t border-b border-zinc-700/80 sm:-left-[4px] sm:top-22 sm:h-10 sm:w-[4px]"
        />
        <div
          title="Bajar volumen"
          className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l-sm bg-zinc-800 border-l border-t border-b border-zinc-700/80 sm:-left-[4px] sm:top-34 sm:h-10 sm:w-[4px]"
        />

        {/* Botón físico: Apagar / Bloqueo (Derecha) */}
        <div
          title="Botón de encendido / bloqueo"
          className="absolute -right-[3px] top-22 h-12 w-[3px] rounded-r-sm bg-zinc-800 border-r border-t border-b border-zinc-700/80 sm:-right-[4px] sm:top-26 sm:h-14 sm:w-[4px]"
        />

        {/* Pantalla interior del teléfono con proporción fija */}
        <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[1.35rem] bg-zinc-950 ring-1 ring-zinc-900/60">
          {/* Indicador mientras carga la imagen sin colapsar dimensiones */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B70B0]/30 border-t-[#3B70B0]" />
            </div>
          )}

          {/* Imagen de la pantalla actual */}
          <img
            ref={imgRef}
            src={image}
            alt={alt || `${title} pantalla`}
            onLoad={() => setLoadedSrc(image)}
            className={`h-full w-full object-cover transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />

          {/* Reflejo Glare reactivo al ratón */}
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(59, 112, 176, 0.12) 30%, transparent 65%)`,
            }}
          />

          {/* Badge flotante "Click para expandir" */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 font-mono text-[10px] tracking-widest text-zinc-100 uppercase backdrop-blur-md shadow-lg">
              <svg
                className="h-3.5 w-3.5 text-[#3B70B0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Ver en grande
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneMockup
