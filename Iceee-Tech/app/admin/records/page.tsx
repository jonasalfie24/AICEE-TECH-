'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check, X, Eye } from 'lucide-react'

export default function AdminRecordsPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null)
  const [approvalNotes, setApprovalNotes] = useState('')

  if (!user) return null

  // Mock data
  const allRecords = [
    {
      id: '1',
      studentName: 'John Doe',
      email: 'john@example.com',
      strand: 'STEM',
      section: '11-A',
      medicalCondition: 'Severe peanut allergy - must avoid all peanut products',
      dateOfRecord: '2024-03-01',
      submittedDate: '2024-03-01',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Mary Taylor',
      email: 'mary@example.com',
      strand: 'ABM',
      section: '11-B',
      medicalCondition: 'Asthma - carries inhaler at all times',
      dateOfRecord: '2024-02-28',
      submittedDate: '2024-02-28',
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'David Lee',
      email: 'david@example.com',
      strand: 'STEM',
      section: '11-A',
      medicalCondition: 'Lactose intolerant',
      dateOfRecord: '2024-02-25',
      submittedDate: '2024-02-25',
      status: 'approved',
    },
  ]

  const filteredRecords = allRecords.filter((record) => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleApprove = async (recordId: string) => {
    console.log('Approving record:', recordId, 'Notes:', approvalNotes)
    setShowApprovalModal(null)
    setApprovalNotes('')
    // API call would go here
  }

  const handleReject = async (recordId: string) => {
    console.log('Rejecting record:', recordId)
    // API call would go here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Medical Records Review</h1>
        <p className="text-muted-foreground mt-1">Review and approve student medical records</p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Records</label>
              <Input
                placeholder="Search by student name or condition..."
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
                <option value="all">All Records</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <Card key={record.id} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{record.studentName}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.status === 'approved'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                            : record.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                              : 'bg-red-500/20 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {record.status === 'approved' ? 'Approved' : record.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-3">{record.medicalCondition}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div>
                        <p className="text-xs font-medium">Strand</p>
                        <p>{record.strand}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Section</p>
                        <p>{record.section}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Record Date</p>
                        <p>{new Date(record.dateOfRecord).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Submitted</p>
                        <p>{new Date(record.submittedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {record.status === 'pending' && (
                    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                      <Button
                        onClick={() => setShowApprovalModal(record.id)}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(record.id)}
                        variant="destructive"
                        className="flex-1 sm:flex-none"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {record.status === 'approved' && (
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No records found.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border-border max-w-md w-full">
            <CardHeader>
              <CardTitle>Approve Medical Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Admin Notes (Optional)</label>
                <textarea
                  placeholder="Add any notes for your records..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalModal(null)
                    setApprovalNotes('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApprove(showApprovalModal)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
