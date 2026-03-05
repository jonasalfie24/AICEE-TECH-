'use client'

import { StudentHeader } from '@/components/StudentHeader'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentHeader />
      <main className="min-h-[calc(100vh-4rem)] flex">
        <div className="hidden lg:w-64 lg:block" /> {/* Sidebar spacer */}
        <div className="flex-1 w-full overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
