import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Typewriter({
  text,
  speed = 40,
  delay = 0,
  className = '',
  showCursor = true,
  onComplete,
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    if (prefersReducedMotion()) {
      setStarted(true)
      setCount(text.length)
      return
    }
    setCount(0)
    setStarted(false)
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [text, delay])

  useEffect(() => {
    if (!started) return
    if (count >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true
        onComplete?.()
      }
      return
    }
    const timer = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(timer)
  }, [started, count, text.length, speed, onComplete])

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCursor && count < text.length && (
        <span className="ml-px animate-pulse text-[#3B70B0]">█</span>
      )}
    </span>
  )
}

export default Typewriter
