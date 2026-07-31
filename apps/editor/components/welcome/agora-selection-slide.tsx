'use client'

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PROJECT_SLIDE_ACCENT } from '@/lib/project-slides'
import { cn } from '@/lib/utils'

const slideChromeTopClass = 'pt-14'
const slideChromeBottomClass = 'pb-20'

function brandBorderFill(start: string, end: string): string {
  return `linear-gradient(#1A1208, #1A1208), linear-gradient(135deg, ${start} 0%, ${end} 100%)`
}

function FitSlideContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const content = measureRef.current
    if (!viewport || !content) return

    const update = () => {
      const availableH = viewport.clientHeight
      const availableW = viewport.clientWidth
      const neededH = content.offsetHeight
      const neededW = content.offsetWidth
      const next = Math.min(
        1,
        availableH / Math.max(neededH, 1),
        availableW / Math.max(neededW, 1),
      )
      const clamped = Number.isFinite(next) ? next : 1
      setScale((current) => (Math.abs(current - clamped) < 0.005 ? current : clamped))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    observer.observe(content)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [children])

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-1 flex-col',
        slideChromeTopClass,
        slideChromeBottomClass,
      )}
    >
      <div
        ref={viewportRef}
        className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden"
      >
        <div
          className="flex w-full justify-center"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            ref={measureRef}
            className={cn('mx-auto flex w-full flex-col items-center', className)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideDivider() {
  return (
    <div
      className="h-px w-full bg-gradient-to-r from-white/15 to-transparent"
      aria-hidden="true"
    />
  )
}

function AgoraSlideBody() {
  const accent = PROJECT_SLIDE_ACCENT

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 text-center min-[900px]:grid-cols-2 min-[900px]:gap-12 min-[900px]:text-left">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[22rem]">
        <Image
          src="/slides/2-abstraspace-experience.png"
          alt="Abstra Space Agora preview"
          fill
          className="object-cover object-center"
          sizes="(min-width: 900px) 50vw, 100vw"
          priority
        />
      </div>

      <div className="flex w-full flex-col text-center min-[900px]:text-left">
        <div className="w-full">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Agora
          </p>
          <h1 className="mt-4 font-serif text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl">
            Discover public spaces and laboratories
          </h1>
          <p className="mt-6 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            Explore exhibitions, simulations, and shared environments — a living gallery
            of concepts you can enter, not only read about.
          </p>
        </div>

        <div className="mt-5 w-full sm:mt-6">
          <SlideDivider />
          <div className="pt-4 sm:pt-5">
            <p
              className="text-[0.65rem] uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              What you find there
            </p>
            <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
              Discover public spaces, exhibitions, simulations, and laboratories — then open
              Studio to create and edit environments whose models express conceptual
              relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Single full-bleed Agora narration slide for the welcome chrome. */
export function AgoraSelectionSlide() {
  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      aria-live="polite"
    >
      <section
        className="flex h-full min-h-0 flex-1 flex-col px-5 text-center sm:px-8"
        aria-label="Agora: Discover public spaces and laboratories"
      >
        <FitSlideContent className="max-w-7xl">
          <AgoraSlideBody />
        </FitSlideContent>
      </section>

      <Link
        href="/agora"
        aria-label="Enter Agora"
        className="pointer-events-auto fixed right-5 bottom-5 z-[170] inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2 text-sm font-medium tracking-wide transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-8 sm:bottom-8 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
        style={{
          backgroundImage: brandBorderFill('#FFFFFF', PROJECT_SLIDE_ACCENT),
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          color: PROJECT_SLIDE_ACCENT,
        }}
      >
        Enter Agora
        <ArrowUpRight className="size-4 sm:size-5" aria-hidden="true" />
      </Link>
    </div>
  )
}
