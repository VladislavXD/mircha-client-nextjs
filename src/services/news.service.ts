



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

// Демо новости на случай проблем с API
const mockNews: NewsArticle[] = [
  {
    author: "TechCrunch",
    content: "Искусственный интеллект продолжает развиваться...",
    description: "Новые технологии ИИ меняют мир программирования и разработки.",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
    source: { id: "techcrunch", name: "TechCrunch" },
    title: "ИИ революционизирует разработку программного обеспечения",
    url: "https://techcrunch.com/ai-development",
    urlToImage: "https://via.placeholder.com/300x200?text=AI+News"
  },
  {
    author: "Wired",
    content: "Новые возможности веб-разработки...",
    description: "React 19 и Next.js 15 приносят множество улучшений для разработчиков.",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 часа назад
    source: { id: "wired", name: "Wired" },
    title: "React 19: что нового для веб-разработчиков",
    url: "https://wired.com/react-19-features",
    urlToImage: "https://via.placeholder.com/300x200?text=React+19"
  },
  {
    author: "TechNews",
    content: "Облачные технологии становятся всё более доступными...",
    description: "Новые сервисы делают облачную разработку проще и дешевле.",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 часов назад
    source: { id: "technews", name: "TechNews" },
    title: "Облачные платформы 2025: обзор лучших решений",
    url: "https://technews.com/cloud-2025",
    urlToImage: "https://via.placeholder.com/300x200?text=Cloud+Tech"
  },
  {
    author: "DevToday",
    content: "TypeScript остается лидером среди языков для фронтенда...",
    description: "Статистика использования и новые фичи TypeScript 5.4.",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 часов назад
    source: { id: "devtoday", name: "DevToday" },
    title: "TypeScript 5.4: улучшения производительности и новый синтаксис",
    url: "https://devtoday.com/typescript-5-4",
    urlToImage: "https://via.placeholder.com/300x200?text=TypeScript"
  },
  {
    author: "JavaScript Weekly",
    content: "Новые возможности для мобильной разработки...",
    description: "React Native и Flutter продолжают конкуренцию за рынок мобильной разработки.",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 часов назад
    source: { id: "jsweekly", name: "JavaScript Weekly" },
    title: "Мобильная разработка 2025: React Native vs Flutter",
    url: "https://jsweekly.com/mobile-development-2025",
    urlToImage: "https://via.placeholder.com/300x200?text=Mobile+Dev"
  }
];

// Простой API с fallback на демо-новости
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://newsapi.org/v2/',
    prepareHeaders: (headers) => {
      headers.set('X-API-Key', 'c3aee40fa7bd44689311929ecb336252');
      return headers;
    },
  }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, { lang?: string; category?: string }>({
      query: ({ lang = 'ru', category = 'technology' }) => {
        // Используем everything endpoint для русского языка
        const params = new URLSearchParams({
          language: lang,
          q: category,
          sortBy: 'publishedAt',
          pageSize: '10',
        });
        
        return `everything?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        // В случае ошибки API или пустого ответа, возвращаем mock данные
        if (!response || !response.articles || response.articles.length === 0) {
          return {
            articles: mockNews.slice(0, 5),
            status: 'ok',
            totalResults: mockNews.length
          };
        }
        return response;
      },
      transformErrorResponse: () => {
        // При ошибке API возвращаем mock данные
        return {
          data: {
            articles: mockNews.slice(0, 5),
            status: 'ok',
            totalResults: mockNews.length
          }
        };
      },
      providesTags: ['News'],
      keepUnusedDataFor: 30 * 60, // 30 минут кеша
    }),
    
    searchNews: builder.query<NewsResponse, { q: string; pageSize?: number }>({
      query: ({ q, pageSize = 5 }) => {
        const params = new URLSearchParams({
          q,
          language: 'ru',
          sortBy: 'publishedAt',
          pageSize: pageSize.toString(),
        });
        
        return `everything?${params.toString()}`;
      },
      transformResponse: (response: any, meta, arg) => {
        if (!response || !response.articles || response.articles.length === 0) {
          // Фильтруем mock новости по запросу
          const filteredNews = mockNews.filter(article => 
            article.title.toLowerCase().includes(arg.q.toLowerCase()) ||
            article.description.toLowerCase().includes(arg.q.toLowerCase())
          );
          return {
            articles: filteredNews.slice(0, 5),
            status: 'ok',
            totalResults: filteredNews.length
          };
        }
        return response;
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



