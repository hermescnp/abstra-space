"use client"

import { brandHeroRadialOverlayStyle, BRAND_HERO_BASE } from "@/lib/brand-hero-background"

/** Full-bleed brand radials — same treatment as IAteneo `NetworkHeroBackground`. */
export function WelcomeHeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: BRAND_HERO_BASE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] motion-reduce:hidden"
        style={brandHeroRadialOverlayStyle}
      />
    </div>
  )
}
