import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/src/api'

// Типы для новостей
export interface NewsArticle {
  author: string | null;
  content: string;
  description: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  title: string;
  url: string;
  urlToImage: string | null;
}

export interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
}

// Query keys
export const newsKeys = {
  all: ['news'] as const,
  headlines: (lang?: string, category?: string) => 
    [...newsKeys.all, 'headlines', { lang, category }] as const,
  search: (q: string, pageSize?: number) => 
    [...newsKeys.all, 'search', { q, pageSize }] as const,
};

/**
 * Получение топовых новостей
 */
export const useTopHeadlines = (
  params: { lang?: string; category?: string } = {},
  options?: Omit<UseQueryOptions<NewsResponse>, 'queryKey' | 'queryFn'>
) => {
  const { lang = 'ru', category = 'technology' } = params;

  return useQuery<NewsResponse>({
    queryKey: newsKeys.headlines(lang, category),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        lang,
        category,
      });
      
      const response = await api.get<NewsResponse>(
        `news/headlines?${queryParams.toString()}`
      );
      
      return response;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    ...options,
  });
};

/**
 * Поиск новостей
 */
export const useSearchNews = (
  params: { q: string; pageSize?: number },
  options?: Omit<UseQueryOptions<NewsResponse>, 'queryKey' | 'queryFn'>
) => {
  const { q, pageSize = 5 } = params;

  return useQuery<NewsResponse>({
    queryKey: newsKeys.search(q, pageSize),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        q,
        pageSize: pageSize.toString(),
      });
      
      const response = await api.get<NewsResponse>(
        `news/search?${queryParams.toString()}`
      );
      
      return response;
    },
    enabled: !!q,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};
