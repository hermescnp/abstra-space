'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

function GoogleLogo({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

function InitialAvatar({
  name,
  size = 18,
  rounded = 'full',
}: {
  name: string
  size?: number
  rounded?: 'full' | 'lg'
}) {
  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center bg-white/20 text-white/60',
        rounded === 'full' ? 'rounded-full' : 'rounded-lg',
      )}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      {name[0]?.toUpperCase() ?? '?'}
    </span>
  )
}

function SignOutIcon({ size = 11 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function resolveDisplayName(user: User | null): string {
  if (!user) return 'Account'
  const metadata = user.user_metadata ?? {}
  if (typeof metadata.full_name === 'string' && metadata.full_name.trim()) {
    return metadata.full_name.trim()
  }
  if (typeof metadata.name === 'string' && metadata.name.trim()) {
    return metadata.name.trim()
  }
  return user.email?.trim() || 'Account'
}

function resolveAvatarUrl(user: User | null): string | null {
  if (!user) return null
  const metadata = user.user_metadata ?? {}
  const candidates = [metadata.avatar_url, metadata.picture, metadata.avatar]
  for (const value of candidates) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') continue
    try {
      const url = new URL(trimmed)
      if (url.protocol === 'http:' || url.protocol === 'https:') return trimmed
    } catch {
      continue
    }
  }
  return null
}

export type HostAccountBadgeVariant = 'welcome' | 'header'

/**
 * Account control — IAteneo / Golden Papers chrome, wired to Dot Science Supabase auth.
 */
export function HostAccountBadge({
  variant = 'header',
  className,
}: {
  variant?: HostAccountBadgeVariant
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [busy, setBusy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  const isSignedIn = Boolean(user)
  const label = resolveDisplayName(user)
  const photoURL = resolveAvatarUrl(user)

  useEffect(() => {
    if (!isSignedIn) {
      setMenuOpen(false)
      setMenuPos(null)
    }
  }, [isSignedIn])

  useEffect(() => {
    if (!menuOpen) return

    const updatePos = () => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }

    updatePos()

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (event.target instanceof Node && root.contains(event.target)) return
      setMenuOpen(false)
      setMenuPos(null)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMenuPos(null)
      }
    }

    window.addEventListener('resize', updatePos)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', updatePos)
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuPos(null)
  }

  const handleSignIn = async () => {
    if (busy || loading) return
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google sign-in failed:', err)
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    if (busy) return
    setBusy(true)
    try {
      await signOut()
      closeMenu()
    } catch (err) {
      console.error('Sign-out failed:', err)
    } finally {
      setBusy(false)
    }
  }

  if (variant === 'welcome') {
    if (isSignedIn) {
      return (
        <div className={cn('mt-4 flex items-center justify-center', className)}>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={busy}
            title="Sign out"
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-[5px] py-[5px] text-xs text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/70 disabled:opacity-50"
          >
            {photoURL ? (
              <Image
                src={photoURL}
                alt=""
                width={20}
                height={20}
                className="size-5 flex-shrink-0 rounded-full object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <InitialAvatar name={label} size={20} />
            )}
            <span className="max-w-[14rem] truncate">{label}</span>
            <span className="ml-0 max-w-0 overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:ml-1 group-hover:max-w-5 group-hover:opacity-100">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
                <SignOutIcon />
              </span>
            </span>
          </button>
        </div>
      )
    }

    return (
      <div className={cn('mt-4 flex items-center justify-center', className)}>
        <button
          type="button"
          onClick={() => void handleSignIn()}
          disabled={busy || loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-[5px] py-[5px] text-xs text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/60 disabled:opacity-50"
        >
          <GoogleLogo size={14} />
          <span>{busy ? 'Signing in…' : 'Sign in with Google'}</span>
        </button>
      </div>
    )
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        title={isSignedIn ? label : 'Account'}
        aria-label={isSignedIn ? `Account menu: ${label}` : 'Account menu'}
        className={cn(
          'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl',
          'border-[0.5px] border-[#416679] text-white transition-all duration-200',
          'hover:scale-105 hover:border-[#68DBFF]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68DBFF]/45',
          'active:scale-95',
          isSignedIn ? 'bg-[#003563]' : 'bg-[#0A1727] hover:bg-black/20',
        )}
      >
        {photoURL ? (
          <Image
            src={photoURL}
            alt=""
            width={40}
            height={40}
            className="size-full object-cover"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : isSignedIn ? (
          <InitialAvatar name={label} size={40} rounded="lg" />
        ) : (
          <UserIcon className="size-5" strokeWidth={1.5} aria-hidden />
        )}
      </button>

      {menuOpen && menuPos ? (
        <div
          role="menu"
          aria-label="Account"
          className="fixed z-[180] min-w-[13.5rem] overflow-hidden rounded-xl border border-white/12 bg-black/55 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl backdrop-saturate-150"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          {isSignedIn ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2 py-1.5">
                {photoURL ? (
                  <Image
                    src={photoURL}
                    alt=""
                    width={28}
                    height={28}
                    className="flex-shrink-0 rounded-full"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <InitialAvatar name={label} size={28} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white/80">
                    {label !== 'Account' ? label : 'Signed in'}
                  </p>
                  {user?.email ? (
                    <p className="truncate text-[11px] text-white/45">{user.email}</p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => void handleSignOut()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white/90 disabled:opacity-50"
              >
                <SignOutIcon size={12} />
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleSignIn()}
              disabled={busy || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-[5px] py-[7px] text-xs text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white/75 disabled:opacity-50"
            >
              <GoogleLogo size={14} />
              <span>{busy ? 'Signing in…' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
