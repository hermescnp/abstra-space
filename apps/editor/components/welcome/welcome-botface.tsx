'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import styles from './welcome-botface.module.css'

interface Position {
  x: number
  y: number
}

const CENTER: Position = { x: 0, y: 0 }

function Eye({ pupil, direction }: { pupil: Position; direction: 'cw' | 'ccw' }) {
  return (
    <div className={styles.eye}>
      <svg className={styles.eyeRing} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          // SVG transforms (not CSS) so Safari keeps ring size/placement stable.
          transform={direction === 'cw' ? 'rotate(-90 50 50)' : 'translate(50 50) scale(-1 1) translate(-50 -50) rotate(-90 50 50)'}
        />
      </svg>
      <div className={styles.pupil} style={{ transform: `translate(${pupil.x - 50}%, ${pupil.y - 50}%)` }} />
    </div>
  )
}

/** The dot.science bot face: two eyes whose pupils follow the pointer and drift back to center. */
export function WelcomeBotface({ className }: { className?: string }) {
  const [pupil, setPupil] = useState<Position>(CENTER)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timeout: ReturnType<typeof setTimeout> | undefined
    const onMouseMove = (event: MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      clearTimeout(timeout)
      // Hovering the face: look straight ahead instead of at the cursor.
      if (Math.hypot(dx, dy) <= rect.width / 2) {
        setPupil(CENTER)
        return
      }
      const angle = Math.atan2(dy, dx)
      const maxMovement = 60
      setPupil({ x: Math.cos(angle) * maxMovement, y: Math.sin(angle) * maxMovement })
      timeout = setTimeout(() => setPupil(CENTER), 800)
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={cn(styles.wrapper, className)} aria-hidden>
      <div ref={containerRef} className={styles.eyeContainer}>
        <Eye pupil={pupil} direction="cw" />
        <Eye pupil={pupil} direction="ccw" />
      </div>
    </div>
  )
}
