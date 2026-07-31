"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./welcome-tabs.module.css"

export interface WelcomeTabDef<T extends string> {
  key: T
  label: string
  icon?: ReactNode
  variant?: "default" | "darkCenter"
}

export function WelcomeSegmentedTabs<T extends string>({
  tabs,
  active,
  onSelect,
  className,
}: {
  tabs: readonly WelcomeTabDef<T>[]
  active: T
  onSelect: (key: T) => void
  className?: string
}) {
  const n = tabs.length
  if (n === 0) return null

  return (
    <div role="tablist" className={cn(styles.tabsOuter, className)}>
      <div className={styles.tabsStripWrap}>
        <div className={styles.tabsContainer}>
          <div
            className={styles.tabsStrip}
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active === tab.key}
                onClick={() => onSelect(tab.key)}
                className={cn(
                  styles.tab,
                  tab.variant === "darkCenter" && styles.tabDark,
                  active === tab.key && styles.tabSelected,
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68DBFF]/45 focus-visible:ring-offset-0",
                )}
              >
                {tab.icon ? (
                  <span className={styles.tabIcon} aria-hidden>
                    {tab.icon}
                  </span>
                ) : null}
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
