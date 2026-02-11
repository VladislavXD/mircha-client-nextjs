import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { forumService } from '../services/forum.service';
import type {
  Board,
  Thread,
  Reply,
  Category,
  Tag,
  ForumStats,
  BoardThreadsResponse,
  LatestPost,
  CreateBoardDto,
  UpdateBoardDto,
  CreateThreadDto,
  CreateReplyDto,
  CreateCategoryDto,
  CreateTagDto,
} from '../types/forum.types';

// ═══════════════════════════════════════════════════════════════
// Query Keys
// ═══════════════════════════════════════════════════════════════

export const forumKeys = {
  all: ['forum'] as const,
  boards: () => [...forumKeys.all, 'boards'] as const,
  board: (boardName: string) => [...forumKeys.boards(), boardName] as const,
  boardThreads: (boardName: string, page: number, tag?: string) =>
    [...forumKeys.board(boardName), 'threads', { page, tag }] as const,
  thread: (boardName: string, threadId: string) =>
    [...forumKeys.board(boardName), 'thread', threadId] as const,
  categories: () => [...forumKeys.all, 'categories'] as const,
  category: (slug: string) => [...forumKeys.categories(), slug] as const,
  tags: () => [...forumKeys.all, 'tags'] as const,
  stats: () => [...forumKeys.all, 'stats'] as const,
  latestPosts: (limit: number) => [...forumKeys.all, 'latest', limit] as const,
  latestThreads: (page: number, limit: number, nsfw: string) =>
    [...forumKeys.all, 'latestThreads', { page, limit, nsfw }] as const,
};

// ═══════════════════════════════════════════════════════════════
// BOARDS HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Получение всех бордов
 */
export function useBoards(
  options?: Omit<UseQueryOptions<Board[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Board[]>({
    queryKey: forumKeys.boards(),
    queryFn: () => forumService.getBoards(),
    staleTime: 5 * 60 * 1000, // 5 минут
    ...options,
  });
}

/**
 * Получение борда по имени
 */
export function useBoardByName(
  boardName: string,
  options?: Omit<UseQueryOptions<Board>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Board>({
    queryKey: forumKeys.board(boardName),
    queryFn: () => forumService.getBoardByName(boardName),
    enabled: !!boardName,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Получение тредов борда
 */
export function useBoardThreads(
  boardName: string,
  page: number = 1,
  tagSlug?: string,
  options?: Omit<UseQueryOptions<BoardThreadsResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<BoardThreadsResponse>({
    queryKey: forumKeys.boardThreads(boardName, page, tagSlug),
    queryFn: () => forumService.getBoardThreads(boardName, page, tagSlug),
    enabled: !!boardName,
    staleTime: 2 * 60 * 1000, // 2 минуты
    ...options,
  });
}

/**
 * Создание борда
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardDto) => forumService.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.boards() });
    },
  });
}

/**
 * Обновление борда
 */
export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardName, data }: { boardName: string; data: UpdateBoardDto }) =>
      forumService.updateBoard(boardName, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.board(variables.boardName) });
      queryClient.invalidateQueries({ queryKey: forumKeys.boards() });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// THREADS HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Получение треда
 */
export function useThread(
  boardName: string,
  threadId: string,
  options?: Omit<UseQueryOptions<Thread>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Thread>({
    queryKey: forumKeys.thread(boardName, threadId),
    queryFn: () => forumService.getThread(boardName, threadId),
    enabled: !!boardName && !!threadId,
    staleTime: 1 * 60 * 1000, // 1 минута
    ...options,
  });
}

/**
 * Создание треда
 */
export function useCreateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardName,
      data,
      files,
    }: {
      boardName: string;
      data: CreateThreadDto;
      files?: File[];
    }) => forumService.createThread(boardName, data, files),
    onSuccess: (_, variables) => {
      // Инвалидируем список тредов борда
      queryClient.invalidateQueries({
        queryKey: forumKeys.board(variables.boardName),
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// REPLIES HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Создание ответа
 */
export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardName,
      threadId,
      data,
      files,
    }: {
      boardName: string;
      threadId: string;
      data: CreateReplyDto;
      files?: File[];
    }) => forumService.createReply(boardName, threadId, data, files),
    onSuccess: (_, variables) => {
      // Инвалидируем тред для обновления replies
      queryClient.invalidateQueries({
        queryKey: forumKeys.thread(variables.boardName, variables.threadId),
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// CATEGORIES HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Получение всех категорий
 */
export function useCategories(
  options?: Omit<UseQueryOptions<Category[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Category[]>({
    queryKey: forumKeys.categories(),
    queryFn: () => forumService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 минут
    ...options,
  });
}

/**
 * Получение категории по slug
 */
export function useCategoryBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Category>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Category>({
    queryKey: forumKeys.category(slug),
    queryFn: () => forumService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Получение тредов категории с пагинацией и фильтром по тегу
 */
export function useCategoryThreads(
  slug: string,
  page: number = 1,
  limit: number = 10,
  tagSlug?: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...forumKeys.category(slug), 'threads', { page, limit, tag: tagSlug }],
    queryFn: () => forumService.getCategoryThreads(slug, page, limit, tagSlug),
    enabled: !!slug,
    staleTime: 1 * 60 * 1000, // 1 минута
    ...options,
  });
}

/**
 * Создание треда в категории
 */
export function useCreateThreadInCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data,
      files,
    }: {
      slug: string;
      data: CreateThreadDto;
      files?: File[];
    }) => forumService.createThreadInCategory(slug, data, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...forumKeys.category(variables.slug), 'threads'],
      });
    },
  });
}

