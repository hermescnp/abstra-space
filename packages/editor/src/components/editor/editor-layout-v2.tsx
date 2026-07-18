'use client'

import { type ReactNode, useCallback, useEffect, useRef } from 'react'
import { useIsMobile } from '../../hooks/use-mobile'
import useEditor from '../../store/use-editor'

import { useSidebarStore } from '../ui/primitives/sidebar'
import {
  SidebarCollapsedRail,
  SidebarPanelTabs,
  type SidebarTab,
} from '../ui/sidebar/tab-bar'
import { EditorLayoutMobile } from './editor-layout-mobile'

const SIDEBAR_MIN_WIDTH = 260
const SIDEBAR_MAX_WIDTH = 520
const SIDEBAR_RAIL_WIDTH = 40

// ── Sidebar tab + collapse controls ──────────────────────────────────────────

function useSidebarTabControls(tabs: SidebarTab[]) {
  const width = useSidebarStore((s) => s.width)
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)
  const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed)
  const setWidth = useSidebarStore((s) => s.setWidth)
  const activePanel = useEditor((s) => s.activeSidebarPanel)
  const setActivePanel = useEditor((s) => s.setActiveSidebarPanel)

  // Ensure active panel is a valid tab
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activePanel)) {
      setActivePanel(tabs[0]!.id)
    }
  }, [tabs, activePanel, setActivePanel])

  // Leaving Models/Items (or collapsing) should disarm any armed build/plant tool
  useEffect(() => {
    if (activePanel === 'items' && !isCollapsed) return
    const { mode, setMode, setTool } = useEditor.getState()
    if (mode === 'build' || mode === 'material-paint') {
      setMode('select')
      setTool(null)
    }
  }, [activePanel, isCollapsed])

  const expandToTab = useCallback(
    (id: string) => {
      setIsCollapsed(false)
      if (width < SIDEBAR_MIN_WIDTH) setWidth(SIDEBAR_MIN_WIDTH)
      setActivePanel(id)
    },
    [width, setIsCollapsed, setWidth, setActivePanel],
  )

  const handleTabChange = useCallback(
    (id: string) => {
      if (isCollapsed) {
        expandToTab(id)
        return
      }
      setActivePanel(id)
    },
    [isCollapsed, expandToTab, setActivePanel],
  )

  const collapse = useCallback(() => {
    setIsCollapsed(true)
  }, [setIsCollapsed])

  const expand = useCallback(() => {
    setIsCollapsed(false)
    if (width < SIDEBAR_MIN_WIDTH) setWidth(SIDEBAR_MIN_WIDTH)
  }, [width, setIsCollapsed, setWidth])

  return { activePanel, isCollapsed, handleTabChange, collapse, expand, expandToTab }
}

// ── Left column: Golden Papers-style panel with in-panel tabs ────────────────

function LeftColumn({
  tabs,
  renderTabContent,
  sidebarOverlay,
}: {
  tabs: SidebarTab[]
  renderTabContent: (tabId: string) => ReactNode
  sidebarOverlay?: ReactNode
}) {
  const width = useSidebarStore((s) => s.width)
  const setWidth = useSidebarStore((s) => s.setWidth)
  const isDragging = useSidebarStore((s) => s.isDragging)
  const setIsDragging = useSidebarStore((s) => s.setIsDragging)
  const { activePanel, isCollapsed, handleTabChange, collapse, expand, expandToTab } =
    useSidebarTabControls(tabs)

  const isResizing = useRef(false)

  const handleResizerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      isResizing.current = true
      setIsDragging(true)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [setIsDragging],
  )

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isResizing.current) return
      const newWidth = e.clientX
      setWidth(Math.max(SIDEBAR_MIN_WIDTH, Math.min(newWidth, SIDEBAR_MAX_WIDTH)))
    }
    const handlePointerUp = () => {
      isResizing.current = false
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [setWidth, setIsDragging])

  if (isCollapsed) {
    return (
      <div className="relative z-10 flex h-full shrink-0 bg-sidebar text-sidebar-foreground">
        <SidebarCollapsedRail
          onExpand={expand}
          onTabClick={expandToTab}
          tabs={tabs}
        />
      </div>
    )
  }

  return (
    <div className="relative z-10 flex h-full shrink-0 bg-sidebar text-sidebar-foreground">
      <div
        className="relative flex h-full flex-col border-border/50 border-r"
        style={{
          width,
          transition: isDragging ? 'none' : 'width 150ms ease',
        }}
      >
        <SidebarPanelTabs
          activeTab={activePanel}
          onCollapse={collapse}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {renderTabContent(activePanel)}
          {sidebarOverlay && <div className="absolute inset-0 z-50">{sidebarOverlay}</div>}
        </div>

        {/* Resize handle + hit area */}
        <div
          className="absolute inset-y-0 -right-3 z-[100] flex w-6 cursor-col-resize items-center justify-center"
          onPointerDown={handleResizerDown}
        >
          <div className="h-8 w-1 rounded-full bg-neutral-500" />
        </div>
      </div>
    </div>
  )
}

