/**
 * Email service for sending notifications to users
 * This is a mock implementation - in production, integrate with SendGrid, AWS SES, or similar
 */

export interface EmailTemplate {
  subject: string
  template: string
  variables: Record<string, string | number>
}

// Account approval email
export const accountApprovalEmail = (firstName: string, email: string): EmailTemplate => ({
  subject: 'Account Approved - Welcome to Aicee-Tech',
  template: `
    <h2>Welcome to Aicee-Tech!</h2>
    <p>Dear ${firstName},</p>
    <p>Your account has been approved. You can now log in to the system and access all features.</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Click here to login</a></p>
    <p>Best regards,<br>Aicee-Tech Admin Team</p>
  `,
  variables: { firstName, email }
})

// Account rejection email
export const accountRejectionEmail = (firstName: string, email: string, reason: string): EmailTemplate => ({
  subject: 'Account Application Result',
  template: `
    <h2>Account Application Status</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for applying. Unfortunately, your application has been rejected for the following reason:</p>
    <p><strong>${reason}</strong></p>
    <p>If you have questions, please contact the admin team.</p>
    <p>Best regards,<br>Aicee-Tech Admin Team</p>
  `,
  variables: { firstName, email, reason }
})

// Medical record approved email
export const recordApprovedEmail = (studentName: string, email: string): EmailTemplate => ({
  subject: 'Medical Record Approved',
  template: `
    <h2>Medical Record Approved</h2>
    <p>Dear ${studentName},</p>
    <p>Your medical record has been reviewed and approved by the admin team.</p>
    <p>You can now view your approved records in your dashboard.</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/records">View Your Records</a></p>
    <p>Best regards,<br>Aicee-Tech Admin Team</p>
  `,
  variables: { studentName, email }
})

// Medical record rejected email
export const recordRejectedEmail = (studentName: string, email: string): EmailTemplate => ({
  subject: 'Medical Record Review Result',
  template: `
    <h2>Medical Record Review Result</h2>
    <p>Dear ${studentName},</p>
    <p>Your medical record has been reviewed. Please check your dashboard for feedback and resubmit if needed.</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/records">Check Feedback</a></p>
    <p>Best regards,<br>Aicee-Tech Admin Team</p>
  `,
  variables: { studentName, email }
})

// Send email notification
export const sendEmailNotification = async (
  to: string,
  template: EmailTemplate
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In production, integrate with actual email service
    console.log(`[EMAIL] Sending email to: ${to}`)
    console.log(`[EMAIL] Subject: ${template.subject}`)
    console.log(`[EMAIL] Template:`, template.template)

    // Mock implementation - simulate email sending
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email'
    console.error('[EMAIL ERROR]', errorMessage)
    return { success: false, error: errorMessage }
  }
}
