/**
 * Типы для системы жалоб и обратной связи
 */

export enum FeedbackType {
  POST_REPORT = 'POST_REPORT',
  COMMENT_REPORT = 'COMMENT_REPORT',
  USER_REPORT = 'USER_REPORT',
  BUG_REPORT = 'BUG_REPORT',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  GENERAL_FEEDBACK = 'GENERAL_FEEDBACK'
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  VIOLENCE = 'VIOLENCE',
  NUDITY = 'NUDITY',
  FALSE_INFORMATION = 'FALSE_INFORMATION',
  SCAM = 'SCAM',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  OTHER = 'OTHER'
}

export interface CreateFeedbackDto {
  type: FeedbackType
  reason?: ReportReason
  targetId?: string // ID поста, комментария, пользователя
  targetType?: 'post' | 'comment' | 'user'
  subject: string
  description: string
  screenshot?: File
}

export interface Feedback {
  id: string
  userId: string
  userName: string
  userEmail?: string
  type: FeedbackType
  reason?: ReportReason
  targetId?: string
  targetType?: string
  subject: string
  description: string
  screenshotUrl?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected'
  createdAt: string
  updatedAt: string
}
