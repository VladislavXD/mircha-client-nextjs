'use client'

import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
  Chip,
  Card,
  CardBody
} from '@heroui/react'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import MediaThumbnail from './MediaThumbnail'
import type { Thread, Reply } from '@/src/types/types'
import { useCreateReplyMutation } from '@/src/services/forum.service'

interface ReplyToPostModalProps {
  isOpen: boolean
  onClose: () => void
  boardName: string
  threadId: string
  thread: Thread
  replyToPost?: Thread | Reply // Пост на который отвечаем
  replyToPostId?: string // ID поста на который отвечаем
}

const ReplyToPostModal: React.FC<ReplyToPostModalProps> = ({ 
  isOpen, 
  onClose, 
  boardName, 
  threadId, 
  thread,
  replyToPost,
  replyToPostId
}) => {
  const [createReply, { isLoading }] = useCreateReplyMutation()
  
  const [formData, setFormData] = useState({
    content: '',
    authorName: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // При открытии модального окна добавляем ссылку на пост в начало сообщения
  useEffect(() => {
    if (isOpen && replyToPost) {
      setFormData(prev => ({
        ...prev,
        content: `>>${replyToPost.shortId}\n${prev.content}`
      }))
    }
  }, [isOpen, replyToPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error('Содержание ответа обязательно')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('content', formData.content)
      formDataToSend.append('authorName', formData.authorName || 'Аноним')
      
      // Добавляем ID поста на который отвечаем
      if (replyToPostId) {
        formDataToSend.append('replyToId', replyToPostId)
      }
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }

      await createReply({ 
        boardName, 
        threadId,
        formData: formDataToSend 
      }).unwrap()
      
      toast.success('Ответ отправлен!')
      onClose()
      setFormData({
        content: '',
        authorName: ''
      })
      setSelectedFile(null)
    } catch (error: any) {
      toast.error(error?.data?.error || 'Ошибка отправки ответа')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка размера файла
      if (file.size > (thread.board?.maxFileSize || 5242880)) {
        toast.error(`Файл слишком большой. Максимальный размер: ${Math.round((thread.board?.maxFileSize || 5242880) / 1024 / 1024)}MB`)
        return
      }

      // Проверка типа файла
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (fileExt && thread.board?.allowedFileTypes && !thread.board.allowedFileTypes.includes(fileExt)) {
        toast.error(`Тип файла не поддерживается. Разрешённые типы: ${thread.board.allowedFileTypes.join(', ')}`)
        return
      }

      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleClose = () => {
    onClose()
    // Сбрасываем форму при закрытии
    setFormData({
      content: '',
      authorName: ''
    })
    setSelectedFile(null)
  }

  // Определяем информацию поста для отображения
  const getPostDisplayInfo = (post: Thread | Reply) => {
    return {
      number: 'boardId' in post ? 1 : post.postNumber,
      shortId: post.shortId
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Ответить на пост</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {thread.subject || `Тред #${thread.id}`}
            </p>
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Показываем пост на который отвечаем */}
            {replyToPost && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Ответ на пост #{getPostDisplayInfo(replyToPost).number} (ID: {getPostDisplayInfo(replyToPost).shortId}):
                </h3>
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardBody className="p-3">
                    <div className="flex gap-3">
                      {/* Медиа превью если есть */}
                      {replyToPost.imageUrl && (
                        <div className="flex-shrink-0">
                          <MediaThumbnail
                            url={replyToPost.imageUrl}
                            thumbnailUrl={replyToPost.thumbnailUrl}
                            name={replyToPost.imageName}
                            size={replyToPost.imageSize}
                            variant="small"
                            showInfo={false}
                            className="border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      )}
                      
                      {/* Содержание поста */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="font-medium text-green-600">
                            {replyToPost.authorName || 'Анон'}
                          </span>
                          <span className="text-gray-500">
                            {formatDistanceToNow(new Date(replyToPost.createdAt), { 
                              addSuffix: true, 
                              locale: ru 
                            })}
                          </span>
                          <span className="text-blue-500 font-mono">
                            #{getPostDisplayInfo(replyToPost).number}
                          </span>
                          <span className="text-blue-500 font-mono text-xs">
                            ID: {getPostDisplayInfo(replyToPost).shortId}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {replyToPost.content}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Имя автора */}
            <Input
              label="Имя"
              placeholder="Аноним"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              variant="bordered"
              description="Оставьте пустым для анонимности"
            />

            {/* Содержание */}
            <Textarea
              label="Ответ"
              placeholder="Введите ваш ответ..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              variant="bordered"
              minRows={4}
              maxRows={8}
              isRequired
              description="Используйте >>shortId для ссылки на другие посты (например: >>a1b2c3)"
            />

            {/* Загрузка файла */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Изображение/Видео</label>
              <input
                type="file"
                accept={thread.board?.allowedFileTypes?.map(type => `.${type}`).join(',')}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  dark:file:bg-primary-900 dark:file:text-primary-300
                  dark:hover:file:bg-primary-800"
              />
              
              {selectedFile && (
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm truncate">{selectedFile.name}</span>
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
                <p>Максимальный размер: {Math.round((thread.board?.maxFileSize || 5242880) / 1024 / 1024)}MB</p>
                <div className="flex flex-wrap gap-1">
                  <span>Поддерживаемые форматы:</span>
                  {thread.board?.allowedFileTypes?.map(type => (
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
              onPress={handleClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={isLoading}
            >
              Отправить ответ
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ReplyToPostModal
