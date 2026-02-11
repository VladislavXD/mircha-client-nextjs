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
//   Image,
//   Divider,
//   useDisclosure,
// } from '@heroui/react'
// import { toast } from 'react-hot-toast'
// import {
//   MdSearch,
//   MdDelete,
//   MdVisibility,
//   MdFilterList,
//   MdMoreVert,
//   MdImage,
//   MdSchedule,
//   MdPerson,
//   MdForum,
//   MdVideoLibrary,
//   MdAudioFile,
//   MdInsertDriveFile,
//   MdDownload,
// } from 'react-icons/md'
// import { 
//   useGetAdminMediaQuery, 
//   useDeleteAdminMediaMutation,
//   type AdminMediaFile,
//   type MediaFilter,
// } from "@/src/services/admin.service.old" // TODO: Migrate to React Query from @/src/features/admin
// import { formatDate, formatFileSize } from "@/src/services/admin.utils"

// interface MediaManagementProps {
//   className?: string
// }

// export default function MediaManagement({ className }: MediaManagementProps) {
//   // Состояние фильтров
//   const [filters, setFilters] = useState<MediaFilter>({
//     page: 1,
//     limit: 10,
//   })
  
//   // Состояние UI
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedMedia, setSelectedMedia] = useState<AdminMediaFile | null>(null)
//   const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  
//   // Модалки
//   const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
//   const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

//   // Данные и мутации
//   const { data: mediaData, isLoading, error, refetch } = useGetAdminMediaQuery(filters)
//   const [deleteMedia, { isLoading: isDeleting }] = useDeleteAdminMediaMutation()

//   // Дебаунс поиска
//   useEffect(() => {
//     const delayedSearch = setTimeout(() => {
//       setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
//     }, 500)

//     return () => clearTimeout(delayedSearch)
//   }, [searchTerm])

//   const media = mediaData?.media || []
//   const total = mediaData?.total || 0
//   const totalPages = mediaData?.totalPages || 1

//   // Обработчики
//   const handleFilterChange = (key: keyof MediaFilter, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
//   }

//   const handlePageChange = (page: number) => {
//     setFilters(prev => ({ ...prev, page }))
//   }

//   const handleViewMedia = (mediaFile: AdminMediaFile) => {
//     setSelectedMedia(mediaFile)
//     onViewOpen()
//   }

//   const handleDeleteMedia = async () => {
//     if (!selectedMedia) return

//     try {
//       await deleteMedia(selectedMedia.id).unwrap()
//       toast.success('Медиафайл успешно удален')
//       onDeleteClose()
//       setSelectedMedia(null)
//       refetch()
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Ошибка при удалении медиафайла')
//     }
//   }

//   const resetFilters = () => {
//     setFilters({ page: 1, limit: 10 })
//     setSearchTerm('')
//   }

//   const getMediaTypeIcon = (type: string) => {
//     if (type.startsWith('image/')) return <MdImage className="text-blue-500" />
//     if (type.startsWith('video/')) return <MdVideoLibrary className="text-red-500" />
//     if (type.startsWith('audio/')) return <MdAudioFile className="text-green-500" />
//     return <MdInsertDriveFile className="text-gray-500" />
//   }

//   const getMediaTypeChip = (type: string) => {
//     if (type.startsWith('image/')) {
//       return <Chip color="primary" size="sm">Изображение</Chip>
//     }
//     if (type.startsWith('video/')) {
//       return <Chip color="danger" size="sm">Видео</Chip>
//     }
//     if (type.startsWith('audio/')) {
//       return <Chip color="success" size="sm">Аудио</Chip>
//     }
//     return <Chip color="default" size="sm">Файл</Chip>
//   }

//   const handleDownload = (mediaFile: AdminMediaFile) => {
//     const link = document.createElement('a')
//     link.href = mediaFile.url
//     link.download = mediaFile.filename
//     link.target = '_blank'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   if (error) {
//     return (
//       <Card className={className}>
//         <CardBody className="text-center py-8">
//           <p className="text-danger">Ошибка загрузки медиафайлов</p>
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
//             <MdImage className="text-primary" size={24} />
//             <h2 className="text-lg sm:text-xl font-semibold">Управление медиа</h2>
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
//                 placeholder="Поиск по имени файла..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 startContent={<MdSearch />}
//                 className="flex-1"
//                 isClearable
//               />
//             </div>

