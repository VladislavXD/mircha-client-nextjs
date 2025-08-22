export type User = {
    id: string
    email: string
    password: string
    name?: string
    avatarUrl?: string
    avatarFrameUrl?: string
    backgroundUrl?: string
    usernameFrameUrl?: string
    dateOfBirth?: Date
    createdAt: Date
    updatedAt: Date
    bio?: string
    location?: string
    post: Post[]
    following: Follows[]
    followers: Follows[]
    likes: Like[]
    comments: Comment[]
    isFolow?: boolean
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