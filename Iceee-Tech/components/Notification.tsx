'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-700 dark:text-green-400',
    iconColor: 'text-green-600 dark:text-green-500',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-700 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-700 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-500',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    iconColor: 'text-yellow-600 dark:text-yellow-500',
  },
}

export function Notification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const config = notificationConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        <h3 className={`font-semibold ${config.textColor}`}>{title}</h3>
        <p className={`text-sm mt-1 ${config.textColor}`}>{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose(id)
        }}
        className={`flex-shrink-0 mt-0.5 ${config.textColor} hover:opacity-75 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
