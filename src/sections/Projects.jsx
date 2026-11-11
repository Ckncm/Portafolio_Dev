import { useState } from 'react'
import ProjectTabs from '../components/ProjectTabs.jsx'
import ProjectDetail from '../components/ProjectDetail.jsx'
import { projects } from '../data/projects.js'

function Projects() {
  const availableProjects = projects.filter((project) => !project.draft)
  const [activeId, setActiveId] = useState(
    availableProjects[0]?.id || projects[0]?.id
  )

  const activeProject =
    availableProjects.find((project) => project.id === activeId) ??
    availableProjects[0]

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050505]/75">
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
      <div className="relative mx-auto w-full max-w-5xl px-6 pt-24 sm:pt-20 pb-24">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-mono text-4xl font-bold tracking-[0.2em] text-zinc-100 uppercase sm:text-5xl">
            Proyectos
          </h2>
          <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">
            Programador frontend y diseño UI/UX
          </p>
        </div>

        <ProjectTabs
          projects={availableProjects}
          activeId={activeId}
          onSelect={setActiveId}
        />

        <ProjectDetail project={activeProject} />
      </div>
    </section>
  )
}

export default Projects