// ── Right column: viewer area with toolbar ───────────────────────────────────

function RightColumn({
  toolbarLeft,
  toolbarRight,
  children,
  overlays,
  stageOverlay,
}: {
  toolbarLeft?: ReactNode
  toolbarRight?: ReactNode
  children: ReactNode
  overlays?: ReactNode
  stageOverlay?: ReactNode
}) {
  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
      style={{
        borderTopLeftRadius: 16,
        clipPath: 'inset(0 0 0 0 round 16px 0 0 0)',
        boxShadow: '-4px -2px 16px rgba(0, 0, 0, 0.08), -1px 0 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Viewer toolbar */}
      {(toolbarLeft || toolbarRight) && (
        <div className="pointer-events-none absolute top-3 right-3 left-3 z-20 flex items-center justify-between gap-2">
          <div className="pointer-events-auto flex items-center gap-2">{toolbarLeft}</div>
          <div className="pointer-events-auto flex items-center gap-2">{toolbarRight}</div>
        </div>
      )}
      {/* Canvas area */}
      <div className="relative flex-1 overflow-hidden">{children}</div>
      {/* Stage overlay — replaces the canvas visually (e.g. studio gallery)
          while keeping it mounted. Sits below the viewer toolbar (z-20) so
          the stage switch stays reachable. */}
      {stageOverlay && <div className="absolute inset-0 z-10">{stageOverlay}</div>}
      {/* Overlays scoped to the viewer column. `data-viewer-bounds` marks the
          draggable region the floating inspector clamps itself to. */}
      {overlays && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          data-viewer-bounds
          style={{ transform: 'translateZ(0)' }}
        >
          {overlays}
        </div>
      )}
    </div>
  )
}

// ── Main v2 layout ───────────────────────────────────────────────────────────

export interface EditorLayoutV2Props {
  navbarSlot?: ReactNode
  sidebarTabs?: SidebarTab[]
  renderTabContent: (tabId: string) => ReactNode
  sidebarOverlay?: ReactNode
  viewerToolbarLeft?: ReactNode
  viewerToolbarRight?: ReactNode
  viewerContent: ReactNode
  overlays?: ReactNode
  stageOverlay?: ReactNode
}

export function EditorLayoutV2({
  navbarSlot,
  sidebarTabs = [],
  renderTabContent,
  sidebarOverlay,
  viewerToolbarLeft,
  viewerToolbarRight,
  viewerContent,
  overlays,
  stageOverlay,
}: EditorLayoutV2Props) {
  const isCaptureMode = useEditor((s) => s.isCaptureMode)
  const isMobile = useIsMobile()
  const showSidebar = !isCaptureMode && sidebarTabs.length > 0

  if (isMobile) {
    return (
      <EditorLayoutMobile
        navbarSlot={navbarSlot}
        overlays={overlays}
        renderTabContent={renderTabContent}
        sidebarOverlay={sidebarOverlay}
        sidebarTabs={sidebarTabs}
        viewerContent={viewerContent}
        viewerToolbarLeft={viewerToolbarLeft}
        viewerToolbarRight={viewerToolbarRight}
      />
    )
  }

  return (
    <div className="dark flex h-full w-full flex-col bg-sidebar text-foreground">
      {/* Top navbar: host content only (sidebar tabs live in the left panel) */}
      <header className="relative z-50 h-14 shrink-0 overflow-visible border-border border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        />
        <div className="relative flex h-full items-center gap-3 overflow-visible px-4">
          <div className="min-w-0 flex-1">{navbarSlot}</div>
        </div>
      </header>

      {/* Main content: left column + right column */}
      <div className="flex min-h-0 flex-1">
        {showSidebar && (
          <LeftColumn
            renderTabContent={renderTabContent}
            sidebarOverlay={sidebarOverlay}
            tabs={sidebarTabs}
          />
        )}
        <RightColumn
          overlays={overlays}
          stageOverlay={stageOverlay}
          toolbarLeft={isCaptureMode ? undefined : viewerToolbarLeft}
          toolbarRight={isCaptureMode ? undefined : viewerToolbarRight}
        >
          {viewerContent}
        </RightColumn>
      </div>
    </div>
  )
}

export { SIDEBAR_RAIL_WIDTH }
