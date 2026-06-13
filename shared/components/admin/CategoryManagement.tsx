"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCategories,
  useCreateCategory,
} from "@/src/features/forum/hooks/useForum";

export default function CategoryManagement() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const roots = useMemo(
    () => (categories || []).filter((c: any) => !c.parentId),
    [categories],
  );
  const parentOptions = useMemo(
    () => [
      { key: "", label: "Без родителя" },
      ...roots.map((c: any) => ({ key: c.id, label: c.name })),
    ],
    [roots],
  );

  const onSubmit = () => {
    if (!name || !slug) return;
    const fd = new FormData();

    fd.append("name", name);
    fd.append("slug", slug);
    if (description) fd.append("description", description);
    if (color) fd.append("color", color);
    if (imageFile) fd.append("image", imageFile);

    createCategory.mutate(fd, {
      onSuccess: () => {
        setName("");
        setSlug("");
        setDescription("");
        setColor("");
        setParentId(null);
        setImageFile(null);
      },
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h2 className="text-lg font-semibold">Категории</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="color">Цвет (hex)</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Родительская категория (опционально)</Label>
            <Select
              value={parentId ?? ""}
              onValueChange={(val) => setParentId(val || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Без родителя" />
              </SelectTrigger>
              <SelectContent>
                {parentOptions.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Изображение</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onSubmit}>Создать категорию</Button>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Существующие категории</h3>
          <div className="flex flex-wrap gap-2">
            {(categories || []).map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}