'use client'

import React, { useState, useEffect } from 'react'
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Spinner,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
  Divider,
  useDisclosure,
} from '@heroui/react'
import { toast } from 'react-hot-toast'
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
  MdFilterList,
  MdMoreVert,
  MdReply,
  MdSchedule,
  MdPerson,
  MdForum,
} from 'react-icons/md'
import { 
  useGetAdminRepliesQuery, 
  useGetAdminReplyByIdQuery,
  useUpdateAdminReplyMutation, 
  useDeleteAdminReplyMutation,
  type AdminReply,
  type RepliesFilter,
  type UpdateReplyRequest,
} from "@/src/services/admin.service.old" // TODO: Migrate to React Query from @/src/features/admin
import { formatDate, getStatusColor } from "@/src/services/admin.utils"

interface ReplyManagementProps {
  className?: string
}

export default function ReplyManagement({ className }: ReplyManagementProps) {
  // Состояние фильтров
  const [filters, setFilters] = useState<RepliesFilter>({
    page: 1,
    limit: 10,
  })
  
  // Состояние UI
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReply, setSelectedReply] = useState<AdminReply | null>(null)
  const [editingReply, setEditingReply] = useState<AdminReply | null>(null)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  
  // Модалки
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  // Данные и мутации
  const { data: repliesData, isLoading, error, refetch } = useGetAdminRepliesQuery(filters)
  const [updateReply, { isLoading: isUpdating }] = useUpdateAdminReplyMutation()
  const [deleteReply, { isLoading: isDeleting }] = useDeleteAdminReplyMutation()

  // Дебаунс поиска
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const replies = repliesData?.replies || []
  const total = repliesData?.total || 0
  const totalPages = repliesData?.totalPages || 1

  // Обработчики
  const handleFilterChange = (key: keyof RepliesFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleViewReply = (reply: AdminReply) => {
    setSelectedReply(reply)
    onViewOpen()
  }

  const handleEditReply = (reply: AdminReply) => {
    setEditingReply(reply)
    onEditOpen()
  }

  const handleUpdateReply = async (data: UpdateReplyRequest) => {
    if (!editingReply) return

    try {
      await updateReply({ id: editingReply.id, data }).unwrap()
      toast.success('Ответ успешно обновлен')
      onEditClose()
      setEditingReply(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Ошибка при обновлении ответа')
    }
  }

  const handleDeleteReply = async () => {
    if (!selectedReply) return

    try {
      await deleteReply(selectedReply.id).unwrap()
      toast.success('Ответ успешно удален')
      onDeleteClose()
      setSelectedReply(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Ошибка при удалении ответа')
    }
  }

  const resetFilters = () => {
    setFilters({ page: 1, limit: 10 })
    setSearchTerm('')
  }

  const getReplyStatusChip = (reply: AdminReply) => {
    if (!reply.isActive) {
      return <Chip color="danger" size="sm">Заблокирован</Chip>
    }
    return <Chip color="success" size="sm">Активный</Chip>
  }

  if (error) {
    return (
      <Card className={className}>
        <CardBody className="text-center py-8">
          <p className="text-danger">Ошибка загрузки ответов</p>
          <Button color="primary" onPress={() => refetch()} className="mt-4">
            Повторить
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <MdReply className="text-primary" size={24} />
            <h2 className="text-lg sm:text-xl font-semibold">Управление ответами</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="flat"
              startContent={<MdFilterList />}
              onPress={() => setIsFiltersVisible(!isFiltersVisible)}
              className="w-full sm:w-auto"
            >
              Фильтры
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {/* Поиск и фильтры */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Поиск по содержанию, автору..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<MdSearch />}
                className="flex-1"
                isClearable
              />
            </div>

            {isFiltersVisible && (
              <Card className="bg-content2">
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      label="ID треда"
                      placeholder="Введите ID треда"
                      value={filters.threadShortId || ''}
                      onChange={(e) => handleFilterChange('threadShortId', e.target.value || undefined)}
                    />

                    <Select
                      label="Статус"
                      placeholder="Все статусы"
                      selectedKeys={filters.isActive !== undefined ? [filters.isActive.toString()] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0]
                        handleFilterChange('isActive', value === 'true' ? true : value === 'false' ? false : undefined)
                      }}
                    >
                      <SelectItem key="all">Все статусы</SelectItem>
                      <SelectItem key="true">Активные</SelectItem>
                      <SelectItem key="false">Заблокированные</SelectItem>
                    </Select>

                    <Input
                      label="Автор"
                      placeholder="Имя автора"
                      value={filters.authorUsername || ''}
                      onChange={(e) => handleFilterChange('authorUsername', e.target.value || undefined)}
                    />

                    <div className="flex items-end">
                      <Button
                        color="secondary"
                        variant="flat"
                        onPress={resetFilters}
                        className="w-full"
                      >
                        Сброс
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Таблица ответов */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                aria-label="Таблица ответов"
                className="min-h-[400px]"
                classNames={{
                  wrapper: "shadow-none border border-divider",
                }}
              >
                <TableHeader>
                  <TableColumn>СОДЕРЖАНИЕ</TableColumn>
                  <TableColumn>АВТОР</TableColumn>
                  <TableColumn>ТРЕД</TableColumn>
                  <TableColumn>СТАТУС</TableColumn>
                  <TableColumn>СОЗДАН</TableColumn>
                  <TableColumn>ДЕЙСТВИЯ</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Ответы не найдены">
                  {replies.map((reply: AdminReply) => (
                    <TableRow key={reply.id}>
                      <TableCell>
                        <div className="max-w-sm">
                          <p className="text-small truncate">
                            {reply.content}
                          </p>
                          {reply.parentReply && (
                            <p className="text-tiny text-default-400 mt-1">
                              Ответ на: {reply.parentReply.shortId}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MdPerson className="text-default-400" />
                          <span className="text-small">
                            {reply.author?.username || reply.authorIp || 'Аноним'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MdForum className="text-default-400" size={16} />
                          <Chip size="sm" variant="flat">
                            {reply.thread?.shortId}
                          </Chip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getReplyStatusChip(reply)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MdSchedule className="text-default-400" size={16} />
                          <span className="text-small">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Tooltip content="Просмотр">
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => handleViewReply(reply)}
                            >
                              <MdVisibility />
                            </Button>
                          </Tooltip>
                          
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                              >
                                <MdMoreVert />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem
                                key="edit"
                                startContent={<MdEdit />}
                                onPress={() => handleEditReply(reply)}
                              >
                                Редактировать
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                startContent={<MdDelete />}
                                color="danger"
                                onPress={() => {
                                  setSelectedReply(reply)
                                  onDeleteOpen()
                                }}
                              >
                                Удалить
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
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
                    page={filters.page || 1}
                    onChange={handlePageChange}
                    showControls
                    showShadow
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Модалка просмотра ответа */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Просмотр ответа</ModalHeader>
          <ModalBody>
            {selectedReply && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Содержание</h3>
                  <p className="whitespace-pre-wrap">{selectedReply.content}</p>
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Автор</h3>
                    <p>{selectedReply.author?.username || selectedReply.authorIp || 'Аноним'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">ID ответа</h3>
                    <p>{selectedReply.shortId}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Тред</h3>
                    <p>{selectedReply.thread?.shortId}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Создан</h3>
                    <p>{formatDate(selectedReply.createdAt)}</p>
                  </div>
                </div>

                {selectedReply.parentReply && (
                  <>
                    <Divider />
                    <div>
                      <h3 className="font-semibold mb-2">Ответ на</h3>
                      <Card>
                        <CardBody>
                          <p className="text-small">
                            ID: {selectedReply.parentReply.shortId}
                          </p>
                          <p className="text-small text-default-500 mt-1">
                            {selectedReply.parentReply.content}
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  </>
                )}

                <Divider />

                <div>
                  <h3 className="font-semibold mb-2">Статус</h3>
                  <div className="flex gap-2">
                    {getReplyStatusChip(selectedReply)}
                  </div>
                </div>

                {selectedReply.media && selectedReply.media.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <h3 className="font-semibold mb-2">Медиа ({selectedReply.media.length})</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReply.media.map((media, index) => (
                          <Card key={index}>
                            <CardBody className="p-2">
                              <p className="text-small truncate">{media.filename}</p>
                              <p className="text-tiny text-default-500">{media.type}</p>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onViewClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модалка редактирования ответа */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalContent>
          <ModalHeader>Редактирование ответа</ModalHeader>
          <ModalBody>
            {editingReply && (
              <ReplyEditForm
                reply={editingReply}
                onSubmit={handleUpdateReply}
                isLoading={isUpdating}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Модалка удаления ответа */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Подтверждение удаления</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить ответ{' '}
              <span className="font-semibold">
                {selectedReply?.shortId}
              </span>
              ?
            </p>
            <p className="text-small text-danger">
              Это действие нельзя отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onDeleteClose}>
              Отмена
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteReply}
              isLoading={isDeleting}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

// Форма редактирования ответа
interface ReplyEditFormProps {
  reply: AdminReply
  onSubmit: (data: UpdateReplyRequest) => void
  isLoading: boolean
}

function ReplyEditForm({ reply, onSubmit, isLoading }: ReplyEditFormProps) {
  const [formData, setFormData] = useState({
    content: reply.content,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updateData: UpdateReplyRequest = {}
    
    if (formData.content !== reply.content) {
      updateData.content = formData.content
    }

    onSubmit(updateData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Содержание"
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        minRows={4}
        isRequired
      />

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          color="primary"
          isLoading={isLoading}
        >
          Сохранить
        </Button>
      </div>
    </form>
  )
}
