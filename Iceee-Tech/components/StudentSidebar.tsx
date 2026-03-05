'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Submit Records', href: '/dashboard/submit', icon: '📝' },
  { label: 'View Records', href: '/dashboard/records', icon: '📋' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
]

export function StudentSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 lg:z-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-lg font-bold text-sidebar-foreground">Aicee-Tech</h2>
            <p className="text-xs text-sidebar-foreground/60">Medical Records</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    onClick={onClose}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <Card className="p-3 bg-sidebar-primary/10">
              <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
            </Card>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
