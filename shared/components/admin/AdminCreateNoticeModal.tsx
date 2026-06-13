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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateNotice } from "@/src/features/notice/hooks/useCreateNotice";
import EmojiPicker from "@/shared/components/ui/inputs/EmojiPicker";

interface AdminCreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminCreateNoticeModal: React.FC<AdminCreateNoticeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createNotice } = useCreateNotice();
  const submittingRef = useRef(false);

  const [formData, setFormData] = useState({
    content: "",
    title: "",
    type: "default",
    durationDays: 7 as number | undefined,
    expiredAt: "" as string,
    emojiUrl: "",
    active: true,
  });

  const handleEmojiSelect = (emojiUrl: string) => {
    setFormData((prev) => ({ ...prev, emojiUrl }));
  };

  const handleSubmit = async () => {
    if (isLoading || submittingRef.current) return;
    if (!formData.content.trim()) {
      toast.error("Содержимое уведомления обязательно");
      return;
    }

    setIsLoading(true);
    submittingRef.current = true;

    try {
      const payload: any = {
        content: formData.content,
        type: formData.type,
        active: formData.active,
      };

      if (formData.title.trim()) payload.title = formData.title.trim();
      if (formData.emojiUrl.trim()) payload.emojiUrl = formData.emojiUrl.trim();
      if (formData.durationDays && Number.isInteger(formData.durationDays))
        payload.durationDays = formData.durationDays;
      if (formData.expiredAt) {
        payload.expiredAt = new Date(formData.expiredAt).toISOString();
      }

      await createNotice(payload);
      toast.success("Уведомление создано");
      onClose();
      if (onSuccess) onSuccess();

      setFormData({
        content: "",
        title: "",
        type: "default",
        durationDays: 7,
        expiredAt: "",
        emojiUrl: "",
        active: true,
      });
    } catch (e: any) {
      console.error("Ошибка создания уведомления", e);
      toast.error(e?.message ?? "Ошибка при создании уведомления");
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Создать уведомление</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="content">Текст уведомления *</Label>
            <Textarea
              id="content"
              placeholder="Текст"
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notice-title">Заголовок (необязательно)</Label>
            <Input
              id="notice-title"
              placeholder="Короткий заголовок"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Тип</Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, type: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration">Продолжительность (дней)</Label>
              <Input
                id="duration"
                max={365}
                min={1}
                type="number"
                value={formData.durationDays ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    durationDays: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiredAt">
              Дата истечения (если указать, имеет приоритет)
            </Label>
            <Input
              id="expiredAt"
              type="datetime-local"
              value={formData.expiredAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiredAt: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <EmojiPicker
                disabled={isLoading}
                onEmojiSelect={handleEmojiSelect}
              />
            </div>
            {formData.emojiUrl && (
              <div className="flex items-center gap-2">
                <img
                  alt="Selected emoji"
                  className="w-10 h-10 object-cover rounded-lg"
                  src={formData.emojiUrl}
                />
                <Button
                  disabled={isLoading}
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, emojiUrl: "" }))
                  }
                >
                  Удалить
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.active}
              id="active"
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, active: checked }))
              }
            />
            <Label htmlFor="active">Активно</Label>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button disabled={isLoading} variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Создаём..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreateNoticeModal;