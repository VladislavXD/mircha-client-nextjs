"use client";

import type {
  AdminUser,
  GetUsersQueryParams,
} from "@/src/features/admin/types/admin.types";

import React, { useState } from "react";
import {
  Search, MoreVertical, Pencil, Trash2, Lock, LockOpen,
  Filter, Users, ChevronDown,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  useAdminUsers,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserRole,
  useToggleUserStatus,
} from "@/src/features/admin/hooks/useAdmin";
import { formatAdminDate } from "@/src/services/admin.utils";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const s = {
  card: [
    "rounded-2xl border border-zinc-800/60 bg-zinc-950",
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_32px_rgba(0,0,0,0.5)]",
  ].join(" "),
  cardHeader: "border-b border-zinc-800/60 px-6 py-5",
  sectionLabel: "text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-500",
  pageTitle: "font-semibold text-white text-xl tracking-tight",
  tableHead: [
    "text-[10px] font-bold tracking-[0.14em] uppercase text-left",
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
    "rounded-xl h-9 px-4 text-sm transition-all duration-150",
    "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset] active:scale-[0.98]",
  ].join(" "),
  btnSecondary: [
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60",
    "rounded-xl h-9 px-4 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
    "inline-flex items-center gap-1.5",
  ].join(" "),
  btnGhost: [
    "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
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
  select: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-300",
    "focus:border-amber-500/50 focus:outline-none",
    "rounded-xl h-9 text-sm px-3 transition-all cursor-pointer",
  ].join(" "),
  dialogContent: "bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl",
  dialogLabel: "text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5",
  dialogField: [
    "bg-zinc-900 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600",
    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    "rounded-xl h-9 text-sm w-full px-3 transition-all outline-none",
  ].join(" "),
};

// ─── Avatar initials ──────────────────────────────────────────────────────────

