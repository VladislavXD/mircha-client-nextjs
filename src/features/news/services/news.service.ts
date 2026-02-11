/**
 * News Service - API для работы с новостями через NestJS backend
 * 
 * Использует axios для HTTP запросов к NestJS серверу
 * Endpoints: GET /news/headlines, GET /news/search
 */

import { api } from '@/src/api';

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

export interface GetHeadlinesParams {
  lang?: string;
  category?: string;
}

export interface SearchNewsParams {
  q: string;
  pageSize?: number;
}

/**
 * Сервис для работы с новостями
 */
export const newsService = {
  /**
   * Получение топовых новостей
   * @param params - параметры запроса (lang, category)
   * @returns Promise<NewsResponse>
   */
  async getHeadlines(params: GetHeadlinesParams = {}): Promise<NewsResponse> {
    const { lang = 'ru', category = 'technology' } = params;
    
    const queryParams = new URLSearchParams({
      lang,
      category,
    });

    const response = await api.get<NewsResponse>(
      `news/headlines?${queryParams.toString()}`
    );

    return response;
  },

  /**
   * Поиск новостей
   * @param params - параметры поиска (q, pageSize)
   * @returns Promise<NewsResponse>
   */
  async searchNews(params: SearchNewsParams): Promise<NewsResponse> {
    const { q, pageSize = 5 } = params;

    if (!q) {
      throw new Error('Search query is required');
    }

    const queryParams = new URLSearchParams({
      q,
      pageSize: pageSize.toString(),
    });

    const response = await api.get<NewsResponse>(
      `news/search?${queryParams.toString()}`
    );

    return response;
  },
};
