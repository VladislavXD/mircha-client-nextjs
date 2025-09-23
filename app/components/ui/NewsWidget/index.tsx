'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Skeleton, Link } from '@heroui/react';
import { useGetTopHeadlinesQuery } from '@/src/services/news.service';
import { Clock, ExternalLink } from 'lucide-react';
import FallbackNewsWidget from '../FallbackNewsWidget';
import { useTranslations } from 'next-intl';

const NewsWidget = () => {
  const { 
    data: newsData, 
    isLoading, 
    error 
  } = useGetTopHeadlinesQuery({ 
    lang: 'ru',
    category: 'технологии OR программирование OR разработка'
  });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours}ч назад`;
    return `${Math.floor(diffInHours / 24)}д назад`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold">📰 Новости</h3>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Если есть ошибка (например, CORS), используем fallback
  if (error) {
    console.log('News API Error, using fallback:', error);
    return <FallbackNewsWidget />;
  }

  const articles = newsData?.articles?.slice(0, 5) || [];


  const t = useTranslations("HomePage.rightSidebar")
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-bold">📰 {t("news")}</h3>
          <div className="text-xs text-default-400 flex items-center gap-1">
            <Clock size={12} />
            Live
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className="group cursor-pointer hover:bg-default-50 rounded-lg p-2 -m-2 transition-colors"
            >
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-inherit"
              >
                <div className="flex gap-3">
                  {article.urlToImage && (
                    <div className="shrink-0 w-16 h-12 bg-default-100 rounded-lg overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-default-700 line-clamp-2 group-hover:text-primary transition-colors">
                      {truncateText(article.title, 100)}
                    </h4>
                    {article.description && (
                      <p className="text-xs text-default-500 mt-1 line-clamp-2">
                        {truncateText(article.description, 120)}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-default-400">
                        {article.source.name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-default-400">
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {articles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-default-200">
            <Link
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-default-400 hover:text-default-600 transition-colors flex items-center gap-1"
            >
              {t("basedOn")} NewsAPI
              <ExternalLink size={10} />
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default NewsWidget;
