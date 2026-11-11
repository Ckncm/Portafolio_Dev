const ACCENT_STYLES = {
  blue: {
    border: 'border-[#3B70B0]',
    hoverBorder: 'hover:border-[#3B70B0]',
    activeBg: 'bg-[#3B70B0]',
    codeText: 'text-[#3B70B0]',
    tagBg: 'bg-[#3B70B0]/15 border-[#3B70B0]/40',
  },
  red: {
    border: 'border-[#D62D32]',
    hoverBorder: 'hover:border-[#D62D32]',
    activeBg: 'bg-[#D62D32]',
    codeText: 'text-[#D62D32]',
    tagBg: 'bg-[#D62D32]/15 border-[#D62D32]/40',
  },
}

function ParallelogramButton({
  label,
  code,
  subtitle,
  accent = 'blue',
  variant = 'menu',
  active = false,
  disabled = false,
  onClick,
  onMouseEnter,
}) {
  const palette = ACCENT_STYLES[accent] ?? ACCENT_STYLES.blue

  if (variant === 'back') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Volver al menú principal"
        className="group relative cursor-pointer -skew-x-[18deg] border-2 border-[#D62D32] bg-[#050505] px-4 py-2 sm:px-5 sm:py-2.5 text-zinc-100 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] transition-all duration-200 hover:-translate-x-1 hover:bg-[#D62D32] hover:text-white active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="flex skew-x-[18deg] items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>{label}</span>
          <span className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[9px] tracking-widest text-zinc-300 group-hover:bg-black/25 group-hover:text-white">
            ESC
          </span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      className={`group relative w-full cursor-pointer -skew-x-[18deg] border-2 px-5 py-3.5 sm:px-7 sm:py-4 text-left shadow-[5px_5px_0px_rgba(0,0,0,0.95)] transition-all duration-200 disabled:pointer-events-none ${
        active
          ? `${palette.border} ${palette.activeBg} -translate-x-2 sm:-translate-x-3 text-white`
          : `border-[#3B70B0]/55 bg-[#050505]/95 text-zinc-100 ${palette.hoverBorder} hover:-translate-x-2`
      }`}
    >
      <div className="flex skew-x-[18deg] items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Código numérico estilo HUD */}
          {code && (
            <span
              className={`rounded border px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold tracking-widest transition-colors ${
                active
                  ? 'border-white/40 bg-black/25 text-white'
                  : `${palette.tagBg} ${palette.codeText}`
              }`}
            >
              {code}
            </span>
          )}

          {/* Título y subtítulo */}
          <div className="flex flex-col">
            <span className="font-mono text-base sm:text-xl font-extrabold tracking-[0.18em] uppercase">
              {label}
            </span>
            {subtitle && (
              <span
                className={`font-mono text-[10px] sm:text-xs tracking-[0.15em] transition-colors ${
                  active ? 'text-white/85' : 'text-zinc-500'
                }`}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Indicador de selección */}
        <span
          className={`font-mono text-sm sm:text-base font-black transition-transform duration-200 ${
            active
              ? 'translate-x-0 text-white opacity-100'
              : '-translate-x-2 text-[#3B70B0] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
          }`}
        >
          ▸
        </span>
      </div>
    </button>
  )
}

export default ParallelogramButton
