'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CheckCircle,
  X,
  BookOpen,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const isNurse = user.role === 'nurse'
  const baseRoute = isNurse ? '/student' : '/admin'

  const nurseNavItems = [
    {
      label: 'Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Student Records',
      href: '/student/records',
      icon: FileText,
    },
    {
      label: 'Add Medical Record',
      href: '/student/records/new',
      icon: FileText,
    },
  ]

  const adminNavItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'User Approval',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Medical Records',
      href: '/admin/records',
      icon: CheckCircle,
    },
    {
      label: 'Audit Logs',
      href: '/admin/audit',
      icon: BookOpen,
    },
  ]

  const navItems = isNurse ? nurseNavItems : adminNavItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border transition-transform md:translate-x-0 md:static md:top-0 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 md:hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Settings link at bottom */}
          <div className="border-t border-border p-4">
            <Link
              href={`${baseRoute}/settings`}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm',
                pathname === `${baseRoute}/settings`
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
