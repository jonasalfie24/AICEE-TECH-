'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check, X, Mail } from 'lucide-react'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  if (!user) return null

  // Mock data
  const allUsers = [
    { id: '1', name: 'Jane Smith', email: 'jane@example.com', username: 'jane_smith', appliedDate: '2024-03-04', status: 'pending' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', username: 'bob_j', appliedDate: '2024-03-03', status: 'pending' },
    { id: '3', name: 'John Doe', email: 'john@example.com', username: 'johndoe', appliedDate: '2024-03-01', status: 'active' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', username: 'alice_b', appliedDate: '2024-02-28', status: 'pending' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', username: 'cwilson', appliedDate: '2024-02-25', status: 'active' },
  ]

  const filteredUsers = allUsers.filter((u) => {
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleApprove = async (userId: string) => {
    console.log('Approving user:', userId)
    // API call would go here
  }

  const handleReject = async (userId: string) => {
    console.log('Rejecting user:', userId, 'Reason:', rejectReason)
    setShowRejectModal(null)
    setRejectReason('')
    // API call would go here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nurse Account Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve pending nurse accounts</p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Users</label>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
              >
                <option value="all">All Users</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <Card key={u.id} className="border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground ml-13">
                      <div>
                        <p className="text-xs font-medium">Email</p>
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Applied</p>
                        <p>{new Date(u.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Status</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            u.status === 'active'
                              ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                              : u.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                : 'bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {u.status === 'pending' ? 'Pending' : u.status === 'active' ? 'Active' : 'Rejected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {u.status === 'pending' && (
                    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                      <Button
                        onClick={() => handleApprove(u.id)}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(u.id)}
                        variant="destructive"
                        className="flex-1 sm:flex-none"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No users found.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border-border max-w-md w-full">
            <CardHeader>
              <CardTitle>Reject Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Reason for Rejection</label>
                <textarea
                  placeholder="Provide a reason for rejecting this account..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(null)
                    setRejectReason('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(showRejectModal)}
                  className="flex-1"
                  disabled={!rejectReason.trim()}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
