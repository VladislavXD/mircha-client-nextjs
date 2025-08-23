'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Link } from '@heroui/react';
import { Clock, ExternalLink, TrendingUp, Globe, Zap } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    title: "Новые технологии в социальных сетях 2025",
    description: "Обзор самых актуальных трендов в разработке социальных платформ",
    source: "TechNews",
    publishedAt: "2025-08-23T10:00:00Z",
    icon: <TrendingUp size={14} />
  },
  {
    id: 2,
    title: "Прорыв в области машинного обучения",
    description: "Новые алгоритмы значительно улучшили качество рекомендаций",
    source: "AI Weekly",
    publishedAt: "2025-08-23T08:30:00Z",
    icon: <Zap size={14} />
  },
  {
    id: 3,
    title: "Глобальные тренды веб-разработки",
    description: "Анализ популярных фреймворков и библиотек 2025 года",
    source: "Web Dev",
    publishedAt: "2025-08-23T07:15:00Z",
    icon: <Globe size={14} />
  }
];

const FallbackNewsWidget = () => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours}ч назад`;
    return `${Math.floor(diffInHours / 24)}д назад`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-bold">📰 Новости IT</h3>
          <div className="text-xs text-default-400 flex items-center gap-1">
            <Clock size={12} />
            Demo
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-4">
          {mockNews.map((article) => (
            <div 
              key={article.id} 
              className="group cursor-pointer hover:bg-default-50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="flex gap-3">
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-default-700 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-default-500 mt-1 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-default-400">
                      {article.source}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-default-400">
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-default-200">
          <div className="text-xs text-default-400 text-center">
            Демо-новости для разработки
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FallbackNewsWidget;
