// 'use client'

// import React, { useState, useMemo } from 'react'
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Card,
//   CardBody,
//   CardHeader,
//   Input,
//   Button,
//   Chip,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Pagination,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
//   Spinner,
//   Select,
//   SelectItem
// } from '@heroui/react'
// import { 
//   MdSearch, 
//   MdMoreVert, 
//   MdEdit, 
//   MdDelete, 
//   MdPersonAdd, 
//   MdLock, 
//   MdLockOpen,
//   MdFilterList 
// } from 'react-icons/md'
// import { 
//   useGetAdminUsersQuery, 
//   useCreateAdminUserMutation, 
//   useUpdateAdminUserMutation, 
//   useDeleteAdminUserMutation,
//   type AdminUser,
//   type UsersFilter,
//   type CreateUserRequest,
//   type UpdateUserRequest
// } from '@/src/services/admin.service'
// import { toast } from 'react-hot-toast'
// import { 
//   formatAdminDate, 
//   getRoleColor, 
//   getRoleText, 
//   getStatusColor, 
//   getStatusText,
//   validateEmail,
//   validateUsername,
//   validatePassword,
//   handleApiError,
//   debounce
// } from '@/src/services/admin.utils'

// const UserManagement: React.FC = () => {
//   // Состояние фильтров
//   const [filters, setFilters] = useState<UsersFilter>({
//     page: 1,
//     limit: 20,
//     search: '',
//     role: '',
//     isActive: ''
//   })
  
//   // Состояние модальных окон
//   const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
//   const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
//   const [formData, setFormData] = useState<CreateUserRequest>({
//     username: '',
//     email: '',
//     password: '',
//     role: 'USER',
//     isActive: true
//   })
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
//   const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure()
//   const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure()
//   const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()

//   // RTK Query hooks
//   const { data: usersData, isLoading, error, refetch } = useGetAdminUsersQuery(filters)
//   const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation()
//   const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation()
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation()

//   // Дебаунс для поиска
//   const debouncedSearch = useMemo(
//     () => debounce((value: string) => {
//       setFilters(prev => ({ ...prev, search: value, page: 1 }))
//     }, 300),
//     []
//   )

//   // Обработчики фильтров
//   const handleSearchChange = (value: string) => {
//     debouncedSearch(value)
//   }

//   const handleRoleFilterChange = (role: string) => {
//     setFilters(prev => ({ ...prev, role: role === 'all' ? '' : role, page: 1 }))
//   }

//   const handleStatusFilterChange = (status: string) => {
//     setFilters(prev => ({ 
//       ...prev, 
//       isActive: status === 'all' ? '' : (status === 'active' ? 'true' : 'false'),
//       page: 1 
//     }))
//   }

//   const handlePageChange = (page: number) => {
//     setFilters(prev => ({ ...prev, page }))
//   }

//   // Валидация формы
//   const validateForm = (data: CreateUserRequest | UpdateUserRequest): Record<string, string> => {
//     const errors: Record<string, string> = {}

//     if ('username' in data && data.username) {
//       if (!validateUsername(data.username)) {
//         errors.username = 'Имя пользователя должно содержать от 3 до 50 символов и состоять из букв, цифр и _'
//       }
//     }

//     if ('email' in data && data.email) {
//       if (!validateEmail(data.email)) {
//         errors.email = 'Некорректный email адрес'
//       }
//     }

//     if ('password' in data && data.password) {
//       if (!validatePassword(data.password)) {
//         errors.password = 'Пароль должен содержать минимум 6 символов'
//       }
//     }

//     return errors
//   }

//   // Обработчики CRUD операций
//   const handleCreateUser = async () => {
//     if (isCreating) return // Предотвращаем повторные запросы
    
//     const errors = validateForm(formData)
//     setFormErrors(errors)

//     if (Object.keys(errors).length === 0) {
//       try {
//         await createUser(formData).unwrap()
//         toast.success('Пользователь успешно создан')
//         onCreateModalClose()
//         setFormData({
//           username: '',
//           email: '',
//           password: '',
//           role: 'USER',
//           isActive: true
//         })
//         refetch()
//       } catch (error: any) {
//         console.error('Ошибка создания пользователя:', error)
//         const errorMessage = handleApiError(error)
//         toast.error(errorMessage)
//       }
//     }
//   }

