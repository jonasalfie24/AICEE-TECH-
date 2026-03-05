'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Download } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  user_login: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  user_logout: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  user_registered: 'bg-green-500/20 text-green-700 dark:text-green-400',
  user_approved: 'bg-green-500/20 text-green-700 dark:text-green-400',
  user_rejected: 'bg-red-500/20 text-red-700 dark:text-red-400',
  record_submitted: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  record_approved: 'bg-green-500/20 text-green-700 dark:text-green-400',
  record_rejected: 'bg-red-500/20 text-red-700 dark:text-red-400',
  profile_updated: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  password_changed: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  admin_login: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  admin_logout: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
}

const ACTION_LABELS: Record<string, string> = {
  user_login: 'User Login',
  user_logout: 'User Logout',
  user_registered: 'User Registered',
  user_approved: 'User Approved',
  user_rejected: 'User Rejected',
  record_submitted: 'Record Submitted',
  record_approved: 'Record Approved',
  record_rejected: 'Record Rejected',
  profile_updated: 'Profile Updated',
  password_changed: 'Password Changed',
  admin_login: 'Admin Login',
  admin_logout: 'Admin Logout',
}

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  userEmail: string
  userName: string
  targetType?: string
  details: string
}

export default function AuditLogPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  if (!user) return null

  // Mock audit logs data
  const allAuditLogs: AuditEntry[] = [
    {
      id: 'log_1',
      timestamp: '2024-03-05T14:30:00Z',
      action: 'user_approved',
      userEmail: 'admin@example.com',
      userName: 'Admin User',
      targetType: 'User',
      details: 'Approved account for Jane Smith',
    },
    {
      id: 'log_2',
      timestamp: '2024-03-05T13:45:00Z',
      action: 'record_approved',
      userEmail: 'admin@example.com',
      userName: 'Admin User',
      targetType: 'Record',
      details: 'Approved medical record for John Doe',
    },
    {
      id: 'log_3',
      timestamp: '2024-03-05T12:20:00Z',
      action: 'user_login',
      userEmail: 'student@example.com',
      userName: 'Student User',
      details: 'Logged in successfully',
    },
    {
      id: 'log_4',
      timestamp: '2024-03-05T11:15:00Z',
      action: 'record_submitted',
      userEmail: 'student@example.com',
      userName: 'Student User',
      targetType: 'Record',
      details: 'Submitted medical record with asthma information',
    },
    {
      id: 'log_5',
      timestamp: '2024-03-04T15:30:00Z',
      action: 'user_registered',
      userEmail: 'newuser@example.com',
      userName: 'New User',
      details: 'New student account registered',
    },
    {
      id: 'log_6',
      timestamp: '2024-03-04T10:00:00Z',
      action: 'admin_login',
      userEmail: 'admin@example.com',
      userName: 'Admin User',
      details: 'Admin logged in',
    },
    {
      id: 'log_7',
      timestamp: '2024-03-03T16:45:00Z',
      action: 'password_changed',
      userEmail: 'student@example.com',
      userName: 'Student User',
      details: 'Password changed successfully',
    },
    {
      id: 'log_8',
      timestamp: '2024-03-03T14:20:00Z',
      action: 'profile_updated',
      userEmail: 'student@example.com',
      userName: 'Student User',
      details: 'Updated profile information',
    },
  ]

  // Filter logs
  const filteredLogs = allAuditLogs.filter((log) => {
    const matchesSearch =
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = filterAction === 'all' || log.action === filterAction

    return matchesSearch && matchesAction
  })

  const handleExport = () => {
    const csv = [
      ['ID', 'Timestamp', 'Action', 'User Email', 'User Name', 'Target Type', 'Details'],
      ...filteredLogs.map((log) => [
        log.id,
        log.timestamp,
        ACTION_LABELS[log.action] || log.action,
        log.userEmail,
        log.userName,
        log.targetType || '-',
        log.details,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Monitor system activity and user actions</p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Logs</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, email, or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
              >
                <option value="all">All Actions</option>
                <option value="user_login">User Login</option>
                <option value="user_registered">User Registered</option>
                <option value="user_approved">User Approved</option>
                <option value="user_rejected">User Rejected</option>
                <option value="record_submitted">Record Submitted</option>
                <option value="record_approved">Record Approved</option>
                <option value="record_rejected">Record Rejected</option>
                <option value="profile_updated">Profile Updated</option>
                <option value="password_changed">Password Changed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Actions</label>
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            ACTION_COLORS[log.action] || 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-foreground font-medium">{log.userName}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
              <p className="text-3xl font-bold text-foreground">{allAuditLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's Activities</p>
              <p className="text-3xl font-bold text-foreground">
                {allAuditLogs.filter((log) => {
                  const logDate = new Date(log.timestamp).toDateString()
                  const today = new Date().toDateString()
                  return logDate === today
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approvals Today</p>
              <p className="text-3xl font-bold text-foreground">
                {allAuditLogs.filter((log) => {
                  const logDate = new Date(log.timestamp).toDateString()
                  const today = new Date().toDateString()
                  return logDate === today && (log.action === 'user_approved' || log.action === 'record_approved')
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
