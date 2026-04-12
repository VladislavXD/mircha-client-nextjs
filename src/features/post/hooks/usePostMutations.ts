import type { Post, PostsResponse, UpdatePostDto, User } from "../types";

import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { postService } from "../services/post.service";

import { postKeys } from "./usePostQueries";

/**
 * Хук для создания поста с оптимистичным обновлением.
 *
 * @param options - Опции мутации
 * @returns Мутация создания поста
 */
type CreatePostContext = {
  previousPosts?: InfiniteData<PostsResponse, unknown>;
};
type DeletePostContext = {
  previousPosts?: InfiniteData<PostsResponse, unknown>;
  deletedPost?: Post;
};

export function useCreatePost(
  options?: Omit<
    UseMutationOptions<Post, Error, FormData, CreatePostContext>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, FormData, CreatePostContext>({
    mutationFn: async (formData: FormData) => {
      return postService.createPost(formData);
    },

    onMutate: async (formData: FormData) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Сохраняем предыдущее состояние (теперь это InfiniteData<PostsResponse>)
      const previousPosts = queryClient.getQueryData<
        InfiniteData<PostsResponse, unknown>
      >(postKeys.lists());

      // Получаем текущего пользователя из кэша
      const currentUser = queryClient.getQueryData<User>(["profile"]);

      // Создаём временный пост (без оптимистичного обновления для упрощения)
      // Оптимистичное обновление будет добавлено после успешного ответа

      return { previousPosts };
    },

    onSuccess: (newPost) => {
      // Добавляем новый пост в начало первой страницы
      queryClient.setQueryData<InfiniteData<PostsResponse, unknown>>(
        postKeys.lists(),
        (old) => {
          if (!old) {
            // Если данных нет, создаём новую структуру
            return {
              pages: [
                {
                  items: [newPost],
                  nextCursor: null,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          // Добавляем новый пост в начало первой страницы
          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [newPost, ...firstPage.items],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },

    onError: (error, _, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }

      toast.error(error.message || "Не удалось создать пост.");
      console.error("Create post error:", error);
    },

    ...options,
  });
}

/**
 * Хук для обновления поста.
 *
 * @param options - Опции мутации
 * @returns Мутация обновления поста
 */
export function useUpdatePost(
  options?: Omit<
    UseMutationOptions<Post, Error, { id: string; data: UpdatePostDto }>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, { id: string; data: UpdatePostDto }>({
    mutationFn: async ({ id, data }) => {
      // Отправляем JSON вместо FormData
      return postService.updatePost(id, data);
    },

    onSuccess: (updatedPost) => {
      // Обновляем пост во всех страницах infinite query
      queryClient.setQueryData<InfiniteData<PostsResponse, unknown>>(
        postKeys.lists(),
        (old) => {
          if (!old) {
            return {
              pages: [
                {
                  items: [updatedPost],
                  nextCursor: null,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          // Обновляем пост на всех страницах где он встречается
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            })),
          };
        },
      );

      // Обновляем детальный кэш поста (если он есть)
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);

      toast.success("Пост обновлён!");
    },

    onError: (error) => {
      toast.error(error.message || "Не удалось обновить пост.");
      console.error("Update post error:", error);
    },

    ...options,
  });
}

/**
 * Хук для удаления поста с оптимистичным обновлением.
 *
 * @param options - Опции мутации
 * @returns Мутация удаления поста
 */
export function useDeletePost(
  options?: Omit<
    UseMutationOptions<void, Error, string, DeletePostContext>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeletePostContext>({
    mutationFn: (id: string) => postService.deletePost(id),

    onMutate: async (postId) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Сохраняем предыдущее состояние
      const previousPosts = queryClient.getQueryData<
        InfiniteData<PostsResponse, unknown>
      >(postKeys.lists());

      // Сохраняем удаляемый пост для возможного восстановления
      const deletedPost = previousPosts?.pages
        .flatMap((page) => page.items)
        .find((post) => post.id === postId);

      // Оптимистично удаляем пост из всех страниц
      queryClient.setQueryData<InfiniteData<PostsResponse, unknown>>(
        postKeys.lists(),
        (old) => {
          if (!old) {
            return {
              pages: [
                {
                  items: [],
                  nextCursor: null,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((post) => post.id !== postId),
            })),
          };
        },
      );

      return { previousPosts, deletedPost };
    },

    onSuccess: (_, postId) => {
      // Удаляем из детального кэша
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });

      toast.success("Пост удалён!");
    },

    onError: (error, _, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }

      toast.error("Ошибка при удалении поста");
      console.error("Delete post error:", error);
    },

    ...options,
  });
}
