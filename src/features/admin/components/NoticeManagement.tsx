"use client"

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
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
  useDisclosure,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { MdSearch, MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticeService } from "@/src/features/notice/services";
import AdminCreateNoticeModal from '@/shared/components/admin/AdminCreateNoticeModal';
import { useDeleteNotice } from "../../notice/hooks/useDeleteNotice";
import { useGetAllNotices } from "../../notice/hooks/useGetAllNotices";

interface NoticeManagementProps {
  className?: string;
}

export default function NoticeManagement({ className }: NoticeManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  
  // Fetch all notices (admin endpoint)
  const {error, isPending, notices, refetch} = useGetAllNotices()

  // Delete mutation
  const { deleteNotice, isPending: isDeleting } = useDeleteNotice();
  
  const handleDelete = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить это уведомление?")) {
      deleteNotice(id)
    }
  };

  // Filter notices by search
  const filteredNotices = Array.isArray(notices) 
    ? notices.filter((n: any) => 
        n.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'primary';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Управление уведомлениями</h2>
            <Chip size="sm" variant="flat">{filteredNotices.length}</Chip>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="sm" color="primary" onPress={onCreateOpen} startContent={<MdAdd />}>
              Создать уведомление
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Поиск по содержимому, заголовку или типу..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                startContent={<MdSearch />}
                className="flex-1"
                isClearable
                size="sm"
              />
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-danger">Ошибка загрузки уведомлений</p>
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
                aria-label="Таблица уведомлений"
                className="min-h-[400px]"
                classNames={{ wrapper: "shadow-none border border-divider overflow-x-auto" }}
              >
                <TableHeader>
                  <TableColumn className="min-w-64">СОДЕРЖИМОЕ</TableColumn>
                  <TableColumn className="min-w-24">ТИП</TableColumn>
                  <TableColumn className="min-w-32">СТАТУС</TableColumn>
                  <TableColumn className="min-w-32">ДАТА СОЗДАНИЯ</TableColumn>
                  <TableColumn className="min-w-32">ИСТЕКАЕТ</TableColumn>
                  <TableColumn className="min-w-24">ДЕЙСТВИЯ</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Уведомления не найдены">
                  {paginatedNotices.map((notice: any) => {
                    const isExpired = new Date(notice.expiredAt) < new Date();
                    const isActive = notice.active && !isExpired;
                    
                    return (
                      <TableRow key={notice.id}>
                        <TableCell className="min-w-64">
                          <div className="max-w-md">
                            {notice.title && (
                              <p className="font-medium text-sm mb-1">{notice.title}</p>
                            )}
                            <p className="text-xs text-default-500 line-clamp-2">
                              {notice.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-24">
                          <Chip size="sm" color={getTypeColor(notice.type)} variant="flat">
                            {notice.type}
                          </Chip>
                        </TableCell>
                        <TableCell className="min-w-32">
                          <Chip 
                            size="sm" 
                            color={isActive ? "success" : "default"} 
                            variant="flat"
                          >
                            {isActive ? "Активно" : isExpired ? "Истекло" : "Неактивно"}
                          </Chip>
                        </TableCell>
                        <TableCell className="min-w-32">
                          <span className="text-xs">
                            {new Date(notice.createdAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-32">
                          <span className="text-xs">
                            {new Date(notice.expiredAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-24">
                          <div className="flex items-center gap-1">
                            <Tooltip content="Удалить">
                              <Button 
                                size="sm" 
                                variant="light" 
                                color="danger" 
                                onPress={() => handleDelete(notice.id)}
                                isLoading={isDeleting}
                              >
                                <MdDelete />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {/* Создание уведомления */}
      <AdminCreateNoticeModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={() => {
          onCreateClose();
          refetch();
        }}
      />
    </div>
  );
}
