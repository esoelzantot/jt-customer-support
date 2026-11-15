export const OPEN_SEARCH_EVENT = 'jt:open-search'

/** Open the global command search from anywhere (buttons, hero, etc.). */
export const openSearch = (initialQuery = '') =>
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT, { detail: initialQuery }))

export const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
