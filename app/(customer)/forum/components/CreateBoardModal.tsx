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
  Switch,
  Select,
  SelectItem,
  Chip
} from '@heroui/react'
import { useCreateBoardMutation } from '@/src/services/forum.service'
import { toast } from 'react-hot-toast'

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [createBoard, { isLoading }] = useCreateBoardMutation()
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.title.trim()) {
      toast.error('Название и заголовок обязательны')
      return
    }

    try {
      await createBoard(formData).unwrap()
      toast.success('Борд создан успешно!')
      onClose()
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
      toast.error(error?.data?.error || 'Ошибка создания борда')
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
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-bold">Создать новый борд</h2>
          </ModalHeader>
          
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Название борда"
                placeholder="b, g, v..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                description="1-10 символов, только буквы и цифры"
                maxLength={10}
                required
              />
              
              <Input
                label="Заголовок"
                placeholder="Random, Technology..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <Textarea
              label="Описание"
              placeholder="Описание борда..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxRows={3}
            />

            <div className="flex items-center gap-4">
              <Switch
                isSelected={formData.isNsfw}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isNsfw: value }))}
              >
                NSFW контент
              </Switch>
            </div>

            <Select
              label="Максимальный размер файла"
              selectedKeys={[formData.maxFileSize.toString()]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string
                setFormData(prev => ({ ...prev, maxFileSize: parseInt(value) }))
              }}
            >
              {fileSizeOptions.map((option) => (
                
                <SelectItem key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Разрешенные типы файлов
              </label>
              <div className="flex flex-wrap gap-2">
                {availableFileTypes.map((type) => (
                  <Chip
                    key={type}
                    variant={formData.allowedFileTypes.includes(type) ? 'solid' : 'bordered'}
                    color={formData.allowedFileTypes.includes(type) ? 'primary' : 'default'}
                    className="cursor-pointer"
                    onClick={() => handleFileTypeToggle(type)}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Постов на странице"
                value={formData.postsPerPage.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  postsPerPage: parseInt(e.target.value) || 15 
                }))}
                min={5}
                max={50}
              />
              
              <Input
                type="number"
                label="Тредов на странице"
                value={formData.threadsPerPage.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  threadsPerPage: parseInt(e.target.value) || 10 
                }))}
                min={5}
                max={25}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Лимит бампов"
                value={formData.bumpLimit.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  bumpLimit: parseInt(e.target.value) || 500 
                }))}
                min={50}
                max={1000}
              />
              
              <Input
                type="number"
                label="Лимит изображений"
                value={formData.imageLimit.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  imageLimit: parseInt(e.target.value) || 150 
                }))}
                min={10}
                max={500}
              />
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button 
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
              Создать борд
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateBoardModal
