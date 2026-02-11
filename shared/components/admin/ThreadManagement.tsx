// 'use client'

// import React, { useState, useEffect } from 'react'
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Button,
//   Input,
//   Select,
//   SelectItem,
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Chip,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Tooltip,
//   Spinner,
//   Pagination,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Textarea,
//   Divider,
//   useDisclosure,
// } from '@heroui/react'
// import { toast } from 'react-hot-toast'
// import {
//   MdSearch,
//   MdEdit,
//   MdDelete,
//   MdVisibility,
//   MdVisibilityOff,
//   MdFilterList,
//   MdMoreVert,
//   MdForum,
//   MdSchedule,
//   MdPerson,
//   MdLock,
//   MdLockOpen
// } from 'react-icons/md'
// import { 
//   useGetAdminThreadsQuery, 
//   useGetAdminThreadByIdQuery,
//   useUpdateAdminThreadMutation, 
//   useDeleteAdminThreadMutation,
//   type AdminThread,
//   type ThreadsFilter,
//   type UpdateThreadRequest,
// } from "@/src/services/admin.service.old" // TODO: Migrate to React Query from @/src/features/admin
// import { formatDate, getStatusColor } from "@/src/services/admin.utils"

// interface ThreadManagementProps {
//   className?: string
// }

// export default function ThreadManagement({ className }: ThreadManagementProps) {
//   // Состояние фильтров
//   const [filters, setFilters] = useState<ThreadsFilter>({
//     page: 1,
//     limit: 10,
//   })
  
//   // Состояние UI
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedThread, setSelectedThread] = useState<AdminThread | null>(null)
//   const [editingThread, setEditingThread] = useState<AdminThread | null>(null)
//   const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  
//   // Модалки
//   const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
//   const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
//   const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

//   // Данные и мутации
//   const { data: threadsData, isLoading, error, refetch } = useGetAdminThreadsQuery(filters)
//   const [updateThread, { isLoading: isUpdating }] = useUpdateAdminThreadMutation()
//   const [deleteThread, { isLoading: isDeleting }] = useDeleteAdminThreadMutation()

//   // Дебаунс поиска
//   useEffect(() => {
//     const delayedSearch = setTimeout(() => {
//       setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
//     }, 500)

//     return () => clearTimeout(delayedSearch)
//   }, [searchTerm])

//   const threads = threadsData?.threads || []
//   const total = threadsData?.total || 0
//   const totalPages = threadsData?.totalPages || 1

//   // Обработчики
//   const handleFilterChange = (key: keyof ThreadsFilter, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
//   }

//   const handlePageChange = (page: number) => {
//     setFilters(prev => ({ ...prev, page }))
//   }

//   const handleViewThread = (thread: AdminThread) => {
//     setSelectedThread(thread)
//     onViewOpen()
//   }

//   const handleEditThread = (thread: AdminThread) => {
//     setEditingThread(thread)
//     onEditOpen()
//   }

//   const handleUpdateThread = async (data: UpdateThreadRequest) => {
//     if (!editingThread) return

//     try {
//       await updateThread({ id: editingThread.id, data }).unwrap()
//       toast.success('Тред успешно обновлен')
//       onEditClose()
//       setEditingThread(null)
//       refetch()
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Ошибка при обновлении треда')
//     }
//   }

//   const handleDeleteThread = async () => {
//     if (!selectedThread) return

//     try {
//       await deleteThread(selectedThread.id).unwrap()
//       toast.success('Тред успешно удален')
//       onDeleteClose()
//       setSelectedThread(null)
//       refetch()
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Ошибка при удалении треда')
//     }
//   }

//   const handleToggleThreadStatus = async (thread: AdminThread) => {
//     try {
//       await updateThread({ 
//         id: thread.id, 
//         data: { isActive: !thread.isActive } 
//       }).unwrap()
//       toast.success(`Тред ${thread.isActive ? 'заблокирован' : 'разблокирован'}`)
//       refetch()
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Ошибка при изменении статуса треда')
//     }
//   }

//   const handleToggleThreadPinned = async (thread: AdminThread) => {
//     try {
//       await updateThread({ 
//         id: thread.id, 
//         data: { isPinned: !thread.isPinned } 
//       }).unwrap()
//       toast.success(`Тред ${thread.isPinned ? 'откреплен' : 'закреплен'}`)
//       refetch()
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Ошибка при изменении закрепления треда')
//     }
//   }

