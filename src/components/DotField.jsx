import { useEffect, useRef } from 'react'

const DOT_COUNT = 650
const BLOB_R = 1.2
const FOLLOW_LERP = 0.01
const HARMONICS = [
  { k: 2, amp: 0.14, speed: 0.00022, phase: 0 },
  { k: 3, amp: 0.1, speed: 0.00035, phase: 1.7 },
  { k: 5, amp: 0.06, speed: 0.00018, phase: 3.2 },
  { k: 7, amp: 0.035, speed: 0.00041, phase: 4.8 },
]
const WOBBLE_SPEED = 0.0011
const WOBBLE_RADIUS = 10
const SPRING = 0.04
const FRICTION = 0.86
const IDLE_DELAY = 1200
const BLUE_RATIO = 0.82
const RED_RATIO = 0.12
const DEEP_BLUE = [17, 27, 94]
const BRIGHT_BLUE = [59, 112, 176]
const LIGHT_BLUE = [100, 150, 220]
const DEEP_RED = [120, 18, 20]
const BRIGHT_RED = [214, 45, 50]
const LIGHT_RED = [235, 90, 95]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function rand(i, salt) {
  let h = (i + 1) * 374761393 + salt * 668265263
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return Math.abs(h) / 2147483647
}

const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
]

function DotField() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf = 0
    let dots = []
    let viewW = 0
    let viewH = 0
    let disposed = false
    let resizeTimer = null
    let lastMove = performance.now()
    let hasMouse = false
    const follow = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const reduced = prefersReducedMotion()

    const blobRadius = (angle, time) => {
      let f = 1
      for (const h of HARMONICS) {
        f += Math.sin(angle * h.k + time * h.speed + h.phase) * h.amp
      }
      return f
    }

    const maxBlobR = () => Math.min(viewW, viewH) * BLOB_R

    const drawStatic = () => {
      ctx.clearRect(0, 0, viewW, viewH)
      const cx = viewW / 2
      const cy = viewH / 2
      const R = maxBlobR()
      for (const d of dots) {
        const radius = d.t * R * blobRadius(d.angle, 0)
        const x = cx + Math.cos(d.angle) * radius
        const y = cy + Math.sin(d.angle) * radius
        const [r, g, b] = d.baseColor
        ctx.fillStyle = `rgba(${r},${g},${b},${d.baseAlpha})`
        ctx.fillRect(x, y, d.w, d.h)
      }
    }

    const init = () => {
      viewW = window.innerWidth
      viewH = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(viewW * dpr)
      canvas.height = Math.round(viewH * dpr)
      canvas.style.width = `${viewW}px`
      canvas.style.height = `${viewH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cx = viewW / 2
      const cy = viewH / 2
      const R = maxBlobR()

      const next = []
      for (let i = 0; i < DOT_COUNT; i++) {
        const angle = rand(i, 10) * Math.PI * 2
        const t = Math.pow(rand(i, 11), 0.4)
        const pick = rand(i, 12)
        const deep = rand(i, 13) < 0.25
        let baseColor = [255, 255, 255]
        let lightColor = LIGHT_BLUE
        if (pick < BLUE_RATIO) {
          baseColor = deep ? DEEP_BLUE : BRIGHT_BLUE
          lightColor = LIGHT_BLUE
        } else if (pick < BLUE_RATIO + RED_RATIO) {
          baseColor = deep ? DEEP_RED : BRIGHT_RED
          lightColor = LIGHT_RED
        }
        baseColor = mix(baseColor, lightColor, rand(i, 14) * 0.5)
        const baseAlpha = 0.12 + t * 0.3 + rand(i, 5) * 0.15
        const startX = cx + Math.cos(angle) * t * R + (rand(i, 30) - 0.5) * 80
        const startY = cy + Math.sin(angle) * t * R + (rand(i, 31) - 0.5) * 80
        next.push({
          angle,
          t,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          phaseA: rand(i, 1) * Math.PI * 2,
          phaseR: rand(i, 2) * Math.PI * 2,
          speed: 0.5 + rand(i, 3) * 0.9,
          color: baseColor,
          alpha: baseAlpha,
          stiffness: SPRING * (0.6 + rand(i, 7) * 0.8),
          baseColor,
          baseAlpha,
          w: 1.5 + t * 4.5 + rand(i, 30) * 1.5,
          h: 1.5 + t * 3 + rand(i, 31) * 1,
        })
      }
      dots = next
      if (reduced) drawStatic()
    }

    const tick = (time) => {
      ctx.clearRect(0, 0, viewW, viewH)
      const cx = viewW / 2
      const cy = viewH / 2
      const R = maxBlobR()

      let m = mouseRef.current
      if (!hasMouse || performance.now() - lastMove > IDLE_DELAY) {
        const w = time * 0.0004
        m = {
          x: cx + Math.cos(w) * viewW * 0.22 + Math.sin(w * 1.7) * 30,
          y: cy + Math.sin(w * 0.8) * viewH * 0.22 + Math.cos(w * 1.3) * 30,
        }
      }

      follow.x += (m.x - follow.x) * FOLLOW_LERP
      follow.y += (m.y - follow.y) * FOLLOW_LERP

      const globalRot = time * 0.00012

      for (const d of dots) {
        const angle = d.angle + globalRot
        const wobble =
          Math.sin(time * WOBBLE_SPEED * d.speed + d.phaseR) * WOBBLE_RADIUS
        const tangential =
          Math.cos(time * WOBBLE_SPEED * 0.6 + d.phaseA) * WOBBLE_RADIUS * 0.5

        const radius = d.t * R * blobRadius(angle, time) + wobble * d.t
        const drawAngle = angle + tangential / Math.max(radius, 1)

        const tx = follow.x + Math.cos(drawAngle) * radius
        const ty = follow.y + Math.sin(drawAngle) * radius

        d.vx = (d.vx + (tx - d.x) * d.stiffness) * FRICTION
        d.vy = (d.vy + (ty - d.y) * d.stiffness) * FRICTION
        d.x += d.vx
        d.y += d.vy

        const [r, g, b] = d.color
        ctx.fillStyle = `rgba(${r},${g},${b},${d.alpha})`
        ctx.fillRect(d.x, d.y, d.w, d.h)
      }
      raf = requestAnimationFrame(tick)
    }

    const onPointerMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      lastMove = performance.now()
      hasMouse = true
    }
    const onPointerLeave = () => {
      hasMouse = false
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!disposed) init()
      }, 200)
    }

    init()
    if (!reduced) {
      raf = requestAnimationFrame(tick)
      window.addEventListener('mousemove', onPointerMove)
      document.addEventListener('mouseleave', onPointerLeave)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}

export default DotField
