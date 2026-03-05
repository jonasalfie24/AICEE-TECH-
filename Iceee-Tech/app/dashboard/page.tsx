'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your medical records and health information
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Records</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
          <Link href="/dashboard/records">
            <Button variant="link" className="p-0 h-auto text-primary">
              View all records →
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
          <p className="text-xs text-muted-foreground">Awaiting admin review</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approved Records</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
          <p className="text-xs text-muted-foreground">Finalized records</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-2 border-dashed border-primary/20">
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Submit New Record</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new medical record to your profile
            </p>
            <Link href="/dashboard/submit">
              <Button className="bg-primary hover:bg-primary/90">
                Start New Record
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 border-2 border-dashed border-accent/20">
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Account Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your profile and preferences
            </p>
            <Link href="/dashboard/settings">
              <Button variant="outline">
                Open Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Student Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Email</p>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Strand</p>
            <p className="font-medium text-foreground">{user?.strand || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Section</p>
            <p className="font-medium text-foreground">{user?.section || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Status</p>
            <p className="font-medium text-green-600">Approved</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
