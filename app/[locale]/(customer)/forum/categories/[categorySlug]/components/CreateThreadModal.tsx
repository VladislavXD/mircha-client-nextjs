"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateThreadInCategory,
  useTags,
} from "@/src/features/forum/hooks/useForum";

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorySlug: string;
  category: any;
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  isOpen,
  onClose,
  categorySlug,
  category,
}) => {
  const t = useTranslations("Forum.createThread");
  const { mutateAsync: createThread, isPending: isLoading } =
    useCreateThreadInCategory();
  const { data: tags } = useTags();

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    authorName: "",
    threadSlug: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error(t("errorRequired"));
      return;
    }
    if (selectedFiles.length > 5) {
      toast.error("Максимум 5 файлов");
      return;
    }

    try {
      const tagIds = Array.from(selectedTags)
        .map((slug) => tags?.find((t) => t.slug === slug)?.id)
        .filter(Boolean) as string[];

      await createThread({
        slug: categorySlug,
        data: {
          subject: formData.subject,
          content: formData.content,
          authorName: formData.authorName || "Аноним",
          tagIds,
        },
        files: selectedFiles,
      });

      toast.success("Тред создан успешно!");
      onClose();
      setFormData({ subject: "", content: "", authorName: "", threadSlug: "" });
      setSelectedFiles([]);
      setSelectedTags(new Set());
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || t("errorCreate"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      toast.error("Максимум 5 файлов");
      return;
    }

    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp", "webm", "mp4"];
    for (const file of files) {
      if (file.size > 5242880) {
        toast.error(`Файл ${file.name} слишком большой. Максимум: 5MB`);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && !allowedTypes.includes(ext)) {
        toast.error(`Тип .${ext} не поддерживается`);
        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (subject: string) =>
    subject
      .toLowerCase()
      .replace(/[^a-zA-Zа-яё0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("title")} {category.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Создайте новую тему для обсуждения в категории
          </p>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="authorName">{t("nameLabel")}</Label>
            <Input
              id="authorName"
              placeholder={t("namePlaceholder")}
              value={formData.authorName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, authorName: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {t("nameDescription")}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">{t("subjectLabel")} *</Label>
            <Input
              required
              id="subject"
              placeholder={t("subjectPlaceholder")}
              value={formData.subject}
              onChange={(e) => {
                const subject = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  subject,
                  threadSlug: prev.threadSlug || generateSlug(subject),
                }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="threadSlug">URL-адрес (slug)</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                /forum/categories/{categorySlug}/
              </span>
              <Input
                id="threadSlug"
                placeholder="thread-url-slug"
                value={formData.threadSlug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    threadSlug: e.target.value,
                  }))
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Используется в URL. Оставьте пустым для автогенерации
            </p>
          </div>

          {tags && tags.length > 0 && (
            <div className="space-y-2">
              <Label>{t("tagsLabel")}</Label>
              <Select
                onValueChange={(val) => {
                  if (val) toggleTag(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("tagsPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag: any) => (
                    <SelectItem key={tag.slug} value={tag.slug}>
                      {tag.icon && (
                        <span className="mr-1">
                          {/^https?:\/\//.test(tag.icon) ? (
                            <img
                              alt=""
                              className="inline w-4 h-4 object-cover rounded"
                              src={tag.icon}
                            />
                          ) : (
                            tag.icon
                          )}
                        </span>
                      )}
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTags.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedTags).map((tagSlug) => {
                    const tag = tags.find((t: any) => t.slug === tagSlug);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.slug}
                        className="cursor-pointer gap-1"
                        style={{ backgroundColor: tag.color || undefined }}
                        variant="secondary"
                        onClick={() => toggleTag(tagSlug)}
                      >
                        {tag.name} ×
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="content">{t("contentLabel")} *</Label>
            <Textarea
              required
              id="content"
              placeholder="Введите содержание треда..."
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">{t("fileLabel")}</Label>
            <input
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.webm,.mp4"
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
              id="files"
              type="file"
              onChange={handleFileChange}
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Выбранные файлы ({selectedFiles.length}/5):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedFiles.map((file, index) => {
                    const fileURL = URL.createObjectURL(file);
                    const isImage = file.type.startsWith("image/");
                    const isVideo = file.type.startsWith("video/");

                    return (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden border bg-muted"
                      >
                        <div className="aspect-square relative">
                          {isImage ? (
                            <img
                              alt={file.name}
                              className="w-full h-full object-cover"
                              src={fileURL}
                              onLoad={() => URL.revokeObjectURL(fileURL)}
                            />
                          ) : isVideo ? (
                            <video
                              muted
                              className="w-full h-full object-cover"
                              src={fileURL}
                              onLoadedData={() => URL.revokeObjectURL(fileURL)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl">📄</span>
                            </div>
                          )}

                          <Button
                            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                            size="sm"
                            type="button"
                            variant="destructive"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>

                          {isVideo && (
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                              ▶
                            </div>
                          )}
                        </div>

                        <div className="p-2">
                          <p
                            className="text-xs text-muted-foreground truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Максимальный размер файла: 5MB · Максимум файлов: 5</p>
              <div className="flex flex-wrap gap-1">
                <span>Форматы:</span>
                {["JPG", "PNG", "GIF", "WEBP", "WEBM", "MP4"].map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              disabled={isLoading}
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Создаём..." : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateThreadModal;