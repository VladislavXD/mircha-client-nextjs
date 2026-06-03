/**
 * Хуки для работы с опросами (Polls)
 *
 * @module features/post/hooks/usePollQueries
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { pollService } from "../services/poll.service";
import type {
  PollFormatted,
  CreatePollDto,
  VoteDto,
} from "../types/poll.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const pollKeys = {
  all: ["polls"] as const,
  byPost: (postId: string) => ["polls", "post", postId] as const,
};

// ─── Context ──────────────────────────────────────────────────────────────────

type VoteContext = {
  previous?: PollFormatted;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Получение опроса по postId.
 *
 * Usage:
 * ```tsx
 * const { data: poll, isLoading } = usePollByPostId(post.id, !!post.poll)
 * ```
 */
export function usePollByPostId(postId: string, enabled = true) {
  return useQuery({
    queryKey: pollKeys.byPost(postId),
    queryFn: () => pollService.getPollByPostId(postId),
    enabled: enabled && Boolean(postId),
    staleTime: 30_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Создание опроса для поста.
 *
 * Usage:
 * ```tsx
 * const { mutate: createPoll } = useCreatePoll(post.id)
 * createPoll({ question: "...", options: ["A", "B"] })
 * ```
 */
export function useCreatePoll(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePollDto) => pollService.createPoll(postId, dto),

    onSuccess: (data) => {
      queryClient.setQueryData(pollKeys.byPost(postId), data);
    },

    onError: (error) => {
      toast.error("Не удалось создать опрос");
      console.error("Create poll error:", error);
    },
  });
}

/**
 * Голосование в опросе с оптимистичным обновлением.
 *
 * Optimistic Updates:
 * - Мгновенно обновляет счётчики и проценты в UI
 * - Помечает выбранные варианты как проголосованные
 * - Откат при ошибке
 *
 * Usage:
 * ```tsx
 * const { mutate: vote } = useVotePoll(poll.id, post.id)
 *
 * // Fire-and-forget (НЕ используй async/await!)
 * vote({ optionIds: [selectedOptionId] })
 * ```
 */
export function useVotePoll(pollId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation<PollFormatted, Error, VoteDto>({
    mutationFn: (dto) => pollService.vote(pollId, dto),

    // Оптимистичное обновление прямо в кеше постов
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Сохраняем снапшот для отката
      const previousPages = queryClient.getQueriesData({ queryKey: ["posts"] });

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: page.items.map((post: any) => {
                if (post.id !== postId || !post.poll) return post;

                const addedVotes = dto.optionIds.length;
                const totalVotes = post.poll.totalVotes + addedVotes;

                return {
                  ...post,
                  poll: {
                    ...post.poll,
                    totalVotes,
                    userVotedOptionIds: [
                      ...post.poll.userVotedOptionIds,
                      ...dto.optionIds,
                    ],
                    options: post.poll.options.map((opt: any) => {
                      const isVoted = dto.optionIds.includes(opt.id);
                      const newVotes = isVoted ? opt.votes + 1 : opt.votes;
                      return {
                        ...opt,
                        votes: newVotes,
                        percent: totalVotes > 0
                          ? Math.round((newVotes / totalVotes) * 100)
                          : 0,
                      };
                    }),
                  },
                };
              }),
            })),
          };
        }
      );

      return { previousPages };
    },

    onError: (_err, _dto, context: any) => {
      // Откатываем при ошибке
      context?.previousPages?.forEach(([queryKey, data]: any) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Не удалось проголосовать");
    },

    onSuccess: (updatedPoll) => {
      // Заменяем оптимистичные данные реальными с сервера
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: page.items.map((post: any) =>
                post.id === postId ? { ...post, poll: updatedPoll } : post
              ),
            })),
          };
        }
      );
    },
  });
}

export function useUnvotePoll(pollId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation<PollFormatted, Error, void>({
    mutationFn: () => pollService.unvote(pollId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPages = queryClient.getQueriesData({ queryKey: ["posts"] });

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: page.items.map((post: any) => {
                if (post.id !== postId || !post.poll) return post;

                const removedVotes = post.poll.userVotedOptionIds.length;
                const totalVotes = Math.max(0, post.poll.totalVotes - removedVotes);

                return {
                  ...post,
                  poll: {
                    ...post.poll,
                    totalVotes,
                    userVotedOptionIds: [],
                    options: post.poll.options.map((opt: any) => {
                      const wasVoted = post.poll.userVotedOptionIds.includes(opt.id);
                      const newVotes = wasVoted ? Math.max(0, opt.votes - 1) : opt.votes;
                      return {
                        ...opt,
                        votes: newVotes,
                        percent: totalVotes > 0
                          ? Math.round((newVotes / totalVotes) * 100)
                          : 0,
                      };
                    }),
                  },
                };
              }),
            })),
          };
        }
      );

      return { previousPages };
    },

    onError: (_err, _v, context: any) => {
      context?.previousPages?.forEach(([queryKey, data]: any) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Не удалось отменить голос");
    },

    onSuccess: (updatedPoll) => {
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: page.items.map((post: any) =>
                post.id === postId ? { ...post, poll: updatedPoll } : post
              ),
            })),
          };
        }
      );
    },
  });
}