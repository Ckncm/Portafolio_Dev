import { useState, useEffect } from 'react'
import PhoneMockup from './PhoneMockup.jsx'
import ImageLightbox from './ImageLightbox.jsx'

function ProjectDetail({ project }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Reiniciar a la primera imagen al cambiar de proyecto y precargar capturas
  useEffect(() => {
    setActiveImageIndex(0)
    setIsLightboxOpen(false)
    project.images?.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [project.id, project.images])

  const images = project.images || []
  const hasImages = images.length > 0

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const links = Array.isArray(project.links)
    ? project.links.filter((link) => link.href)
    : [
        { label: 'Ver demo', href: project.links?.demo },
        { label: 'Código fuente', href: project.links?.code },
      ].filter((link) => link.href)

  return (
    <div
      id="project-panel"
      role="tabpanel"
      aria-labelledby={`tab-${project.id}`}
      tabIndex={0}
      key={project.id}
      className="project-enter"
    >
      {/* Título y descripción del proyecto */}
      <h3 className="text-center font-mono text-2xl font-bold tracking-[0.15em] text-zinc-100 uppercase sm:text-3xl">
        {project.title}
      </h3>

      <p className="mx-auto mt-4 max-w-2xl text-center font-mono text-sm leading-relaxed text-zinc-400">
        {project.description}
      </p>

      {/* Botones de acción / enlaces con iconos */}
      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 font-mono text-xs tracking-wider text-zinc-200 transition-all duration-300 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
            >
              {link.icon && (
                <img
                  src={link.icon}
                  alt={`${link.label} icono`}
                  className="h-5 w-5 shrink-0 object-contain"
                />
              )}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Escenario del teléfono interactivo */}
      <div className="mt-10">
        {hasImages ? (
          <div className="flex flex-col items-center">
            {/* Teléfono central con sus dos botones para cambiar de imagen */}
            <div className="flex w-full items-center justify-center gap-3 sm:gap-8">
              {/* Botón cambiar imagen anterior */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Pantalla anterior"
                  title="Pantalla anterior"
                  className="group flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/80 text-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#3B70B0] hover:bg-[#3B70B0]/15 hover:text-white"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:-translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Smartphone mockup */}
              <PhoneMockup
                image={images[activeImageIndex]}
                title={project.title}
                alt={`${project.title} pantalla ${activeImageIndex + 1}`}
                onExpand={() => setIsLightboxOpen(true)}
              />

              {/* Botón cambiar imagen siguiente */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente pantalla"
                  title="Siguiente pantalla"
                  className="group flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/80 text-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#3B70B0] hover:bg-[#3B70B0]/15 hover:text-white"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Contador de pantalla */}
            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#3B70B0]">
                  {String(activeImageIndex + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs text-zinc-600">/</span>
                <span className="font-mono text-xs tracking-wider text-zinc-500">
                  {String(images.length).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-[16/6] items-center justify-center rounded-lg border border-dashed border-white/10 bg-zinc-950/20">
            <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
              imágenes próximamente
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Modal a pantalla completa */}
      <ImageLightbox
        images={images}
        currentIndex={activeImageIndex}
        title={project.title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActiveImageIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}

export default ProjectDetail
