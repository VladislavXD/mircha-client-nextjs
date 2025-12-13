'use client'

import React, { useState } from 'react'
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
  SelectItem
} from '@heroui/react'
import { 
  MdSearch, 
  MdMoreVert, 
  MdEdit, 
  MdDelete, 
  MdLock, 
  MdLockOpen,
  MdFilterList 
} from 'react-icons/md'
import { 
  useAdminUsers, 
  useUpdateUser, 
  useDeleteUser, 
  useUpdateUserRole, 
  useToggleUserStatus 
} from '@/src/features/admin/hooks/useAdmin'
import type { AdminUser, GetUsersQueryParams } from '@/src/features/admin/types/admin.types'
import { formatAdminDate } from '@/src/services/admin.utils'

const UserManagement: React.FC = () => {
  // Состояние фильтров
  const [filters, setFilters] = useState<GetUsersQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    role: undefined
  })
  
  // Состояние модальных окон
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'regular' as 'regular' | 'admin',
    isActive: true
  })
  
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()

  // React Query hooks
  const { data: usersData, isLoading, error } = useAdminUsers(filters)
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const updateRoleMutation = useUpdateUserRole()
  const toggleStatusMutation = useToggleUserStatus()

  // Handlers
  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role.toLowerCase() as 'regular' | 'admin',
      isActive: user.isActive
    })
    onEditModalOpen()
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    
    const updateData: Record<string, any> = {}
    if (formData.email !== editingUser.email) updateData.email = formData.email
    if (formData.name !== editingUser.name) updateData.name = formData.name
    if (formData.role !== editingUser.role.toLowerCase()) updateData.role = formData.role
    if (formData.isActive !== editingUser.isActive) updateData.isActive = formData.isActive

    if (Object.keys(updateData).length === 0) {
      onEditModalClose()
      return
    }

    try {
      await updateUserMutation.mutateAsync({ userId: editingUser.id, data: updateData })
      onEditModalClose()
      setEditingUser(null)
    } catch (err) {
      console.error('Ошибка обновления:', err)
      alert('Ошибка при обновлении пользователя')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id)
      onDeleteModalClose()
      setSelectedUser(null)
    } catch (err) {
      console.error('Ошибка удаления:', err)
      alert('Ошибка при удалении пользователя')
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(userId)
    } catch (err) {
      console.error('Ошибка переключения статуса:', err)
      alert('Ошибка при изменении статуса пользователя')
    }
  }

  const handleChangeRole = async (userId: string, newRole: 'regular' | 'admin') => {
    try {
      await updateRoleMutation.mutateAsync({ userId, data: { role: newRole } })
    } catch (err) {
      console.error('Ошибка смены роли:', err)
      alert('Ошибка при изменении роли пользователя')
    }
  }

  const handleOpenDeleteModal = (user: AdminUser) => {
    setSelectedUser(user)
    onDeleteModalOpen()
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
          <p className="text-danger">Ошибка загрузки пользователей: {error.toString()}</p>
        </CardBody>
      </Card>
    )
  }

  const users = usersData?.users || []
  const pagination = usersData?.pagination
  const total = pagination?.total || 0
  const totalPages = pagination?.pages || 1
  const currentPage = pagination?.page || 1

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'warning' : 'default'
  }

  const getRoleText = (role: string) => {
    return role === 'ADMIN' ? 'Администратор' : 'Пользователь'
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'danger'
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Заблокирован'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Управление пользователями</h2>
            <p className="text-gray-600">Всего пользователей: {total}</p>
          </div>
        </CardHeader>
        <CardBody>
          {/* Фильтры */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Поиск по имени или email..."
              startContent={<MdSearch />}
              value={filters.search || ''}
              onValueChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
              className="flex-1"
            />
            <Select
              placeholder="Фильтр по роли"
              value={filters.role || ''}
              onChange={(e) => setFilters({ ...filters, role: e.target.value as 'regular' | 'admin' | undefined, page: 1 })}
              className="w-full sm:w-48"
            >
              <SelectItem key="">Все роли</SelectItem>
              <SelectItem key="regular">Пользователи</SelectItem>
              <SelectItem key="admin">Администраторы</SelectItem>
            </Select>
            <Button
              variant="flat"
              startContent={<MdFilterList />}
              onPress={() => setFilters({ page: 1, limit: 20, search: '', role: undefined })}
            >
              Сбросить
            </Button>
          </div>

          {/* Таблица */}
          <Table aria-label="Таблица пользователей">
            <TableHeader>
              <TableColumn>ПОЛЬЗОВАТЕЛЬ</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>РОЛЬ</TableColumn>
              <TableColumn>СТАТУС</TableColumn>
              <TableColumn>РЕГИСТРАЦИЯ</TableColumn>
              <TableColumn>СТАТИСТИКА</TableColumn>
              <TableColumn>ДЕЙСТВИЯ</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{user.name || 'Без имени'}</p>
                      <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip color={getRoleColor(user.role)} variant="flat" size="sm">
                      {getRoleText(user.role)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(user.isActive)} variant="flat" size="sm">
                      {getStatusText(user.isActive)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatAdminDate(user.createdAt)}</div>
                      {user.lastSeen && (
                        <div className="text-gray-500">
                          Был: {formatAdminDate(user.lastSeen)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Посты: {user._count.post}</div>
                      <div>Комментарии: {user._count.comments}</div>
                      <div>Лайки: {user._count.likes}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <MdMoreVert />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          startContent={<MdEdit />}
                          onPress={() => handleEditUser(user)}
                        >
                          Редактировать
                        </DropdownItem>
                        <DropdownItem
                          key="toggle-status"
                          startContent={user.isActive ? <MdLock /> : <MdLockOpen />}
                          onPress={() => handleToggleStatus(user.id)}
                        >
                          {user.isActive ? 'Заблокировать' : 'Разблокировать'}
                        </DropdownItem>
                        <DropdownItem
                          key="change-role"
                          onPress={() => handleChangeRole(
                            user.id, 
                            user.role === 'ADMIN' ? 'regular' : 'admin'
                          )}
                        >
                          {user.role === 'ADMIN' ? 'Снять права админа' : 'Сделать админом'}
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<MdDelete />}
                          onPress={() => handleOpenDeleteModal(user)}
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

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Модальное окно редактирования */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>Редактировать пользователя</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Имя"
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onValueChange={(value) => setFormData({ ...formData, email: value })}
              />
              <Select
                label="Роль"
                selectedKeys={[formData.role]}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'regular' | 'admin' })}
              >
                <SelectItem key="regular">Пользователь</SelectItem>
                <SelectItem key="admin">Администратор</SelectItem>
              </Select>
              <Select
                label="Статус"
                selectedKeys={[formData.isActive ? 'active' : 'inactive']}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
              >
                <SelectItem key="active">Активен</SelectItem>
                <SelectItem key="inactive">Заблокирован</SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditModalClose}>
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleUpdateUser}
              isLoading={updateUserMutation.isPending}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальное окно удаления */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>Подтверждение удаления</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить пользователя{' '}
              <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Это действие необратимо. Все данные пользователя будут удалены.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              Отмена
            </Button>
            <Button 
              color="danger" 
              onPress={handleDeleteUser}
              isLoading={deleteUserMutation.isPending}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default UserManagement
