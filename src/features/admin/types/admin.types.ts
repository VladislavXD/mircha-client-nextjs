/**
 * Admin Feature Types
 * Типы для административной панели
 */

// ============ Базовые типы ============

export type UserRole = 'REGULAR' | 'ADMIN';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============ Статистика ============

export interface AdminStats {
  users: {
    total: number;
    active: number;
    admins: number;
  };
  boards: {
    total: number;
    active: number;
  };
  threads: {
    total: number;
    today: number;
  };
  replies: {
    total: number;
    today: number;
  };
  media: {
    total: number;
    totalSize: number;
  };
}

// ============ Пользователи ============

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastSeen: string | null;
  provider: string | null;
  _count: {
    post: number;
    comments: number;
    likes: number;
  };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: PaginationMeta;
}

// ============ Доски ============

export interface AdminBoard {
  id: string;
  name: string;
  title: string;
  description: string | null;
  isNsfw: boolean;
  isActive: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  postsPerPage: number;
  threadsPerPage: number;
  bumpLimit: number;
  imageLimit: number;
  createdAt: string;
  _count: {
    threads: number;
  };
}

export interface AdminBoardsResponse {
  boards: AdminBoard[];
  pagination: PaginationMeta;
}

// ============ Треды ============

export interface AdminThread {
  id: string;
  title: string;
  content: string;
  boardId: string;
  createdAt: string;
  board: {
    name: string;
    title: string;
  };
  _count: {
    replies: number;
  };
}

export interface AdminThreadsResponse {
  threads: AdminThread[];
  pagination: PaginationMeta;
}

// ============ Ответы ============

export interface AdminReply {
  id: string;
  content: string;
  threadId: string;
  createdAt: string;
  thread: {
    title: string;
    board: {
      name: string;
    };
  };
}

export interface AdminRepliesResponse {
  replies: AdminReply[];
  pagination: PaginationMeta;
}

// ============ Медиафайлы ============

export interface AdminMediaFile {
  id: string;
  url: string;
  publicId: string;
  type: string;
  name: string | null;
  size: number;
  threadId: string | null;
  replyId: string | null;
  createdAt: string;
  thread?: {
    title: string;
  } | null;
}

export interface AdminMediaFilesResponse {
  mediaFiles: AdminMediaFile[];
  pagination: PaginationMeta;
}

// ============ Query параметры ============

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersQueryParams extends PaginationQueryParams {
  role?: 'regular' | 'admin';
}

// ============ DTO для создания/обновления ============

export interface UpdateUserRoleDto {
  role: 'regular' | 'admin';
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: 'regular' | 'admin';
  isActive?: boolean;
  password?: string;
}

export interface CreateBoardDto {
  name: string;
  title: string;
  description?: string;
  isNsfw?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  postsPerPage?: number;
  threadsPerPage?: number;
  bumpLimit?: number;
  imageLimit?: number;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  bumpLimit?: number;
  isActive?: boolean;
}

// ============ Response типы для мутаций ============

export interface AdminActionResponse {
  message: string;
}

export interface UpdatedUserResponse {
  id: string;
  username: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
    replies: number;
  };
}

export interface UpdatedUserRoleResponse {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface ToggledUserStatusResponse {
  id: string;
  isActive: boolean;
}
