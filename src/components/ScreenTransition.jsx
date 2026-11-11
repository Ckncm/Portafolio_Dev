import { useEffect } from 'react'

const WIPE_DURATION_MS = 740
const COVER_AT_MS = 415
const DONE_AT_MS = 920

const WIPE_LAYERS = [
  { color: '#3B70B0', delay: 0, border: '' },
  { color: '#D62D32', delay: 40, border: '' },
  {
    color: '#050505',
    delay: 60,
    border: 'border-x-4 border-[#3B70B0]',
  },
  { color: '#D62D32', delay: 110, border: '' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ScreenTransition({ onCovered, onDone }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      onCovered?.()
      onDone?.()
      return undefined
    }

    const coverTimer = setTimeout(() => onCovered?.(), COVER_AT_MS)
    const doneTimer = setTimeout(() => onDone?.(), DONE_AT_MS)

    return () => {
      clearTimeout(coverTimer)
      clearTimeout(doneTimer)
    }
  }, [onCovered, onDone])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-50 overflow-hidden"
    >
      {WIPE_LAYERS.map((layer, index) => (
        <div
          key={index}
          className={`fixed -inset-y-8 -left-[25vw] w-[150vw] ${layer.border}`}
          style={{
            backgroundColor: layer.color,
            transform: 'translateX(-125%) skewX(-18deg)',
            animation: `diagonal-wipe ${WIPE_DURATION_MS}ms cubic-bezier(0.77, 0, 0.175, 1) ${layer.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default ScreenTransition

