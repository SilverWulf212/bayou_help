import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [status, setStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
  })

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ isOnline: true, wasOffline: !prev.isOnline }))
      setTimeout(() => setStatus(s => ({ ...s, wasOffline: false })), 3000)
    }

    const handleOffline = () => {
      setStatus({ isOnline: false, wasOffline: false })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
}
