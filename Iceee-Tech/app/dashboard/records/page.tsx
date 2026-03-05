'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface MedicalRecord {
  id: string
  strand: string
  section: string
  studentName: string
  medicalCondition: string
  recordDate: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
}

const STATUS_COLORS = {
  draft: { bg: 'bg-muted/30', text: 'text-muted-foreground', icon: '📝' },
  submitted: { bg: 'bg-accent/10', text: 'text-accent', icon: '⏳' },
  approved: { bg: 'bg-green-500/10', text: 'text-green-600', icon: '✅' },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive', icon: '❌' }
}

export default function RecordsPage() {
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const success = searchParams.get('success')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('aicee-token')
      const response = await fetch('/api/medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch records')
      }

      const data = await response.json()
      setRecords(data.records || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Medical Records</h1>
          <p className="text-muted-foreground">
            View and manage your submitted medical records
          </p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="bg-primary hover:bg-primary/90">
            + New Record
          </Button>
        </Link>
      </div>

      {/* Success Message */}
      {success === 'true' && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600">Record submitted successfully!</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && records.length === 0 && !error && (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Records Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't submitted any medical records yet.
          </p>
          <Link href="/dashboard/submit">
            <Button className="bg-primary hover:bg-primary/90">
              Submit Your First Record
            </Button>
          </Link>
        </Card>
      )}

      {/* Records List */}
      {!loading && records.length > 0 && (
        <div className="space-y-4">
          {records.map((record) => {
            const statusColor = STATUS_COLORS[record.status]
            return (
              <Card
                key={record.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{statusColor.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{record.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.strand} - Section {record.section}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {record.medicalCondition}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>📅 {new Date(record.recordDate).toLocaleDateString()}</span>
                      <span>📝 Submitted {new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                    {record.status === 'draft' && (
                      <Link href={`/dashboard/records/${record.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    )}
                    {record.status === 'approved' && (
                      <Button variant="ghost" size="sm">
                        Export PDF
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail Modal/Sidebar would go here */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedRecord.studentName}</h2>
                  <p className="text-muted-foreground">{selectedRecord.strand} - Section {selectedRecord.section}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Medical Condition</p>
                  <p className="text-foreground whitespace-pre-wrap">{selectedRecord.medicalCondition}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Record Date</p>
                    <p className="text-foreground">{new Date(selectedRecord.recordDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedRecord.status].bg} ${STATUS_COLORS[selectedRecord.status].text}`}>
                      {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                {selectedRecord.status === 'approved' && (
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
