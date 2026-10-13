function PageTurn() {
  return (
    <div className="pointer-events-none relative z-20 -mb-1 w-full">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-24 w-full"
      >
        <defs>
          <filter id="pageGlow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path
          d="M0,60 Q720,-40 1440,60"
          fill="none"
          stroke="#3B70B0"
          strokeWidth="1.5"
          opacity="0.45"
          filter="url(#pageGlow)"
        />
        <path d="M0,120 L0,60 Q720,-40 1440,60 L1440,120 Z" fill="#050505" />
      </svg>
    </div>
  )
}

export default PageTurn
