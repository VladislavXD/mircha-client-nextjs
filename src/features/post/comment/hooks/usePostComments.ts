import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api';

interface CommentUser {
  id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
}

export interface CommentData {
  id: string;
  content: string;
  emojiUrls?: string[];
  user: CommentUser;
  userId: string;
  postId: string;
  createdAt: string;
  likeCount?: number;
  likedByUser?: boolean;
  replies?: CommentData[];
  replyToId?: string | null;
}

/**
 * Хук для получения комментариев поста
 */
export function usePostComments(postId: string, currentUserId?: string) {
  return useQuery<CommentData[]>({
    queryKey: ['comments', 'post', postId],
    queryFn: async () => {
      const url = currentUserId 
        ? `comment/post/${postId}?userId=${currentUserId}`
        : `comment/post/${postId}`;
      
      const response = await api.get<CommentData[]>(url);
      return response;
    },
    enabled: !!postId,
    staleTime: 30000, // 30 секунд
  });
}
