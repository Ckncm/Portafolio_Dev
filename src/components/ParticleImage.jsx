import { useEffect, useRef } from 'react'

const SAMPLE_STEP = 5
const PARTICLE_SIZE = 2
const SPRING = 0.035
const FRICTION = 0.86
const REPEL_RADIUS = 90
const REPEL_FORCE = 4.5
const SCATTER = 0.06
const FADE_STEP = 0.012

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const styleCache = new Map()
function alphaStyle(alpha) {
  const key = Math.max(0, Math.min(20, Math.round(alpha * 20)))
  let s = styleCache.get(key)
  if (!s) {
    s = `rgba(255,255,255,${(key / 20).toFixed(2)})`
    styleCache.set(key, s)
  }
  return s
}

function ParticleImage({
  src,
  step = SAMPLE_STEP,
  particleSize = PARTICLE_SIZE,
  repelRadius = REPEL_RADIUS,
}) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !src) return undefined
    const ctx = canvas.getContext('2d')
    let raf = 0
    let particles = []
    let viewW = 0
    let viewH = 0
    let disposed = false
    let resizeTimer = null
    let fade = 0
    const reduced = prefersReducedMotion()

    const image = new Image()

    const drawStatic = () => {
      ctx.clearRect(0, 0, viewW, viewH)
      for (const p of particles) {
        ctx.fillStyle = alphaStyle(p.alpha)
        ctx.fillRect(p.homeX, p.homeY, particleSize, particleSize)
      }
    }

    const init = () => {
      const parent = canvas.parentElement
      if (!parent) return
      viewW = parent.clientWidth
      viewH = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(viewW * dpr)
      canvas.height = Math.round(viewH * dpr)
      canvas.style.width = `${viewW}px`
      canvas.style.height = `${viewH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const off = document.createElement('canvas')
      const scale = Math.min(
        (viewW * 0.45) / image.width,
        (viewH * 0.45) / image.height,
      )
      const iw = Math.max(1, Math.round(image.width * scale))
      const ih = Math.max(1, Math.round(image.height * scale))
      off.width = iw
      off.height = ih
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(image, 0, 0, iw, ih)
      const data = octx.getImageData(0, 0, iw, ih).data

      let transparent = 0
      let total = 0
      for (let i = 3; i < data.length; i += 68) {
        total++
        if (data[i] < 30) transparent++
      }
      const alphaMode = total > 0 && transparent / total > 0.2

      const offsetX = (viewW - iw) / 2
      const offsetY = (viewH - ih) / 2
      const next = []
      for (let y = 0; y < ih; y += step) {
        for (let x = 0; x < iw; x += step) {
          const i = (y * iw + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          let visible
          let alpha
          if (alphaMode) {
            visible = a > 30
            alpha = (a / 255) * (0.45 + 0.55 * lum)
          } else {
            visible = lum > 0.12
            alpha = Math.min(1, 0.2 + lum * 0.8)
          }
          if (!visible) continue
          const homeX = offsetX + x
          const homeY = offsetY + y
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * Math.max(viewW, viewH) * SCATTER
          next.push({
            homeX,
            homeY,
            x: homeX + Math.cos(angle) * dist,
            y: homeY + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
            alpha,
          })
        }
      }
      particles = next
      if (reduced) drawStatic()
    }

    const tick = () => {
      ctx.clearRect(0, 0, viewW, viewH)
      const m = mouseRef.current
      const r2 = repelRadius * repelRadius
      fade = Math.min(1, fade + FADE_STEP)
      for (const p of particles) {
        const dx = p.x - m.x
        const dy = p.y - m.y
        const d2 = dx * dx + dy * dy
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const force = (1 - d / repelRadius) * REPEL_FORCE
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }
        p.vx += (p.homeX - p.x) * SPRING
        p.vy += (p.homeY - p.y) * SPRING
        p.vx *= FRICTION
        p.vy *= FRICTION
        p.x += p.vx
        p.y += p.vy
        ctx.fillStyle = alphaStyle(p.alpha * fade)
        ctx.fillRect(p.x, p.y, particleSize, particleSize)
      }
      raf = requestAnimationFrame(tick)
    }

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const point = e.touches ? e.touches[0] : e
      mouseRef.current = {
        x: point.clientX - rect.left,
        y: point.clientY - rect.top,
      }
    }
    const onPointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!disposed) init()
      }, 200)
    }

    image.onload = () => {
      if (disposed) return
      init()
      if (!reduced) {
        raf = requestAnimationFrame(tick)
        window.addEventListener('mousemove', onPointerMove)
        canvas.addEventListener('mouseleave', onPointerLeave)
        canvas.addEventListener('touchmove', onPointerMove, { passive: true })
      }
    }
    image.src = src
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onPointerMove)
      canvas.removeEventListener('mouseleave', onPointerLeave)
      canvas.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('resize', onResize)
    }
  }, [src, step, particleSize, repelRadius])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export default ParticleImage