/**
 * Получение треда категории по slug
 */
export function useThreadByCategoryAndSlug(
  categorySlug: string,
  threadSlug: string,
  options?: Omit<UseQueryOptions<Thread>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Thread>({
    queryKey: [...forumKeys.category(categorySlug), 'thread', threadSlug],
    queryFn: () => forumService.getThreadByCategoryAndSlug(categorySlug, threadSlug),
    enabled: !!categorySlug && !!threadSlug,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

/**
 * Создание ответа в треде категории
 */
export function useCreateReplyInCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categorySlug,
      threadId,
      formData,
    }: {
      categorySlug: string;
      threadId: string;
      formData: FormData;
    }) => forumService.createReplyInCategory(categorySlug, threadId, formData),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш треда чтобы обновить список ответов
      queryClient.invalidateQueries({
        queryKey: [...forumKeys.category(variables.categorySlug), 'thread'],
      });
    },
  });
}

/**
 * Создание категории
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | CreateCategoryDto) => forumService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.categories() });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// TAGS HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Получение всех тегов
 */
export function useTags(
  options?: Omit<UseQueryOptions<Tag[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Tag[]>({
    queryKey: forumKeys.tags(),
    queryFn: () => forumService.getTags(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Создание тега
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDto) => forumService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.tags() });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// STATS HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Получение статистики форума
 */
export function useForumStats(
  options?: Omit<UseQueryOptions<ForumStats>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ForumStats>({
    queryKey: forumKeys.stats(),
    queryFn: () => forumService.getForumStats(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Получение последних постов
 */
export function useLatestPosts(
  limit: number = 10,
  options?: Omit<UseQueryOptions<LatestPost[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<LatestPost[]>({
    queryKey: forumKeys.latestPosts(limit),
    queryFn: () => forumService.getLatestPosts(limit),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Получение последних тредов с пагинацией
 */
export function useLatestThreads(
  page: number = 1,
  limit: number = 20,
  nsfw: string = '0',
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: forumKeys.latestThreads(page, limit, nsfw),
    queryFn: () => forumService.getLatestThreads(page, limit, nsfw),
    staleTime: 2 * 60 * 1000, // 2 минуты
    ...options,
  });
}
