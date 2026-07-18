'use client'

import type { SidebarTab } from '@pascal-app/editor'
import { Bot, Layers, Package } from 'lucide-react'
import Image from 'next/image'
import { AgentPlaceholder } from './agent-placeholder'
import { ModelsPanel } from './models-panel'

function tabIcon(src: string) {
  return (
    <Image
      alt=""
      className="h-8 w-8 object-contain"
      height={32}
      src={src}
      unoptimized
      width={32}
    />
  )
}

/**
 * Shared Agent / Scene / Models tabs for local and saved-scene editors.
 * Internal IDs stay `ai` / `site` / `items` for existing keyboard and layout
 * consumers; visible labels match the product IA.
 */
export const EDITOR_SIDEBAR_TABS: (SidebarTab & { component: React.ComponentType })[] = [
  {
    id: 'ai',
    label: 'Agent',
    component: AgentPlaceholder,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Bot className="h-5 w-5" />,
    icon: tabIcon('/icons/agent.png'),
  },
  {
    id: 'site',
    label: 'Scene',
    component: () => null, // Built-in SitePanel handles this id
    mobileDefaultSnap: 0.5,
    mobileIcon: <Layers className="h-5 w-5" />,
    icon: tabIcon('/icons/scene-v2.png'),
  },
  {
    id: 'items',
    label: 'Models',
    component: ModelsPanel,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Package className="h-5 w-5" />,
    icon: tabIcon('/icons/couch-v2.png'),
  },
]