//   const handleEditUser = (user: AdminUser) => {
//     setEditingUser(user)
//     setFormData({
//       username: user.username,
//       email: user.email,
//       password: '',
//       role: user.role,
//       isActive: user.isActive
//     })
//     onEditModalOpen()
//   }

//   const handleUpdateUser = async () => {
//     if (!editingUser || isUpdating) return // Предотвращаем повторные запросы

//     const updateData: UpdateUserRequest = {
//       username: formData.username !== editingUser.username ? formData.username : undefined,
//       email: formData.email !== editingUser.email ? formData.email : undefined,
//       password: formData.password ? formData.password : undefined,
//       role: formData.role !== editingUser.role ? formData.role : undefined,
//       isActive: formData.isActive !== editingUser.isActive ? formData.isActive : undefined
//     }

//     // Добавляем пароль только если он введен
//     if (formData.password && formData.password.trim() !== '') {
//       updateData.password = formData.password
//     }

//     // Удаляем пустые поля
//     Object.keys(updateData).forEach(key => {
//       if (updateData[key as keyof UpdateUserRequest] === undefined) {
//         delete updateData[key as keyof UpdateUserRequest]
//       }
//     })

//     const errors = validateForm(updateData)
//     setFormErrors(errors)

//     if (Object.keys(errors).length === 0) {
//       try {
//         await updateUser({ id: editingUser.id, data: updateData }).unwrap()
//         toast.success('Пользователь успешно обновлен')
//         onEditModalClose()
//         setEditingUser(null)
//         refetch()
//       } catch (error: any) {
//         console.error('Ошибка обновления пользователя:', error)
//         const errorMessage = handleApiError(error)
//         toast.error(errorMessage)
//       }
//     }
//   }

//   const handleDeleteUser = async () => {
//     if (!selectedUser || isDeleting) return // Предотвращаем повторные запросы

//     try {
//       await deleteUser(selectedUser.id).unwrap()
//       toast.success('Пользователь успешно удален')
//       onDeleteModalClose()
//       setSelectedUser(null)
//       refetch()
//     } catch (error: any) {
//       console.error('Ошибка удаления пользователя:', error)
//       const errorMessage = handleApiError(error)
//       toast.error(errorMessage)
//     }
//   }

//   const handleToggleUserStatus = async (user: AdminUser) => {
//     try {
//       await updateUser({
//         id: user.id,
//         data: { isActive: !user.isActive }
//       }).unwrap()
//       toast.success(`Пользователь ${user.isActive ? 'заблокирован' : 'разблокирован'}`)
//       refetch()
//     } catch (error: any) {
//       console.error('Ошибка изменения статуса пользователя:', error)
//       const errorMessage = handleApiError(error)
//       toast.error(errorMessage)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-96">
//         <Spinner size="lg" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <Card className="bg-danger-50 border-danger-200">
//         <CardBody>
//           <p className="text-danger">Ошибка загрузки пользователей: {error.toString()}</p>
//         </CardBody>
//       </Card>
//     )
//   }

//   const users = usersData?.users || []
//   const total = usersData?.total || 0
//   const totalPages = usersData?.totalPages || 1
//   const currentPage = usersData?.page || 1

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold">Управление пользователями</h2>
//             <p className="text-sm sm:text-base text-gray-600">Всего пользователей: {total}</p>
//           </div>
//           <Button
//             color="primary"
//             startContent={<MdPersonAdd />}
//             onPress={onCreateModalOpen}
//             size="sm"
//             className="w-full sm:w-auto"
//           >
//             <span className="hidden sm:inline">Добавить пользователя</span>
//             <span className="sm:hidden">Добавить</span>
//           </Button>
//         </CardHeader>
//         <CardBody>
//           {/* Фильтры */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <Input
//               placeholder="Поиск по имени или email..."
//               startContent={<MdSearch />}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full sm:max-w-xs"
//             />
//             <Select
//               placeholder="Роль"
//               startContent={<MdFilterList />}
//               onChange={(e) => handleRoleFilterChange(e.target.value)}
//               className="w-full sm:max-w-xs"
//             >
//               <SelectItem key="all">Все роли</SelectItem>
//               <SelectItem key="USER">Пользователь</SelectItem>
//               <SelectItem key="MODERATOR">Модератор</SelectItem>
//               <SelectItem key="ADMIN">Администратор</SelectItem>
//             </Select>
//             <Select
//               placeholder="Статус"
//               onChange={(e) => handleStatusFilterChange(e.target.value)}
//               className="w-full sm:max-w-xs"
//             >
//               <SelectItem key="all">Все статусы</SelectItem>
//               <SelectItem key="active">Активные</SelectItem>
//               <SelectItem key="inactive">Заблокированные</SelectItem>
//             </Select>
//           </div>

