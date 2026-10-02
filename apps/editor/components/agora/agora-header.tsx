'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { BRAND_TITLE_HEX, BRAND_TITLE_RGB } from '@/lib/brand-hero-background'

import { HostAccountBadge } from '@/components/welcome/host-account-badge'
import layoutStyles from './agora-layout.module.css'
import {
  AgoraPrimaryTabs,
  type AgoraMainTab,
} from './agora-primary-tabs'

const brandLogoHaloStyle = {
  background: `radial-gradient(ellipse at center, rgba(${BRAND_TITLE_RGB}, 0.35), transparent 68%)`,
} as const

export function AgoraHeader({
  mainTab,
  onMainTabChange,
}: {
  mainTab: AgoraMainTab
  onMainTabChange: (tab: AgoraMainTab) => void
}) {
  return (
    <div className={layoutStyles.agoraTop}>
      <nav className={layoutStyles.primaryTabsBar} aria-label="Exploration scope">
        <div className={layoutStyles.primaryTabsBarInner}>
          <div className={layoutStyles.homeHeaderButton}>
            <Link
              href="/"
              className={layoutStyles.homeHeaderButtonLink}
              aria-label="Create a space"
              title="Create"
            >
              <Plus size={18} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          <AgoraPrimaryTabs mainTab={mainTab} onMainTabChange={onMainTabChange} />
          <div className={layoutStyles.accountHeaderButton}>
            <HostAccountBadge />
          </div>
        </div>
      </nav>
      <div className={layoutStyles.absoluteHeader}>
        <div className="relative flex flex-col items-center gap-5">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-16 -z-10 rounded-full opacity-90 blur-3xl motion-reduce:opacity-50"
            style={brandLogoHaloStyle}
          />
          <Image
            src="/logos/abstra-space-symbol.svg"
            alt="Abstra Space"
            width={96}
            height={96}
            priority
            unoptimized
            className="h-auto w-16 md:w-20"
          />
          <p className={layoutStyles.brandEyebrow}>
            Abstra Space <span style={{ color: BRAND_TITLE_HEX }}>·</span> Agora
          </p>
        </div>
      </div>
    </div>
  )
}
