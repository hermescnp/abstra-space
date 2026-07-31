"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react"
import {
  PROJECT_SLIDE_ACCENT,
  projectSlides,
  projectSlidesMeta,
  type ProjectSlidesData,
} from "@/lib/project-slides"
import { cn } from "@/lib/utils"

const slideChromeTopClass = "pt-14"
const slideChromeBottomClass = "pb-24"

function brandBorderFill(start: string, end: string): string {
  return `linear-gradient(#1A1208, #1A1208), linear-gradient(135deg, ${start} 0%, ${end} 100%)`
}

const DOT_SCIENCE_ECOSYSTEM_URL = "https://workspace.dotscience.ai"

function DotScienceEcosystemLink({
  className,
}: {
  className?: string
}) {
  return (
    <a
      href={DOT_SCIENCE_ECOSYSTEM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Learn about Dot Science Ecosystem"
      className={cn(
        "inline-flex max-w-[min(22rem,calc(100vw-2.5rem))] cursor-pointer items-center justify-center rounded-full border border-white/26 px-2.5 py-1 text-center text-[0.58rem] font-medium uppercase leading-snug tracking-[0.12em] text-white/70 transition hover:border-white/54 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:max-w-none sm:px-3 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.18em]",
        className,
      )}
    >
      <span className="sm:hidden">Learn about Dot Science</span>
      <span className="hidden sm:inline">Learn about Dot Science Ecosystem</span>
    </a>
  )
}

/** Discrete wheel/touch steps — no edge “return” action. */
function bindDiscreteSlideGestures({
  target,
  getActiveIndex,
  slideCount,
  scrollToSlide,
}: {
  target: HTMLElement
  getActiveIndex: () => number
  slideCount: number
  scrollToSlide: (index: number) => void
}): () => void {
  let lockedUntil = 0
  let wheelAccum = 0
  let touchStartX: number | null = null
  let touchStartY: number | null = null
  const slideCooldownMs = 900
  const wheelThreshold = 36
  const touchThreshold = 48

  const step = (direction: 1 | -1) => {
    const now = performance.now()
    if (now < lockedUntil) return
    lockedUntil = now + slideCooldownMs

    const next = getActiveIndex() + direction
    if (next < 0 || next >= slideCount) return
    scrollToSlide(next)
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    const now = performance.now()
    if (now < lockedUntil) {
      wheelAccum = 0
      return
    }

    wheelAccum += event.deltaY
    if (Math.abs(wheelAccum) < wheelThreshold) return

    const direction: 1 | -1 = wheelAccum > 0 ? 1 : -1
    wheelAccum = 0
    step(direction)
  }

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  const onTouchMove = (event: TouchEvent) => {
    if (touchStartX == null || touchStartY == null || event.touches.length !== 1) {
      return
    }
    const dx = touchStartX - event.touches[0].clientX
    const dy = touchStartY - event.touches[0].clientY
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
      event.preventDefault()
    }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX == null || touchStartY == null) return
    const touch = event.changedTouches[0]
    const dx = touchStartX - touch.clientX
    const dy = touchStartY - touch.clientY
    touchStartX = null
    touchStartY = null

    if (Math.abs(dx) >= Math.abs(dy)) return
    if (Math.abs(dy) < touchThreshold) return

    step(dy > 0 ? 1 : -1)
  }

  const onTouchCancel = () => {
    touchStartX = null
    touchStartY = null
  }

  target.addEventListener("wheel", onWheel, { passive: false })
  target.addEventListener("touchstart", onTouchStart, { passive: true })
  target.addEventListener("touchmove", onTouchMove, { passive: false })
  target.addEventListener("touchend", onTouchEnd, { passive: true })
  target.addEventListener("touchcancel", onTouchCancel, { passive: true })

  return () => {
    target.removeEventListener("wheel", onWheel)
    target.removeEventListener("touchstart", onTouchStart)
    target.removeEventListener("touchmove", onTouchMove)
    target.removeEventListener("touchend", onTouchEnd)
    target.removeEventListener("touchcancel", onTouchCancel)
  }
}

