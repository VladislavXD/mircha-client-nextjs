"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, FileText, Image, BarChart3 } from "lucide-react";

import { useAdminStats } from "@/src/features/admin";
import { formatFileSize } from "@/src/services/admin.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="w-9 h-9 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <CardContent>
          <p className="text-danger">
            Ошибка загрузки статистики: {error.toString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (
    !stats ||
    !stats.users ||
    !stats.boards ||
    !stats.threads ||
    !stats.replies ||
    !stats.media
  ) {
    return (
      <Card className="bg-warning-50 border-warning-200">
        <CardContent>
          <p className="text-warning">Данные статистики недоступны</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Пользователи",
      subtitle: `активных ${stats.users?.active || 0}`,
      value: stats.users?.total || 0,
      colorClass: "c1",
      icon: Users,
      details: [
        { label: "Активные", value: stats.users?.active || 0 },
        { label: "Админы", value: stats.users?.admins || 0 },
      ],
      accentColor: "var(--foreground)",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
    {
      title: "Борды",
      subtitle: `активных ${stats.boards?.active || 0}`,
      value: stats.boards?.total || 0,
      colorClass: "c2",
      icon: FileText,
      details: [
        { label: "Всего", value: stats.boards?.total || 0 },
        { label: "Активные", value: stats.boards?.active || 0 },
      ],
      accentColor: "#534AB7",
      iconBg: "bg-[#EEEDFE]",
      iconColor: "text-[#534AB7]",
    },
    {
      title: "Треды",
      subtitle: `сегодня ${stats.threads?.today || 0}`,
      value: stats.threads?.total || 0,
      colorClass: "c3",
      icon: MessageSquare,
      details: [
        { label: "Всего", value: stats.threads?.total || 0 },
        { label: "Сегодня", value: stats.threads?.today || 0 },
      ],
      accentColor: "#0F6E56",
      iconBg: "bg-[#E1F5EE]",
      iconColor: "text-[#0F6E56]",
    },
    {
      title: "Ответы",
      subtitle: `сегодня ${stats.replies?.today || 0}`,
      value: stats.replies?.total || 0,
      colorClass: "c4",
      icon: MessageSquare,
      details: [
        { label: "Всего", value: stats.replies?.total || 0 },
        { label: "Сегодня", value: stats.replies?.today || 0 },
      ],
      accentColor: "#854F0B",
      iconBg: "bg-[#FAEEDA]",
      iconColor: "text-[#854F0B]",
    },
    {
      title: "Медиафайлы",
      subtitle: `размер ${formatFileSize(stats.media?.totalSize || 0)}`,
      value: stats.media?.total || 0,
      colorClass: "c5",
      icon: Image,
      details: [
        { label: "Файлов", value: stats.media?.total || 0 },
        {
          label: "Размер",
          value: formatFileSize(stats.media?.totalSize || 0),
        },
      ],
      accentColor: "#993C1D",
      iconBg: "bg-[#FAECE7]",
      iconColor: "text-[#993C1D]",
    },
  ];

  const quickActions = [
    { label: "Управление пользователями", icon: Users },
    { label: "Управление бордами", icon: FileText },
    { label: "Модерация контента", icon: MessageSquare },
    { label: "Управление медиа", icon: Image },
  ];

  const activeUsersPercent = (
    (stats.users.active / stats.users.total) *
    100
  ).toFixed(1);
  const adminsPercent = (
    (stats.users.admins / stats.users.total) *
    100
  ).toFixed(1);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto font-[Geologica,sans-serif]">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-3 flex-wrap">
        <div>
          <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
            Система управления
          </p>
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-[-0.03em] leading-tight">
            Панель администратора
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-light leading-relaxed max-w-md">
            Управление пользователями, контентом и медиафайлами форума.
          </p>
        </div>
        <Badge
          variant="default"
          className="font-mono text-[10px] tracking-[0.06em] px-2.5 py-1.5 rounded shrink-0 mt-0.5"
        >
          v2.4.1 · онлайн
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-5">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={card.title}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: index * 0.08 }}
              className={index === 4 ? "col-span-2 sm:col-span-1" : ""}
            >
              <Card className="relative overflow-hidden h-full border-border/50 hover:border-border transition-colors duration-200">
                {/* accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2.5px]"
                  style={{ background: card.accentColor }}
                />
                <CardContent className="p-4">
                  <div
                    className={`w-8 h-8 rounded-[7px] flex items-center justify-center mb-3 ${card.iconBg}`}
                  >
                    <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <p className="text-[20px] font-semibold font-mono tracking-[-0.04em] leading-none">
                    {typeof card.value === "number"
                      ? card.value.toLocaleString()
                      : card.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-light tracking-[0.01em]">
                    {card.title}
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-border/50 font-mono text-[11px] text-muted-foreground">
                    <span className="mr-1 text-muted-foreground/60">
                      {card.subtitle.split(" ")[0]}
                    </span>
                    <span className="text-foreground/70">
                      {card.subtitle.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Users */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[13px] font-medium">Пользователи</h3>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">
                  Активные пользователи
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {activeUsersPercent}%
                </span>
              </div>
              <div className="h-[3px] bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${activeUsersPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">
                  Администраторы
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {adminsPercent}%
                </span>
              </div>
              <div className="h-[3px] bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${adminsPercent}%`,
                    background: "#993C1D",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[13px] font-medium">Активность</h3>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-0">
            {[
              {
                label: "Новых тредов сегодня",
                value: stats.threads.today,
                badge: true,
              },
              {
                label: "Новых ответов сегодня",
                value: stats.replies.today,
                badge: true,
              },
              {
                label: "Активных бордов",
                value: stats.boards.active,
                badge: true,
              },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-border/50"
              >
                <span className="text-xs text-muted-foreground">
                  {row.label}
                </span>
                <Badge
                  variant="outline"
                  className="font-mono text-[11px] px-2 py-0.5 h-auto"
                >
                  {row.value}
                </Badge>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3">
              <span className="text-xs font-medium text-muted-foreground">
                Общий размер медиа
              </span>
              <span className="text-xs font-mono text-foreground/70">
                {formatFileSize(stats.media.totalSize)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader className="pb-2 pt-4 px-4">
          <h3 className="text-[13px] font-medium">Быстрые действия</h3>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((action, i) => {
              const IconComponent = action.icon;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-[10px] border border-border/70 bg-background hover:bg-muted hover:border-border transition-all duration-150 cursor-pointer"
                >
                  <IconComponent className="w-[18px] h-[18px] text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground text-center leading-snug">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;