//   const resetFilters = () => {
//     setFilters({ page: 1, limit: 10 })
//     setSearchTerm('')
//   }

//   const getThreadStatusChip = (thread: AdminThread) => {
//     if (!thread.isActive) {
//       return <Chip color="danger" size="sm">Заблокирован</Chip>
//     }
//     if (thread.isPinned) {
//       return <Chip color="warning" size="sm">Закреплен</Chip>
//     }
//     if (thread.isLocked) {
//       return <Chip color="secondary" size="sm">Заархивирован</Chip>
//     }
//     return <Chip color="success" size="sm">Активный</Chip>
//   }

//   if (error) {
//     return (
//       <Card className={className}>
//         <CardBody className="text-center py-8">
//           <p className="text-danger">Ошибка загрузки тредов</p>
//           <Button color="primary" onPress={() => refetch()} className="mt-4">
//             Повторить
//           </Button>
//         </CardBody>
//       </Card>
//     )
//   }

//   return (
//     <div className={className}>
//       <Card>
//         <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-2">
//             <MdForum className="text-primary" size={24} />
//             <h2 className="text-lg sm:text-xl font-semibold">Управление тредами</h2>
//           </div>
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <Button
//               size="sm"
//               variant="flat"
//               startContent={<MdFilterList />}
//               onPress={() => setIsFiltersVisible(!isFiltersVisible)}
//               className="w-full sm:w-auto"
//             >
//               Фильтры
//             </Button>
//           </div>
//         </CardHeader>

//         <CardBody>
//           {/* Поиск и фильтры */}
//           <div className="space-y-4 mb-6">
//             <div className="flex gap-4 items-center">
//               <Input
//                 placeholder="Поиск по названию, автору..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 startContent={<MdSearch />}
//                 className="flex-1"
//                 isClearable
//                 size="sm"
//               />
//             </div>

//             {isFiltersVisible && (
//               <Card className="bg-content2">
//                 <CardBody>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <Select
//                       label="Борда"
//                       placeholder="Все борды"
//                       selectedKeys={filters.boardShortId ? [filters.boardShortId] : []}
//                       onSelectionChange={(keys) => 
//                         handleFilterChange('boardShortId', Array.from(keys)[0] || undefined)
//                       }
//                     >
//                       <SelectItem key="all">Все борды</SelectItem>
//                       <SelectItem key="b">Борда /b/</SelectItem>
//                       <SelectItem key="dev">Борда /dev/</SelectItem>
//                     </Select>

//                     <Select
//                       label="Статус"
//                       placeholder="Все статусы"
//                       selectedKeys={filters.isActive !== undefined ? [filters.isActive.toString()] : []}
//                       onSelectionChange={(keys) => {
//                         const value = Array.from(keys)[0]
//                         handleFilterChange('isActive', value === 'true' ? true : value === 'false' ? false : undefined)
//                       }}
//                     >
//                       <SelectItem key="all">Все статусы</SelectItem>
//                       <SelectItem key="true">Активные</SelectItem>
//                       <SelectItem key="false">Заблокированные</SelectItem>
//                     </Select>

//                     <Select
//                       label="Закрепленные"
//                       placeholder="Все треды"
//                       selectedKeys={filters.isPinned !== undefined ? [filters.isPinned.toString()] : []}
//                       onSelectionChange={(keys) => {
//                         const value = Array.from(keys)[0]
//                         handleFilterChange('isPinned', value === 'true' ? true : value === 'false' ? false : undefined)
//                       }}
//                     >
//                       <SelectItem key="all">Все треды</SelectItem>
//                       <SelectItem key="true">Закрепленные</SelectItem>
//                       <SelectItem key="false">Обычные</SelectItem>
//                     </Select>

//                     <div className="flex items-end">
//                       <Button
//                         color="secondary"
//                         variant="flat"
//                         onPress={resetFilters}
//                         className="w-full"
//                       >
//                         Сброс
//                       </Button>
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             )}
//           </div>

