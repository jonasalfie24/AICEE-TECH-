'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PendingApprovalPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-foreground mb-2">Account Pending Approval</h1>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Our administrators will review your details and approve your account shortly.
          </p>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-foreground mb-3 font-medium">What happens next:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Admin reviews your registration details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>We'll send you an approval notification via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>You can then access the full platform</span>
              </li>
            </ul>
          </div>

          {/* Estimated Time */}
          <div className="bg-muted/30 rounded-lg p-4 mb-8">
            <p className="text-sm text-foreground">
              <span className="font-medium">Estimated approval time:</span> 24-48 hours
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Back to Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Sign In With Different Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
