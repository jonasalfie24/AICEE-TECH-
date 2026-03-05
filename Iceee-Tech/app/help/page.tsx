'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, AlertCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'student' | 'admin' | 'general'
}

const faqs: FAQItem[] = [
  {
    category: 'student',
    question: 'How do I submit my medical records?',
    answer:
      'Go to your Medical Records page and click "Submit Record". Fill in your medical condition details and submit. Your record will be reviewed by an administrator before approval.',
  },
  {
    category: 'student',
    question: 'What should I include in my medical record submission?',
    answer:
      'Include detailed information about your medical condition, any allergies, medications you take, and any special accommodations you might need at school. Be as specific as possible to help administrators make informed decisions.',
  },
  {
    category: 'student',
    question: 'How long does it take for my records to be approved?',
    answer:
      'Most records are reviewed within 1-2 business days. You will receive an email notification once your record has been approved or if revisions are needed.',
  },
  {
    category: 'student',
    question: 'Can I edit my medical records after submission?',
    answer:
      'Once submitted, you cannot directly edit records. If changes are needed, contact an administrator or resubmit an updated record with the corrections.',
  },
  {
    category: 'admin',
    question: 'How do I approve or reject user accounts?',
    answer:
      'Navigate to User Approvals from the admin dashboard. Review each pending application and click Approve or Reject. You can provide feedback when rejecting an application.',
  },
  {
    category: 'admin',
    question: 'What should I look for when reviewing medical records?',
    answer:
      'Check for completeness (all fields filled), clarity of medical conditions, and any special requirements. If information is missing or unclear, reject the record and ask the student to resubmit with more details.',
  },
  {
    category: 'admin',
    question: 'How do I access the audit logs?',
    answer:
      'Go to the Audit Logs page from the admin sidebar. You can search, filter by action type, and export logs as CSV for record-keeping and compliance purposes.',
  },
  {
    category: 'general',
    question: 'How do I change my password?',
    answer:
      'Go to Settings and select the Password tab. Enter your current password and the new password you want to set. Make sure your new password is at least 6 characters long.',
  },
  {
    category: 'general',
    question: 'How do I switch between light and dark mode?',
    answer:
      'Go to Settings and select the Theme tab. Click the button to toggle between light and dark mode. Your preference will be saved automatically.',
  },
  {
    category: 'general',
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. All passwords are encrypted, and sensitive data is protected. Only authorized administrators can access records. Never share your login credentials with anyone.',
  },
]

export default function HelpPage() {
  const { user } = useAuth()
  const [expandedId, setExpandedId] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'student' | 'admin' | 'general'>('all')

  if (!user) return null

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'student' && user.role === 'student') return faq.category !== 'admin'
    if (selectedCategory === 'admin' && user.role === 'admin') return faq.category !== 'student'
    return faq.category === selectedCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Help & Documentation</h1>
        <p className="text-muted-foreground mt-1">Find answers to common questions about Aicee-Tech</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">FAQ</h3>
                <p className="text-sm text-muted-foreground mt-1">Frequently asked questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Getting Started</h3>
                <p className="text-sm text-muted-foreground mt-1">New to Aicee-Tech?</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Support</h3>
                <p className="text-sm text-muted-foreground mt-1">Contact support team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              All Questions
            </Button>
            {user.role === 'student' && (
              <Button
                onClick={() => setSelectedCategory('student')}
                variant={selectedCategory === 'student' ? 'default' : 'outline'}
                size="sm"
              >
                Student Questions
              </Button>
            )}
            {user.role === 'admin' && (
              <Button
                onClick={() => setSelectedCategory('admin')}
                variant={selectedCategory === 'admin' ? 'default' : 'outline'}
                size="sm"
              >
                Admin Questions
              </Button>
            )}
            <Button
              onClick={() => setSelectedCategory('general')}
              variant={selectedCategory === 'general' ? 'default' : 'outline'}
              size="sm"
            >
              General
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg">
              <button
                onClick={() => setExpandedId(expandedId === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-left font-medium text-foreground">{faq.question}</h3>
                {expandedId === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {expandedId === index && (
                <div className="px-4 pb-4 border-t border-border text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.role === 'student' ? (
              <>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    Create Your Account
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    Sign up with your school email and complete your profile information.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </span>
                    Wait for Approval
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    An administrator will review your account and approve it. You'll receive an email notification.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </span>
                    Submit Medical Records
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    Go to Medical Records and submit information about any medical conditions or allergies.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    Review User Applications
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    Go to User Approvals to review and approve pending student accounts.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </span>
                    Review Medical Records
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    Go to Medical Records to review and approve student medical records submissions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </span>
                    Monitor System Activity
                  </h4>
                  <p className="text-muted-foreground ml-8">
                    Check Audit Logs to monitor all system activities and maintain compliance records.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card className="border-border bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Need More Help?</h3>
              <p className="text-muted-foreground mb-3">
                If you can't find the answer you're looking for, contact the support team at support@aicee-tech.edu or visit our help center.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
