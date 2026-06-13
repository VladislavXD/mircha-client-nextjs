"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateBoard } from "@/src/features/admin";
import { handleApiError } from "@/src/services/admin.utils";

interface AdminCreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminCreateBoardModal: React.FC<AdminCreateBoardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createBoard } = useCreateBoard();
  const submittingRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    isNsfw: false,
    maxFileSize: 5242880,
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
    postsPerPage: 15,
    threadsPerPage: 10,
    bumpLimit: 500,
    imageLimit: 150,
  });

  const availableFileTypes = [
    "jpg", "jpeg", "png", "gif", "webp", "webm", "mp4", "mov",
  ];

  const fileSizeOptions = [
    { label: "1 MB", value: 1048576 },
    { label: "5 MB", value: 5242880 },
    { label: "10 MB", value: 10485760 },
    { label: "25 MB", value: 26214400 },
    { label: "50 MB", value: 52428800 },
  ];

  const handleFileTypeToggle = (fileType: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter((t) => t !== fileType)
        : [...prev.allowedFileTypes, fileType],
    }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!formData.name.trim() || !formData.title.trim()) {
      toast.error("Название и заголовок обязательны");
      return;
    }

    setIsLoading(true);
    submittingRef.current = true;

    try {
      await createBoard(formData);
      toast.success("Борд создан успешно!");
      onClose();
      if (onSuccess) onSuccess();

      setFormData({
        name: "",
        title: "",
        description: "",
        isNsfw: false,
        maxFileSize: 5242880,
        allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
        postsPerPage: 15,
        threadsPerPage: 10,
        bumpLimit: 500,
        imageLimit: 150,
      });
    } catch (error: any) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новый борд</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="board-name">Короткое имя борда *</Label>
            <Input
              id="board-name"
              placeholder="b, g, pol..."
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Только буквы и цифры, до 10 символов
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="board-title">Название борда *</Label>
            <Input
              id="board-title"
              placeholder="Random, Technology, Politics..."
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="board-desc">Описание</Label>
            <Textarea
              id="board-desc"
              placeholder="Описание борда..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="posts-per-page">Постов на страницу</Label>
              <Input
                id="posts-per-page"
                max={50}
                min={5}
                type="number"
                value={formData.postsPerPage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    postsPerPage: parseInt(e.target.value) || 15,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="threads-per-page">Тредов на страницу</Label>
              <Input
                id="threads-per-page"
                max={25}
                min={5}
                type="number"
                value={formData.threadsPerPage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    threadsPerPage: parseInt(e.target.value) || 10,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bump-limit">Лимит бампа</Label>
              <Input
                id="bump-limit"
                max={1000}
                min={50}
                type="number"
                value={formData.bumpLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bumpLimit: parseInt(e.target.value) || 500,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image-limit">Лимит изображений</Label>
              <Input
                id="image-limit"
                max={500}
                min={10}
                type="number"
                value={formData.imageLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    imageLimit: parseInt(e.target.value) || 150,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Максимальный размер файла</Label>
            <Select
              value={formData.maxFileSize.toString()}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  maxFileSize: parseInt(val),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fileSizeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Разрешенные типы файлов</Label>
            <div className="flex flex-wrap gap-2">
              {availableFileTypes.map((fileType) => {
                const active = formData.allowedFileTypes.includes(fileType);
                return (
                  <Badge
                    key={fileType}
                    className="cursor-pointer select-none"
                    variant={active ? "default" : "outline"}
                    onClick={() => handleFileTypeToggle(fileType)}
                  >
                    {fileType}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isNsfw}
              id="nsfw"
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isNsfw: checked }))
              }
            />
            <Label htmlFor="nsfw">NSFW контент</Label>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button disabled={isLoading} variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Создаём..." : "Создать борд"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreateBoardModal;