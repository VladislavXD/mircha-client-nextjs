"use client";

import type {
  AdminBoard,
  CreateBoardDto,
  UpdateBoardDto,
} from "../types/admin.types";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Pencil, Trash2, LayoutGrid, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useAdminBoards,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../hooks/useAdmin";

import AdminCreateBoardModal from "@/shared/components/admin/AdminCreateBoardModal";
import AdminCreateNoticeModal from "@/shared/components/admin/AdminCreateNoticeModal";

// ─── Shared styles ───────────────────────────────────────────────────────────

const adminStyles = {
  card: [
    "rounded-2xl border border-zinc-800/60 bg-zinc-950",
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_32px_rgba(0,0,0,0.5)]",
  ].join(" "),

  cardHeader: "border-b border-zinc-800/60 px-6 py-5",

  sectionLabel: "text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-500",

  pageTitle: [
    "font-semibold text-white text-xl tracking-tight",
  ].join(" "),

  tableHead: [
    "text-[10px] font-bold tracking-[0.14em] uppercase",
    "text-zinc-500 bg-zinc-900/60 border-b border-zinc-800/50",
    "h-9 px-4",
  ].join(" "),

  tableRow: [
    "border-b border-zinc-800/30 transition-colors duration-150",
    "hover:bg-zinc-900/50",
  ].join(" "),

  tableCell: "px-4 py-3 text-sm text-zinc-200",

  badge: {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-[11px] font-medium px-2 py-0.5 rounded-md",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    red: "bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium px-2 py-0.5 rounded-md",
  },

  input: [
    "bg-zinc-900 border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm transition-all",
  ].join(" "),

  btnPrimary: [
    "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold",
    "rounded-xl h-9 px-4 text-sm transition-all duration-150",
    "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]",
    "active:scale-[0.98]",
  ].join(" "),

  btnSecondary: [
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60",
    "rounded-xl h-9 px-4 text-sm font-medium transition-all duration-150",
    "active:scale-[0.98]",
  ].join(" "),

  btnGhost: [
    "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
    "rounded-lg h-8 w-8 p-0 transition-all duration-150",
  ].join(" "),

  btnDanger: [
    "bg-transparent hover:bg-red-500/10 text-zinc-600 hover:text-red-400",
    "rounded-lg h-8 w-8 p-0 transition-all duration-150",
  ].join(" "),

  emptyState: "text-center py-16 text-zinc-600 text-sm",

  label: "text-xs font-medium text-zinc-400 uppercase tracking-wider",

  inputField: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm w-full px-3 transition-all outline-none",
  ].join(" "),
};

// ─── Pagination ───────────────────────────────────────────────────────────────

function SimplePagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-5">
      <button
        className={[
          "h-8 w-8 rounded-lg text-sm font-medium transition-all",
          "border border-zinc-700/60 bg-zinc-900 text-zinc-400",
          "hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed",
        ].join(" ")}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
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
        >
          {p}
        </button>
      ))}
      <button
        className={[
          "h-8 w-8 rounded-lg text-sm font-medium transition-all",
          "border border-zinc-700/60 bg-zinc-900 text-zinc-400",
          "hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed",
        ].join(" ")}
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface BoardManagementProps {
  className?: string;
}

