/**
 * Audit logging system for tracking system activities
 */

export type AuditAction =
  | 'user_login'
  | 'user_logout'
  | 'user_registered'
  | 'user_approved'
  | 'user_rejected'
  | 'record_submitted'
  | 'record_approved'
  | 'record_rejected'
  | 'profile_updated'
  | 'password_changed'
  | 'admin_login'
  | 'admin_logout'

export interface AuditLog {
  id: string
  action: AuditAction
  userId: string
  userEmail: string
  userName: string
  targetId?: string
  targetType?: string
  details: Record<string, any>
  timestamp: string
  ipAddress?: string
}

// Mock audit logs storage (in production, use a database)
const auditLogs: AuditLog[] = []

export const logAction = async (
  action: AuditAction,
  userId: string,
  userEmail: string,
  userName: string,
  details: Record<string, any> = {},
  targetId?: string,
  targetType?: string
): Promise<void> => {
  const auditLog: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    userId,
    userEmail,
    userName,
    targetId,
    targetType,
    details,
    timestamp: new Date().toISOString(),
  }

  auditLogs.push(auditLog)
  console.log('[AUDIT]', JSON.stringify(auditLog, null, 2))

  // In production, save to database
  // await db.auditLogs.create(auditLog)
}

export const getAuditLogs = (limit: number = 50): AuditLog[] => {
  return auditLogs.slice(-limit).reverse()
}

export const getAuditLogsByUser = (userId: string, limit: number = 20): AuditLog[] => {
  return auditLogs.filter((log) => log.userId === userId).slice(-limit).reverse()
}

export const getAuditLogsByAction = (action: AuditAction, limit: number = 20): AuditLog[] => {
  return auditLogs.filter((log) => log.action === action).slice(-limit).reverse()
}

export const clearAuditLogs = (): void => {
  auditLogs.length = 0
}
