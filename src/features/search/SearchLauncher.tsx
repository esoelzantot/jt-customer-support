import { lazy, Suspense, useEffect, useState } from 'react'
import { OPEN_SEARCH_EVENT } from './searchBus'

// The palette (and Firestore) only download the first time someone opens search.
const CommandPalette = lazy(() => import('./CommandPalette'))

export function SearchLauncher() {
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const show = (q = '') => {
      setInitial(q)
      setLoaded(true)
      setOpen(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        show()
      }
    }
    const onEvent = (e: Event) => show((e as CustomEvent<string>).detail ?? '')
    document.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_SEARCH_EVENT, onEvent)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_SEARCH_EVENT, onEvent)
    }
  }, [])

  if (!loaded) return null
  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} initialQuery={initial} onClose={() => setOpen(false)} />
    </Suspense>
  )
}
