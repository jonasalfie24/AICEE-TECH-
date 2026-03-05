'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface NotificationMessage {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: NotificationMessage[]
  addNotification: (notification: Omit<NotificationMessage, 'id'>) => void
  removeNotification: (id: string) => void
  showSuccess: (title: string, message: string, duration?: number) => void
  showError: (title: string, message: string, duration?: number) => void
  showInfo: (title: string, message: string, duration?: number) => void
  showWarning: (title: string, message: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])

  const addNotification = useCallback((notification: Omit<NotificationMessage, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNotification: NotificationMessage = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showSuccess = useCallback(
    (title: string, message: string, duration = 3000) => {
      addNotification({ type: 'success', title, message, duration })
    },
    [addNotification]
  )

  const showError = useCallback(
    (title: string, message: string, duration = 4000) => {
      addNotification({ type: 'error', title, message, duration })
    },
    [addNotification]
  )

  const showInfo = useCallback(
    (title: string, message: string, duration = 3000) => {
      addNotification({ type: 'info', title, message, duration })
    },
    [addNotification]
  )

  const showWarning = useCallback(
    (title: string, message: string, duration = 3000) => {
      addNotification({ type: 'warning', title, message, duration })
    },
    [addNotification]
  )

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
