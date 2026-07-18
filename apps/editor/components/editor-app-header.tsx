'use client'

import type { SaveStatus, SettingsPanelProps } from '@pascal-app/editor'
import {
  AlertCircle,
  BookMarked,
  Brain,
  Check,
  GitBranch,
  Loader2,
  MessageSquare,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { EditorModeToggle } from './editor-mode-toggle'
import { PlaceholderHeaderDrawer } from './placeholder-header-drawer'
import { SettingsDrawer } from './settings-drawer'
import { ShareMenu } from './share-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

type EditorAppHeaderProps = {
  variant: 'local' | 'scene'
  name: string
  saveStatus?: SaveStatus
  onNameChange?: (name: string) => void
  settingsPanelProps?: SettingsPanelProps
}

function saveStatusMeta(status: SaveStatus | undefined): {
  label: string
  className: string
  icon: typeof Check
  spin?: boolean
} {
  switch (status) {
    case 'pending':
      return { label: 'Unsaved changes', className: 'text-amber-500', icon: Loader2 }
    case 'saving':
      return { label: 'Saving…', className: 'text-muted-foreground', icon: Loader2, spin: true }
    case 'saved':
      return { label: 'Saved', className: 'text-emerald-500', icon: Check }
    case 'error':
      return { label: 'Save failed', className: 'text-destructive', icon: AlertCircle }
    case 'paused':
      return { label: 'Autosave paused', className: 'text-muted-foreground', icon: AlertCircle }
    default:
      return { label: 'Up to date', className: 'text-muted-foreground', icon: Check }
  }
}

/**
 * Left-side header content (home + scene title) plus Settings drawer trigger
 * on the right of the name field (Golden Papers Document-panel pattern).
 */
export function EditorAppHeader({
  variant,
  name,
  saveStatus,
  onNameChange,
  settingsPanelProps,
}: EditorAppHeaderProps) {
  const [draftName, setDraftName] = useState(name)
  const status = saveStatusMeta(saveStatus)
  const StatusIcon = status.icon

  useEffect(() => {
    setDraftName(name)
  }, [name])

  const commitName = () => {
    const next = draftName.trim()
    if (!next || next === name) {
      setDraftName(name)
      return
    }
    onNameChange?.(next)
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 overflow-visible">
      <div className="flex min-w-0 items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              aria-label="Back to scenes"
              className={cn(
                'group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                '[&_img]:transition-[opacity,filter] [&_img]:duration-200',
                'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                '[&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0',
              )}
              href="/agora"
            >
              <Image
                alt=""
                aria-hidden
                className="h-8 w-8 object-contain"
                height={32}
                src="/icons/home.png"
                unoptimized
                width={32}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">Back to scenes</TooltipContent>
        </Tooltip>

        <div className="flex min-w-0 max-w-xl flex-1 items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3">
          {variant === 'scene' && onNameChange ? (
            <input
              aria-label="Scene name"
              className="h-8 min-w-0 flex-1 border-0 bg-transparent px-0 font-semibold text-sm shadow-none outline-none focus-visible:ring-0"
              onBlur={commitName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                }
                if (event.key === 'Escape') {
                  setDraftName(name)
                  event.currentTarget.blur()
                }
              }}
              placeholder="Untitled scene"
              value={draftName}
            />
          ) : (
            <span className="h-8 min-w-0 flex-1 truncate py-1.5 font-semibold text-sm">{name}</span>
          )}

          {variant === 'local' ? (
            <span className="hidden shrink-0 text-muted-foreground text-xs sm:inline">
              Scenes are not saved
            </span>
          ) : (
            <span className="shrink-0" title={status.label}>
              <StatusIcon
                className={cn(
                  'h-4 w-4 shrink-0',
                  status.className,
                  status.spin && 'animate-spin',
                )}
              />
            </span>
          )}
        </div>
      </div>

      <EditorModeToggle className="shrink-0 justify-self-center" />

      <div className="flex min-w-0 items-center justify-end gap-2">
        <PlaceholderHeaderDrawer icon={MessageSquare} iconSrc="/icons/comments.png" label="Comments" />
        <PlaceholderHeaderDrawer icon={Brain} iconSrc="/icons/knowledge.png" label="Knowledge" />
        <PlaceholderHeaderDrawer icon={BookMarked} iconSrc="/icons/branding.png" label="Branding" />
        <PlaceholderHeaderDrawer icon={GitBranch} iconSrc="/icons/derive.png" label="Derive" />
        <ShareMenu />
        <SettingsDrawer {...settingsPanelProps} />
        <PlaceholderHeaderDrawer
          avatarSrc="/man-empty-avatar.png"
          icon={UserRound}
          label="User account"
        />
      </div>
    </div>
  )
}
