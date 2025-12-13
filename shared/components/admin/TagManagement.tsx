"use client"

import React, { useState } from 'react'
import { Button, Card, CardBody, Chip, Divider, Input, Textarea } from '@heroui/react'
// TODO: Migrate to React Query: Create useTags, useCreateTag hooks
import { useCreateTagMutation, useGetTagsQuery } from '@/src/services/forum.service.old'

export default function TagManagement() {
  const { data: tags } = useGetTagsQuery()
  const [createTag, { isLoading }] = useCreateTagMutation()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)

  const onSubmit = async () => {
    if (!name || !slug) return
    const fd = new FormData()
    fd.append('name', name)
    fd.append('slug', slug)
    if (description) fd.append('description', description)
    if (color) fd.append('color', color)
    if (iconFile) fd.append('icon', iconFile)
    await createTag(fd).unwrap()
    setName(''); setSlug(''); setDescription(''); setColor(''); setIconFile(null)
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="text-lg font-semibold">Теги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Название" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <Textarea label="Описание" value={description} onChange={e => setDescription(e.target.value)} className="md:col-span-2" />
          <Input label="Цвет (hex)" value={color} onChange={e => setColor(e.target.value)} />
          <Input type="file" onChange={e => setIconFile(e.target.files?.[0] || null)} label="Иконка"/>
        </div>
        <div className="flex gap-2">
          <Button color="primary" isLoading={isLoading} onPress={onSubmit}>Создать тег</Button>
        </div>

        <Divider />
        <div>
          <h3 className="font-medium mb-2">Существующие теги</h3>
          <div className="flex flex-wrap gap-2">
            {(tags || []).map(tag => (
              <Chip key={tag.id} color="secondary" variant="flat">{tag.name}</Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
