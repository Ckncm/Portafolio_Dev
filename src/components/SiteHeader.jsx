function SiteHeader() {
  return (
    <header className="pointer-events-none fixed top-4 sm:top-6 left-0 z-40 select-none">
      {/* Tarjeta estilo Manga / Persona 5: plano en el borde, diagonal hacia el centro */}
      <div
        className="pointer-events-auto relative flex items-center transition-transform duration-300 hover:translate-x-1"
        style={{
          filter: 'drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.95))',
        }}
      >
        {/* Marco exterior azul (#3B70B0) con corte diagonal */}
        <div
          className="bg-[#3B70B0] p-[2px]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 26px) 100%, 0 100%)',
          }}
        >
          {/* Fondo negro interior (#050505) */}
          <div
            className="flex items-center gap-3 sm:gap-4.5 bg-[#050505] py-2.5 sm:py-3 pl-4 sm:pl-6 pr-10 sm:pr-12"
            style={{
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 25px) 100%, 0 100%)',
            }}
          >
            {/* Nombre y usuario */}
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-zinc-100 uppercase">
                Erick Cuá
              </span>
              <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#3B70B0] uppercase">
                ckncm
              </span>
            </div>

            {/* Separador angular estilo Manga / Persona 5 */}
            <div className="flex items-center text-[#3B70B0]/60 font-mono text-sm font-black -skew-x-[20deg] select-none">
              {'//'}
            </div>

            {/* Versión del portafolio */}
            <div className="flex items-center gap-1.5 rounded bg-[#3B70B0]/15 px-2.5 py-1 border border-[#3B70B0]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B70B0] animate-pulse" />
              <span className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-zinc-300 uppercase">
                v0.1 — dev
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