//           {/* Таблица тредов */}
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <Spinner size="lg" />
//             </div>
//           ) : (
//             <>
//               <Table
//                 aria-label="Таблица тредов"
//                 className="min-h-[400px]"
//                 classNames={{
//                   wrapper: "shadow-none border border-divider overflow-x-auto",
//                 }}
//               >
//                 <TableHeader>
//                   <TableColumn className="min-w-48">ТРЕД</TableColumn>
//                   <TableColumn className="min-w-32 hidden sm:table-cell">АВТОР</TableColumn>
//                   <TableColumn className="min-w-24">БОРДА</TableColumn>
//                   <TableColumn className="min-w-20 hidden md:table-cell">ОТВЕТЫ</TableColumn>
//                   <TableColumn className="min-w-24">СТАТУС</TableColumn>
//                   <TableColumn className="min-w-32 hidden lg:table-cell">СОЗДАН</TableColumn>
//                   <TableColumn className="min-w-24">ДЕЙСТВИЯ</TableColumn>
//                 </TableHeader>
//                 <TableBody emptyContent="Треды не найдены">
//                   {threads.map((thread: AdminThread) => (
//                     <TableRow key={thread.id}>
//                       <TableCell className="min-w-48">
//                         <div className="max-w-xs">
//                           <p className="font-medium truncate text-sm sm:text-base">
//                             {thread.title || 'Без названия'}
//                           </p>
//                           <p className="text-xs sm:text-small text-default-500 truncate">
//                             {thread.content}
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell className="min-w-32 hidden sm:table-cell">
//                         <div className="flex items-center gap-2">
//                           <MdPerson className="text-default-400" />
//                           <span className="text-xs sm:text-small">
//                             {thread.author?.username || thread.authorIp || 'Аноним'}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="min-w-24">
//                         <Chip size="sm" variant="flat">
//                           /{thread.board?.shortId}/
//                         </Chip>
//                       </TableCell>
//                       <TableCell className="min-w-20 hidden md:table-cell">
//                         <div className="flex items-center gap-1">
//                           <MdForum className="text-default-400" size={16} />
//                           <span className="text-xs sm:text-small">{thread.repliesCount || 0}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="min-w-24">
//                         {getThreadStatusChip(thread)}
//                       </TableCell>
//                       <TableCell className="min-w-32 hidden lg:table-cell">
//                         <div className="flex items-center gap-1">
//                           <MdSchedule className="text-default-400" size={16} />
//                           <span className="text-xs sm:text-small">
//                             {formatDate(thread.createdAt)}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="min-w-24">
//                         <div className="flex items-center gap-1">
//                           <Tooltip content="Просмотр">
//                             <Button
//                               size="sm"
//                               variant="light"
//                               isIconOnly
//                               onPress={() => handleViewThread(thread)}
//                             >
//                               <MdVisibility />
//                             </Button>
//                           </Tooltip>
                          
//                           <Dropdown>
//                             <DropdownTrigger>
//                               <Button
//                                 size="sm"
//                                 variant="light"
//                                 isIconOnly
//                               >
//                                 <MdMoreVert />
//                               </Button>
//                             </DropdownTrigger>
//                             <DropdownMenu>
//                               <DropdownItem
//                                 key="edit"
//                                 startContent={<MdEdit />}
//                                 onPress={() => handleEditThread(thread)}
//                               >
//                                 Редактировать
//                               </DropdownItem>
//                               <DropdownItem
//                                 key="toggle-status"
//                                 startContent={thread.isActive ? <MdVisibilityOff /> : <MdVisibility />}
//                                 onPress={() => handleToggleThreadStatus(thread)}
//                               >
//                                 {thread.isActive ? 'Заблокировать' : 'Разблокировать'}
//                               </DropdownItem>
//                               <DropdownItem
//                                 key="toggle-pinned"
//                                 startContent={thread.isPinned ? <MdLockOpen /> : <MdLock />}
//                                 onPress={() => handleToggleThreadPinned(thread)}
//                               >
//                                 {thread.isPinned ? 'Открепить' : 'Закрепить'}
//                               </DropdownItem>
//                               <DropdownItem
//                                 key="delete"
//                                 startContent={<MdDelete />}
//                                 color="danger"
//                                 onPress={() => {
//                                   setSelectedThread(thread)
//                                   onDeleteOpen()
//                                 }}
//                               >
//                                 Удалить
//                               </DropdownItem>
//                             </DropdownMenu>
//                           </Dropdown>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {totalPages > 1 && (
//                 <div className="flex justify-center mt-4">
//                   <Pagination
//                     total={totalPages}
//                     page={filters.page || 1}
//                     onChange={handlePageChange}
//                     showControls
//                     showShadow
//                   />
//                 </div>
//               )}
//             </>
//           )}
//         </CardBody>
//       </Card>

