const SPLASH_CLIP =
  'path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")'

function ScreenCard({ title, image, active, containerRef }) {
  return (
    <div
      ref={containerRef}
      className="relative mb-[-120px] flex items-start justify-center overflow-hidden pt-5"
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(306deg, #111B5E, #3B70B0)',
          clipPath: SPLASH_CLIP,
        }}
      />
      <div
        className="flex h-[430px] w-[300px] items-center justify-center overflow-hidden rounded-[20px] bg-black"
        style={{
          boxShadow:
            '0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)',
          transformOrigin: '10% 60%',
          transform: active
            ? 'translateY(50px) rotate(-10deg)'
            : 'translateY(300px)',
          transition: 'transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-zinc-200 uppercase">
              {title}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              placeholder
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScreenCard
