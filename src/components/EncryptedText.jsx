import { useEffect, useRef, useState } from 'react'

const DEFAULT_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?"'
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function scrambledChar(index, tick, charset) {
  let h = (index + 1) * 374761393 + tick * 668265263
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return charset[Math.abs(h) % charset.length]
}

function EncryptedText({
  text,
  className = '',
  encryptedClassName = 'text-zinc-600',
  revealedClassName = 'text-white',
  revealDelayMs = 50,
  flipDelayMs = 50,
  charset = DEFAULT_CHARSET,
  delay = 0,
  onComplete,
}) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)
  const doneRef = useRef(false)

  const totalMs = delay + text.length * revealDelayMs
  const revealed = Math.min(
    text.length,
    Math.max(0, Math.floor((elapsed - delay) / revealDelayMs)),
  )

  useEffect(() => {
    doneRef.current = false
    if (prefersReducedMotion()) {
      setElapsed(totalMs)
      return
    }
    setElapsed(0)
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + flipDelayMs)
    }, flipDelayMs)
    return () => clearInterval(intervalRef.current)
  }, [text, delay, flipDelayMs, totalMs])

  useEffect(() => {
    if (elapsed < totalMs) return
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!doneRef.current) {
      doneRef.current = true
      onComplete?.()
    }
  }, [elapsed, totalMs, onComplete])

  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => {
        if (i < revealed) {
          return (
            <span key={i} className={revealedClassName}>
              {ch}
            </span>
          )
        }
        if (ch === ' ') {
          return (
            <span key={i} className="inline-block w-[0.3em]" aria-hidden="true" />
          )
        }
        return (
          <span key={i} className={encryptedClassName} aria-hidden="true">
            {scrambledChar(i, elapsed, charset)}
          </span>
        )
      })}
    </span>
  )
}

export default EncryptedText