//           {/* Таблица пользователей */}
//           <div className="overflow-x-auto">
//             <Table aria-label="Таблица пользователей" className="min-w-full">
//               <TableHeader>
//                 <TableColumn className="min-w-48">ПОЛЬЗОВАТЕЛЬ</TableColumn>
//                 <TableColumn className="min-w-24">РОЛЬ</TableColumn>
//                 <TableColumn className="min-w-24">СТАТУС</TableColumn>
//                 <TableColumn className="min-w-32 hidden sm:table-cell">СТАТИСТИКА</TableColumn>
//                 <TableColumn className="min-w-32 hidden md:table-cell">СОЗДАН</TableColumn>
//                 <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
//               </TableHeader>
//               <TableBody emptyContent="Пользователи не найдены">
//                 {users.map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell className="min-w-48">
//                       <div>
//                         <p className="font-semibold text-sm sm:text-base">{user.username}</p>
//                         <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
//                       </div>
//                     </TableCell>
//                     <TableCell className="min-w-24">
//                       <Chip
//                         className={getRoleColor(user.role)}
//                         size="sm"
//                         variant="flat"
//                       >
//                         {getRoleText(user.role)}
//                       </Chip>
//                     </TableCell>
//                     <TableCell className="min-w-24">
//                       <Chip
//                         className={getStatusColor(user.isActive)}
//                         size="sm"
//                         variant="flat"
//                       >
//                         {getStatusText(user.isActive)}
//                       </Chip>
//                     </TableCell>
//                     <TableCell className="min-w-32 hidden sm:table-cell">
//                       <div className="text-xs sm:text-sm">
//                         <div>Посты: {user._count?.posts || 0}</div>
//                         <div>Ответы: {user._count?.replies || 0}</div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="min-w-32 hidden md:table-cell">
//                       <div className="text-xs sm:text-sm">
//                         {formatAdminDate(user.createdAt)}
//                       </div>
//                     </TableCell>
//                   <TableCell>
//                     <Dropdown>
//                       <DropdownTrigger>
//                         <Button isIconOnly size="sm" variant="light">
//                           <MdMoreVert />
//                         </Button>
//                       </DropdownTrigger>
//                       <DropdownMenu aria-label="Действия пользователя">
//                         <DropdownItem
//                           key="edit"
//                           startContent={<MdEdit />}
//                           onPress={() => handleEditUser(user)}
//                         >
//                           Редактировать
//                         </DropdownItem>
//                         <DropdownItem
//                           key="toggle-status"
//                           startContent={user.isActive ? <MdLock /> : <MdLockOpen />}
//                           onPress={() => handleToggleUserStatus(user)}
//                         >
//                           {user.isActive ? 'Заблокировать' : 'Разблокировать'}
//                         </DropdownItem>
//                         <DropdownItem
//                           key="delete"
//                           className="text-danger"
//                           color="danger"
//                           startContent={<MdDelete />}
//                           onPress={() => {
//                             setSelectedUser(user)
//                             onDeleteModalOpen()
//                           }}
//                         >
//                           Удалить
//                         </DropdownItem>
//                       </DropdownMenu>
//                     </Dropdown>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           </div>

//           {/* Пагинация */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-6">
//               <Pagination
//                 total={totalPages}
//                 page={currentPage}
//                 onChange={handlePageChange}
//                 showControls
//               />
//             </div>
//           )}
//         </CardBody>
//       </Card>

