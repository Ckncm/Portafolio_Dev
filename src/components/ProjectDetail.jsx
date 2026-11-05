import { useState, useEffect } from 'react'
import PhoneMockup from './PhoneMockup.jsx'
import ImageLightbox from './ImageLightbox.jsx'

const PAGE_SIZE = 6

function ProjectDetail({ project }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Reiniciar a la primera imagen al cambiar de proyecto
  useEffect(() => {
    setActiveImageIndex(0)
    setCurrentPage(0)
    setIsLightboxOpen(false)
  }, [project.id])

  const images = project.images || []
  const hasImages = images.length > 0
  const totalPages = Math.ceil(images.length / PAGE_SIZE)

  // Mantener la página de miniaturas sincronizada con la imagen que se visualiza
  useEffect(() => {
    setCurrentPage(Math.floor(activeImageIndex / PAGE_SIZE))
  }, [activeImageIndex])

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const pages = Array.from({ length: totalPages }, (_, pIdx) =>
    images.slice(pIdx * PAGE_SIZE, (pIdx + 1) * PAGE_SIZE)
  )

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

      {/* Escenario de dispositivo interactivo (Device Stage) */}
      <div className="mt-10">
        {hasImages ? (
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Columna Izquierda: Mockup de Smartphone 3D */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <PhoneMockup
                image={images[activeImageIndex]}
                title={project.title}
                alt={`${project.title} pantalla ${activeImageIndex + 1}`}
                onExpand={() => setIsLightboxOpen(true)}
              />
            </div>

            {/* Columna Derecha: Selector de flujo y miniaturas */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              {/* Contenedor con transición suave deslizante entre páginas */}
              <div className="relative flex items-center gap-2 sm:gap-3">
                {/* Botón izquierdo para regresar a la página anterior */}
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    aria-label="Página anterior de miniaturas"
                    title="Página anterior"
                    className={`flex h-12 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-zinc-300 transition-all ${
                      currentPage === 0
                        ? 'cursor-not-allowed opacity-20'
                        : 'hover:scale-105 hover:border-[#3B70B0] hover:bg-[#3B70B0]/15 hover:text-white'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                  >
                    {pages.map((pageImages, pageIdx) => {
                      const emptySlots = PAGE_SIZE - pageImages.length
                      return (
                        <div
                          key={pageIdx}
                          className="grid w-full shrink-0 grid-cols-3 gap-3 p-2.5"
                        >
                          {pageImages.map((img, i) => {
                            const idx = pageIdx * PAGE_SIZE + i
                            const isActive = idx === activeImageIndex
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImageIndex(idx)}
                                className={`group relative aspect-[9/16] overflow-hidden rounded-lg border text-left transition-all duration-300 ${
                                  isActive
                                    ? 'border-[#3B70B0] ring-2 ring-[#3B70B0]/40 shadow-[0_0_16px_rgba(59,112,176,0.35)] scale-105'
                                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Vista previa ${idx + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <span className="absolute bottom-1 left-1.5 font-mono text-[10px] font-bold text-white">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                              </button>
                            )
                          })}

                          {/* Espacios vacíos transparentes para que la altura sea uniforme */}
                          {emptySlots > 0 &&
                            Array.from({ length: emptySlots }).map((_, emptyIdx) => (
                              <div
                                key={`empty-${emptyIdx}`}
                                aria-hidden="true"
                                className="pointer-events-none aspect-[9/16] opacity-0"
                              />
                            ))}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Botón derecho para avanzar a la página siguiente */}
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Siguiente página de miniaturas"
                    title="Siguiente página"
                    className={`flex h-12 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-zinc-300 transition-all ${
                      currentPage === totalPages - 1
                        ? 'cursor-not-allowed opacity-20'
                        : 'hover:scale-105 hover:border-[#3B70B0] hover:bg-[#3B70B0]/15 hover:text-white'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Indicador de página abajo */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  {Array.from({ length: totalPages }).map((_, pageIdx) => (
                    <button
                      key={pageIdx}
                      type="button"
                      onClick={() => setCurrentPage(pageIdx)}
                      aria-label={`Ir a página ${pageIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        pageIdx === currentPage
                          ? 'w-6 bg-[#3B70B0]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                    Pág. {currentPage + 1} de {totalPages}
                  </span>
                </div>
              )}
            </div>
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
