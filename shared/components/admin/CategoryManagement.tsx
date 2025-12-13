"use client"

import React, { useMemo, useState } from 'react'
import { Button, Card, CardBody, Chip, Divider, Input, Textarea, Select, SelectItem } from '@heroui/react'
import { useCategories, useCreateCategory } from '@/src/features/forum/hooks/useForum'


export default function   CategoryManagement() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // parentId может отсутствовать в типе Category, поэтому фильтруем по parentId === null или undefined
  const roots = useMemo(() => (categories || []).filter((c: any) => !c.parentId), [categories]);
  const parentOptions = useMemo(() => (
    [{ key: '', label: 'Без родителя' }, ...roots.map((c: any) => ({ key: c.id, label: c.name }))]
  ), [roots]);

  const onSubmit = () => {
    if (!name || !slug) return;
    const fd = new FormData();
    fd.append('name', name);
    fd.append('slug', slug);
    if (description) fd.append('description', description);
    if (color) fd.append('color', color);
    if (imageFile) fd.append('image', imageFile);

    createCategory.mutate(fd, {
      onSuccess: () => {
        setName(''); setSlug(''); setDescription(''); setColor(''); setParentId(null); setImageFile(null);
      },
    });
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="text-lg font-semibold">Категории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Название" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <Textarea label="Описание" value={description} onChange={e => setDescription(e.target.value)} className="md:col-span-2" />
          <Input label="Цвет (hex)" value={color} onChange={e => setColor(e.target.value)} type="color" />
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
          <Button color="primary" onPress={onSubmit}>Создать категорию</Button>
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
