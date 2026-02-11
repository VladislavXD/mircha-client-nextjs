/**
 * Forum Service - API для работы с форумом через NestJS backend
 */

import { api } from '@/src/api';
import type {
  Board,
  Thread,
  Reply,
  Category,
  Tag,
  ForumStats,
  BoardThreadsResponse,
  LatestPost,
  LatestThreadsResponse,
  CreateBoardDto,
  UpdateBoardDto,
  CreateThreadDto,
  CreateReplyDto,
  CreateCategoryDto,
  CreateTagDto,
} from '../types/forum.types';

/**
 * Сервис для работы с форумом
 */
export const forumService = {
  // ═══════════════════════════════════════════════════════════════
  // BOARDS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Получить все борды
   */
  async getBoards(): Promise<Board[]> {
    return api.get<Board[]>('forum/boards');
  },

  /**
   * Получить борд по имени
   */
  async getBoardByName(boardName: string): Promise<Board> {
    return api.get<Board>(`forum/boards/${boardName}`);
  },

  /**
   * Получить треды борда с пагинацией
   */
  async getBoardThreads(
    boardName: string,
    page: number = 1,
    tagSlug?: string,
  ): Promise<BoardThreadsResponse> {
    const params = new URLSearchParams({ page: page.toString() });
    if (tagSlug) params.set('tag', tagSlug);

    return api.get<BoardThreadsResponse>(
      `forum/boards/${boardName}/full?${params.toString()}`,
    );
  },

  /**
   * Создать новый борд
   */
  async createBoard(data: CreateBoardDto): Promise<Board> {
    return api.post<Board>('forum/boards', data);
  },

  /**
   * Обновить борд
   */
  async updateBoard(
    boardName: string,
    data: UpdateBoardDto,
  ): Promise<Board> {
    return api.put<Board>(`forum/boards/${boardName}`, data);
  },

  /**
   * Деактивировать борд
   */
  async deactivateBoard(boardName: string): Promise<Board> {
    return api.delete<Board>(`forum/boards/${boardName}`);
  },

  // ═══════════════════════════════════════════════════════════════
  // THREADS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Получить тред по ID
   */
  async getThread(boardName: string, threadId: string): Promise<Thread> {
    return api.get<Thread>(`forum/boards/${boardName}/threads/${threadId}`);
  },

  /**
   * Создать новый тред
   */
  async createThread(
    boardName: string,
    data: CreateThreadDto,
    files?: File[],
  ): Promise<Thread> {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('content', data.content);
    if (data.authorName) formData.append('authorName', data.authorName);
    if (data.isPinned) formData.append('isPinned', String(data.isPinned));
    if (data.tagIds) {
      data.tagIds.forEach((tagId) => formData.append('tagIds[]', tagId));
    }

    if (files) {
      files.forEach((file) => formData.append('images', file));
    }

    return api.post<Thread>(
      `forum/boards/${boardName}/threads`,
      formData,
    );
  },

  // ═══════════════════════════════════════════════════════════════
  // REPLIES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Создать ответ в треде
   */
  async createReply(
    boardName: string,
    threadId: string,
    data: CreateReplyDto,
    files?: File[],
  ): Promise<Reply> {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.authorName) formData.append('authorName', data.authorName);

    if (files) {
      files.forEach((file) => formData.append('images', file));
    }

    return api.post<Reply>(
      `forum/boards/${boardName}/threads/${threadId}/replies`,
      formData,
    );
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Получить все категории
   */
  async getCategories(): Promise<Category[]> {
    return api.get<Category[]>('forum/categories');
  },

  /**
   * Получить категорию по slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    return api.get<Category>(`forum/categories/${slug}`);
  },

  /**
   * Получить треды категории с пагинацией и фильтрацией
   */
  async getCategoryThreads(
    slug: string,
    page: number = 1,
    limit: number = 10,
    tagSlug?: string,
  ): Promise<{
    category: Category;
    threads: Thread[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (tagSlug) params.set('tag', tagSlug);

    return api.get<any>(
      `forum/categories/${slug}/threads?${params.toString()}`,
    );
  },

  /**
   * Создать тред в категории
   */
  async createThreadInCategory(
    slug: string,
    data: CreateThreadDto,
    files?: File[],
  ): Promise<Thread> {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('content', data.content);
    if (data.authorName) formData.append('authorName', data.authorName);
    if (data.isPinned) formData.append('isPinned', String(data.isPinned));
    if (data.tagIds) {
      data.tagIds.forEach((tagId) => formData.append('tagIds[]', tagId));
    }

    if (files) {
      files.forEach((file) => formData.append('images', file));
    }

    return api.post<Thread>(
      `forum/categories/${slug}/threads`,
      formData,
    );
  },

  /**
   * Получить тред категории по slug
   */
  async getThreadByCategoryAndSlug(
    categorySlug: string,
    threadSlug: string,
  ): Promise<Thread> {
    return api.get<Thread>(
      `forum/categories/${categorySlug}/threads/${threadSlug}`,
    );
  },

  /**
   * Создать ответ в треде категории
   */
  async createReplyInCategory(
    categorySlug: string,
    threadId: string,
    data: FormData,
  ): Promise<Reply> {
    return api.post<Reply>(
      `forum/categories/${categorySlug}/threads/${threadId}/replies`,
      data,
    );
  },

  /**
   * Создать категорию
   */
  async createCategory(data: FormData | CreateCategoryDto): Promise<Category> {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return api.post<Category>('forum/categories', data);
    } else {
      return api.post<Category>('forum/categories', data);
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Получить все теги
   */
  async getTags(): Promise<Tag[]> {
    return api.get<Tag[]>('forum/tags');
  },

  /**
   * Создать тег
   */
  async createTag(data: CreateTagDto): Promise<Tag> {
    return api.post<Tag>('forum/tags', data);
  },

  // ═══════════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Получить статистику форума
   */
  async getForumStats(): Promise<ForumStats> {
    return api.get<ForumStats>('forum/stats');
  },

  /**
   * Получить последние посты
   */
  async getLatestPosts(limit: number = 10): Promise<LatestPost[]> {
    return api.get<LatestPost[]>(`forum/posts/latest?limit=${limit}`);
  },

  /**
   * Получить последние треды с пагинацией
   */
  async getLatestThreads(
    page: number = 1,
    limit: number = 20,
    nsfw: string = '0',
  ): Promise<LatestThreadsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      nsfw,
    });

    return api.get<LatestThreadsResponse>(
      `forum/threads/latest?${params.toString()}`,
    );
  },
};
