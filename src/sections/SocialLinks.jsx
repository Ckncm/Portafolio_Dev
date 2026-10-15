import githubLogo from '../assets/logos/github_logo_icon_229278.webp'
import instagramLogo from '../assets/logos/Instagram_logo_2022.svg.webp'

function SocialLinks() {
  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24">
      <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
        Hablemos de Proyectos
      </h2>
      <p className="mt-4 max-w-md text-center font-sans text-base leading-relaxed text-zinc-400">
        ¿Tienes una idea en mente o quieres colaborar en algo genial? Envíame un mensaje directo.
      </p>

      <a
        href="mailto:ckncmm@gmail.com"
        className="group mt-10 flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-[#D62D32]/40 hover:bg-white/[0.06]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D62D32]/20">
          <svg
            className="h-5 w-5 text-[#D62D32]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            Correo Electrónico
          </p>
          <p className="font-sans text-base font-semibold text-zinc-100">
            ckncmm@gmail.com
          </p>
        </div>
        <svg
          className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D62D32]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </a>

      <div className="mt-10 flex items-center gap-12">
        <a
          href="https://github.com/Ckncm"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-3"
        >
          <img
            src={githubLogo}
            alt="GitHub"
            className="h-10 w-10 opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
          />
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase transition-colors duration-300 group-hover:text-zinc-200">
            GitHub
          </span>
        </a>

        <a
          href="https://instagram.com/erickcua_19"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-3"
        >
          <img
            src={instagramLogo}
            alt="Instagram"
            className="h-10 w-10 opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
          />
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase transition-colors duration-300 group-hover:text-zinc-200">
            Instagram
          </span>
        </a>
      </div>

      <p className="mt-16 font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
        Diseñado & Desarrollado • 2026
      </p>
    </section>
  )
}

export default SocialLinks
