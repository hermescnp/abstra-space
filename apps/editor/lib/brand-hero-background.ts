import type { CSSProperties } from 'react'

/** Ecosystem identity blue — brand radial glows and gradient stops. */
export const BRAND_TITLE_HEX = '#0A5E95'
export const BRAND_TITLE_RGB = '10,94,149'

/** Cyan accent — pairs with `BRAND_TITLE_HEX` in gradients. */
export const BRAND_ACCENT_HEX = '#68DBFF'
export const BRAND_ACCENT_RGB = '104,219,255'

/** Full-bleed brand radials over the dark hero field (no image). */
export const brandHeroRadialOverlayStyle: CSSProperties = {
  background: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(${BRAND_TITLE_RGB}, 0.2), transparent 55%), radial-gradient(ellipse 90% 70% at 100% 35%, rgba(${BRAND_TITLE_RGB}, 0.14), transparent 48%), radial-gradient(ellipse 85% 60% at 0% 70%, rgba(${BRAND_TITLE_RGB}, 0.09), transparent 42%)`,
}

export const BRAND_HERO_BASE = '#050508'
