



import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

// API для новостей через наш backend
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://mirchan-expres-api.onrender.com/api' 
      : 'http://localhost:5000/api',
  }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, { lang?: string; category?: string }>({
      query: ({ lang = 'ru', category = 'технологии OR программирование OR разработка' }) => {
        const params = new URLSearchParams({
          lang,
          category,
        });
        
        return `news/headlines?${params.toString()}`;
      },
      providesTags: ['News'],
      keepUnusedDataFor: 30 * 60, // 30 минут кеша
    }),
    
    searchNews: builder.query<NewsResponse, { q: string; pageSize?: number }>({
      query: ({ q, pageSize = 5 }) => {
        const params = new URLSearchParams({
          q,
          pageSize: pageSize.toString(),
        });
        
        return `news/search?${params.toString()}`;
      },
      providesTags: ['News'],
      keepUnusedDataFor: 15 * 60, // 15 минут для поиска
    }),
  }),
});

export const { 
  useGetTopHeadlinesQuery, 
  useSearchNewsQuery,
  useLazyGetTopHeadlinesQuery,
  useLazySearchNewsQuery 
} = newsApi;



