import { useEffect } from 'react'

function ImageLightbox({
  images,
  currentIndex,
  title,
  isOpen,
  onClose,
  onSelectIndex,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, onPrev, onNext])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de ${title}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 p-4 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Barra superior con info y botón cerrar */}
      <div
        className="flex w-full max-w-4xl items-center justify-between border-b border-white/10 pb-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#3B70B0] uppercase">
            {title}
          </span>
          <span className="font-mono text-xs text-zinc-400">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista ampliada"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-300 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Imagen central con controles laterales */}
      <div
        className="relative my-auto flex max-h-[75vh] w-full max-w-md items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Pantalla anterior"
            className="absolute -left-4 sm:-left-14 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-zinc-200 backdrop-blur-md transition-all hover:scale-110 hover:border-[#3B70B0] hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="relative aspect-[9/18.5] max-h-[75vh] overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_0_50px_rgba(59,112,176,0.25)]">
          <img
            key={currentImage}
            src={currentImage}
            alt={`${title} - pantalla ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Siguiente pantalla"
            className="absolute -right-4 sm:-right-14 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-zinc-200 backdrop-blur-md transition-all hover:scale-110 hover:border-[#3B70B0] hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Tira inferior de miniaturas */}
      {images.length > 1 && (
        <div
          className="flex max-w-xl items-center gap-2 overflow-x-auto py-2 px-3"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-14 w-8 shrink-0 overflow-hidden rounded-md border transition-all ${
                idx === currentIndex
                  ? 'border-[#3B70B0] ring-2 ring-[#3B70B0]/40 scale-105'
                  : 'border-white/15 opacity-50 hover:opacity-100 hover:border-white/40'
              }`}
            >
              <img
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageLightbox

