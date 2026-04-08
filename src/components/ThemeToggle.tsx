import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'auto'

function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setThemeCookie(mode: ThemeMode) {
  const maxAge = mode === 'auto' ? 0 : 60 * 60 * 24 * 365
  document.cookie = `theme=${mode}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function getInitialMode(serverTheme: 'light' | 'dark' | null): ThemeMode {
  if (serverTheme) return serverTheme

  if (typeof window === 'undefined') return 'auto'

  const stored = getCookieValue('theme')
  if (stored === 'light' || stored === 'dark') return stored

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle({ serverTheme }: { serverTheme: 'light' | 'dark' | null }) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode(serverTheme))

  useEffect(() => {
    applyThemeMode(mode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    setThemeCookie(nextMode)
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  const Icon = mode === 'auto' ? Monitor : mode === 'dark' ? Moon : Sun

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-(--sea-ink-soft) hover:text-(--sea-ink) cursor-pointer bg-transparent border-none p-0"
    >
      <Icon size={14} />
    </button>
  )
}
