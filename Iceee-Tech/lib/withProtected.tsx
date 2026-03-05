'use client'

import { useAuth, UserRole } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ComponentType } from 'react'

interface WithProtectedProps {
  allowedRoles?: UserRole[]
}

export function withProtected<P extends object>(
  Component: ComponentType<P>,
  options: WithProtectedProps = {}
) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const { allowedRoles } = options

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
      if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
      }
    }, [user, loading, router, allowedRoles])

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-primary/20" />
        </div>
      )
    }

    if (!user) {
      return null
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return null
    }

    return <Component {...props} />
  }
}

export function ProtectedLayout({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }, [user, loading, router, allowedRoles])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-primary/20" />
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}
