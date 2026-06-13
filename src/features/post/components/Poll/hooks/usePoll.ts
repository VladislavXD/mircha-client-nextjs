import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { pollService } from "../services/poll.service";
import type {
  PollFormatted,
  CreatePollDto,
  VoteDto,
} from "../types/poll.types";
import { postKeys } from "../../../hooks/usePostQueries";

export const pollKeys = {
  all: ["polls"] as const,
  byPost: (postId: string) => ["polls", "post", postId] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyPollUpdate(
  post: any,
  postId: string,
  updater: (poll: any) => any
): any {
  // Обычный пост
  if (post.id === postId && post.poll) {
    return { ...post, poll: updater(post.poll) };
  }
  // Оригинальный пост внутри репоста
  if (post.originalPost?.id === postId && post.originalPost?.poll) {
    return {
      ...post,
      originalPost: {
        ...post.originalPost,
        poll: updater(post.originalPost.poll),
      },
    };
  }
  return post;
}

function updatePagesCache(
  queryClient: any,
  postId: string,
  updater: (poll: any) => any
) {
  // 1. Одиночный пост (репост читает отсюда)
  queryClient.setQueryData(
    postKeys.detail(postId),
    (old: any) => {
      if (!old) return old;
      return applyPollUpdate(old, postId, updater);
    }
  );

  // 2. Пост-обёртка в ленте (репост лежит внутри originalPost)
  // Нужен ID поста-обёртки, а не оригинала
  queryClient.setQueriesData(
    { queryKey: postKeys.lists() },
    (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          items: page.items.map((post: any) =>
            applyPollUpdate(post, postId, updater)
          ),
        })),
      };
    }
  );
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function usePollByPostId(postId: string, enabled = true) {
  return useQuery({
    queryKey: pollKeys.byPost(postId),
    queryFn: () => pollService.getPollByPostId(postId),
    enabled: enabled && Boolean(postId),
    staleTime: 30_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

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

export function useVotePoll(pollId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation<PollFormatted, Error, VoteDto>({
    mutationFn: (dto) => pollService.vote(pollId, dto),

    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPages = queryClient.getQueriesData({ queryKey: ["posts"] });

      updatePagesCache(queryClient, postId, (poll) => {
        const addedVotes = dto.optionIds.length;
        const totalVotes = poll.totalVotes + addedVotes;
        return {
          ...poll,
          totalVotes,
          userVotedOptionIds: [...poll.userVotedOptionIds, ...dto.optionIds],
          options: poll.options.map((opt: any) => {
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
        };
      });

      return { previousPages };
    },

    onError: (_err, _dto, context: any) => {
      context?.previousPages?.forEach(([queryKey, data]: any) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Не удалось проголосовать");
    },

    onSuccess: (updatedPoll) => {
      updatePagesCache(queryClient, postId, () => updatedPoll);
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

      updatePagesCache(queryClient, postId, (poll) => {
        const removedVotes = poll.userVotedOptionIds.length;
        const totalVotes = Math.max(0, poll.totalVotes - removedVotes);
        return {
          ...poll,
          totalVotes,
          userVotedOptionIds: [],
          options: poll.options.map((opt: any) => {
            const wasVoted = poll.userVotedOptionIds.includes(opt.id);
            const newVotes = wasVoted ? Math.max(0, opt.votes - 1) : opt.votes;
            return {
              ...opt,
              votes: newVotes,
              percent: totalVotes > 0
                ? Math.round((newVotes / totalVotes) * 100)
                : 0,
            };
          }),
        };
      });

      return { previousPages };
    },

    onError: (_err, _v, context: any) => {
      context?.previousPages?.forEach(([queryKey, data]: any) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Не удалось отменить голос");
    },

    onSuccess: (updatedPoll) => {
      updatePagesCache(queryClient, postId, () => updatedPoll);
    },
  });
}