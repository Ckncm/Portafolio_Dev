import { useEffect, useMemo } from 'react'

const PIXEL = 80
const APPEAR_MS = 650
const HIDE_MS = 650
const COVER_MAX_DELAY = 500
const COVER_JITTER = 70
const COVER_MS = COVER_MAX_DELAY + COVER_JITTER + APPEAR_MS + 150
const REVEAL_MAX_DELAY = 1200
const REVEAL_JITTER = 150
const REVEAL_MS = REVEAL_MAX_DELAY + REVEAL_JITTER + HIDE_MS + 150

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function rand(i, salt) {
  let h = (i + 1) * 374761393 + salt * 668265263
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return Math.abs(h) / 2147483647
}

function PixelCurtain({ onCovered, onDone }) {
  const { cols, pixels } = useMemo(() => {
    const cols = Math.ceil(window.innerWidth / PIXEL)
    const rows = Math.ceil(window.innerHeight / PIXEL)
    const maxRow = Math.max(1, rows - 1)
    const pixels = Array.from({ length: cols * rows }, (_, i) => {
      const row = Math.floor(i / cols)
      const t = row / maxRow
      const jitterIn = (rand(i, 2) - 0.5) * 2 * COVER_JITTER
      const jitterOut = (rand(i, 3) - 0.5) * 2 * REVEAL_JITTER
      return {
        appearDelay: Math.max(
          0,
          Math.round(t * COVER_MAX_DELAY + jitterIn),
        ),
        hideAt:
          COVER_MS +
          Math.max(0, Math.round(t * REVEAL_MAX_DELAY + jitterOut)),
      }
    })
    return { cols, pixels }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) {
      onCovered?.()
      onDone?.()
      return
    }
    const coverTimer = setTimeout(() => onCovered?.(), COVER_MS)
    const revealTimer = setTimeout(() => onDone?.(), COVER_MS + REVEAL_MS)
    return () => {
      clearTimeout(coverTimer)
      clearTimeout(revealTimer)
    }
  }, [onCovered, onDone])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 grid overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${cols}, ${PIXEL}px)` }}
    >
      {pixels.map((px, i) => (
        <div
          key={i}
          style={{
            width: PIXEL,
            height: PIXEL,
            animation: `pixel-appear ${APPEAR_MS}ms ease-out ${px.appearDelay}ms forwards, pixel-hide ${HIDE_MS}ms ease-in ${px.hideAt}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default PixelCurtain
