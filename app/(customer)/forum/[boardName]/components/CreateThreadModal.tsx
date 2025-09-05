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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error('Содержание треда обязательно')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('authorName', formData.authorName || 'Аноним')
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }

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
      setSelectedFile(null)
    } catch (error: any) {
      toast.error(error?.data?.error || 'Ошибка создания треда')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка размера файла
      if (file.size > (board.maxFileSize || 5242880)) {
        toast.error(`Файл слишком большой. Максимальный размер: ${Math.round((board.maxFileSize || 5242880) / 1024 / 1024)}MB`)
        return
      }

      // Проверка типа файла
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (fileExt && board.allowedFileTypes && !board.allowedFileTypes.includes(fileExt)) {
        toast.error(`Тип файла не поддерживается. Разрешённые типы: ${board.allowedFileTypes.join(', ')}`)
        return
      }

      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
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
              <label className="text-sm font-medium">Изображение/Видео</label>
              <input
                type="file"
                accept={board.allowedFileTypes?.map(type => `.${type}`).join(',')}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
              
              {selectedFile && (
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={removeFile}
                  >
                    Удалить
                  </Button>
                </div>
              )}

              {/* Информация о лимитах */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Максимальный размер: {Math.round((board.maxFileSize || 5242880) / 1024 / 1024)}MB</p>
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
