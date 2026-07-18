'use client'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

export function EditorModeToggle({ className }: { className?: string }) {
  return (
    <div
      aria-label="Editor mode"
      className={cn('editor-mode-toggle', className)}
      role="tablist"
    >
      <span aria-hidden className="editor-mode-toggle-indicator" />
      <button
        aria-selected="true"
        className="editor-mode-toggle-tab editor-mode-toggle-tab--active"
        role="tab"
        type="button"
      >
        SIGHT
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-disabled="true"
            aria-selected="false"
            className="editor-mode-toggle-tab editor-mode-toggle-tab--disabled"
            onClick={(event) => event.preventDefault()}
            role="tab"
            type="button"
          >
            VIBE
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">VIBE is coming soon</TooltipContent>
      </Tooltip>
    </div>
  )
}
