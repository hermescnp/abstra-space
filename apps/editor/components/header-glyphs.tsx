import { Brain, Download, GitBranch, type LucideProps, Palette } from 'lucide-react'
import type { SVGProps } from 'react'

/** Header glyph standard shared with the IAteneo session bottom bar: 18px outline, stroke 2. */
export const HEADER_GLYPH_PX = 18

export type HeaderGlyphProps = SVGProps<SVGSVGElement>

function OutlineGlyph({ children, ...props }: HeaderGlyphProps) {
  return (
    <svg
      aria-hidden
      fill="none"
      height={HEADER_GLYPH_PX}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={HEADER_GLYPH_PX}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  )
}

export function CommentsGlyph(props: HeaderGlyphProps) {
  return (
    <OutlineGlyph {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </OutlineGlyph>
  )
}

export function SettingsGlyph(props: HeaderGlyphProps) {
  return (
    <OutlineGlyph {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </OutlineGlyph>
  )
}

const lucideDefaults = { size: HEADER_GLYPH_PX, strokeWidth: 2, 'aria-hidden': true } as const

export function KnowledgeGlyph(props: LucideProps) {
  return <Brain {...lucideDefaults} {...props} />
}

export function BrandingGlyph(props: LucideProps) {
  return <Palette {...lucideDefaults} {...props} />
}

export function DeriveGlyph(props: LucideProps) {
  return <GitBranch {...lucideDefaults} {...props} />
}

export function ExportGlyph(props: LucideProps) {
  return <Download {...lucideDefaults} {...props} />
}