function FitSlideContent({
  children,
  contentRef,
  className,
}: {
  children: ReactNode
  contentRef?: (node: HTMLDivElement | null) => void
  className?: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const setMeasureRef = useCallback(
    (node: HTMLDivElement | null) => {
      measureRef.current = node
      contentRef?.(node)
    },
    [contentRef],
  )

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
      setScale((current) =>
        Math.abs(current - clamped) < 0.005 ? current : clamped,
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    observer.observe(content)
    window.addEventListener("resize", update)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [children])

  useEffect(() => {
    window.dispatchEvent(new Event("resize"))
  }, [scale])

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-1 flex-col",
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
            transformOrigin: "center center",
          }}
        >
          <div
            ref={setMeasureRef}
            className={cn(
              "project-selection-slide-content mx-auto flex w-full flex-col items-center",
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function SplitSlideLayout({
  accent,
  imageLabel,
  imageSrc,
  children,
}: {
  accent: string
  imageLabel: string
  imageSrc?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 text-center min-[900px]:grid-cols-2 min-[900px]:gap-12 min-[900px]:text-left">
      <div
        className={cn(
          "relative hidden aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl min-[900px]:flex min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[22rem]",
          imageSrc ? "border border-white/10" : "border border-dashed border-white/20",
        )}
        style={
          imageSrc
            ? undefined
            : { background: `linear-gradient(160deg, ${accent}22, transparent 55%)` }
        }
        aria-hidden={imageSrc ? undefined : true}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageLabel}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="size-12 rounded-full border border-white/20"
              style={{ background: `${accent}33` }}
            />
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
              Image
            </p>
            <p className="max-w-[8rem] text-[0.65rem] leading-4 text-white/30">
              {imageLabel}
            </p>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col text-center min-[900px]:text-left">
        {children}
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

function OverviewSlideContent({ data }: { data: ProjectSlidesData }) {
  const accent = data.accent

  return (
    <SplitSlideLayout
      accent={accent}
      imageLabel={`${data.name} visual`}
      imageSrc={data.images.identity}
    >
      <div className="w-full">
        <p className="text-sm uppercase tracking-[0.24em] text-white/62">
          {data.concept}
        </p>
        <h1 className="mt-4 font-serif text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl">
          {data.vision}
        </h1>
      </div>

      <div className="mt-5 w-full sm:mt-6">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            The Human Problem
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.firstSlide.humanProblem}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full sm:mt-5">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            The New Perspective
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.firstSlide.newPerspective}
          </p>
        </div>
      </div>
    </SplitSlideLayout>
  )
}

function ExperienceSlideContent({ data }: { data: ProjectSlidesData }) {
  const accent = data.accent

  return (
    <SplitSlideLayout
      accent={accent}
      imageLabel={`${data.name} experience`}
      imageSrc={data.images.experience}
    >
      <div className="w-full">
        <p
          className="text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          The Experience
        </p>
        <h1 className="mt-4 font-serif text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl">
          {data.secondSlide.title}
        </h1>
        <p className="mt-6 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
          {data.secondSlide.story}
        </p>
      </div>

      <div className="mt-5 w-full sm:mt-6">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            How it feels
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.secondSlide.feeling}
          </p>
        </div>
      </div>
    </SplitSlideLayout>
  )
}

function TransformationSlideContent({ data }: { data: ProjectSlidesData }) {
  const accent = data.accent

  return (
    <SplitSlideLayout
      accent={accent}
      imageLabel={`${data.name} transformation`}
      imageSrc={data.images.transformation}
    >
      <div className="w-full">
        <p
          className="text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          The Core Transformation
        </p>
        <h1 className="mt-4 font-serif text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl">
          {data.thirdSlide.title}
        </h1>
      </div>

      <div className="mt-5 w-full sm:mt-6">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Before
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.thirdSlide.before}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full sm:mt-5">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Through
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.thirdSlide.through}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full sm:mt-5">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            After
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.thirdSlide.after}
          </p>
        </div>
      </div>
    </SplitSlideLayout>
  )
}

