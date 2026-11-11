import { projects } from '../data/projects.js'
import { certificates } from '../data/certificates.js'
import ckncmLogo from '../assets/logos/ckncm_logo.svg'
import githubLogo from '../assets/logos/github_logo_icon_229278.webp'
import instagramLogo from '../assets/logos/Instagram_logo_2022.svg.webp'

// Mantiene referencias vivas en memoria para evitar que el navegador descarte la caché decodificada
const imageCache = new Map()

export function getBaseAssetUrls() {
  const urls = new Set([ckncmLogo, githubLogo, instagramLogo])
  projects.forEach((project) => {
    if (Array.isArray(project.links)) {
      project.links.forEach((link) => {
        if (link?.icon) urls.add(link.icon)
      })
    }
  })
  return Array.from(urls)
}

export function getContentAssetUrls() {
  const urls = new Set()
  projects.forEach((project) => {
    if (project.draft) return
    if (project.cover) urls.add(project.cover)
    if (Array.isArray(project.images)) {
      project.images.forEach((img) => {
        if (img) urls.add(img)
      })
    }
  })
  certificates.forEach((cert) => {
    if (cert?.image) urls.add(cert.image)
  })
  return Array.from(urls)
}

export function preloadImage(src, timeoutMs = 6000) {
  if (!src) return Promise.resolve({ src, img: null, ok: false })
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve({ src, img: cached, ok: true })
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    let settled = false

    const finish = (ok) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (ok) imageCache.set(src, img)
      resolve({ src, img: ok ? img : null, ok })
    }

    const timer = setTimeout(() => finish(false), timeoutMs)
    img.onload = () => finish(true)
    img.onerror = () => finish(false)
    img.src = src

    if (img.complete && img.naturalWidth > 0) {
      finish(true)
    }
  })
}

export async function preloadAssetGroup(urls, onProgress) {
  const total = urls.length
  if (total === 0) {
    onProgress?.(0, 0)
    return []
  }

  let loaded = 0
  onProgress?.(0, total)

  const results = await Promise.all(
    urls.map(async (url) => {
      const res = await preloadImage(url)
      loaded += 1
      onProgress?.(loaded, total)
      return res
    })
  )

  return results
}

export async function decodeCachedImages(onProgress) {
  const imgs = Array.from(imageCache.values())
  const total = imgs.length
  if (total === 0) {
    onProgress?.(0, 0)
    return
  }

  let decoded = 0
  onProgress?.(0, total)

  await Promise.all(
    imgs.map(async (img) => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode()
        }
      } catch {
        // Ignorar errores puntuales de decodificación (ej. SVG sin bitmap o abortado)
      } finally {
        decoded += 1
        onProgress?.(decoded, total)
      }
    })
  )
}

export function waitForFonts(timeoutMs = 1800) {
  if (typeof document === 'undefined' || !document.fonts?.ready) {
    return Promise.resolve()
  }
  return Promise.race([
    document.fonts.ready.catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ])
}

