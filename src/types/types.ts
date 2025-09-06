export type User = {
    id: string
    email: string
    password?: string
    name?: string
    role?: 'ADMIN' | 'MODERATOR' | 'USER'
    avatarUrl?: string
    avatarFrameUrl?: string
    backgroundUrl?: string
    usernameFrameUrl?: string
    dateOfBirth?: Date
    createdAt: Date
    updatedAt: Date
    bio?: string
    location?: string
    provider?: string
    googleId?: string
    post: Post[]
    following: Follows[]
    followers: Follows[]
    likes: Like[]
    comments: Comment[]
    isFolow?: boolean
    followersCount?: number
    
  }

  // Forum types
  export type MediaFile = {
    id: string
    url: string
    publicId: string
    name?: string
    size?: number
    type: 'image' | 'video'
    mimeType: string
    thumbnailUrl?: string
    width?: number
    height?: number
    duration?: number
    threadId?: string
    replyId?: string
    createdAt: Date
  }

  export type Board = {
    id: string
    name: string
    title: string
    description?: string
    isNsfw: boolean
    maxFileSize: number
    allowedFileTypes: string[]
    postsPerPage: number
    threadsPerPage: number
    bumpLimit: number
    imageLimit: number
    isActive: boolean
    createdAt: Date
    _count?: {
      threads: number
      replies: number
    }
  }

  export type Thread = {
    id: string
    shortId: string
    boardId: string
    subject?: string
    content: string
    authorName?: string
    authorTrip?: string
    posterHash: string
    // Новые поля для множественных медиафайлов
    mediaFiles?: MediaFile[]
    // Старые поля для обратной совместимости
    imageUrl?: string
    imagePublicId?: string
    imageName?: string
    imageSize?: number
    thumbnailUrl?: string
    isPinned: boolean
    isLocked: boolean
    isClosed: boolean
    isArchived: boolean
    replyCount: number
    imageCount: number
    uniquePosters: number
    lastBumpAt: Date
    createdAt: Date
    lastReply?: Date
    board?: Board
    replies?: Reply[]
    _count?: {
      replies: number
    }
  }

  export type Reply = {
    id: string
    shortId: string
    threadId: string
    content: string
    authorName?: string
    authorTrip?: string
    posterHash: string
    postNumber: number
    // Новые поля для множественных медиафайлов
    mediaFiles?: MediaFile[]
    // Старые поля для обратной совместимости
    imageUrl?: string
    imagePublicId?: string
    imageName?: string
    imageSize?: number
    thumbnailUrl?: string
    replyTo: string[]  // Массив shortId вместо номеров
    quotedBy: string[] // Массив shortId вместо номеров
    isDeleted: boolean
    deletedAt?: Date
    createdAt: Date
    thread?: Thread
  }
  
  export type Follows = {
    id: string
    follower: User
    followerId: string
    following: User
    followingId: string
  }
  
  export type Post = {
    id: string
    content: string
    imageUrl?: string // URL изображения поста (опционально)
    emojiUrls?: string[] // Массив URL emoji (опционально)
    author: User
    authorId: string
    likes: Like[]
    comments: Comment[]
    likeByUser: boolean
    createdAt: Date
    updatedAt: Date
    views: string[]
  }
  
  export type Like = {
    id: string
    user: User
    userId: string
    post: Post
    postId: string
  }
  
  export type Comment = {
    id: string
    content: string
    user: User
    userId: string
    post: Post
    postId: string
  }