function Avatar({ name, email }: { name?: string | null; email: string }) {
  const initials = name
    ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : email[0].toUpperCase()
  const colors = [
    "bg-purple-500/20 border-purple-500/30 text-purple-300",
    "bg-blue-500/20 border-blue-500/30 text-blue-300",
    "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    "bg-amber-500/20 border-amber-500/30 text-amber-300",
    "bg-pink-500/20 border-pink-500/30 text-pink-300",
  ];
  const color = colors[email.charCodeAt(0) % colors.length];
  return (
    <div className={`h-7 w-7 rounded-full border flex items-center justify-center text-[10px] font-semibold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, onChange }: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-5">
      <button
        className="h-8 w-8 rounded-lg text-sm border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >‹</button>
      {visible.map((p, i) => {
        const prev = visible[i - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && (
              <span className="text-zinc-600 text-xs px-1">…</span>
            )}
            <button
              className={[
                "h-8 w-8 rounded-lg text-sm font-medium transition-all",
                p === page
                  ? "bg-amber-500 text-zinc-950 border border-amber-500"
                  : "border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
              ].join(" ")}
              onClick={() => onChange(p)}
            >{p}</button>
          </React.Fragment>
        );
      })}
      <button
        className="h-8 w-8 rounded-lg text-sm border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >›</button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const UserManagement: React.FC = () => {
  const [filters, setFilters] = useState<GetUsersQueryParams>({
    page: 1, limit: 20, search: "", role: undefined,
  });

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "",
    role: "regular" as "regular" | "admin",
    isActive: true,
  });

  const { data: usersData, isLoading, error } = useAdminUsers(filters);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();
  const toggleStatusMutation = useToggleUserStatus();

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      role: user.role.toLowerCase() as "regular" | "admin",
      isActive: user.isActive,
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const updateData: Record<string, any> = {};
    if (formData.email !== editingUser.email) updateData.email = formData.email;
    if (formData.name !== editingUser.name) updateData.name = formData.name;
    if (formData.role !== editingUser.role.toLowerCase()) updateData.role = formData.role;
    if (formData.isActive !== editingUser.isActive) updateData.isActive = formData.isActive;
    if (Object.keys(updateData).length === 0) { setIsEditOpen(false); return; }
    try {
      await updateUserMutation.mutateAsync({ userId: editingUser.id, data: updateData });
      setIsEditOpen(false);
      setEditingUser(null);
    } catch { alert("Ошибка при обновлении пользователя"); }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch { alert("Ошибка при удалении пользователя"); }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${s.card} p-6`}>
        <p className="text-red-400 text-sm">Ошибка загрузки пользователей: {error.toString()}</p>
      </div>
    );
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.pages || 1;
  const currentPage = pagination?.page || 1;

  return (
    <div className="space-y-5">
      <div className={s.card}>
        {/* Header */}
        <div className={`${s.cardHeader} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className={s.sectionLabel}>Администрирование</p>
              <h2 className={s.pageTitle}>
                Пользователи
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-zinc-800 border border-zinc-700/50 text-zinc-400 text-[11px] font-medium">
                  {total}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                className={`${s.inputField} pl-9`}
                placeholder="Поиск по имени или email..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
            <select
              className={`${s.select} w-full sm:w-44`}
              value={filters.role || "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  role: e.target.value === "all" ? undefined : (e.target.value as "regular" | "admin"),
                  page: 1,
                })
              }
            >
              <option value="all">Все роли</option>
              <option value="regular">Пользователи</option>
              <option value="admin">Администраторы</option>
            </select>
            <button
              className={s.btnSecondary}
              onClick={() => setFilters({ page: 1, limit: 20, search: "", role: undefined })}
            >
              <Filter className="h-3.5 w-3.5" />
              Сбросить
            </button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={`${s.tableHead} min-w-[200px]`}>Пользователь</th>
                    <th className={`${s.tableHead} min-w-[180px] hidden sm:table-cell`}>Email</th>
                    <th className={`${s.tableHead} min-w-[100px]`}>Роль</th>
                    <th className={`${s.tableHead} min-w-[100px]`}>Статус</th>
                    <th className={`${s.tableHead} min-w-[160px] hidden lg:table-cell`}>Регистрация</th>
                    <th className={`${s.tableHead} min-w-[140px] hidden xl:table-cell`}>Статистика</th>
                    <th className={`${s.tableHead} text-right min-w-[60px]`}>‌</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={s.emptyState}>Пользователи не найдены</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className={s.tableRow}>
                        <td className={`${s.tableCell} min-w-[200px]`}>
                          <div className="flex items-center gap-2.5">
                            <Avatar name={user.name} email={user.email} />
                            <div>
                              <p className="font-medium text-zinc-100 text-sm leading-tight">
                                {user.name || "Без имени"}
                              </p>
                              <p className="text-[10px] text-zinc-600 font-mono">
                                {user.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`${s.tableCell} min-w-[180px] hidden sm:table-cell`}>
                          <span className="text-xs text-zinc-400">{user.email}</span>
                        </td>
                        <td className={`${s.tableCell} min-w-[100px]`}>
                          <span className={user.role === "ADMIN" ? s.badge.amber : s.badge.default}>
                            {user.role === "ADMIN" ? "Админ" : "Юзер"}
                          </span>
                        </td>
                        <td className={`${s.tableCell} min-w-[100px]`}>
                          <span className={user.isActive ? s.badge.green : s.badge.red}>
                            {user.isActive ? "Активен" : "Заблокирован"}
                          </span>
                        </td>
                        <td className={`${s.tableCell} min-w-[160px] hidden lg:table-cell`}>
                          <div>
                            <p className="text-xs text-zinc-300 tabular-nums">
                              {formatAdminDate(user.createdAt)}
                            </p>
                            {user.lastSeen && (
                              <p className="text-[10px] text-zinc-600 tabular-nums mt-0.5">
                                Был: {formatAdminDate(user.lastSeen)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className={`${s.tableCell} min-w-[140px] hidden xl:table-cell`}>
                          <div className="flex gap-2">
                            <span className={s.badge.default}>{user._count.post} постов</span>
                            <span className={s.badge.default}>{user._count.likes} лайков</span>
                          </div>
                        </td>
                        <td className={`${s.tableCell} text-right`}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={s.btnGhost}>
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl p-1 min-w-[180px]"
                            >
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                onClick={() => handleEditUser(user)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-zinc-500" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                onClick={async () => {
                                  try { await toggleStatusMutation.mutateAsync(user.id); }
                                  catch { alert("Ошибка изменения статуса"); }
                                }}
                              >
                                {user.isActive
                                  ? <><Lock className="h-3.5 w-3.5 text-zinc-500" /> Заблокировать</>
                                  : <><LockOpen className="h-3.5 w-3.5 text-zinc-500" /> Разблокировать</>
                                }
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                onClick={async () => {
                                  try {
                                    await updateRoleMutation.mutateAsync({
                                      userId: user.id,
                                      data: { role: user.role === "ADMIN" ? "regular" : "admin" },
                                    });
                                  } catch { alert("Ошибка изменения роли"); }
                                }}
                              >
                                {user.role === "ADMIN" ? "Снять права админа" : "Сделать админом"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={(p) => setFilters({ ...filters, page: p })}
          />
        </div>
      </div>

      {/* Edit modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className={`${s.dialogContent} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-semibold text-lg">
              Редактировать пользователя
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-1">
            <div>
              <label className={s.dialogLabel}>Имя</label>
              <input
                className={s.dialogField}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className={s.dialogLabel}>Email</label>
              <input
                className={s.dialogField}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={s.dialogLabel}>Роль</label>
                <select
                  className={`${s.select} w-full`}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "regular" | "admin" })}
                >
                  <option value="regular">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <div>
                <label className={s.dialogLabel}>Статус</label>
                <select
                  className={`${s.select} w-full`}
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Активен</option>
                  <option value="inactive">Заблокирован</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-5 border-t border-zinc-800 pt-4 gap-2">
            <button
              className={s.btnSecondary}
              onClick={() => setIsEditOpen(false)}
            >
              Отмена
            </button>
            <button
              className={s.btnPrimary}
              disabled={updateUserMutation.isPending}
              onClick={handleUpdateUser}
            >
              {updateUserMutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className={`${s.dialogContent} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-semibold text-lg">
              Удалить пользователя?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-1">
            <p className="text-sm text-zinc-300">
              Вы собираетесь удалить{" "}
              <span className="text-zinc-100 font-medium">
                {selectedUser?.name || selectedUser?.email}
              </span>
              .
            </p>
            <p className="text-xs text-zinc-500">
              Это действие необратимо. Все данные пользователя будут удалены.
            </p>
          </div>
          <DialogFooter className="mt-5 border-t border-zinc-800 pt-4 gap-2">
            <button
              className={s.btnSecondary}
              onClick={() => setIsDeleteOpen(false)}
            >
              Отмена
            </button>
            <button
              className={[
                "bg-red-500/90 hover:bg-red-500 text-white font-semibold",
                "rounded-xl h-9 px-4 text-sm transition-all duration-150 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              ].join(" ")}
              disabled={deleteUserMutation.isPending}
              onClick={handleDeleteUser}
            >
              {deleteUserMutation.isPending ? "Удаление..." : "Удалить"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;