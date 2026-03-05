'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function SubmitRecordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    strand: 'STEM',
    section: '',
    studentName: '',
    medicalCondition: '',
    dateOfRecord: new Date().toISOString().split('T')[0],
  })

  if (!user) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (asDraft: boolean = false) => {
    setIsLoading(true)
    try {
      // API call to save record would go here
      console.log('Saving record:', { ...formData, isDraft: asDraft })
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push('/student/records')
    } finally {
      setIsLoading(false)
    }
  }

  const strands = ['STEM', 'ABM', 'HUMSS', 'TVL', 'GAS']

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/student/records">
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Student Medical Record</h1>
          <p className="text-muted-foreground mt-1">Fill in the student details and medical information</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Medical Record Information</CardTitle>
          <CardDescription>Please fill in all required fields</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Strand and Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Strand <span className="text-destructive">*</span>
                </label>
                <select
                  name="strand"
                  value={formData.strand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                  required
                >
                  {strands.map((strand) => (
                    <option key={strand} value={strand}>
                      {strand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Section <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  name="section"
                  placeholder="e.g., 11-A"
                  value={formData.section}
                  onChange={handleChange}
                  className="bg-input border-border"
                  required
                />
              </div>
            </div>

            {/* Student Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Student Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                name="studentName"
                placeholder="e.g., Maria Santos"
                value={formData.studentName}
                onChange={handleChange}
                className="bg-input border-border"
                required
              />
              <p className="text-xs text-muted-foreground">Enter the full name of the student</p>
            </div>

            {/* Medical Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Medical Condition <span className="text-destructive">*</span>
              </label>
              <textarea
                name="medicalCondition"
                placeholder="Describe the medical condition, symptoms, or health concerns..."
                value={formData.medicalCondition}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>

            {/* Date of Record */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date of Record <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                name="dateOfRecord"
                value={formData.dateOfRecord}
                onChange={handleChange}
                className="bg-input border-border"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? 'Submitting...' : 'Submit Record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
