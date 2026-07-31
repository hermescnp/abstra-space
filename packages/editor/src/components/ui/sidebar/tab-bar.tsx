'use client'

import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { triggerSFX } from './../../../lib/sfx-bus'
import { cn } from './../../../lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../primitives/tooltip'

export type SidebarTab = {
  id: string
  label: string
  mobileDefaultSnap?: number
  mobileIcon?: ReactNode
  /** Desktop icon shown in the sidebar tab strip / collapsed rail (v2 layout). */
  icon?: ReactNode
}

interface TabBarProps {
  tabs: SidebarTab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-0.5 border-border/50 border-b px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            className={cn(
              'relative h-7 rounded-md px-3 font-medium text-sm transition-colors',
              isActive
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
            key={tab.id}
            onClick={() => {
              triggerSFX('sfx:menu-click')
              onTabChange(tab.id)
            }}
            onMouseEnter={() => triggerSFX('sfx:menu-hover')}
            type="button"
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface PanelTabsProps {
  tabs: SidebarTab[]
  activeTab: string
  onTabChange: (id: string) => void
  onCollapse: () => void
}

/**
 * Expanded left-panel tab strip (Golden Papers style): equal-width icon+label
 * buttons plus an explicit collapse control.
 */
export function SidebarPanelTabs({ tabs, activeTab, onTabChange, onCollapse }: PanelTabsProps) {
  const cols = Math.max(tabs.length, 1)
  return (
    <div className="relative z-10 flex shrink-0 items-center gap-1 border-border border-b bg-transparent px-2 py-2 shadow-[0_4px_24px_rgba(15,23,42,0.10),0_16px_48px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.40),0_16px_48px_rgba(0,0,0,0.28)]">
      <div
        className="grid min-w-0 flex-1 gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              className={cn(
                'flex h-10 items-center justify-start gap-2 rounded-xl px-2 transition-all duration-200 [&_img]:transition-[opacity,filter] [&_img]:duration-200',
                isActive
                  ? 'bg-accent text-foreground shadow-sm [&_img]:opacity-100 [&_img]:grayscale-0'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0',
              )}
              key={tab.id}
              onClick={() => {
                triggerSFX('sfx:menu-click')
                onTabChange(tab.id)
              }}
              onMouseEnter={() => triggerSFX('sfx:menu-hover')}
              type="button"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center [&_img]:h-8 [&_img]:w-8 [&_svg]:h-5 [&_svg]:w-5">
                {tab.icon ?? tab.label.charAt(0)}
              </span>
              <span className="truncate text-sm font-semibold">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <TooltipProvider delayDuration={0} disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-xl border border-border bg-background/90 shadow-2xl backdrop-blur-md">
              <button
                aria-label="Collapse sidebar"
                className="flex w-8 items-center justify-center text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground/90"
                onClick={() => {
                  triggerSFX('sfx:menu-click')
                  onCollapse()
                }}
                type="button"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Collapse sidebar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

interface CollapsedRailProps {
  tabs: SidebarTab[]
  onExpand: () => void
  onTabClick: (id: string) => void
}

/**
 * Collapsed 40px rail: expand control + vertical labeled tab buttons.
 */
export function SidebarCollapsedRail({ tabs, onExpand, onTabClick }: CollapsedRailProps) {
  return (
    <div className="flex h-full w-10 flex-col border-border border-r bg-transparent">
      <div className="flex shrink-0 justify-center border-border border-b px-1 py-2">
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex h-8 items-stretch overflow-hidden rounded-xl border border-border bg-background/90 shadow-2xl backdrop-blur-md">
                <button
                  aria-label="Expand sidebar"
                  className="flex w-8 items-center justify-center text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground/90"
                  onClick={() => {
                    triggerSFX('sfx:menu-click')
                    onExpand()
                  }}
                  type="button"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <TooltipProvider delayDuration={0} disableHoverableContent>
        <div className="flex min-h-0 flex-1 flex-col gap-1 p-1">
          {tabs.map((tab) => (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  aria-label={tab.label}
                  className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-1 py-4 text-muted-foreground transition-colors hover:text-foreground [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0"
                  onClick={() => {
                    triggerSFX('sfx:menu-click')
                    onTabClick(tab.id)
                  }}
                  onMouseEnter={() => triggerSFX('sfx:menu-hover')}
                  type="button"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center [&_img]:h-8 [&_img]:w-8 [&_svg]:h-5 [&_svg]:w-5">
                    {tab.icon ?? tab.label.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold leading-none [writing-mode:vertical-rl] rotate-180">
                    {tab.label}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{tab.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}

interface IconRailProps {
  tabs: SidebarTab[]
  /** Highlighted tab. Stays highlighted while the panel is collapsed. */
  activeTab: string
  /** True when the panel beside the rail is collapsed. */
  collapsed: boolean
  /** Clicking a rail icon: switch tab, or toggle the panel (see layout). */
  onIconClick: (id: string) => void
}

/**
 * Vertical icon rail for the v2 left column. Always visible (even when the
 * panel is collapsed) so the user can reopen the panel by clicking an icon.
 * The label renders as a hover tooltip on the right.
 */
export function IconRail({ tabs, activeTab, collapsed, onIconClick }: IconRailProps) {
  return (
    <TooltipProvider delayDuration={0} disableHoverableContent>
      <div className="flex h-full w-14 shrink-0 flex-col items-center gap-1 border-border/50 border-r py-2">
        {tabs.map((tab) => {
          // Only show the active highlight while the panel is open. When
          // collapsed nothing is "open", so every icon reads as unselected.
          const showActive = activeTab === tab.id && !collapsed
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    'group flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 [&_img]:transition-[opacity,filter] [&_img]:duration-200',
                    showActive
                      ? 'bg-accent text-foreground shadow-sm [&_img]:opacity-100 [&_img]:grayscale-0'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0',
                  )}
                  onClick={() => {
                    triggerSFX('sfx:menu-click')
                    onIconClick(tab.id)
                  }}
                  onMouseEnter={() => triggerSFX('sfx:menu-hover')}
                  type="button"
                >
                  {tab.icon ?? tab.label.charAt(0)}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{tab.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

/**
 * @deprecated Prefer {@link SidebarPanelTabs}. Kept for any external callers.
 */
export function HeaderTabRail({ tabs, activeTab, collapsed, onIconClick }: IconRailProps) {
  return (
    <TooltipProvider delayDuration={0} disableHoverableContent>
      <div className="flex shrink-0 items-center gap-1">
        {tabs.map((tab) => {
          const showActive = activeTab === tab.id && !collapsed
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  aria-label={tab.label}
                  aria-pressed={showActive}
                  className={cn(
                    'group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 [&_img]:transition-[opacity,filter] [&_img]:duration-200',
                    showActive
                      ? 'bg-accent text-foreground shadow-sm [&_img]:opacity-100 [&_img]:grayscale-0'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0',
                  )}
                  onClick={() => {
                    triggerSFX('sfx:menu-click')
                    onIconClick(tab.id)
                  }}
                  onMouseEnter={() => triggerSFX('sfx:menu-hover')}
                  type="button"
                >
                  {tab.icon ?? tab.label.charAt(0)}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{tab.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
