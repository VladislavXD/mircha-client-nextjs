"use client"

import React, { useMemo, useState } from 'react'
import { Button, Card, CardBody, Chip, Divider, Input, Textarea, Select, SelectItem } from '@heroui/react'
import { useCreateCategoryMutation, useGetCategoriesQuery } from '@/src/services/forum.service'

export default function CategoryManagement() {
  const { data: categories, isLoading } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const roots = useMemo(() => (categories || []).filter(c => !c.parentId), [categories])
  const parentOptions = useMemo(() => (
    [{ key: '', label: 'Без родителя' }, ...roots.map(c => ({ key: c.id, label: c.name }))]
  ), [roots])

  const onSubmit = async () => {
    if (!name || !slug) return
    const fd = new FormData()
    fd.append('name', name)
    fd.append('slug', slug)
    if (description) fd.append('description', description)
    if (color) fd.append('color', color)
    if (parentId) fd.append('parentId', parentId)
    if (imageFile) fd.append('image', imageFile)

    await createCategory(fd).unwrap()
    setName(''); setSlug(''); setDescription(''); setColor(''); setParentId(null); setImageFile(null)
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="text-lg font-semibold">Категории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Название" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <Textarea label="Описание" value={description} onChange={e => setDescription(e.target.value)} className="md:col-span-2" />
          <Input label="Цвет (hex)" value={color} onChange={e => setColor(e.target.value)} />
          <Select 
            label="Родительская категория (опционально)"
            selectedKeys={new Set([parentId ?? ''])}
            onSelectionChange={(keys) => {
              const first = Array.from(keys as Set<string>)[0] || ''
              setParentId(first || null)
            }}
            items={parentOptions}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
          <Input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} label="Изображение"/>
        </div>
        <div className="flex gap-2">
          <Button color="primary" isLoading={isCreating} onPress={onSubmit}>Создать категорию</Button>
        </div>

        <Divider />
        <div>
          <h3 className="font-medium mb-2">Существующие категории</h3>
          <div className="flex flex-wrap gap-2">
            {(categories || []).map(cat => (
              <Chip key={cat.id} color="secondary" variant="flat">{cat.name}</Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
