"use client"

import React, { useEffect, useState } from "react";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import {
  useAdminBoards,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../hooks/useAdmin";
import AdminCreateBoardModal from '@/shared/components/admin/AdminCreateBoardModal';
import type { AdminBoard, CreateBoardDto, UpdateBoardDto } from "../types/admin.types";

interface BoardManagementProps {
  className?: string;
}

export default function BoardManagement({ className }: BoardManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<AdminBoard | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isPending, error, refetch } = useAdminBoards({ page, limit, search: searchTerm });
  const createBoard = useCreateBoard();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

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
      setCreating(false);
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
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Управление бордами</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="sm" color="primary" onPress={onCreateOpen}>
              Создать борду
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Поиск по названию..."
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
              <p className="text-danger">Ошибка загрузки борд</p>
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
                aria-label="Таблица борд"
                className="min-h-[400px]"
                classNames={{ wrapper: "shadow-none border border-divider overflow-x-auto" }}
              >
                <TableHeader>
                  <TableColumn className="min-w-48">БОРОДА</TableColumn>
                  <TableColumn className="min-w-24">ФАЙЛЫ</TableColumn>
                  <TableColumn className="min-w-24">ПОСТЫ/ТРЕДЫ</TableColumn>
                  <TableColumn className="min-w-24">ДЕЙСТВИЯ</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Борды не найдены">
                  {boards.map((board: AdminBoard) => (
                    <TableRow key={board.id}>
                      <TableCell className="min-w-48">
                        <div className="max-w-xs">
                          <p className="font-medium truncate text-sm sm:text-base">
                            {board.title} ({board.name})
                          </p>
                          <p className="text-xs sm:text-small text-default-500 truncate">
                            {board.description ?? "Без описания"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex flex-wrap gap-1">
                          <Chip size="sm" variant="flat">Макс. {Math.round(board.maxFileSize / (1024*1024))}MB</Chip>
                          <Chip size="sm" variant="flat">{board.allowedFileTypes ? board.allowedFileTypes.join(", ") : "Типы файлов не указаны"}</Chip>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex flex-wrap gap-1">
                          <Chip size="sm" variant="flat">Пост/стр: {board.postsPerPage}</Chip>
                          <Chip size="sm" variant="flat">Тред/стр: {board.threadsPerPage}</Chip>
                          <Chip size="sm" variant="flat">Bump: {board.bumpLimit}</Chip>
                          <Chip size="sm" variant="flat">Img: {board.imageLimit}</Chip>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-1">
                          <Tooltip content="Редактировать">
                            <Button size="sm" variant="light" onPress={() => setEditing(board)}>
                              <MdEdit />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Удалить">
                            <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(board.id)}>
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

      {/* Создание борды (реиспользуем старый модальный компонент для консистентного дизайна) */}
      <AdminCreateBoardModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={() => {
          onCreateClose();
          refetch();
        }}
      />

      {/* Редактирование борды */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)}>
        <ModalContent>
          <ModalHeader>Редактировать борду</ModalHeader>
          <ModalBody>
            {editing && (
              <BoardEditForm
                initial={{
                  title: editing.title,
                  description: editing.description ?? "",
                  allowedFileTypes: editing.allowedFileTypes,
                  maxFileSize: editing.maxFileSize,
                  bumpLimit: editing.bumpLimit,
                  isActive: true,
                }}
                onSubmit={(payload) => handleUpdate(editing.id, payload)}
                isSubmitting={updateBoard.isPending}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

function BoardEditForm({ initial, onSubmit, isSubmitting }: {
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
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(initial.allowedFileTypes);
  const [maxFileSize, setMaxFileSize] = useState(initial.maxFileSize);
  const [bumpLimit, setBumpLimit] = useState(initial.bumpLimit);
  const [isActive, setIsActive] = useState(initial.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, allowedFileTypes, maxFileSize, bumpLimit, isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input
        label="Типы файлов (через запятую)"
        value={allowedFileTypes.join(",")}
        onChange={(e) => setAllowedFileTypes(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
      />
      <Input type="number" label="Макс. размер файла (байт)" value={String(maxFileSize)} onChange={(e) => setMaxFileSize(Number(e.target.value))} />
      <Input type="number" label="Bump limit" value={String(bumpLimit)} onChange={(e) => setBumpLimit(Number(e.target.value))} />
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <span className="text-small">Активная</span>
      </label>
      <div className="flex justify-end gap-2">
        <Button type="submit" color="primary" isLoading={isSubmitting}>Сохранить</Button>
      </div>
    </form>
  );
}
