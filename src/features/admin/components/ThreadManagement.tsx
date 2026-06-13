"use client";

import type { AdminThread } from "../types/admin.types";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Clock, User, Trash2, Search } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAdminThreads, useDeleteThread } from "../hooks/useAdmin";

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
    "h-9 px-4 text-left",
  ].join(" "),
  tableRow: "border-b border-zinc-800/30 transition-colors duration-150 hover:bg-zinc-900/50",
  tableCell: "px-4 py-3 text-sm text-zinc-200",
  inputField: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm w-full px-3 transition-all outline-none",
  ].join(" "),
  btnSecondary: [
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60",
    "rounded-xl h-9 px-4 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
  ].join(" "),
  btnDanger: [
    "bg-transparent hover:bg-red-500/10 text-zinc-600 hover:text-red-400",
    "rounded-lg h-8 w-8 p-0 flex items-center justify-center transition-all duration-150",
  ].join(" "),
  emptyState: "text-center py-16 text-zinc-600 text-sm",
  badge: {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-[11px] font-medium px-2 py-0.5 rounded-md",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
  },
  select: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-300",
    "focus:border-amber-500/50 focus:outline-none",
    "rounded-xl h-9 text-sm px-3 transition-all cursor-pointer",
  ].join(" "),
};

// ─── Pagination ───────────────────────────────────────────────────────────────

function SimplePagination({ page, total, onChange }: {
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

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ThreadManagementProps {
  className?: string;
}

export default function ThreadManagement({ className }: ThreadManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isPending, error, refetch } = useAdminThreads({
    page, limit, search: searchTerm,
  });
  const deleteThreadMutation = useDeleteThread();

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); refetch(); }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const threads = data?.threads ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  const handleDelete = async (threadId: string) => {
    try {
      await deleteThreadMutation.mutateAsync(threadId);
      toast.success("Тред успешно удален");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка при удалении треда");
    }
  };

  return (
    <TooltipProvider>
      <div className={className}>
        <div className={s.card}>
          {/* Header */}
          <div className={`${s.cardHeader} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className={s.sectionLabel}>Администрирование</p>
                <h2 className={s.pageTitle}>Треды</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                className={s.select}
                value={String(limit)}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              >
                <option value="10">10 на странице</option>
                <option value="20">20 на странице</option>
                <option value="50">50 на странице</option>
              </select>
            </div>
          </div>

          <div className="p-5">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                className={`${s.inputField} pl-9`}
                placeholder="Поиск по заголовку..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm mb-3">Ошибка загрузки тредов</p>
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
                          <th className={`${s.tableHead} min-w-[220px]`}>Тред</th>
                          <th className={`${s.tableHead} min-w-[120px] hidden sm:table-cell`}>Автор</th>
                          <th className={`${s.tableHead} min-w-[100px]`}>Доска</th>
                          <th className={`${s.tableHead} min-w-[80px] hidden md:table-cell`}>Ответы</th>
                          <th className={`${s.tableHead} min-w-[150px] hidden lg:table-cell`}>Создан</th>
                          <th className={`${s.tableHead} text-right min-w-[80px]`}>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threads.length === 0 ? (
                          <tr>
                            <td colSpan={6} className={s.emptyState}>Треды не найдены</td>
                          </tr>
                        ) : (
                          threads.map((thread: AdminThread) => (
                            <tr key={thread.id} className={s.tableRow}>
                              <td className={`${s.tableCell} min-w-[220px]`}>
                                <div className="max-w-xs">
                                  <p className="font-medium text-zinc-100 text-sm leading-tight truncate">
                                    {thread.title || "Без названия"}
                                  </p>
                                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                                    {thread.content}
                                  </p>
                                </div>
                              </td>
                              <td className={`${s.tableCell} min-w-[120px] hidden sm:table-cell`}>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                                    <User className="h-2.5 w-2.5 text-zinc-500" />
                                  </div>
                                  <span className="text-xs text-zinc-400">Аноним</span>
                                </div>
                              </td>
                              <td className={`${s.tableCell} min-w-[100px]`}>
                                <span className={s.badge.amber}>/{thread.board?.name}/</span>
                              </td>
                              <td className={`${s.tableCell} min-w-[80px] hidden md:table-cell`}>
                                <div className="flex items-center gap-1.5">
                                  <MessageSquare className="h-3 w-3 text-zinc-600" />
                                  <span className="text-xs text-zinc-400 tabular-nums">
                                    {thread._count?.replies ?? 0}
                                  </span>
                                </div>
                              </td>
                              <td className={`${s.tableCell} min-w-[150px] hidden lg:table-cell`}>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-zinc-600" />
                                  <span className="text-xs text-zinc-400 tabular-nums">
                                    {new Date(thread.createdAt).toLocaleString("ru-RU", {
                                      day: "2-digit", month: "2-digit", year: "numeric",
                                      hour: "2-digit", minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </td>
                              <td className={`${s.tableCell} text-right`}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className={s.btnDanger}
                                      disabled={deleteThreadMutation.isPending}
                                      onClick={() => handleDelete(thread.id)}
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
                          ))
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
      </div>
    </TooltipProvider>
  );
}