'use client'

import { AgoraPlatformCatalogMenu } from './agora-platform-catalog-menu'
import styles from './agora-header.module.css'

export type AgoraMainTab = 'spaces' | 'pieces' | 'derived' | 'circles'

export const AGORA_MAIN_TABS: readonly AgoraMainTab[] = [
  'spaces',
  'pieces',
  'derived',
  'circles',
] as const

export function parseAgoraMainTabFromSearchParam(
  value: string | null | undefined,
): AgoraMainTab | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  if ((AGORA_MAIN_TABS as readonly string[]).includes(normalized)) {
    return normalized as AgoraMainTab
  }
  return null
}

/** Primary Spaces / Pieces / Derived / Circles strip — used above the hero on `/agora`. */
export function AgoraPrimaryTabs({
  mainTab,
  onMainTabChange,
}: {
  mainTab: AgoraMainTab
  onMainTabChange: (option: AgoraMainTab) => void
}) {
  const leftTabs: { value: AgoraMainTab; label: string }[] = [
    { value: 'spaces', label: 'Spaces' },
    { value: 'pieces', label: 'Pieces' },
  ]
  const rightTabs: { value: AgoraMainTab; label: string }[] = [
    { value: 'derived', label: 'Derived' },
    { value: 'circles', label: 'Circles' },
  ]

  return (
    <div className={styles.PrimaryBarTabsOuter}>
      <div className={styles.PrimaryTabsStripWrap}>
        <div className={styles.PrimaryTabsWithCreate}>
          {leftTabs.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.SortOptionContainer} ${mainTab === option.value ? styles.selected : ''}`}
              onClick={() => onMainTabChange(option.value)}
            >
              <span className={styles.SortOptionText}>{option.label}</span>
            </button>
          ))}
          <AgoraPlatformCatalogMenu />
          {rightTabs.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.SortOptionContainer} ${mainTab === option.value ? styles.selected : ''}`}
              onClick={() => onMainTabChange(option.value)}
            >
              <span className={styles.SortOptionText}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
