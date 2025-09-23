import React, { useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { IoImageOutline, IoClose } from 'react-icons/io5';
import { ImageUploadProps } from './types';
import { validateImageFile, createImagePreview, revokeImagePreview } from './utils';
import { useTranslations } from 'next-intl';

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  preview,
  className = '',
  disabled = false
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
      setError(validation.error || 'Ошибка загрузки файла');
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
      fileInputRef.current.value = '';
    }
  };

  const t = useTranslations('HomePage.CreatePost');
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {!preview ? (
        <Button
          type="button"
          variant="bordered"
          size="sm"
          startContent={<IoImageOutline />}
          onClick={handleButtonClick}
          disabled={disabled}
          className="w-fit"
        >
          {t('addImage')}
        </Button>
      ) : (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Предпросмотр"
            className="max-w-xs max-h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            isIconOnly
            size="sm"
            variant="solid"
            color="danger"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1"
            disabled={disabled}
          >
            <IoClose />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
