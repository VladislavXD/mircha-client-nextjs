"use client"

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Spinner,
  Pagination,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import {
  MdSearch,
  MdForum,
  MdSchedule,
  MdPerson,
  MdDelete,
} from "react-icons/md";
import { useAdminThreads, useDeleteThread } from "../hooks/useAdmin";
import type { AdminThread } from "../types/admin.types";

interface ThreadManagementProps {
  className?: string;
}

export default function ThreadManagement({ className }: ThreadManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isPending, error, refetch } = useAdminThreads({ page, limit, search: searchTerm });
  const deleteThreadMutation = useDeleteThread();

  // Дебаунс поиска
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      refetch();
    }, 500);
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
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <MdForum className="text-primary" size={24} />
            <h2 className="text-lg sm:text-xl font-semibold">Управление тредами</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              label="На странице"
              size="sm"
              selectedKeys={[String(limit)]}
              onSelectionChange={(keys) => {
                const v = Number(Array.from(keys)[0] ?? 10);
                setLimit(v);
                setPage(1);
              }}
            >
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Поиск по заголовку..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<MdSearch />}
                className="flex-1"
                isClearable
                size="sm"
              />
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-danger">Ошибка загрузки тредов</p>
              <Button color="primary" onPress={() => refetch()} className="mt-4">
                Повторить
              </Button>
            </div>
          ) : isPending ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                aria-label="Таблица тредов"
                className="min-h-[400px]"
                classNames={{ wrapper: "shadow-none border border-divider overflow-x-auto" }}
              >
                <TableHeader>
                  <TableColumn className="min-w-48">ТРЕД</TableColumn>
                  <TableColumn className="min-w-32 hidden sm:table-cell">АВТОР</TableColumn>
                  <TableColumn className="min-w-24">ДОСКА</TableColumn>
                  <TableColumn className="min-w-20 hidden md:table-cell">ОТВЕТЫ</TableColumn>
                  <TableColumn className="min-w-32 hidden lg:table-cell">СОЗДАН</TableColumn>
                  <TableColumn className="min-w-24">ДЕЙСТВИЯ</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Треды не найдены">
                  {threads.map((thread: AdminThread) => (
                    <TableRow key={thread.id}>
                      <TableCell className="min-w-48">
                        <div className="max-w-xs">
                          <p className="font-medium truncate text-sm sm:text-base">
                            {thread.title || "Без названия"}
                          </p>
                          <p className="text-xs sm:text-small text-default-500 truncate">
                            {thread.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <MdPerson className="text-default-400" />
                          <span className="text-xs sm:text-small">
                            {/* В новых типах автора может не быть — показываем заглушку */}
                            {"Аноним"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <Chip size="sm" variant="flat">
                          {thread.board?.name}
                        </Chip>
                      </TableCell>
                      <TableCell className="min-w-20 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <MdForum className="text-default-400" size={16} />
                          <span className="text-xs sm:text-small">{thread._count?.replies ?? 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32 hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <MdSchedule className="text-default-400" size={16} />
                          <span className="text-xs sm:text-small">
                            {new Date(thread.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-1">
                          <Tooltip content="Удалить">
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => handleDelete(thread.id)}
                              isLoading={deleteThreadMutation.isPending}
                            >
                              <MdDelete />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                    showShadow
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
