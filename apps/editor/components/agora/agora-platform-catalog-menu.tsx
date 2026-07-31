'use client'

import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import { cn } from '@/lib/utils'

import styles from './agora-header.module.css'

type CatalogPlatform = {
  id: string
  name: string
  logo: string
  url: string
  /** Current product — shown selected; click closes the menu. */
  current?: boolean
}

const CATALOG_PLATFORMS: readonly CatalogPlatform[] = [
  {
    id: 'iateneo',
    name: 'IAteneo',
    logo: '/logos/iateneo-logo.svg',
    url: 'https://iateneo.ai',
  },
  {
    id: 'golden-papers',
    name: 'Golden Papers',
    logo: '/logos/golden-papers-logo.svg',
    url: 'https://goldenpapers.ai',
  },
  {
    id: 'abstra-space',
    name: 'Abstra Space',
    logo: '/logos/abstra-space-logo.svg',
    url: '/agora',
    current: true,
  },
  {
    id: 'affine-club',
    name: 'Affine Club',
    logo: '/logos/affine-club-logo.svg',
    url: 'https://affine.club',
  },
] as const

/**
 * Agora primary-bar catalog control — grid icon opens a platform picker dropdown.
 */
export function AgoraPlatformCatalogMenu() {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const panelVisible = open || closing

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!panelVisible) return

    const updatePos = () => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const panelWidth = Math.min(352, window.innerWidth - 24)
      const left = Math.min(
        Math.max(12, rect.left + rect.width / 2 - panelWidth / 2),
        window.innerWidth - panelWidth - 12,
      )
      setMenuPos({
        top: rect.bottom + 8,
        left,
      })
    }

    updatePos()

    const onPointerDown = (event: PointerEvent) => {
      if (closing) return
      const root = rootRef.current
      const panel = panelRef.current
      const target = event.target
      if (!(target instanceof Node)) return
      if (root?.contains(target) || panel?.contains(target)) return
      setOpen(false)
      setClosing(true)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !closing) {
        setOpen(false)
        setClosing(true)
      }
    }

    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [panelVisible, closing])

  const close = () => {
    if (!open || closing) return
    setOpen(false)
    setClosing(true)
  }

  const toggle = () => {
    if (closing) return
    if (open) {
      setOpen(false)
      setClosing(true)
      return
    }
    setOpen(true)
  }

  const handlePanelAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (!closing) return
    setClosing(false)
    setMenuPos(null)
  }

  useEffect(() => {
    if (!closing) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) return
    setClosing(false)
    setMenuPos(null)
  }, [closing])

  const panel =
    panelVisible && menuPos && mounted
      ? createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Dot Science Ecosystem"
            className={cn(
              'fixed z-[80] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-white/12 bg-black/55 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl backdrop-saturate-150',
              closing ? styles.CatalogDropdownPanelExit : styles.CatalogDropdownPanel,
            )}
            style={{ top: menuPos.top, left: menuPos.left }}
            onAnimationEnd={handlePanelAnimationEnd}
          >
            <p className="mb-2.5 px-0.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
              Dot Science Ecosystem
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {CATALOG_PLATFORMS.map((platform) => {
                const selected = Boolean(platform.current)
                const className = cn(
                  'flex aspect-square items-center justify-center overflow-hidden rounded-xl border p-1.5 transition-[background-color,border-color,transform] duration-200',
                  selected
                    ? 'border-[#68DBFF]/55 bg-[#0A1727] shadow-[0_0_0_1px_rgba(104,219,255,0.18)_inset]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/22 hover:bg-white/[0.06]',
                )

                if (selected) {
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      aria-current="page"
                      aria-label={`${platform.name} (current)`}
                      className={className}
                      onClick={close}
                    >
                      <PlatformLogo platform={platform} />
                    </button>
                  )
                }

                return (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${platform.name}`}
                    className={className}
                    onClick={close}
                  >
                    <PlatformLogo platform={platform} />
                  </a>
                )
              })}
              <a
                href="https://workspace.dotscience.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Dot Science Workspace"
                className="col-span-2 flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-2 transition-[background-color,border-color] duration-200 hover:border-white/22 hover:bg-white/[0.06]"
                onClick={close}
              >
                <span className="relative flex h-[82%] w-full items-center justify-center">
                  <Image
                    src="/logos/dot-science-workspace-logo.svg"
                    alt=""
                    width={320}
                    height={80}
                    className="!h-full !w-auto max-w-none object-contain"
                    unoptimized
                  />
                </span>
              </a>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={styles.PrimaryTabCatalogRoot}>
      <button
        type="button"
        className={cn(
          styles.PrimaryTabCreateLink,
          (open || closing) && styles.PrimaryTabCreateLinkOpen,
        )}
        aria-label="Browse Dot Science platforms"
        title="Browse Dot Science platforms"
        aria-expanded={open || closing}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        <CatalogGridIcon />
      </button>
      {panel}
    </div>
  )
}

function CatalogGridIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <rect x="1.25" y="1.25" width="6.5" height="6.5" rx="1.35" />
      <rect x="10.25" y="1.25" width="6.5" height="6.5" rx="1.35" />
      <rect x="1.25" y="10.25" width="6.5" height="6.5" rx="1.35" />
      <rect x="10.25" y="10.25" width="6.5" height="6.5" rx="1.35" />
    </svg>
  )
}

function PlatformLogo({ platform }: { platform: CatalogPlatform }) {
  return (
    <span className="relative flex h-[65%] w-full items-center justify-center">
      <Image
        src={platform.logo}
        alt=""
        width={240}
        height={100}
        className="!h-full !w-auto max-w-none object-contain"
        unoptimized
      />
    </span>
  )
}