function CapabilitiesSlideContent({ data }: { data: ProjectSlidesData }) {
  const accent = data.accent

  return (
    <SplitSlideLayout
      accent={accent}
      imageLabel={`${data.name} capabilities`}
      imageSrc={data.images.capabilities}
    >
      <div className="w-full">
        <p
          className="text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          What the User Can Do
        </p>
        <h1 className="mt-4 font-serif text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl">
          {data.fourthSlide.title}
        </h1>
      </div>

      <ul className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:gap-3">
        {data.fourthSlide.environments.map((environment) => (
          <li
            key={environment.name}
            className="flex flex-col gap-0.5 min-[900px]:flex-row min-[900px]:items-baseline min-[900px]:gap-3"
          >
            <span
              className="shrink-0 text-[0.65rem] uppercase tracking-[0.28em]"
              style={{ color: accent }}
            >
              {environment.name}
            </span>
            <span className="text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
              {environment.summary}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 w-full sm:mt-6">
        <SlideDivider />
        <div className="pt-4 sm:pt-5">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            How it connects to the Workspace
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
            {data.fourthSlide.workspaceConnection}
          </p>
        </div>
      </div>
    </SplitSlideLayout>
  )
}

export function ProjectSelectionSlides() {
  const data = projectSlides
  const slides = useMemo(() => projectSlidesMeta(data), [data])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const contentRefs = useRef<(HTMLElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTop = 0
    setActiveIndex(0)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const nodes = slideRefs.current.filter(Boolean) as HTMLElement[]
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = nodes.indexOf(visible.target as HTMLElement)
        if (index >= 0) setActiveIndex(index)
      },
      { root: scroller, threshold: [0.6] },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [slides])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let frame = 0

    const updateEdgeFade = () => {
      frame = 0
      const scrollTop = scroller.scrollTop
      const viewH = scroller.clientHeight
      const rootRect = scroller.getBoundingClientRect()
      const leaveDistance = viewH * 0.7
      const topFadeBand = viewH * 0.55
      const bottomFadeBand = viewH * 0.42

      contentRefs.current.forEach((content, index) => {
        const slide = slideRefs.current[index]
        if (!content || !slide) return

        const contentRect = content.getBoundingClientRect()
        if (contentRect.bottom <= rootRect.top || contentRect.top >= rootRect.bottom) {
          content.style.filter = "blur(18px)"
          content.style.opacity = "0"
          content.style.visibility = "hidden"
          return
        }

        const leaveProgress = Math.min(
          1,
          Math.abs(slide.offsetTop - scrollTop) / leaveDistance,
        )
        const leaveClarity =
          1 - leaveProgress * leaveProgress * (3 - 2 * leaveProgress)

        const topClarity = Math.min(
          1,
          Math.max(0, (contentRect.top - rootRect.top) / topFadeBand),
        )
        const bottomClarity = Math.min(
          1,
          Math.max(0, (rootRect.bottom - contentRect.bottom) / bottomFadeBand),
        )

        const scrollingClarity = Math.min(leaveClarity, topClarity, bottomClarity)
        const settled = Math.max(0, 1 - leaveProgress / 0.14)
        const clarity = settled + (1 - settled) * scrollingClarity
        const eased = clarity * clarity * (3 - 2 * clarity)
        const opacity = eased * eased
        const blur = (1 - eased) * 18
        content.style.filter = `blur(${blur.toFixed(2)}px)`
        content.style.opacity = opacity.toFixed(3)
        content.style.visibility = opacity < 0.02 ? "hidden" : "visible"
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateEdgeFade)
    }

    updateEdgeFade()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      scroller.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [slides])

  const scrollToSlide = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current
      const slide = slideRefs.current[index]
      if (!scroller || !slide) return
      if (index < 0 || index >= slides.length) return
      scroller.scrollTo({ top: slide.offsetTop, behavior: "smooth" })
      setActiveIndex(index)
    },
    [slides.length],
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    return bindDiscreteSlideGestures({
      target: scroller,
      getActiveIndex: () => activeIndexRef.current,
      slideCount: slides.length,
      scrollToSlide,
    })
  }, [scrollToSlide, slides.length])

  const isLast = activeIndex === slides.length - 1

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      aria-live="polite"
    >
      <div
        ref={scrollerRef}
        className="hide-scrollbar project-selection-snap-mask h-full touch-none snap-y snap-mandatory overflow-y-auto overscroll-contain"
      >
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            ref={(node) => {
              slideRefs.current[index] = node
            }}
            className="flex h-full min-h-full snap-start snap-always flex-col px-5 text-center sm:px-8"
            aria-label={`${data.name}: ${slide.eyebrow}`}
          >
            <FitSlideContent
              contentRef={(node) => {
                contentRefs.current[index] = node
              }}
              className="max-w-7xl"
            >
              {slide.kind === "overview" ? (
                <OverviewSlideContent data={data} />
              ) : slide.kind === "experience" ? (
                <ExperienceSlideContent data={data} />
              ) : slide.kind === "transformation" ? (
                <TransformationSlideContent data={data} />
              ) : (
                <CapabilitiesSlideContent data={data} />
              )}
            </FitSlideContent>
          </section>
        ))}
      </div>

      {activeIndex > 0 ? (
        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex - 1)}
          aria-label="Go to previous slide"
          className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-full p-2 text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <ChevronUp className="size-6" aria-hidden="true" />
        </button>
      ) : (
        <DotScienceEcosystemLink className="absolute top-3 left-1/2 z-10 -translate-x-1/2" />
      )}

      {isLast ? (
        <DotScienceEcosystemLink className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2" />
      ) : (
        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex + 1)}
          aria-label="Go to next slide"
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-full p-2 text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <ChevronDown className="size-6 animate-bounce" aria-hidden="true" />
        </button>
      )}

      <Link
        href="https://abstra.space"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Learn more about Abstra Space"
        className="pointer-events-auto fixed right-5 bottom-5 z-[170] inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2 text-sm font-medium tracking-wide transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-8 sm:bottom-8 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
        style={{
          backgroundImage: brandBorderFill("#FFFFFF", PROJECT_SLIDE_ACCENT),
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          color: PROJECT_SLIDE_ACCENT,
        }}
      >
        Learn more
        <ArrowUpRight className="size-4 sm:size-5" aria-hidden="true" />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to ${slide.eyebrow}`}
            className={cn(
              "pointer-events-auto size-1.5 rounded-full transition",
              index === activeIndex
                ? "bg-white/80"
                : "bg-white/30 hover:bg-white/55",
            )}
          />
        ))}
      </div>
    </div>
  )
}
