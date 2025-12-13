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
  Chip,
  Select,
  SelectItem
} from '@heroui/react'
// TODO: Migrate to React Query: Create useCreateThreadInCategory, useTags, useAssignTagToThread hooks
import { useCreateThreadInCategoryMutation, useGetTagsQuery, useAssignTagToThreadMutation } from '@/src/services/forum.service.old'
import { toast } from 'react-hot-toast'
import type { Category } from '@/src/services/forum.service.old'
import { useTranslations } from 'next-intl'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
  categorySlug: string
  category: Category
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ 
  isOpen, 
  onClose, 
  categorySlug, 
  category 
}) => {
  const t = useTranslations('Forum.createThread')
  const [createThread, { isLoading }] = useCreateThreadInCategoryMutation()
  const [assignTag] = useAssignTagToThreadMutation()
  const { data: tags } = useGetTagsQuery()
  
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    authorName: '',
    threadSlug: ''
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error(t('errorRequired'))
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
      
      // Добавляем slug если указан
      if (formData.threadSlug.trim()) {
        formDataToSend.append('threadSlug', formData.threadSlug.trim())
      }
      
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file)
      })

      const thread = await createThread({ 
        slug: categorySlug, 
        formData: formDataToSend 
      }).unwrap()
      
      // Назначаем выбранные теги
      if (selectedTags.size > 0) {
        const tagSlugs = Array.from(selectedTags)
        for (const tagSlug of tagSlugs) {
          try {
            await assignTag({ threadId: thread.id, tagSlug }).unwrap()
          } catch (tagError) {
            console.error('Ошибка назначения тега:', tagError)
          }
        }
      }
      
      toast.success('Тред создан успешно!')
      onClose()
      setFormData({
        subject: '',
        content: '',
        authorName: '',
        threadSlug: ''
      })
      setSelectedFiles([])
      setSelectedTags(new Set())
    } catch (error: any) {
      toast.error(error?.data?.error || t('errorCreate'))
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

    // Проверка каждого файла (базовые ограничения)
    for (const file of files) {
      // Проверка размера файла (5MB по умолчанию)
      if (file.size > 5242880) {
        toast.error(`Файл ${file.name} слишком большой. Максимальный размер: 5MB`)
        return
      }

      // Проверка типа файла
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'webm', 'mp4']
      if (fileExt && !allowedTypes.includes(fileExt)) {
        toast.error(`Тип файла ${fileExt} не поддерживается. Разрешённые типы: ${allowedTypes.join(', ')}`)
        return
      }
    }

    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const generateSlug = (subject: string) => {
    return subject
      .toLowerCase()
      .replace(/[^a-zA-Zа-яё0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
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
            <h2 className="text-xl font-bold">{t('title')} {category.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Создайте новую тему для обсуждения в категории
            </p>
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Имя автора */}
            <Input
              label={t('nameLabel')}
              placeholder={t('namePlaceholder')}
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              variant="bordered"
              description={t('nameDescription')}
            />

            {/* Тема треда */}
            <Input
              label={t('subjectLabel')}
              placeholder={t('subjectPlaceholder')}
              value={formData.subject}
              onChange={(e) => {
                const subject = e.target.value
                setFormData(prev => ({ 
                  ...prev, 
                  subject,
                  // Автогенерация slug только если он пустой
                  threadSlug: prev.threadSlug || generateSlug(subject)
                }))
              }}
              variant="bordered"
              isRequired
            />

            {/* Slug треда */}
            <Input
              label="URL-адрес (slug)"
              placeholder="thread-url-slug"
              value={formData.threadSlug}
              onChange={(e) => setFormData(prev => ({ ...prev, threadSlug: e.target.value }))}
              variant="bordered"
              description="Используется в URL. Оставьте пустым для автогенерации"
              startContent={<span className="text-sm text-gray-500">/forum/categories/{categorySlug}/</span>}
            />

            {/* Выбор тегов */}
            {tags && tags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="thread-tags">{t('tagsLabel')}</label>
                <Select
                  id="thread-tags"
                  label={t('tagsLabel')}
                  placeholder={t('tagsPlaceholder')}
                  selectionMode="multiple"
                  selectedKeys={selectedTags}
                  onSelectionChange={(keys) => setSelectedTags(keys as Set<string>)}
                  variant="bordered"
                  items={tags}
                >
                  {(tag) => (
                    <SelectItem
                      key={tag.slug}
                      textValue={tag.name}
                      startContent={
                        tag.icon ? (
                          /^https?:\/\//.test(tag.icon) ? (
                            <img src={tag.icon} alt="" className="w-4 h-4 object-cover rounded" />
                          ) : (
                            <span className="text-sm">{tag.icon}</span>
                          )
                        ) : null
                      }
                      description={tag.description || undefined}
                    >
                      {tag.name}
                    </SelectItem>
                  )}
                </Select>

                {/* Превью выбранных тегов */}
                {selectedTags.size > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedTags).map((tagSlug) => {
                      const tag = tags.find(t => t.slug === tagSlug)
                      if (!tag) return null
                      return (
                        <Chip
                          key={tag.slug}
                          size="sm"
                          variant="flat"
                          style={{ backgroundColor: tag.color || undefined }}
                          onClose={() => {
                            const newTags = new Set(selectedTags)
                            newTags.delete(tagSlug)
                            setSelectedTags(newTags)
                          }}
                        >
                          {tag.icon ? (
                            /^https?:\/\//.test(tag.icon) ? (
                              <img
                                src={tag.icon}
                                alt=""
                                className="inline-block w-4 h-4 object-cover rounded mr-1 align-[-2px]"
                                loading="lazy"
                              />
                            ) : (
                              <span className="mr-1">{tag.icon}</span>
                            )
                          ) : null}
                          {tag.name}
                        </Chip>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Содержание */}
            <Textarea
              label={t('contentLabel')}
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
              <label className="text-sm font-medium">{t('fileLabel')}</label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.webm,.mp4"
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
                <p>Максимальный размер файла: 5MB</p>
                <p>Максимум файлов: 5</p>
                <div className="flex flex-wrap gap-1">
                  <span>Поддерживаемые форматы:</span>
                  {['JPG', 'PNG', 'GIF', 'WEBP', 'WEBM', 'MP4'].map(type => (
                    <Chip key={type} size="sm" variant="flat" color="default">
                      {type}
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
              {t('cancel')}
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={isLoading}
            >
              {t('submit')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateThreadModal