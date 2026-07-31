'use client'

import { BRAND_TITLE_HEX } from '@/lib/brand-hero-background'

export function WelcomeTaglineDivider() {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/45">
      Abstra Space <span style={{ color: BRAND_TITLE_HEX }}>·</span> Science&apos;s Laboratory
    </p>
  )
}
