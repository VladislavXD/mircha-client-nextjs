"use client";

import React from "react";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import FallbackNewsWidget from "../FallbackNewsWidget";

import { useTopHeadlines } from "@/src/features/news/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";

const NewsWidget = () => {
  const t = useTranslations("HomePage.rightSidebar");
  const params = useParams();

  // Получаем текущий язык из параметров маршрута (ru/en)
  const locale = (params.locale as string) || "ru";

  // Используем React Query хук для получения новостей
  const {
    data: newsData,
    isLoading,
    error,
  } = useTopHeadlines(
    { lang: locale, category: "technology" },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] w-full p-4 sm:p-5">
        <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          📰 Новости
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="shrink-0 w-16 h-12 bg-neutral-200 dark:bg-neutral-800/80 rounded-xl" />
              <div className="flex-1 space-y-2 py-0.5">
                <Skeleton className="h-3 w-full bg-neutral-200 dark:bg-neutral-800/80 rounded-full" />
                <Skeleton className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800/80 rounded-full" />
                <Skeleton className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800/80 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Если ошибка или нет данных - показываем fallback
  if (error || !newsData) {
    console.log("News API Error, using fallback:", error);

    return <FallbackNewsWidget />;
  }

  const articles = newsData?.articles?.slice(0, 5) || [];

  return (
    <div className="bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] w-full p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
          📰 {t("news")}
        </h3>
        <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Clock size={12} strokeWidth={2.5} />
          Live
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="group cursor-pointer rounded-[1rem] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors p-2 -mx-2 block"
          >
            <Link
              className="block outline-none"
              href={article.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex gap-3">
                {article.urlToImage && (
                  <div className="shrink-0 w-16 h-12 bg-neutral-100 dark:bg-[#202020] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800/70">
                    <img
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={article.urlToImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:underline">
                    {truncateText(article.title, 100)}
                  </h4>
                  {article.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {truncateText(article.description, 120)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[11px] font-medium text-neutral-400 truncate pr-2">
                      {article.source.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 shrink-0">
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                      <ExternalLink
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        size={12}
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {articles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/70">
          <Link
            className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
            href="https://newsapi.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("basedOn")} NewsAPI
            <ExternalLink size={12} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsWidget;
