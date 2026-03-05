'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Download } from 'lucide-react'

export default function StudentRecordsPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (!user) return null

  // Mock data
  const allRecords = [
    {
      id: 1,
      studentName: user.first_name + ' ' + user.last_name,
      strand: 'STEM',
      section: '11-A',
      medicalCondition: 'Allergy to Penicillin',
      dateOfRecord: '2024-03-01',
      status: 'approved',
      createdAt: '2024-03-01T10:00:00Z',
    },
    {
      id: 2,
      studentName: user.first_name + ' ' + user.last_name,
      strand: 'STEM',
      section: '11-A',
      medicalCondition: 'Asthma - requires inhaler',
      dateOfRecord: '2024-02-15',
      status: 'pending',
      createdAt: '2024-02-15T14:30:00Z',
    },
    {
      id: 3,
      studentName: user.first_name + ' ' + user.last_name,
      strand: 'STEM',
      section: '11-A',
      medicalCondition: 'General health checkup',
      dateOfRecord: '2024-02-01',
      status: 'approved',
      createdAt: '2024-02-01T09:15:00Z',
    },
  ]

  const filteredRecords = allRecords.filter((record) => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Medical Records</h1>
          <p className="text-muted-foreground mt-1">View and manage all student medical records</p>
        </div>
        <Link href="/student/records/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Add Student Record
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <Input
                placeholder="Search by name or condition..."
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
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{record.medicalCondition}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.status === 'approved'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                            : record.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                              : record.status === 'draft'
                                ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                                : 'bg-red-500/20 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
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
                        <p className="text-xs font-medium">Date</p>
                        <p>{new Date(record.dateOfRecord).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Submitted</p>
                        <p>{new Date(record.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {record.status === 'draft' && (
                      <Link href={`/student/records/${record.id}/edit`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    )}
                    {record.status === 'approved' && (
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    )}
                    {record.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No records found.</p>
              <Link href="/student/records/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Create Your First Record
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
