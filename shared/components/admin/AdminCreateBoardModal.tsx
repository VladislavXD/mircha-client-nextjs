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
  Chip,
} from "@heroui/react";
import { toast } from "sonner";

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
    maxFileSize: 5242880, // 5MB
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
    postsPerPage: 15,
    threadsPerPage: 10,
    bumpLimit: 500,
    imageLimit: 150,
  });

  const availableFileTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "webm",
    "mp4",
    "mov",
  ];

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!formData.name.trim() || !formData.title.trim()) {
      toast.error("Название и заголовок обязательны");

      return;
    }

    setIsLoading(true);
    submittingRef.current = true;

    try {
      console.log("Отправляем данные на создание борда:", formData);
      await createBoard(formData);
      toast.success("Борд создан успешно!");
      onClose();
      if (onSuccess) onSuccess();

      // Сброс формы
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
      console.error("Ошибка создания борда:", error);
      const errorMessage = handleApiError(error);

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  const handleFileTypeToggle = (fileType: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter((type) => type !== fileType)
        : [...prev.allowedFileTypes, fileType],
    }));
  };

  const fileSizeOptions = [
    { label: "1 MB", value: 1048576 },
    { label: "5 MB", value: 5242880 },
    { label: "10 MB", value: 10485760 },
    { label: "25 MB", value: 26214400 },
    { label: "50 MB", value: 52428800 },
  ];

  return (
    <Modal
      classNames={{
        base: "mx-2 sm:mx-4",
        body: "px-4 sm:px-6",
        header: "px-4 sm:px-6",
        footer: "px-4 sm:px-6",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg sm:text-xl font-semibold">
            Создать новый борд
          </h3>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <Input
            isRequired
            description="Только буквы и цифры, до 10 символов"
            label="Короткое имя борда"
            placeholder="b, g, pol..."
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <Input
            isRequired
            label="Название борда"
            placeholder="Random, Technology, Politics..."
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <Textarea
            label="Описание"
            maxRows={3}
            placeholder="Описание борда..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Постов на страницу"
              max={50}
              min={5}
              type="number"
              value={formData.postsPerPage.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  postsPerPage: parseInt(e.target.value) || 15,
                }))
              }
            />

            <Input
              label="Тредов на страницу"
              max={25}
              min={5}
              type="number"
              value={formData.threadsPerPage.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  threadsPerPage: parseInt(e.target.value) || 10,
                }))
              }
            />

            <Input
              label="Лимит бампа"
              max={1000}
              min={50}
              type="number"
              value={formData.bumpLimit.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bumpLimit: parseInt(e.target.value) || 500,
                }))
              }
            />

            <Input
              label="Лимит изображений"
              max={500}
              min={10}
              type="number"
              value={formData.imageLimit.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imageLimit: parseInt(e.target.value) || 150,
                }))
              }
            />
          </div>

          <Select
            label="Максимальный размер файла"
            selectedKeys={[formData.maxFileSize.toString()]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxFileSize: parseInt(e.target.value),
              }))
            }
          >
            {fileSizeOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Разрешенные типы файлов
            </label>
            <div className="flex flex-wrap gap-2">
              {availableFileTypes.map((fileType) => (
                <Chip
                  key={fileType}
                  className="cursor-pointer"
                  color={
                    formData.allowedFileTypes.includes(fileType)
                      ? "primary"
                      : "default"
                  }
                  variant={
                    formData.allowedFileTypes.includes(fileType)
                      ? "solid"
                      : "bordered"
                  }
                  onClick={() => handleFileTypeToggle(fileType)}
                >
                  {fileType}
                </Chip>
              ))}
            </div>
          </div>

          <Switch
            isSelected={formData.isNsfw}
            onValueChange={(checked) =>
              setFormData((prev) => ({ ...prev, isNsfw: checked }))
            }
          >
            NSFW контент
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
            isLoading={isLoading}
            onPress={handleSubmit}
          >
            Создать борд
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminCreateBoardModal;
