export interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  preview?: string | null;
  className?: string;
  disabled?: boolean;
}

export interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
  className?: string;
}

export type AcceptedImageTypes = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/gif' | 'image/webp';

export const ACCEPTED_IMAGE_TYPES: AcceptedImageTypes[] = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