//       {/* Модалка просмотра треда */}
//       <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl" scrollBehavior="inside">
//         <ModalContent>
//           <ModalHeader>Просмотр треда</ModalHeader>
//           <ModalBody>
//             {selectedThread && (
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Заголовок</h3>
//                   <p>{selectedThread.title || 'Без названия'}</p>
//                 </div>

//                 <Divider />

//                 <div>
//                   <h3 className="font-semibold mb-2">Содержание</h3>
//                   <p className="whitespace-pre-wrap">{selectedThread.content}</p>
//                 </div>

//                 <Divider />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Автор</h3>
//                     <p>{selectedThread.author?.username || selectedThread.authorIp || 'Аноним'}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Борда</h3>
//                     <p>/{selectedThread.board?.shortId}/</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Ответов</h3>
//                     <p>{selectedThread.repliesCount || 0}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Создан</h3>
//                     <p>{formatDate(selectedThread.createdAt)}</p>
//                   </div>
//                 </div>

//                 <Divider />

//                 <div>
//                   <h3 className="font-semibold mb-2">Статус</h3>
//                   <div className="flex gap-2">
//                     {getThreadStatusChip(selectedThread)}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button color="danger" variant="light" onPress={onViewClose}>
//               Закрыть
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Модалка редактирования треда */}
//       <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
//         <ModalContent>
//           <ModalHeader>Редактирование треда</ModalHeader>
//           <ModalBody>
//             {editingThread && (
//               <ThreadEditForm
//                 thread={editingThread}
//                 onSubmit={handleUpdateThread}
//                 isLoading={isUpdating}
//               />
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//       {/* Модалка удаления треда */}
//       <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
//         <ModalContent>
//           <ModalHeader>Подтверждение удаления</ModalHeader>
//           <ModalBody>
//             <p>
//               Вы уверены, что хотите удалить тред{' '}
//               <span className="font-semibold">
//                 "{selectedThread?.title || 'Без названия'}"
//               </span>
//               ?
//             </p>
//             <p className="text-small text-danger">
//               Это действие нельзя отменить. Все ответы в треде также будут удалены.
//             </p>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="danger" variant="light" onPress={onDeleteClose}>
//               Отмена
//             </Button>
//             <Button
//               color="danger"
//               onPress={handleDeleteThread}
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

// // Форма редактирования треда
// interface ThreadEditFormProps {
//   thread: AdminThread
//   onSubmit: (data: UpdateThreadRequest) => void
//   isLoading: boolean
// }

// function ThreadEditForm({ thread, onSubmit, isLoading }: ThreadEditFormProps) {
//   const [formData, setFormData] = useState({
//     title: thread.title || '',
//     content: thread.content,
//     isActive: thread.isActive,
//     isPinned: thread.isPinned,
//     isLocked: thread.isLocked,
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const updateData: UpdateThreadRequest = {}
    
//     if (formData.title !== thread.title) {
//       updateData.title = formData.title
//     }
//     if (formData.content !== thread.content) {
//       updateData.content = formData.content
//     }
//     if (formData.isActive !== thread.isActive) {
//       updateData.isActive = formData.isActive
//     }
//     if (formData.isPinned !== thread.isPinned) {
//       updateData.isPinned = formData.isPinned
//     }
//     if (formData.isLocked !== thread.isLocked) {
//       updateData.isLocked = formData.isLocked
//     }

//     onSubmit(updateData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Input
//         label="Заголовок"
//         value={formData.title}
//         onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//       />

//       <Textarea
//         label="Содержание"
//         value={formData.content}
//         onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
//         minRows={4}
//         isRequired
//       />

//       <div className="space-y-2">
//         <label className="text-small font-medium">Настройки треда</label>
//         <div className="flex flex-col gap-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
//               className="rounded"
//             />
//             <span className="text-small">Активный</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.isPinned}
//               onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
//               className="rounded"
//             />
//             <span className="text-small">Закрепленный</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.isLocked}
//               onChange={(e) => setFormData(prev => ({ ...prev, isLocked: e.target.checked }))}
//               className="rounded"
//             />
//             <span className="text-small">Заархивированный</span>
//           </label>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2">
//         <Button
//           type="submit"
//           color="primary"
//           isLoading={isLoading}
//         >
//           Сохранить
//         </Button>
//       </div>
//     </form>
//   )
// }
