import React, { useRef, useState } from "react";
import { Button } from "@heroui/react";
import { IoImageOutline, IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { ImageUploadProps } from "./types";
import { validateImageFile, revokeImagePreview } from "./utils";

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  preview,
  className = "",
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError(null);

    if (!file) {
      onImageSelect(null);

      return;
    }

    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setError(validation.error || "Ошибка загрузки файла");

      return;
    }

    onImageSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (preview) {
      revokeImagePreview(preview);
    }
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const t = useTranslations("HomePage.CreatePost");

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        disabled={disabled}
        type="file"
        onChange={handleFileChange}
      />

      {!preview ? (
        <Button
          className="w-fit"
          disabled={disabled}
          size="sm"
          startContent={<IoImageOutline />}
          type="button"
          variant="bordered"
          onClick={handleButtonClick}
        >
          {t("addImage")}
        </Button>
      ) : (
        <div className="relative inline-block">
          <img
            alt="Предпросмотр"
            className="max-w-xs max-h-48 object-cover rounded-lg border"
            src={preview}
          />
          <Button
            isIconOnly
            className="absolute top-1 right-1"
            color="danger"
            disabled={disabled}
            size="sm"
            type="button"
            variant="solid"
            onClick={handleRemoveImage}
          >
            <IoClose />
          </Button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUpload;
