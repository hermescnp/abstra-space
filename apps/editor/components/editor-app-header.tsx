'use client'

import type { SaveStatus, SettingsPanelProps } from '@pascal-app/editor'
import { Box, Cloud, CloudAlert, CloudCheck, CloudOff, Landmark, Loader2, Plus, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { EditorModeToggle } from './editor-mode-toggle'
import { BrandingGlyph, CommentsGlyph, DeriveGlyph, KnowledgeGlyph } from './header-glyphs'
import { PlaceholderHeaderDrawer } from './placeholder-header-drawer'
import { SettingsDrawer } from './settings-drawer'
import { ExportMenu } from './export-menu'
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
  icon: typeof CloudCheck
  spin?: boolean
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Changes pending save',
        className: 'text-muted-foreground',
        icon: Cloud,
      }
    case 'saving':
      return {
        label: 'Saving to cloud...',
        className: 'text-primary',
        icon: Loader2,
        spin: true,
      }
    case 'saved':
      return {
        label: 'Saved to the cloud',
        className: 'text-emerald-600',
        icon: CloudCheck,
      }
    case 'error':
      return {
        label: 'Could not save to the cloud',
        className: 'text-destructive',
        icon: CloudAlert,
      }
    case 'paused':
      return {
        label: 'Autosave paused',
        className: 'text-muted-foreground',
        icon: CloudOff,
      }
    default:
      return {
        label: 'Saved to the cloud',
        className: 'text-emerald-600',
        icon: CloudCheck,
      }
  }
}

const headerGroupItemClassName = cn(
  'flex w-10 items-center justify-center text-white transition-colors duration-200',
  'hover:bg-[#0B1E33] hover:text-[#68DBFF] active:bg-[#0D2640]',
  'focus-visible:bg-[#0B1E33] focus-visible:text-[#68DBFF] focus-visible:outline-none',
  'focus-visible:shadow-[inset_0_0_0_2px_rgba(104,219,255,0.35)]',
)

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
  const status =
    variant === 'local'
      ? {
          label: 'Scenes are not saved',
          className: 'text-muted-foreground',
          icon: CloudOff,
          spin: false as boolean | undefined,
        }
      : saveStatusMeta(saveStatus)
  const StatusIcon = status.icon
  const canEditName = variant === 'scene' && Boolean(onNameChange)

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
      <div className="flex min-w-0 items-center gap-3 overflow-visible">
        <div
          className={cn(
            'flex h-10 shrink-0 items-stretch overflow-hidden rounded-xl border-[0.5px] border-[#416679]',
            'bg-[#0A1727] transition-colors duration-200 hover:border-[#68DBFF]',
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link aria-label="Create a space" className={headerGroupItemClassName} href="/">
                <Plus aria-hidden size={18} strokeWidth={1.75} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Create</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Go to the Agora"
                className={cn(headerGroupItemClassName, 'border-l-[0.5px] border-[#416679]')}
                href="/agora"
              >
                <Landmark aria-hidden size={18} strokeWidth={1.75} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Agora</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex h-10 min-w-0 max-w-xl flex-1 items-center gap-2 overflow-hidden rounded-xl border border-border/60 bg-background/70 px-3">
          <Box aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            aria-label="Scene name"
            className={cn(
              'h-8 w-full min-w-0 border-0 bg-transparent px-0 text-sm font-semibold text-foreground shadow-none outline-none',
              'placeholder:text-muted-foreground focus-visible:ring-0',
              !canEditName && 'cursor-default',
            )}
            onBlur={canEditName ? commitName : undefined}
            onChange={
              canEditName ? (event) => setDraftName(event.target.value) : undefined
            }
            onKeyDown={
              canEditName
                ? (event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur()
                    }
                    if (event.key === 'Escape') {
                      setDraftName(name)
                      event.currentTarget.blur()
                    }
                  }
                : undefined
            }
            placeholder="Untitled scene"
            readOnly={!canEditName}
            value={canEditName ? draftName : name}
          />
          <span className="shrink-0" title={status.label}>
            <StatusIcon
              className={cn(
                'h-4 w-4 shrink-0',
                status.className,
                status.spin && 'animate-spin',
              )}
            />
          </span>
        </div>
      </div>

      <EditorModeToggle className="shrink-0 justify-self-center" />

      <div className="flex min-w-0 items-center justify-end gap-2">
        <PlaceholderHeaderDrawer icon={CommentsGlyph} label="Comments" />
        <PlaceholderHeaderDrawer icon={KnowledgeGlyph} label="Knowledge" />
        <PlaceholderHeaderDrawer icon={BrandingGlyph} label="Branding" />
        <PlaceholderHeaderDrawer icon={DeriveGlyph} label="Derive" />
        <ExportMenu />
        <SettingsDrawer {...settingsPanelProps} />
        <PlaceholderHeaderDrawer icon={User} label="User account" variant="account" />
      </div>
    </div>
  )
}