//             {isFiltersVisible && (
//               <Card className="bg-content2">
//                 <CardBody>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <Select
//                       label="Тип файла"
//                       placeholder="Все типы"
//                       selectedKeys={filters.type ? [filters.type] : []}
//                       onSelectionChange={(keys) => 
//                         handleFilterChange('type', Array.from(keys)[0] || undefined)
//                       }
//                     >
//                       <SelectItem key="all">Все типы</SelectItem>
//                       <SelectItem key="image">Изображения</SelectItem>
//                       <SelectItem key="video">Видео</SelectItem>
//                       <SelectItem key="audio">Аудио</SelectItem>
//                       <SelectItem key="other">Другие</SelectItem>
//                     </Select>

//                     <Input
//                       label="ID треда"
//                       placeholder="Введите ID треда"
//                       value={filters.threadShortId || ''}
//                       onChange={(e) => handleFilterChange('threadShortId', e.target.value || undefined)}
//                     />

//                     <Input
//                       label="ID ответа"
//                       placeholder="Введите ID ответа"
//                       value={filters.replyShortId || ''}
//                       onChange={(e) => handleFilterChange('replyShortId', e.target.value || undefined)}
//                     />

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

//           {/* Таблица медиафайлов */}
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <Spinner size="lg" />
//             </div>
//           ) : (
//             <>
//               <Table
//                 aria-label="Таблица медиафайлов"
//                 className="min-h-[400px]"
//                 classNames={{
//                   wrapper: "shadow-none border border-divider",
//                 }}
//               >
//                 <TableHeader>
//                   <TableColumn>ПРЕВЬЮ</TableColumn>
//                   <TableColumn>ФАЙЛ</TableColumn>
//                   <TableColumn>ТИП</TableColumn>
//                   <TableColumn>РАЗМЕР</TableColumn>
//                   <TableColumn>СВЯЗЬ</TableColumn>
//                   <TableColumn>СОЗДАН</TableColumn>
//                   <TableColumn>ДЕЙСТВИЯ</TableColumn>
//                 </TableHeader>
//                 <TableBody emptyContent="Медиафайлы не найдены">
//                   {media.map((mediaFile: AdminMediaFile) => (
//                     <TableRow key={mediaFile.id}>
//                       <TableCell>
//                         <div className="w-16 h-16 bg-content2 rounded-lg overflow-hidden flex items-center justify-center">
//                           {mediaFile.type.startsWith('image/') ? (
//                             <Image
//                               src={mediaFile.url}
//                               alt={mediaFile.filename}
//                               className="w-full h-full object-cover"
//                               fallbackSrc="/placeholder-image.png"
//                             />
//                           ) : (
//                             getMediaTypeIcon(mediaFile.type)
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="max-w-xs">
//                           <p className="font-medium truncate">
//                             {mediaFile.filename}
//                           </p>
//                           <p className="text-small text-default-500">
//                             {mediaFile.originalName}
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {getMediaTypeChip(mediaFile.type)}
//                       </TableCell>
//                       <TableCell>
//                         <span className="text-small">
//                           {formatFileSize(mediaFile.size)}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <div className="space-y-1">
//                           {mediaFile.thread && (
//                             <div className="flex items-center gap-1">
//                               <MdForum className="text-default-400" size={14} />
//                               <span className="text-tiny">
//                                 Тред: {mediaFile.thread.shortId}
//                               </span>
//                             </div>
//                           )}
//                           {mediaFile.reply && (
//                             <div className="flex items-center gap-1">
//                               <MdForum className="text-default-400" size={14} />
//                               <span className="text-tiny">
//                                 Ответ: {mediaFile.reply.shortId}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <MdSchedule className="text-default-400" size={16} />
//                           <span className="text-small">
//                             {formatDate(mediaFile.createdAt)}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <Tooltip content="Просмотр">
//                             <Button
//                               size="sm"
//                               variant="light"
//                               isIconOnly
//                               onPress={() => handleViewMedia(mediaFile)}
//                             >
//                               <MdVisibility />
//                             </Button>
//                           </Tooltip>
                          
//                           <Tooltip content="Скачать">
//                             <Button
//                               size="sm"
//                               variant="light"
//                               isIconOnly
//                               onPress={() => handleDownload(mediaFile)}
//                             >
//                               <MdDownload />
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
//                                 key="delete"
//                                 startContent={<MdDelete />}
//                                 color="danger"
//                                 onPress={() => {
//                                   setSelectedMedia(mediaFile)
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

