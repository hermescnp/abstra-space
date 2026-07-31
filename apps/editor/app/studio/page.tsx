'use client'

import { Editor } from '@pascal-app/editor'
import { EditorAppHeader } from '@/components/editor-app-header'
import { EDITOR_SIDEBAR_TABS } from '@/components/editor-sidebar-tabs'
import {
  CommunityViewerToolbarLeft,
  CommunityViewerToolbarRight,
} from '@/components/viewer-toolbar'

const PROJECT_ID = 'local-editor'

export default function StudioPage() {
  return (
    <div className="relative h-screen w-screen">
      <Editor
        includeRegisteredSidebarPanels={false}
        layoutVersion="v2"
        navbarSlot={<EditorAppHeader name="Local editor" variant="local" />}
        projectId={PROJECT_ID}
        sidebarTabs={EDITOR_SIDEBAR_TABS}
        viewerToolbarLeft={<CommunityViewerToolbarLeft />}
        viewerToolbarRight={<CommunityViewerToolbarRight />}
      />
    </div>
  )
}
