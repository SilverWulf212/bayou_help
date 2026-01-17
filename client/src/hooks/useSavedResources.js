import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'bayou-help-saved-resources'

export function useSavedResources() {
  const [savedIds, setSavedIds] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedIds(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load saved resources:', e)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    }
  }, [savedIds, hydrated])

  const toggleSaved = useCallback((id) => {
    setSavedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }, [])

  const isSaved = useCallback((id) => {
    return savedIds.includes(id)
  }, [savedIds])

  const clearAll = useCallback(() => {
    setSavedIds([])
  }, [])

  return {
    savedIds,
    toggleSaved,
    isSaved,
    clearAll,
    count: savedIds.length,
    hydrated,
  }
}
