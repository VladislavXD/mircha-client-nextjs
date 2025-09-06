/**
 * Типы для админ-панели
 */

// Основные сущности
export interface AdminUser {
  id: string
  username: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
    replies: number
  }
}

export interface AdminBoard {
  id: string
  name: string
  title: string
  description: string
  shortName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    threads: number
  }
}

export interface AdminThread {
  id: string
  shortId: string
  title: string
  content: string
  author: string
  boardName: string
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
  replyCount: number
  imageCount: number
  board?: AdminBoard
  _count?: {
    replies: number
  }
}

export interface AdminReply {
  id: string
  shortId: string
  content: string
  author: string
  threadId: string
  threadShortId: string
  replyTo: string[]
  quotedBy: string[]
  createdAt: string
  updatedAt: string
  imageCount: number
  thread?: AdminThread
}

export interface AdminMediaFile {
  id: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  filename: string
  size: number
  cloudinaryId: string
  threadId?: string
  replyId?: string
  createdAt: string
  thread?: AdminThread
  reply?: AdminReply
}

// Перечисления
export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER'
export type MediaType = 'IMAGE' | 'VIDEO'

// Статистика
export interface AdminStats {
  users: {
    total: number
    active: number
    admins: number
    moderators: number
  }
  boards: {
    total: number
    active: number
  }
  threads: {
    total: number
    today: number
  }
  replies: {
    total: number
    today: number
  }
  media: {
    total: number
    totalSize: number
  }
}

// Фильтры
export interface BaseFilter {
  search?: string
  page?: number
  limit?: number
}

export interface UsersFilter extends BaseFilter {
  role?: UserRole | ''
  isActive?: boolean | ''
}

export interface BoardsFilter extends BaseFilter {
  isActive?: boolean | ''
}

export interface ThreadsFilter extends BaseFilter {
  boardName?: string
  author?: string
  isPinned?: boolean | ''
  isLocked?: boolean | ''
}

export interface RepliesFilter extends BaseFilter {
  threadShortId?: string
  author?: string
}

export interface MediaFilter extends BaseFilter {
  type?: MediaType | ''
  threadShortId?: string
  replyShortId?: string
}

// Запросы на создание/обновление
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role?: UserRole
  isActive?: boolean
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  password?: string
  role?: UserRole
  isActive?: boolean
}

export interface CreateBoardRequest {
  name: string
  title: string
  description?: string
  isNsfw?: boolean
  maxFileSize?: number
  allowedFileTypes?: string[]
  postsPerPage?: number
  threadsPerPage?: number
  bumpLimit?: number
  imageLimit?: number
}

export interface UpdateBoardRequest {
  name?: string
  title?: string
  description?: string
  shortName?: string
  isActive?: boolean
}

export interface UpdateThreadRequest {
  title?: string
  content?: string
  isPinned?: boolean
  isLocked?: boolean
}

export interface UpdateReplyRequest {
  content?: string
}

// Ответы API с пагинацией
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export interface UsersResponse extends PaginatedResponse<AdminUser> {
  users: AdminUser[]
}

export interface BoardsResponse extends PaginatedResponse<AdminBoard> {
  boards: AdminBoard[]
}

export interface ThreadsResponse extends PaginatedResponse<AdminThread> {
  threads: AdminThread[]
}

export interface RepliesResponse extends PaginatedResponse<AdminReply> {
  replies: AdminReply[]
}

export interface MediaResponse extends PaginatedResponse<AdminMediaFile> {
  media: AdminMediaFile[]
}

// Состояния UI
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isValid: boolean
  isDirty: boolean
}

export interface TableState {
  sortBy?: string
  sortOrder: 'asc' | 'desc'
  selectedIds: string[]
  selectAll: boolean
}

export interface ModalState {
  isOpen: boolean
  type: 'create' | 'edit' | 'delete' | 'view'
  data?: any
}

// Конфигурация колонок таблицы
export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
}

// Действия для bulk операций
export interface BulkAction {
  id: string
  label: string
  icon?: React.ComponentType
  variant: 'primary' | 'secondary' | 'danger'
  confirm?: boolean
  confirmMessage?: string
}

// Опции для селектов
export interface SelectOption {
  value: string | number | boolean
  label: string
  disabled?: boolean
}

// Навигация админки
export interface AdminNavItem {
  id: string
  label: string
  icon?: React.ComponentType
  href?: string
  children?: AdminNavItem[]
  permission?: UserRole[]
}

// Уведомления
export interface AdminNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Настройки админки
export interface AdminSettings {
  theme: 'light' | 'dark'
  language: 'ru' | 'en'
  itemsPerPage: number
  autoRefresh: boolean
  refreshInterval: number
}

// Экспорт всех типов для удобства
export type {
  // Re-export для совместимости
  AdminUser as User,
  AdminBoard as Board,
  AdminThread as Thread,
  AdminReply as Reply,
  AdminMediaFile as MediaFile,
}
