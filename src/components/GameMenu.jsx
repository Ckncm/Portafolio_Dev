import { useEffect, useState } from 'react'
import { menuItems } from '../data/menuItems.js'
import ParallelogramButton from './ParallelogramButton.jsx'
import { playConfirm, playSariaSongNote } from '../utils/soundEffects.js'

function GameMenu({ onSelectScreen, disabled = false }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (disabled) return undefined

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = (prev + 1) % menuItems.length
          playSariaSongNote(next)
          return next
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = (prev - 1 + menuItems.length) % menuItems.length
          playSariaSongNote(next)
          return next
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur()
        }
        playConfirm()
        const current = menuItems[selectedIndex]
        if (current) {
          onSelectScreen(current.id)
        }
      } else if (['1', '2', '3'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1
        const target = menuItems[index]
        if (target) {
          e.preventDefault()
          e.stopPropagation()
          if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur()
          }
          playConfirm()
          setSelectedIndex(index)
          onSelectScreen(target.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, disabled, onSelectScreen])

  return (
    <nav
      aria-label="Menú principal"
      className="flex w-full max-w-md flex-col gap-3.5 sm:gap-4"
    >
      {/* Lista escalonada de botones en paralelogramo */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              marginLeft: `${index * 12}px`,
              animation: `menu-item-enter 550ms cubic-bezier(0.16, 1, 0.3, 1) ${
                index * 110 + 80
              }ms backwards`,
            }}
          >
            <ParallelogramButton
              code={item.code}
              label={item.label}
              subtitle={item.subtitle}
              accent={item.accent}
              active={selectedIndex === index}
              disabled={disabled}
              soundFn={() => playSariaSongNote(index)}
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
