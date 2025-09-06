'use client'

import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Chip
} from '@heroui/react'
import { useCreateThreadMutation } from '@/src/services/forum.service'
import { toast } from 'react-hot-toast'
import type { Board } from '@/src/types/types'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
  boardName: string
  board: Board
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ 
  isOpen, 
  onClose, 
  boardName, 
  board 
}) => {
  const [createThread, { isLoading }] = useCreateThreadMutation()
  
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    authorName: ''
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error('Содержание треда обязательно')
      return
    }

    if (selectedFiles.length > 5) {
      toast.error('Максимум 5 файлов')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('authorName', formData.authorName || 'Аноним')
      
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file)
      })

      await createThread({ 
        boardName, 
        formData: formDataToSend 
      }).unwrap()
      
      toast.success('Тред создан успешно!')
      onClose()
      setFormData({
        subject: '',
        content: '',
        authorName: ''
      })
      setSelectedFiles([])
    } catch (error: any) {
      toast.error(error?.data?.error || 'Ошибка создания треда')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    // Проверка количества файлов
    if (selectedFiles.length + files.length > 5) {
      toast.error('Максимум 5 файлов')
      return
    }

    // Проверка каждого файла
    for (const file of files) {
      // Проверка размера файла
      if (file.size > (board.maxFileSize || 5242880)) {
        toast.error(`Файл ${file.name} слишком большой. Максимальный размер: ${Math.round((board.maxFileSize || 5242880) / 1024 / 1024)}MB`)
        return
      }

      // Проверка типа файла
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (fileExt && board.allowedFileTypes && !board.allowedFileTypes.includes(fileExt)) {
        toast.error(`Тип файла ${fileExt} не поддерживается. Разрешённые типы: ${board.allowedFileTypes.join(', ')}`)
        return
      }
    }

    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Создать тред в /{boardName}/</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Создайте новую тему для обсуждения
            </p>
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Имя автора */}
            <Input
              label="Имя"
              placeholder="Анон"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              variant="bordered"
              description="Оставьте пустым для анонимности"
            />

            {/* Тема треда */}
            <Input
              label="Тема"
              placeholder="Введите тему треда (необязательно)"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              variant="bordered"
            />

            {/* Содержание */}
            <Textarea
              label="Содержание"
              placeholder="Введите содержание треда..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              variant="bordered"
              minRows={4}
              maxRows={8}
              isRequired
            />

            {/* Загрузка файла */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Изображения/Видео</label>
              <input
                type="file"
                multiple
                accept={board.allowedFileTypes?.map(type => `.${type}`).join(',')}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
              
              {/* Список выбранных файлов */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Выбранные файлы ({selectedFiles.length}/5):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith('image/');
                      const isVideo = file.type.startsWith('video/');
                      
                      return (
                        <div key={index} className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          {/* Превью медиа */}
                          <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
                            {isImage ? (
                              <img
                                src={fileURL}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onLoad={() => URL.revokeObjectURL(fileURL)}
                              />
                            ) : isVideo ? (
                              <video
                                src={fileURL}
                                className="w-full h-full object-cover"
                                muted
                                onLoadedData={() => URL.revokeObjectURL(fileURL)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📄</span>
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {file.name.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Кнопка удаления */}
                            <Button
                              size="sm"
                              color="danger"
                              variant="solid"
                              className="absolute top-1 right-1 min-w-unit-6 w-6 h-6 p-0"
                              onPress={() => removeFile(index)}
                            >
                              ×
                            </Button>

                            {/* Индикатор типа файла */}
                            {isVideo && (
                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                ▶
                              </div>
                            )}
                          </div>

                          {/* Информация о файле */}
                          <div className="p-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Информация о лимитах */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Максимальный размер файла: {Math.round((board.maxFileSize || 5242880) / 1024 / 1024)}MB</p>
                <p>Максимум файлов: 5</p>
                <div className="flex flex-wrap gap-1">
                  <span>Поддерживаемые форматы:</span>
                  {board.allowedFileTypes?.map(type => (
                    <Chip key={type} size="sm" variant="flat" color="default">
                      {type.toUpperCase()}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={isLoading}
            >
              Создать тред
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateThreadModal
