'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { AgoraSelectionSlide } from '@/components/welcome/agora-selection-slide'
import { HostAccountBadge } from '@/components/welcome/host-account-badge'
import { ProjectSelectionSlides } from '@/components/welcome/project-selection-slides'
import { WelcomeHeroBackground } from '@/components/welcome/welcome-hero-background'
import { WelcomeSegmentedTabs } from '@/components/welcome/welcome-segmented-tabs'
import { WelcomeSpaceForm } from '@/components/welcome/welcome-space-form'
import { WelcomeTaglineDivider } from '@/components/welcome/welcome-tagline-divider'
import tabStyles from '@/components/welcome/welcome-tabs.module.css'
import { BRAND_HERO_BASE } from '@/lib/brand-hero-background'
import { cn } from '@/lib/utils'

type WelcomeTab = 'space' | 'explore' | 'about'

function WelcomeBrandMark({ showWelcomeBadge = false }: { showWelcomeBadge?: boolean }) {
  return (
    <div className="shrink-0 px-4 text-center" translate="no">
      <div className="mx-auto mb-3 w-[4.5rem]">
        <Image
          src="/logos/abstra-space-symbol.svg"
          alt="Abstra Space"
          width={63}
          height={65}
          priority
          unoptimized
          className="mx-auto h-auto w-[4.5rem]"
        />
      </div>
      <WelcomeTaglineDivider />
      {showWelcomeBadge ? <HostAccountBadge variant="welcome" /> : null}
    </div>
  )
}

export function WelcomeHome() {
  const [welcomeTab, setWelcomeTab] = useState<WelcomeTab>('space')
  const isSlideTab = welcomeTab === 'about' || welcomeTab === 'explore'

  return (
    <div
      className="fixed inset-0 isolate flex flex-col overflow-hidden"
      style={{ backgroundColor: BRAND_HERO_BASE }}
    >
      <WelcomeHeroBackground />

      <nav
        className={cn(
          'pointer-events-auto fixed left-0 right-0 top-0 z-[160] pt-[env(safe-area-inset-top,0px)]',
          tabStyles.primaryTabsBar,
        )}
        aria-label="Welcome sections"
      >
        <div className="relative flex w-full items-stretch justify-center">
          <div className="w-full min-w-0 pl-4 pr-14 sm:pl-5 sm:pr-16 md:px-6">
            <WelcomeSegmentedTabs
              className="flex w-full justify-center"
              tabs={[
                { key: 'space', label: 'Space' },
                {
                  key: 'explore',
                  label: 'Agora',
                  icon: <Globe size={14} strokeWidth={1.75} aria-hidden />,
                  variant: 'darkCenter',
                },
                { key: 'about', label: 'About' },
              ]}
              active={welcomeTab}
              onSelect={setWelcomeTab}
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3 sm:pr-4">
            <div className="pointer-events-auto">
              <HostAccountBadge variant="header" />
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'relative z-10 flex min-h-0 min-w-0 flex-1 flex-col items-center',
          'justify-start overflow-hidden px-0 pb-[max(1rem,env(safe-area-inset-bottom,0px))]',
          'pt-[calc(48px+env(safe-area-inset-top,0px))]',
          !isSlideTab && 'lg:justify-center',
        )}
      >
        {welcomeTab === 'space' ? (
          <>
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center lg:flex-none">
              <div className="lg:mb-10">
                <WelcomeBrandMark showWelcomeBadge />
              </div>
            </div>
            <div className="mx-auto w-full max-w-md shrink-0">
              <div className="flex max-h-[min(92dvh,92vh)] w-full flex-col overflow-hidden rounded-xl border border-border bg-black shadow-xl backdrop-blur-md">
                <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-6 hide-scrollbar">
                  <div className="relative isolate flex flex-col">
                    <div
                      className="pointer-events-none relative z-0 -mx-6 -mt-6 w-[calc(100%+3rem)] shrink-0 self-stretch overflow-hidden"
                      aria-hidden
                    >
                      <div className="relative w-full" style={{ aspectRatio: '3 / 1' }}>
                        <Image
                          src="/slides/1-abstraspace-identity.png"
                          alt=""
                          fill
                          className="object-cover object-center opacity-50"
                          sizes="28rem"
                          priority
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                      </div>
                    </div>
                    <div className="relative z-10 -mt-10 flex w-full flex-col gap-6 pointer-events-auto">
                      <WelcomeSpaceForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {isSlideTab ? (
          <>
            <div className="mt-5 mb-2 shrink-0 pt-2 lg:mt-8 lg:mb-4 lg:pt-3">
              <WelcomeBrandMark />
            </div>
            {welcomeTab === 'explore' ? (
              <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col">
                <AgoraSelectionSlide />
              </div>
            ) : null}
            {welcomeTab === 'about' ? (
              <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col">
                <ProjectSelectionSlides />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
