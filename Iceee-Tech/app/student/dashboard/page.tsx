'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFullName } from '@/lib/utils'
import { FileText, Plus, Eye, Users, ClipboardList, CheckCircle } from 'lucide-react'

export default function NurseDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Mock data — nurse sees all students' records
  const stats = [
    { label: 'Total Records Submitted', value: '28', icon: ClipboardList, color: 'text-primary/30' },
    { label: 'Pending Admin Review', value: '5', icon: FileText, color: 'text-yellow-400/40' },
    { label: 'Approved Records', value: '23', icon: CheckCircle, color: 'text-green-400/40' },
  ]

  const recentRecords = [
    { id: 1, studentName: 'Maria Santos', strand: 'STEM', section: '11-A', condition: 'Allergy to Penicillin', date: '2024-03-05', status: 'approved' },
    { id: 2, studentName: 'Jose Reyes', strand: 'ABM', section: '11-B', condition: 'Asthma — uses inhaler', date: '2024-03-04', status: 'pending' },
    { id: 3, studentName: 'Ana Cruz', strand: 'HUMSS', section: '12-C', condition: 'Lactose intolerant', date: '2024-03-03', status: 'approved' },
    { id: 4, studentName: 'Carlo Bautista', strand: 'GAS', section: '12-A', condition: 'Seizure disorder — medicated', date: '2024-03-02', status: 'pending' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
          Welcome, {getFullName(user.first_name, user.last_name)}!
        </h1>
        <p className="text-muted-foreground">Manage and submit student medical records</p>
      </div>

      {/* Account Status Alert */}
      {user.status !== 'active' && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
          <p className="text-sm font-medium">
            Your account is currently pending admin approval. You will be able to submit records once approved.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <Icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/student/records/new">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            disabled={user.status !== 'active'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Student Medical Record
          </Button>
        </Link>
        <Link href="/student/records">
          <Button variant="outline" className="w-full h-12 text-base">
            <Eye className="w-5 h-5 mr-2" />
            View All Records
          </Button>
        </Link>
      </div>

      {/* Recent Records */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Submitted Records</CardTitle>
          <Link href="/student/records">
            <Button variant="ghost" size="sm" className="text-primary">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold text-foreground">{record.studentName}</p>
                    <span className="text-xs text-muted-foreground">{record.strand} — {record.section}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{record.condition}</p>
                  <p className="text-xs text-muted-foreground ml-6 mt-1">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <span
                  className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    record.status === 'approved'
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                      : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {record.status === 'approved' ? 'Approved' : 'Pending Review'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
