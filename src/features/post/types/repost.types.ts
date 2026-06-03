import { Post } from "./post.types";

export interface CreateRepostDto {
  postId: string;
  comment?: string;
}

export interface Repost {
  id: string;
  userId: string;
  postId: string;
  repostComment?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  post: Post;
}

export interface RepostResponse {
  items: Repost[];
  nextCursor: string | null;
  hasMore: boolean;
}
