"use client";

import React, { useState, useRef } from "react";
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
} from "@heroui/react";
import { toast } from "sonner";

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
  const { createNotice, isPending } = useCreateNotice();
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
        const iso = new Date(formData.expiredAt).toISOString();

        payload.expiredAt = iso;
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
    <Modal isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">Создать уведомление</h3>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <Textarea
            isRequired
            label="Текст уведомления"
            maxRows={6}
            placeholder="Текст"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <Input
            label="Заголовок (необязательно)"
            placeholder="Короткий заголовок"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Тип"
              selectedKeys={[formData.type]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <SelectItem key="default">Default</SelectItem>
              <SelectItem key="info">Info</SelectItem>
              <SelectItem key="warning">Warning</SelectItem>
              <SelectItem key="error">Error</SelectItem>
            </Select>

            <Input
              label="Продолжительность (дней)"
              max={365}
              min={1}
              type="number"
              value={
                formData.durationDays ? formData.durationDays.toString() : ""
              }
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

          <Input
            label="Дата истечения (если указать, имеет приоритет)"
            type="datetime-local"
            value={formData.expiredAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expiredAt: e.target.value }))
            }
          />

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
                  color="danger"
                  disabled={isLoading}
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, emojiUrl: "" }))
                  }
                >
                  Удалить
                </Button>
              </div>
            )}
          </div>

          <Switch
            isSelected={formData.active}
            onValueChange={(checked) =>
              setFormData((prev) => ({ ...prev, active: checked }))
            }
          >
            Активно
          </Switch>
        </ModalBody>

        <ModalFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full sm:w-auto order-2 sm:order-1"
            color="danger"
            disabled={isLoading}
            variant="light"
            onPress={onClose}
          >
            Отмена
          </Button>
          <Button
            className="w-full sm:w-auto order-1 sm:order-2"
            color="primary"
            disabled={isLoading}
            onPress={handleSubmit}
          >
            {isLoading ? "Создаём..." : "Создать"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminCreateNoticeModal;
