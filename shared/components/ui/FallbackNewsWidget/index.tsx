"use client";

import React from "react";
import { Clock, TrendingUp, Globe, Zap } from "lucide-react";

const mockNews = [
  {
    id: 1,
    title: "Новые технологии в социальных сетях 2025",
    description:
      "Обзор самых актуальных трендов в разработке социальных платформ",
    source: "TechNews",
    publishedAt: "2025-08-23T10:00:00Z",
    icon: <TrendingUp size={14} />,
  },
  {
    id: 2,
    title: "Прорыв в области машинного обучения",
    description: "Новые алгоритмы значительно улучшили качество рекомендаций",
    source: "AI Weekly",
    publishedAt: "2025-08-23T08:30:00Z",
    icon: <Zap size={14} />,
  },
  {
    id: 3,
    title: "Глобальные тренды веб-разработки",
    description: "Анализ популярных фреймворков и библиотек 2025 года",
    source: "Web Dev",
    publishedAt: "2025-08-23T07:15:00Z",
    icon: <Globe size={14} />,
  },
];

const FallbackNewsWidget = () => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Только что";
    if (diffInHours < 24) return `${diffInHours}ч назад`;

    return `${Math.floor(diffInHours / 24)}д назад`;
  };

  return (
    <div className="bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] w-full p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
          📰 Новости IT
        </h3>
        <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Clock size={12} strokeWidth={2.5} />
          Demo
        </div>
      </div>

      <div className="space-y-4">
        {mockNews.map((article) => (
          <div
            key={article.id}
            className="group cursor-pointer rounded-[1rem] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors -mx-2 p-2 block"
          >
            <div className="flex gap-3">
              <div className="shrink-0 w-10 h-10 bg-neutral-100 dark:bg-[#202020] text-neutral-500 dark:text-neutral-400 rounded-xl flex items-center justify-center">
                {article.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:underline">
                  {article.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[11px] font-medium text-neutral-400">
                    {article.source}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/70">
        <div className="text-[11px] font-medium text-neutral-400 text-center uppercase tracking-wider">
          Демо-новости для разработки
        </div>
      </div>
    </div>
  );
};

export default FallbackNewsWidget;
