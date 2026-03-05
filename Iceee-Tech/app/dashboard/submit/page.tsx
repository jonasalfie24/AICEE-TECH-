'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const STRANDS = ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Arts & Design']
const SECTIONS = ['A', 'B', 'C', 'D', 'E']

export default function SubmitRecordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    strand: user?.strand || '',
    section: user?.section || '',
    studentName: user?.name || '',
    medicalCondition: '',
    recordDate: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.medicalCondition.trim()) {
        throw new Error('Medical condition is required')
      }

      const token = localStorage.getItem('aicee-token')
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit record')
      }

      router.push('/dashboard/records?success=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit Medical Record</h1>
        <p className="text-muted-foreground">
          Add a new medical record to your profile
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 md:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Strand & Section Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="strand" className="block text-sm font-medium text-foreground mb-2">
                Strand
              </label>
              <select
                id="strand"
                name="strand"
                value={formData.strand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select a strand</option>
                {STRANDS.map(strand => (
                  <option key={strand} value={strand}>{strand}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-foreground mb-2">
                Section
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select a section</option>
                {SECTIONS.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-foreground mb-2">
              Student Name
            </label>
            <Input
              id="studentName"
              name="studentName"
              placeholder="Enter full name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Record Date */}
          <div>
            <label htmlFor="recordDate" className="block text-sm font-medium text-foreground mb-2">
              Date of Record
            </label>
            <Input
              id="recordDate"
              name="recordDate"
              type="date"
              value={formData.recordDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Medical Condition */}
          <div>
            <label htmlFor="medicalCondition" className="block text-sm font-medium text-foreground mb-2">
              Medical Condition / Health Information
            </label>
            <textarea
              id="medicalCondition"
              name="medicalCondition"
              placeholder="Describe the medical condition, symptoms, or health information..."
              value={formData.medicalCondition}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide detailed information about the medical condition. Be as specific as possible for better documentation.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Record'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Section */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span>•</span>
            <span>Ensure all information is accurate and complete</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>Medical records will be reviewed and approved by administrators</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>You can edit submitted records before approval</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>Contact your administrator if you have questions</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