//       {/* Модалка просмотра медиафайла */}
//       <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl" scrollBehavior="inside">
//         <ModalContent>
//           <ModalHeader>Просмотр медиафайла</ModalHeader>
//           <ModalBody>
//             {selectedMedia && (
//               <div className="space-y-4">
//                 {/* Превью медиа */}
//                 <div className="flex justify-center bg-content2 rounded-lg p-4">
//                   {selectedMedia.type.startsWith('image/') ? (
//                     <Image
//                       src={selectedMedia.url}
//                       alt={selectedMedia.filename}
//                       className="max-w-full max-h-96 object-contain"
//                       fallbackSrc="/placeholder-image.png"
//                     />
//                   ) : selectedMedia.type.startsWith('video/') ? (
//                     <video
//                       controls
//                       className="max-w-full max-h-96"
//                       src={selectedMedia.url}
//                     >
//                       Ваш браузер не поддерживает видео.
//                     </video>
//                   ) : selectedMedia.type.startsWith('audio/') ? (
//                     <audio controls className="w-full">
//                       <source src={selectedMedia.url} type={selectedMedia.type} />
//                       Ваш браузер не поддерживает аудио.
//                     </audio>
//                   ) : (
//                     <div className="flex flex-col items-center py-8">
//                       {getMediaTypeIcon(selectedMedia.type)}
//                       <p className="mt-2 text-default-500">Предпросмотр недоступен</p>
//                     </div>
//                   )}
//                 </div>

//                 <Divider />

//                 {/* Информация о файле */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Имя файла</h3>
//                     <p>{selectedMedia.filename}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Оригинальное имя</h3>
//                     <p>{selectedMedia.originalName}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Тип файла</h3>
//                     <div className="flex items-center gap-2">
//                       {getMediaTypeIcon(selectedMedia.type)}
//                       <span>{selectedMedia.type}</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Размер</h3>
//                     <p>{formatFileSize(selectedMedia.size)}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Создан</h3>
//                     <p>{formatDate(selectedMedia.createdAt)}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">URL</h3>
//                     <p className="text-small text-default-500 break-all">
//                       {selectedMedia.url}
//                     </p>
//                   </div>
//                 </div>

//                 <Divider />

//                 {/* Связанные объекты */}
//                 <div>
//                   <h3 className="font-semibold mb-2">Связанные объекты</h3>
//                   <div className="space-y-2">
//                     {selectedMedia.thread && (
//                       <Card>
//                         <CardBody className="py-2">
//                           <div className="flex items-center gap-2">
//                             <MdForum className="text-default-400" />
//                             <span className="text-small">
//                               Тред: {selectedMedia.thread.shortId}
//                             </span>
//                           </div>
//                           {selectedMedia.thread.title && (
//                             <p className="text-small text-default-500 mt-1">
//                               {selectedMedia.thread.title}
//                             </p>
//                           )}
//                         </CardBody>
//                       </Card>
//                     )}
                    
//                     {selectedMedia.reply && (
//                       <Card>
//                         <CardBody className="py-2">
//                           <div className="flex items-center gap-2">
//                             <MdForum className="text-default-400" />
//                             <span className="text-small">
//                               Ответ: {selectedMedia.reply.shortId}
//                             </span>
//                           </div>
//                           <p className="text-small text-default-500 mt-1 truncate">
//                             {selectedMedia.reply.content}
//                           </p>
//                         </CardBody>
//                       </Card>
//                     )}

//                     {!selectedMedia.thread && !selectedMedia.reply && (
//                       <p className="text-small text-default-500">
//                         Файл не связан с тредом или ответом
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               color="primary"
//               variant="flat"
//               onPress={() => selectedMedia && handleDownload(selectedMedia)}
//               startContent={<MdDownload />}
//             >
//               Скачать
//             </Button>
//             <Button color="danger" variant="light" onPress={onViewClose}>
//               Закрыть
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Модалка удаления медиафайла */}
//       <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
//         <ModalContent>
//           <ModalHeader>Подтверждение удаления</ModalHeader>
//           <ModalBody>
//             <p>
//               Вы уверены, что хотите удалить файл{' '}
//               <span className="font-semibold">
//                 "{selectedMedia?.filename}"
//               </span>
//               ?
//             </p>
//             <p className="text-small text-danger">
//               Это действие нельзя отменить. Файл будет удален с сервера и из базы данных.
//             </p>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="danger" variant="light" onPress={onDeleteClose}>
//               Отмена
//             </Button>
//             <Button
//               color="danger"
//               onPress={handleDeleteMedia}
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
