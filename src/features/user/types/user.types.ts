import { Follows, Like, Post, Comment as UserComment } from "@/src/types/types";

/**
 * Роли пользователя в системе.
 */
export enum UserRole {
  Regular = "REGULAR",
  Admin = "ADMIN",
}

/**
 * Методы аутентификации.
 */
export enum AuthMethod {
  Credentials = "CREDENTIALS",
  Google = "GOOGLE",
  Yandex = "YANDEX",
}

/**
 * Интерфейс для аккаунта пользователя.
 */
export interface IAccount {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  provider: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  userId: string;
}

/**
 * Интерфейс для пользователя.
 */
export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  method: AuthMethod;
  accounts: IAccount[];
  status?: string;
  username?: string;
  avatarFrameUrl?: string;
  backgroundUrl?: string;
  usernameFrameUrl?: string;
  dateOfBirth?: Date;
  location?: string;
  bio?: string;
  post: Post[];
  following: Follows[];
  followers: Follows[];
  likes: Like[];
  comments: UserComment[];
  isFollow?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  _count?: {
    followers?: number;
    following?: number;
    post?: number;
  };
}