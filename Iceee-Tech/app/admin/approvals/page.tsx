'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PendingUser {
  id: string
  name: string
  email: string
  strand: string
  section: string
  createdAt: string
}

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('aicee-token')
      const response = await fetch('/api/admin/pending-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch pending users')
      }

      const data = await response.json()
      setPendingUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    try {
      const token = localStorage.getItem('aicee-token')
      const response = await fetch(`/api/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to approve user')
      }

      setSuccess('User approved successfully')
      setPendingUsers(pendingUsers.filter(u => u.id !== userId))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return

    setActionLoading(userId)
    try {
      const token = localStorage.getItem('aicee-token')
      const response = await fetch(`/api/users/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to reject user')
      }

      setSuccess('User rejected')
      setPendingUsers(pendingUsers.filter(u => u.id !== userId))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve pending student accounts
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && pendingUsers.length === 0 && !error && (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up</h3>
          <p className="text-muted-foreground">
            No pending user approvals at the moment
          </p>
        </Card>
      )}

      {/* Pending Users List */}
      {!loading && pendingUsers.length > 0 && (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{user.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>📚 {user.strand}</span>
                    <span>🏫 Section {user.section}</span>
                    <span>📅 Applied {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleApprove(user.id)}
                    disabled={actionLoading === user.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === user.id ? '...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleReject(user.id)}
                    disabled={actionLoading === user.id}
                    variant="destructive"
                  >
                    {actionLoading === user.id ? '...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
