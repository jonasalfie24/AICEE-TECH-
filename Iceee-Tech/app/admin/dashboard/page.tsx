'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFullName } from '@/lib/utils'
import { Users, FileText, CheckCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Mock data
  const stats = [
    { label: 'Total Users', value: '42', icon: Users, color: 'bg-blue-500/20' },
    { label: 'Pending Approvals', value: '5', icon: Clock, color: 'bg-yellow-500/20' },
    { label: 'Total Records', value: '128', icon: FileText, color: 'bg-purple-500/20' },
    { label: 'Approved Records', value: '115', icon: CheckCircle, color: 'bg-green-500/20' },
  ]

  const pendingApprovals = [
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', date: '2024-03-04' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', date: '2024-03-03' },
    { id: 3, name: 'Alice Brown', email: 'alice@example.com', date: '2024-03-02' },
  ]

  const pendingRecords = [
    { id: 1, student: 'John Doe', condition: 'Asthma', date: '2024-03-01' },
    { id: 2, student: 'Mary Taylor', condition: 'Allergy', date: '2024-02-28' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Welcome back, {getFullName(user.first_name, user.last_name)}!
        </h1>
        <p className="text-muted-foreground">Manage users and medical records</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending User Approvals */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending User Approvals</CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{approval.name}</p>
                      <p className="text-sm text-muted-foreground">{approval.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{approval.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No pending approvals</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Medical Records Review */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Records Review</CardTitle>
            <Link href="/admin/records">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRecords.length > 0 ? (
                pendingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{record.student}</p>
                      <p className="text-sm text-muted-foreground">{record.condition}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No pending records</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/users">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
            <Users className="w-5 h-5 mr-2" />
            Review User Approvals
          </Button>
        </Link>
        <Link href="/admin/records">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
            <FileText className="w-5 h-5 mr-2" />
            Review Medical Records
          </Button>
        </Link>
      </div>
    </div>
  )
}
