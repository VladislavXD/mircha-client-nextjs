"use client";

import React, { useState } from "react";
import { Plus, Search, Trash2, Bell } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useDeleteNotice } from "../../notice/hooks/useDeleteNotice";
import { useGetAllNotices } from "../../notice/hooks/useGetAllNotices";
import AdminCreateNoticeModal from "@/shared/components/admin/AdminCreateNoticeModal";

// ─── Shared tokens ────────────────────────────────────────────────────────────

const s = {
  card: [
    "rounded-2xl border border-zinc-800/60 bg-zinc-950",
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_32px_rgba(0,0,0,0.5)]",
  ].join(" "),
  cardHeader: "border-b border-zinc-800/60 px-6 py-5",
  sectionLabel: "text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-500",
  pageTitle: "font-semibold text-white text-xl tracking-tight",
  tableHead: [
    "text-[10px] font-bold tracking-[0.14em] uppercase",
    "text-zinc-500 bg-zinc-900/60 border-b border-zinc-800/50",
    "h-9 px-4",
  ].join(" "),
  tableRow: "border-b border-zinc-800/30 transition-colors duration-150 hover:bg-zinc-900/50",
  tableCell: "px-4 py-3 text-sm text-zinc-200",
  inputField: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm w-full px-3 transition-all outline-none",
  ].join(" "),
  btnPrimary: [
    "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold",
    "rounded-xl h-9 px-4 text-sm transition-all duration-150 inline-flex items-center gap-1.5",
    "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset] active:scale-[0.98]",
  ].join(" "),
  btnSecondary: [
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60",
    "rounded-xl h-9 px-4 text-sm font-medium transition-all duration-150",
    "active:scale-[0.98]",
  ].join(" "),
  btnDanger: [
    "bg-transparent hover:bg-red-500/10 text-zinc-600 hover:text-red-400",
    "rounded-lg h-8 w-8 p-0 flex items-center justify-center transition-all duration-150",
  ].join(" "),
  emptyState: "text-center py-16 text-zinc-600 text-sm",
  badge: {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-[11px] font-medium px-2 py-0.5 rounded-md",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    red: "bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
  },
};

// ─── Pagination ───────────────────────────────────────────────────────────────

function SimplePagination({
  page, total, onChange,
}: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-5">
      <button
        className="h-8 w-8 rounded-lg text-sm font-medium border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={[
            "h-8 w-8 rounded-lg text-sm font-medium transition-all",
            p === page
              ? "bg-amber-500 text-zinc-950 border border-amber-500"
              : "border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
          ].join(" ")}
          onClick={() => onChange(p)}
        >{p}</button>
      ))}
      <button
        className="h-8 w-8 rounded-lg text-sm font-medium border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >›</button>
    </div>
  );
}

// ─── Type badge map ───────────────────────────────────────────────────────────

function typeBadge(type: string) {
  const map: Record<string, string> = {
    info: s.badge.blue,
    warning: s.badge.amber,
    error: s.badge.red,
    success: s.badge.green,
  };
  return map[type] ?? s.badge.default;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface NoticeManagementProps {
  className?: string;
}

export default function NoticeManagement({ className }: NoticeManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { error, isPending, notices, refetch } = useGetAllNotices();
  const { deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить это уведомление?")) {
      deleteNotice(id);
    }
  };

  const filteredNotices = Array.isArray(notices)
    ? notices.filter(
        (n: any) =>
          n.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.type?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <TooltipProvider>
      <div className={className}>
        <div className={s.card}>
          {/* Header */}
          <div className={`${s.cardHeader} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Bell className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className={s.sectionLabel}>Администрирование</p>
                <h2 className={s.pageTitle}>
                  Уведомления
                  <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-zinc-800 border border-zinc-700/50 text-zinc-400 text-[11px] font-medium">
                    {filteredNotices.length}
                  </span>
                </h2>
              </div>
            </div>
            <button className={s.btnPrimary} onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Создать уведомление
            </button>
          </div>

          <div className="p-5">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                className={`${s.inputField} pl-9`}
                placeholder="Поиск по содержимому, заголовку или типу..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>

            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm mb-3">Ошибка загрузки уведомлений</p>
                <button className={s.btnSecondary} onClick={() => refetch()}>Повторить</button>
              </div>
            ) : isPending ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={`${s.tableHead} text-left min-w-[280px]`}>Содержимое</th>
                          <th className={`${s.tableHead} text-left min-w-[80px]`}>Тип</th>
                          <th className={`${s.tableHead} text-left min-w-[100px]`}>Статус</th>
                          <th className={`${s.tableHead} text-left min-w-[140px] hidden sm:table-cell`}>Создано</th>
                          <th className={`${s.tableHead} text-left min-w-[140px] hidden md:table-cell`}>Истекает</th>
                          <th className={`${s.tableHead} text-right min-w-[80px]`}>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedNotices.length === 0 ? (
                          <tr>
                            <td colSpan={6} className={s.emptyState}>Уведомления не найдены</td>
                          </tr>
                        ) : (
                          paginatedNotices.map((notice: any) => {
                            const isExpired = new Date(notice.expiredAt) < new Date();
                            const isActive = notice.active && !isExpired;
                            return (
                              <tr key={notice.id} className={s.tableRow}>
                                <td className={`${s.tableCell} min-w-[280px]`}>
                                  <div className="max-w-sm">
                                    {notice.title && (
                                      <p className="font-medium text-zinc-100 text-sm leading-tight mb-0.5">
                                        {notice.title}
                                      </p>
                                    )}
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                      {notice.content}
                                    </p>
                                  </div>
                                </td>
                                <td className={`${s.tableCell} min-w-[80px]`}>
                                  <span className={typeBadge(notice.type)}>{notice.type}</span>
                                </td>
                                <td className={`${s.tableCell} min-w-[100px]`}>
                                  <span className={isActive ? s.badge.green : s.badge.default}>
                                    {isActive ? "Активно" : isExpired ? "Истекло" : "Неактивно"}
                                  </span>
                                </td>
                                <td className={`${s.tableCell} min-w-[140px] hidden sm:table-cell`}>
                                  <span className="text-xs text-zinc-400 tabular-nums">
                                    {formatDate(notice.createdAt)}
                                  </span>
                                </td>
                                <td className={`${s.tableCell} min-w-[140px] hidden md:table-cell`}>
                                  <span className={`text-xs tabular-nums ${isExpired ? "text-red-400" : "text-zinc-400"}`}>
                                    {formatDate(notice.expiredAt)}
                                  </span>
                                </td>
                                <td className={`${s.tableCell} text-right min-w-[80px]`}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className={s.btnDanger}
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(notice.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs">
                                      Удалить
                                    </TooltipContent>
                                  </Tooltip>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <SimplePagination page={page} total={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>

        <AdminCreateNoticeModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => { setIsCreateOpen(false); refetch(); }}
        />
      </div>
    </TooltipProvider>
  );
}         