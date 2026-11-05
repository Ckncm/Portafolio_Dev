import { useEffect, useRef } from 'react'

function ProjectTabs({ projects, activeId, onSelect }) {
  const tabRefs = useRef([])
  const listRef = useRef(null)
  const isFirstRender = useRef(true)

  const activeIndex = projects.findIndex((project) => project.id === activeId)

  useEffect(() => {
    if (activeIndex < 0) return
    const el = tabRefs.current[activeIndex]
    const list = listRef.current
    if (!el || !list) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Centrar la tarjeta seleccionada en el contenedor horizontal
    const targetLeft = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2

    if (isFirstRender.current) {
      isFirstRender.current = false
      list.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'auto',
      })
      return
    }

    list.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [activeIndex])

  const handleKeyDown = (event, index) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex =
      (index + delta + projects.length) % projects.length
    onSelect(projects[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Proyectos"
      className="snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="mx-auto flex w-max justify-center gap-4 px-[calc(50%-4rem)] pt-4 pb-8 sm:gap-6 sm:px-[calc(50%-5rem)]">
        {projects.map((project, index) => {
          const isActive = project.id === activeId
          return (
            <button
              key={project.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`tab-${project.id}`}
              aria-selected={isActive}
              aria-controls="project-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(project.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="group flex shrink-0 snap-center flex-col items-center gap-2 outline-none"
            >
              <span
                className={`relative flex aspect-[3/4] w-32 items-center justify-center overflow-hidden rounded-md border transition-all duration-300 sm:w-40 ${
                  isActive
                    ? 'z-10 -translate-y-1 scale-105 border-[#3B70B0] shadow-[0_0_32px_rgba(59,112,176,0.65)] ring-1 ring-[#3B70B0]/50 sm:scale-110'
                    : 'scale-95 border-white/10 opacity-50 hover:scale-100 hover:opacity-85 hover:border-white/25 group-focus-visible:border-white/40 group-focus-visible:opacity-100'
                }`}
                style={{
                  background:
                    'linear-gradient(160deg, #111B5E 0%, #0a0a0a 100%)',
                }}
              >
                {project.cover ? (
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 px-3 text-center">
                    <span className="font-mono text-[10px] leading-tight font-bold tracking-[0.15em] text-zinc-200 uppercase">
                      {project.title}
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500 uppercase">
                      sin portada
                    </span>
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectTabs
