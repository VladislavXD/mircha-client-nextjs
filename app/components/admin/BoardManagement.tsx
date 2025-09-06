'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react'
import { 
  MdSearch, 
  MdMoreVert, 
  MdEdit, 
  MdDelete, 
  MdAdd,
  MdVisibility,
  MdVisibilityOff,
  MdFilterList 
} from 'react-icons/md'
import { 
  useGetAdminBoardsQuery, 
  useUpdateAdminBoardMutation, 
  useDeleteAdminBoardMutation,
  type AdminBoard,
  type BoardsFilter,
  type UpdateBoardRequest
} from '@/src/services/admin.service'
import { 
  formatAdminDate, 
  getStatusColor, 
  getStatusText,
  validateBoardName,
  validateBoardShortName,
  handleApiError,
  debounce
} from '@/src/services/admin.utils'
import { toast } from 'react-hot-toast'
import AdminCreateBoardModal from './AdminCreateBoardModal'

const BoardManagement: React.FC = () => {
  // Состояние фильтров
  const [filters, setFilters] = useState<BoardsFilter>({
    page: 1,
    limit: 20,
    search: '',
    isActive: ''
  })
  
  // Состояние модальных окон
  const [selectedBoard, setSelectedBoard] = useState<AdminBoard | null>(null)
  const [editingBoard, setEditingBoard] = useState<AdminBoard | null>(null)
  const [editFormData, setEditFormData] = useState<UpdateBoardRequest>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()

  // RTK Query hooks
  const { data: boardsData, isLoading, error, refetch } = useGetAdminBoardsQuery(filters)
  const [updateBoard, { isLoading: isUpdating }] = useUpdateAdminBoardMutation()
  const [deleteBoard, { isLoading: isDeleting }] = useDeleteAdminBoardMutation()

  // Дебаунс для поиска
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }))
    }, 300),
    []
  )

  // Обработчики фильтров
  const handleSearchChange = (value: string) => {
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      isActive: status === 'all' ? '' : (status === 'active' ? 'true' : 'false'),
      page: 1 
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Валидация формы
  const validateForm = (data: UpdateBoardRequest): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (data.name) {
      if (!validateBoardName(data.name)) {
        errors.name = 'Имя борда должно содержать от 2 до 20 символов и состоять из букв, цифр и _'
      }
    }

    if (data.shortName) {
      if (!validateBoardShortName(data.shortName)) {
        errors.shortName = 'Короткое имя должно содержать от 1 до 5 символов и состоять из букв и цифр'
      }
    }

    if (data.title) {
      if (data.title.length < 3 || data.title.length > 100) {
        errors.title = 'Заголовок должен содержать от 3 до 100 символов'
      }
    }

    if (data.description) {
      if (data.description.length > 500) {
        errors.description = 'Описание не должно превышать 500 символов'
      }
    }

    return errors
  }

  // Обработчики CRUD операций
  const handleEditBoard = (board: AdminBoard) => {
    setEditingBoard(board)
    setEditFormData({
      name: board.name,
      title: board.title,
      description: board.description,
      shortName: board.shortName,
      isActive: board.isActive
    })
    onEditModalOpen()
  }

  const handleUpdateBoard = async () => {
    if (!editingBoard) return

    const updateData: UpdateBoardRequest = {}
    
    if (editFormData.name !== editingBoard.name) updateData.name = editFormData.name
    if (editFormData.title !== editingBoard.title) updateData.title = editFormData.title
    if (editFormData.description !== editingBoard.description) updateData.description = editFormData.description
    if (editFormData.shortName !== editingBoard.shortName) updateData.shortName = editFormData.shortName
    if (editFormData.isActive !== editingBoard.isActive) updateData.isActive = editFormData.isActive

    const errors = validateForm(updateData)
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      try {
        await updateBoard({ id: editingBoard.id, data: updateData }).unwrap()
        toast.success('Борд обновлен успешно!')
        onEditModalClose()
        setEditingBoard(null)
        refetch()
      } catch (error: any) {
        console.error('Ошибка обновления борда:', error)
        const errorMessage = handleApiError(error)
        toast.error(errorMessage)
      }
    }
  }

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return

    try {
      await deleteBoard(selectedBoard.id).unwrap()
      toast.success('Борд удален успешно!')
      onDeleteModalClose()
      setSelectedBoard(null)
      refetch()
    } catch (error: any) {
      console.error('Ошибка удаления борда:', error)
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    }
  }

  const handleToggleBoardStatus = async (board: AdminBoard) => {
    try {
      await updateBoard({
        id: board.id,
        data: { isActive: !board.isActive }
      }).unwrap()
      toast.success(`Борд ${!board.isActive ? 'активирован' : 'деактивирован'}`)
      refetch()
    } catch (error: any) {
      console.error('Ошибка изменения статуса борда:', error)
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    }
  }

  const handleCreateSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <CardBody>
          <p className="text-danger">Ошибка загрузки бордов: {error.toString()}</p>
        </CardBody>
      </Card>
    )
  }

  const boards = boardsData?.boards || []
  const total = boardsData?.total || 0
  const totalPages = boardsData?.totalPages || 1
  const currentPage = boardsData?.page || 1

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Управление бордами</h2>
            <p className="text-sm sm:text-base text-gray-600">Всего бордов: {total}</p>
          </div>
          <Button
            color="primary"
            startContent={<MdAdd />}
            onPress={onCreateModalOpen}
            size="sm"
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Добавить борд</span>
            <span className="sm:hidden">Добавить</span>
          </Button>
        </CardHeader>
        <CardBody>
          {/* Фильтры */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Поиск по названию или описанию..."
              startContent={<MdSearch />}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select
              placeholder="Статус"
              startContent={<MdFilterList />}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full sm:max-w-xs"
            >
              <SelectItem key="all">Все статусы</SelectItem>
              <SelectItem key="active">Активные</SelectItem>
              <SelectItem key="inactive">Неактивные</SelectItem>
            </Select>
          </div>

          {/* Таблица бордов */}
          <div className="overflow-x-auto">
            <Table aria-label="Таблица бордов" className="min-w-full">
              <TableHeader>
                <TableColumn className="min-w-48">БОРД</TableColumn>
                <TableColumn className="min-w-24">СТАТУС</TableColumn>
                <TableColumn className="min-w-24 hidden sm:table-cell">ТРЕДЫ</TableColumn>
                <TableColumn className="min-w-32 hidden md:table-cell">СОЗДАН</TableColumn>
                <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Борды не найдены">
                {boards.map((board) => (
                  <TableRow key={board.id}>
                    <TableCell className="min-w-48">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm sm:text-base">{board.title}</span>
                          <Chip size="sm" variant="bordered">/{board.shortName}/</Chip>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">{board.name}</p>
                        {board.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {board.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-24">
                      <Chip
                        className={getStatusColor(board.isActive)}
                        size="sm"
                        variant="flat"
                        startContent={board.isActive ? <MdVisibility /> : <MdVisibilityOff />}
                      >
                        {getStatusText(board.isActive)}
                      </Chip>
                    </TableCell>
                    <TableCell className="min-w-24 hidden sm:table-cell">
                      <div className="text-xs sm:text-sm">
                        <span className="font-medium">{board._count?.threads || 0}</span>
                        <span className="text-gray-500 ml-1">тредов</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-32 hidden md:table-cell">
                      <div className="text-xs sm:text-sm">
                        {formatAdminDate(board.createdAt)}
                      </div>
                    </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <MdMoreVert />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Действия борда">
                        <DropdownItem
                          key="edit"
                          startContent={<MdEdit />}
                          onPress={() => handleEditBoard(board)}
                        >
                          Редактировать
                        </DropdownItem>
                        <DropdownItem
                          key="toggle-status"
                          startContent={board.isActive ? <MdVisibilityOff /> : <MdVisibility />}
                          onPress={() => handleToggleBoardStatus(board)}
                        >
                          {board.isActive ? 'Скрыть' : 'Показать'}
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<MdDelete />}
                          onPress={() => {
                            setSelectedBoard(board)
                            onDeleteModalOpen()
                          }}
                        >
                          Удалить
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Модальное окно создания борда */}
      <AdminCreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      {/* Модальное окно редактирования борда */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="lg">
        <ModalContent>
          <ModalHeader>Редактировать борд</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название борда"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                isInvalid={!!formErrors.name}
                errorMessage={formErrors.name}
              />
              <Input
                label="Короткое имя"
                value={editFormData.shortName || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, shortName: e.target.value }))}
                isInvalid={!!formErrors.shortName}
                errorMessage={formErrors.shortName}
              />
              <Input
                label="Заголовок"
                value={editFormData.title || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                isInvalid={!!formErrors.title}
                errorMessage={formErrors.title}
              />
              <Textarea
                label="Описание"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                isInvalid={!!formErrors.description}
                errorMessage={formErrors.description}
                maxRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditModalClose}>
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleUpdateBoard}
              isLoading={isUpdating}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальное окно удаления борда */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>Удалить борд</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить борд{' '}
              <strong>{selectedBoard?.title}</strong>?
            </p>
            <p className="text-sm text-gray-600">
              Это действие нельзя отменить. Все данные борда будут безвозвратно удалены.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              Отмена
            </Button>
            <Button 
              color="danger" 
              onPress={handleDeleteBoard}
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

export default BoardManagement
