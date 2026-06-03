export enum NotificationType {
  LIKE_POST = "LIKE_POST",
  LIKE_COMMENT = "LIKE_COMMENT",
  NEW_COMMENT = "NEW_COMMENT",
  REPLY_COMMENT = "REPLY_COMMENT",
  NEW_FOLLOWER = "NEW_FOLLOWER",
  NEW_MESSAGE = "NEW_MESSAGE",
  POST_MENTION = "POST_MENTION",
  COMMENT_MENTION = "COMMENT_MENTION",
  SYSTEM = "SYSTEM",
}

export interface INotificationIssuer {
  id: string;
  name: string;
  avatar?: string | null;
  slug?: string | null;
}

export interface INotification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  message: string | null;
  userId: string;
  issuerId: string | null;
  issuer?: INotificationIssuer | null;
  postId?: string | null;
  commentId?: string | null;
  chatId?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationsResponse {
  data: INotification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
