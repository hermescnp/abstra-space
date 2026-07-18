'use client'

import { ItemsPanel, useEditor } from '@pascal-app/editor'
import { treesHostPanel } from '@pascal-app/plugin-trees'
import { lazy, Suspense, useMemo } from 'react'
import { BuildTab } from './build-tab'

const NaturePanel = lazy(treesHostPanel.component)

function disarmArmedTools() {
  const { mode, setMode, setTool } = useEditor.getState()
  if (mode === 'material-paint' || mode === 'build') {
    setMode('select')
    setTool(null)
  }
}

/**
 * Models tab: Items catalog with Build and Nature as peer sections.
 */
export function ModelsPanel() {
  const additionalSections = useMemo(
    () => [
      {
        id: 'build',
        label: 'Build',
        iconSrc: '/icons/build-v2.png',
        content: <BuildTab />,
        onSelect: disarmArmedTools,
      },
      {
        id: 'nature',
        label: 'Nature',
        iconSrc: '/icons/tree.webp',
        content: (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                Loading Nature…
              </div>
            }
          >
            <NaturePanel />
          </Suspense>
        ),
        onSelect: disarmArmedTools,
      },
    ],
    [],
  )

  return (
    <ItemsPanel
      additionalSections={additionalSections}
      showSourceFilter={false}
      showTagFilters={false}
    />
  )
}
