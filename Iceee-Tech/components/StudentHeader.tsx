'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { StudentSidebar } from './StudentSidebar'
import { Button } from '@/components/ui/button'

export function StudentHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="gap-2"
          >
            {theme === 'light' ? (
              <>
                <span>🌙</span>
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            ) : (
              <>
                <span>☀️</span>
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
