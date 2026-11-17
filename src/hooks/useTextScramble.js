import { useEffect, useState, useRef } from 'react'

const GLITCH_CHARS = '0123456789ABCDEF!#$*+/<=>?@[]^_{}~'

/**
 * Hook para decodificar texto estilo sci-fi / hacker reveal
 * cuando el componente se activa.
 */
export function useTextScramble(text, active = false) {
  const [displayText, setDisplayText] = useState(text)
  const animRef = useRef(null)

  useEffect(() => {
    // Si no está activo, mostrar el texto normal inmediatamente
    if (!active) {
      setDisplayText(text)
      return
    }

    // Verificar preferencia de movimiento reducido
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(text)
      return
    }

    let frame = 0
    // 16 fotogramas a 34ms (~540ms total) para que la encriptación se aprecie con ritmo y claridad
    const totalFrames = 16
    const interval = 34

    const tick = () => {
      frame++
      const progress = frame / totalFrames
      const chars = text.split('').map((char, i) => {
        if (char === ' ') return ' '
        const charProgress = (i + 1) / text.length
        // Revelar progresivamente de izquierda a derecha
        if (progress >= charProgress) {
          return char
        }
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      })
      setDisplayText(chars.join(''))

      if (frame < totalFrames) {
        animRef.current = setTimeout(tick, interval)
      } else {
        setDisplayText(text)
      }
    }

    tick()

    return () => {
      if (animRef.current) clearTimeout(animRef.current)
    }
  }, [text, active])

  return displayText
}
