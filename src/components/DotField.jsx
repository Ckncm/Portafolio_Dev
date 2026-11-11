import { useEffect, useRef } from 'react'

const BLUE_DOT = 'rgba(59, 112, 176, 0.26)'
const BLUE_DOT_BRIGHT = 'rgba(100, 150, 220, 0.42)'
const WHITE_DOT = 'rgba(255, 255, 255, 0.15)'
const TILT_ANGLE = -15 // Inclinación en grados para las columnas de puntos verticales

const DOT_SPACING_X = 26
const DOT_SPACING_Y = 26
const DOT_RADIUS = 1.35

function DotField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let resizeTimer = null

    const render = () => {
      const viewW = window.innerWidth
      const viewH = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(viewW * dpr)
      canvas.height = Math.round(viewH * dpr)
      canvas.style.width = `${viewW}px`
      canvas.style.height = `${viewH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Fondo base sólido
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, viewW, viewH)

      // Trama de puntos estática ordenada verticalmente con ligera inclinación
      const cx = viewW / 2
      const cy = viewH / 2
      const diag = Math.hypot(viewW, viewH) * 1.25

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((TILT_ANGLE * Math.PI) / 180)

      const startX = -diag / 2 - ((-diag / 2) % DOT_SPACING_X)
      const endX = diag / 2
      const startY = -diag / 2 - ((-diag / 2) % DOT_SPACING_Y)
      const endY = diag / 2

      for (let x = startX; x <= endX; x += DOT_SPACING_X) {
        for (let y = startY; y <= endY; y += DOT_SPACING_Y) {
          // Distribución determinista de textura (estática)
          const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
          const rand = hash - Math.floor(hash)

          ctx.beginPath()
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)

          if (rand < 0.08) {
            ctx.fillStyle = BLUE_DOT_BRIGHT
          } else if (rand < 0.14) {
            ctx.fillStyle = WHITE_DOT
          } else {
            ctx.fillStyle = BLUE_DOT
          }
          ctx.fill()
        }
      }
      ctx.restore()
    }

    render()

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(render, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}

export default DotField
