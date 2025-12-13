/**
 * Forum Types - TypeScript типы для форума
 */

export interface Board {
  id: string;
  name: string;
  title: string;
  description?: string;
  isNsfw: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  postsPerPage: number;
  threadsPerPage: number;
  bumpLimit: number;
  imageLimit: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    threads: number;
    replies?: number;
  };
}

export interface MediaFile {
  id: string;
  url: string;
  thumbnailUrl: string;
  publicId: string;
  fileType: string;
  mimeType: string;
  size: number;
  name?: string;
  width?: number;
  height?: number;
  type: 'image' | 'video';
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  _count?: {
    threadTags: number;
  };
}

export interface ThreadTag {
  id: string;
  threadId: string;
  tagId: string;
  tag: Tag;
}

export interface Thread {
  id: string;
  shortId: string;
  slug?: string;
  boardId: string;
  subject?: string;
  content: string;
  authorName?: string;
  posterHash: string;
  mediaFiles: MediaFile[];
  isPinned: boolean;
  isLocked: boolean;
  isClosed: boolean;
  isArchived: boolean;
  replyCount: number;
  imageCount: number;
  uniquePosters: number;
  lastBumpAt: string;
  lastReply?: string;
  createdAt: string;
  board?: {
    name: string;
    title: string;
  };
  threadTags?: ThreadTag[];
  replies?: Reply[];
  _count?: {
    replies: number;
  };
}

export interface Reply {
  id: string;
  shortId: string;
  threadId: string;
  content: string;
  authorName?: string;
  posterHash: string;
  postNumber: number;
  mediaFiles: MediaFile[];
  imageCount: number;
  replyTo: string[];
  quotedBy: string[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
  color?: string;
  description?: string;
  group?: string;
  _count?: {
    threads: number;
  };
}

export interface ForumStats {
  totalThreads: number;
  totalReplies: number;
  totalPosts: number;
  totalBoards: number;
}

// DTOs для создания
export interface CreateBoardDto {
  name: string;
  title: string;
  description?: string;
  isNsfw?: boolean;
  threadsPerPage?: number;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
  isNsfw?: boolean;
  threadsPerPage?: number;
}

export interface CreateThreadDto {
  subject: string;
  content: string;
  authorName?: string;
  tagIds?: string[];
  isPinned?: boolean;
}

export interface CreateReplyDto {
  content: string;
  authorName?: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
  color?: string;
}

// Response типы
export interface BoardThreadsResponse {
  board: {
    id: string;
    name: string;
    title: string;
    description?: string;
    isNsfw: boolean;
  };
  threads: Thread[];
  pagination: {
    page: number;
    threadsPerPage: number;
    totalThreads: number;
    totalPages: number;
  };
}

export interface LatestPost {
  id: string;
  shortId: string;
  content: string;
  authorName?: string;
  createdAt: string;
  thread: {
    id: string;
    shortId: string;
    subject?: string;
    board: {
      name: string;
      title: string;
    };
  };
}