export default function BoardManagement({ className }: BoardManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editing, setEditing] = useState<AdminBoard | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const { data, isPending, error, refetch } = useAdminBoards({
    page,
    limit,
    search: searchTerm,
  });
  const createBoard = useCreateBoard();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      refetch();
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const boards = data?.boards ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  const handleCreate = async (payload: CreateBoardDto) => {
    try {
      await createBoard.mutateAsync(payload);
      toast.success("Борда создана");
      setIsCreateOpen(false);
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка создания борды");
    }
  };

  const handleUpdate = async (boardId: string, payload: UpdateBoardDto) => {
    try {
      await updateBoard.mutateAsync({ boardId, data: payload });
      toast.success("Борда обновлена");
      setEditing(null);
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка обновления борды");
    }
  };

  const handleDelete = async (boardId: string) => {
    try {
      await deleteBoard.mutateAsync(boardId);
      toast.success("Борда удалена");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка удаления борды");
    }
  };

  return (
    <TooltipProvider>
      <div className={className}>
        <div className={adminStyles.card}>
          {/* Header */}
          <div className={`${adminStyles.cardHeader} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <LayoutGrid className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className={adminStyles.sectionLabel}>Администрирование</p>
                <h2 className={adminStyles.pageTitle}>Борды</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                className={adminStyles.btnPrimary}
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5 inline" />
                Создать борду
              </button>
              <button
                className={adminStyles.btnSecondary}
                onClick={() => setIsNoticeOpen(true)}
              >
                Уведомление
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                className={`${adminStyles.inputField} pl-9`}
                placeholder="Поиск по названию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm mb-3">Ошибка загрузки борд</p>
                <button className={adminStyles.btnSecondary} onClick={() => refetch()}>
                  Повторить
                </button>
              </div>
            ) : isPending ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={`${adminStyles.tableHead} text-left w-[40%]`}>Борда</th>
                        <th className={`${adminStyles.tableHead} text-left`}>Файлы</th>
                        <th className={`${adminStyles.tableHead} text-left hidden md:table-cell`}>Лимиты</th>
                        <th className={`${adminStyles.tableHead} text-right`}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boards.length === 0 ? (
                        <tr>
                          <td colSpan={4} className={adminStyles.emptyState}>
                            Борды не найдены
                          </td>
                        </tr>
                      ) : (
                        boards.map((board: AdminBoard) => (
                          <tr key={board.id} className={adminStyles.tableRow}>
                            <td className={adminStyles.tableCell}>
                              <div>
                                <p className="font-medium text-zinc-100 text-sm leading-tight">
                                  {board.title}
                                  <span className="ml-1.5 text-zinc-500 font-normal text-xs">/{board.name}/</span>
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs">
                                  {board.description ?? "Без описания"}
                                </p>
                              </div>
                            </td>
                            <td className={adminStyles.tableCell}>
                              <div className="flex flex-wrap gap-1">
                                <span className={adminStyles.badge.amber}>
                                  {Math.round(board.maxFileSize / (1024 * 1024))} MB
                                </span>
                                <span className={adminStyles.badge.default}>
                                  {board.allowedFileTypes?.join(", ") ?? "—"}
                                </span>
                              </div>
                            </td>
                            <td className={`${adminStyles.tableCell} hidden md:table-cell`}>
                              <div className="flex flex-wrap gap-1">
                                <span className={adminStyles.badge.default}>Bump {board.bumpLimit}</span>
                                <span className={adminStyles.badge.default}>Img {board.imageLimit}</span>
                                <span className={adminStyles.badge.default}>{board.postsPerPage}/стр</span>
                              </div>
                            </td>
                            <td className={`${adminStyles.tableCell} text-right`}>
                              <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className={adminStyles.btnGhost}
                                      onClick={() => setEditing(board)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs">
                                    Редактировать
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className={adminStyles.btnDanger}
                                      onClick={() => handleDelete(board.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs">
                                    Удалить
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <SimplePagination page={page} total={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        <AdminCreateBoardModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => { setIsCreateOpen(false); refetch(); }}
        />

        <AdminCreateNoticeModal
          isOpen={isNoticeOpen}
          onClose={() => setIsNoticeOpen(false)}
          onSuccess={() => setIsNoticeOpen(false)}
        />

        {/* Edit dialog */}
        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-zinc-100 font-semibold text-lg">
                Редактировать борду
              </DialogTitle>
            </DialogHeader>
            {editing && (
              <BoardEditForm
                initial={{
                  title: editing.title,
                  description: editing.description ?? "",
                  allowedFileTypes: editing.allowedFileTypes ?? [],
                  maxFileSize: editing.maxFileSize,
                  bumpLimit: editing.bumpLimit,
                  isActive: true,
                }}
                isSubmitting={updateBoard.isPending}
                onSubmit={(payload) => handleUpdate(editing.id, payload)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

function BoardEditForm({
  initial,
  onSubmit,
  isSubmitting,
}: {
  initial: {
    title: string;
    description: string;
    allowedFileTypes: string[];
    maxFileSize: number;
    bumpLimit: number;
    isActive: boolean;
  };
  onSubmit: (payload: UpdateBoardDto) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(initial.allowedFileTypes ?? []);
  const [maxFileSize, setMaxFileSize] = useState(initial.maxFileSize);
  const [bumpLimit, setBumpLimit] = useState(initial.bumpLimit);
  const [isActive, setIsActive] = useState(initial.isActive);

  const field = [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm w-full px-3 transition-all outline-none",
  ].join(" ");

  const label = "text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5";

  return (
    <form
      className="space-y-4 mt-1"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, description, allowedFileTypes, maxFileSize, bumpLimit, isActive });
      }}
    >
      <div>
        <label className={label}>Заголовок</label>
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className={label}>Описание</label>
        <input className={field} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className={label}>Типы файлов (через запятую)</label>
        <input
          className={field}
          value={allowedFileTypes.join(",")}
          onChange={(e) =>
            setAllowedFileTypes(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Макс. размер (байт)</label>
          <input
            className={field}
            type="number"
            value={String(maxFileSize)}
            onChange={(e) => setMaxFileSize(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={label}>Bump limit</label>
          <input
            className={field}
            type="number"
            value={String(bumpLimit)}
            onChange={(e) => setBumpLimit(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div
          className={[
            "h-4 w-4 rounded border cursor-pointer flex items-center justify-center transition-all",
            isActive
              ? "bg-amber-500 border-amber-500"
              : "bg-zinc-900 border-zinc-600",
          ].join(" ")}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive && <span className="text-zinc-950 text-[10px] font-bold leading-none">✓</span>}
        </div>
        <label
          className="text-sm text-zinc-300 cursor-pointer select-none"
          onClick={() => setIsActive(!isActive)}
        >
          Активная
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold",
            "rounded-xl h-9 px-5 text-sm transition-all duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}