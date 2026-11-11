import { useEffect, useState } from 'react'
import { menuItems } from '../data/menuItems.js'
import ParallelogramButton from './ParallelogramButton.jsx'

function GameMenu({ onSelectScreen, disabled = false }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (disabled) return undefined

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % menuItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(
          (prev) => (prev - 1 + menuItems.length) % menuItems.length
        )
      } else if (e.key === 'Enter') {
        const current = menuItems[selectedIndex]
        if (current) {
          onSelectScreen(current.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, disabled, onSelectScreen])

  return (
    <nav
      aria-label="Menú principal"
      className="flex w-full max-w-md flex-col gap-3 sm:gap-4"
    >
      {/* Encabezado HUD del menú */}
      <div className="mb-1 flex items-center justify-between px-2">
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#3B70B0] uppercase">
          {'// Menu Principal'}
        </span>
        <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          [↑↓] Mover · [Enter] Entrar
        </span>
      </div>

      {/* Lista escalonada de botones en paralelogramo */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              marginLeft: `${index * 12}px`,
            }}
          >
            <ParallelogramButton
              code={item.code}
              label={item.label}
              subtitle={item.subtitle}
              accent={item.accent}
              active={selectedIndex === index}
              disabled={disabled}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => onSelectScreen(item.id)}
            />
          </div>
        ))}
      </div>
    </nav>
  )
}

export default GameMenu

