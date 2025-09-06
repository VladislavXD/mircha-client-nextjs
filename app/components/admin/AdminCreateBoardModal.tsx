'use client'

import React, { useState, useRef } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectItem,
  Chip
} from '@heroui/react'
import { useCreateAdminBoardMutation } from '@/src/services/admin.service'
import { handleApiError } from '@/src/services/admin.utils'
import { toast } from 'react-hot-toast'

interface AdminCreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AdminCreateBoardModal: React.FC<AdminCreateBoardModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [createBoard, { isLoading }] = useCreateAdminBoardMutation()
  const submittingRef = useRef(false)
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    isNsfw: false,
    maxFileSize: 5242880, // 5MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    postsPerPage: 15,
    threadsPerPage: 10,
    bumpLimit: 500,
    imageLimit: 150
  })

  const availableFileTypes = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'webm', 'mp4', 'mov'
  ]

  const handleSubmit = async () => {
    if (isLoading || submittingRef.current) return // Предотвращаем повторные запросы
    
    if (!formData.name.trim() || !formData.title.trim()) {
      toast.error('Название и заголовок обязательны')
      return
    }

    submittingRef.current = true
    
    try {
      console.log('Отправляем данные на создание борда:', formData)
      await createBoard(formData).unwrap()
      toast.success('Борд создан успешно!')
      onClose()
      if (onSuccess) onSuccess()
      
      // Сброс формы
      setFormData({
        name: '',
        title: '',
        description: '',
        isNsfw: false,
        maxFileSize: 5242880,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        postsPerPage: 15,
        threadsPerPage: 10,
        bumpLimit: 500,
        imageLimit: 150
      })
    } catch (error: any) {
      console.error('Ошибка создания борда:', error)
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    } finally {
      submittingRef.current = false
    }
  }

  const handleFileTypeToggle = (fileType: string) => {
    setFormData(prev => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter(type => type !== fileType)
        : [...prev.allowedFileTypes, fileType]
    }))
  }

  const fileSizeOptions = [
    { label: '1 MB', value: 1048576 },
    { label: '5 MB', value: 5242880 },
    { label: '10 MB', value: 10485760 },
    { label: '25 MB', value: 26214400 },
    { label: '50 MB', value: 52428800 }
  ]

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">Создать новый борд</h3>
        </ModalHeader>
        
        <ModalBody className="space-y-4">
          <Input
            label="Короткое имя борда"
            placeholder="b, g, pol..."
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            description="Только буквы и цифры, до 10 символов"
            isRequired
          />
          
          <Input
            label="Название борда"
            placeholder="Random, Technology, Politics..."
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            isRequired
          />

          <Textarea
            label="Описание"
            placeholder="Описание борда..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            maxRows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Постов на страницу"
              value={formData.postsPerPage.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) || 15 }))}
              min={5}
              max={50}
            />
            
            <Input
              type="number"
              label="Тредов на страницу"
              value={formData.threadsPerPage.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, threadsPerPage: parseInt(e.target.value) || 10 }))}
              min={5}
              max={25}
            />
            
            <Input
              type="number"
              label="Лимит бампа"
              value={formData.bumpLimit.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, bumpLimit: parseInt(e.target.value) || 500 }))}
              min={50}
              max={1000}
            />
            
            <Input
              type="number"
              label="Лимит изображений"
              value={formData.imageLimit.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, imageLimit: parseInt(e.target.value) || 150 }))}
              min={10}
              max={500}
            />
          </div>

          <Select
            label="Максимальный размер файла"
            selectedKeys={[formData.maxFileSize.toString()]}
            onChange={(e) => setFormData(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
          >
            {fileSizeOptions.map(option => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <div className="space-y-2">
            <label className="text-sm font-medium">Разрешенные типы файлов</label>
            <div className="flex flex-wrap gap-2">
              {availableFileTypes.map(fileType => (
                <Chip
                  key={fileType}
                  color={formData.allowedFileTypes.includes(fileType) ? "primary" : "default"}
                  variant={formData.allowedFileTypes.includes(fileType) ? "solid" : "bordered"}
                  className="cursor-pointer"
                  onClick={() => handleFileTypeToggle(fileType)}
                >
                  {fileType}
                </Chip>
              ))}
            </div>
          </div>

          <Switch
            isSelected={formData.isNsfw}
            onValueChange={(checked) => setFormData(prev => ({ ...prev, isNsfw: checked }))}
          >
            NSFW контент
          </Switch>
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
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            Создать борд
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AdminCreateBoardModal