//       {/* Модальное окно создания пользователя */}
//       <Modal 
//         isOpen={isCreateModalOpen} 
//         onClose={onCreateModalClose}
//         size="2xl"
//         scrollBehavior="inside"
//         classNames={{
//           base: "mx-2 sm:mx-4",
//           body: "px-4 sm:px-6",
//           header: "px-4 sm:px-6",
//           footer: "px-4 sm:px-6"
//         }}
//       >
//         <ModalContent>
//           <ModalHeader>Создать пользователя</ModalHeader>
//           <ModalBody>
//             <div className="space-y-4">
//               <Input
//                 label="Имя пользователя"
//                 value={formData.username}
//                 onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
//                 isInvalid={!!formErrors.username}
//                 errorMessage={formErrors.username}
//               />
//               <Input
//                 label="Email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                 isInvalid={!!formErrors.email}
//                 errorMessage={formErrors.email}
//               />
//               <Input
//                 label="Пароль"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                 isInvalid={!!formErrors.password}
//                 errorMessage={formErrors.password}
//               />
//               <Select
//                 label="Роль"
//                 value={formData.role}
//                 onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
//               >
//                 <SelectItem key="USER">Пользователь</SelectItem>
//                 <SelectItem key="MODERATOR">Модератор</SelectItem>
//                 <SelectItem key="ADMIN">Администратор</SelectItem>
//               </Select>
//             </div>
//           </ModalBody>
//           <ModalFooter className="flex flex-col sm:flex-row gap-3">
//             <Button 
//               variant="light" 
//               onPress={onCreateModalClose}
//               className="w-full sm:w-auto order-2 sm:order-1"
//             >
//               Отмена
//             </Button>
//             <Button 
//               color="primary" 
//               onPress={handleCreateUser}
//               isLoading={isCreating}
//               className="w-full sm:w-auto order-1 sm:order-2"
//             >
//               Создать
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Модальное окно редактирования пользователя */}
//       <Modal 
//         isOpen={isEditModalOpen} 
//         onClose={onEditModalClose}
//         size="2xl"
//         scrollBehavior="inside"
//         classNames={{
//           base: "mx-2 sm:mx-4",
//           body: "px-4 sm:px-6",
//           header: "px-4 sm:px-6",
//           footer: "px-4 sm:px-6"
//         }}
//       >
//         <ModalContent>
//           <ModalHeader>Редактировать пользователя</ModalHeader>
//           <ModalBody>
//             <div className="space-y-4">
//               <Input
//                 label="Имя пользователя"
//                 value={formData.username}
//                 onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
//                 isInvalid={!!formErrors.username}
//                 errorMessage={formErrors.username}
//               />
//               <Input
//                 label="Email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                 isInvalid={!!formErrors.email}
//                 errorMessage={formErrors.email}
//               />
//               <Input
//                 label="Новый пароль (оставьте пустым, чтобы не менять)"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                 isInvalid={!!formErrors.password}
//                 errorMessage={formErrors.password}
//               />
//               <Select
//                 label="Роль"
//                 value={formData.role}
//                 onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
//               >
//                 <SelectItem key="USER">Пользователь</SelectItem>
//                 <SelectItem key="MODERATOR">Модератор</SelectItem>
//                 <SelectItem key="ADMIN">Администратор</SelectItem>
//               </Select>
//             </div>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="light" onPress={onEditModalClose}>
//               Отмена
//             </Button>
//             <Button 
//               color="primary" 
//               onPress={handleUpdateUser}
//               isLoading={isUpdating}
//             >
//               Сохранить
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Модальное окно удаления пользователя */}
//       <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
//         <ModalContent>
//           <ModalHeader>Удалить пользователя</ModalHeader>
//           <ModalBody>
//             <p>
//               Вы уверены, что хотите удалить пользователя{' '}
//               <strong>{selectedUser?.username}</strong>?
//             </p>
//             <p className="text-sm text-gray-600">
//               Это действие нельзя отменить. Все данные пользователя будут безвозвратно удалены.
//             </p>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="light" onPress={onDeleteModalClose}>
//               Отмена
//             </Button>
//             <Button 
//               color="danger" 
//               onPress={handleDeleteUser}
//               isLoading={isDeleting}
//             >
//               Удалить
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </div>
//   )
// }

// export default UserManagement
