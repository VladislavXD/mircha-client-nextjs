"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
      const formDataToSend = new FormData();

      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("authorName", formData.authorName || "Аноним");

      // Добавляем slug если указан
      if (formData.threadSlug.trim()) {
        formDataToSend.append("slug", formData.threadSlug.trim());
      }

      // Добавляем выбранные теги как массив ID
      if (selectedTags.size > 0) {
        const tagIds = Array.from(selectedTags)
          .map((slug) => {
            const tag = tags?.find((t) => t.slug === slug);

            return tag?.id;
          })
          .filter(Boolean);

        tagIds.forEach((id) => {
          if (id) formDataToSend.append("tagIds[]", id);
        });
      }

      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await createThread({
        slug: categorySlug,
        data: {
          subject: formData.subject,
          content: formData.content,
          authorName: formData.authorName || "Аноним",
          tagIds: Array.from(selectedTags)
            .map((slug) => {
              const tag = tags?.find((t) => t.slug === slug);

              return tag?.id;
            })
            .filter(Boolean) as string[],
        },
        files: selectedFiles,
      });

      toast.success("Тред создан успешно!");
      onClose();
      setFormData({
        subject: "",
        content: "",
        authorName: "",
        threadSlug: "",
      });
      setSelectedFiles([]);
      setSelectedTags(new Set());

      // Перезагрузка страницы для обновления списка тредов
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || t("errorCreate"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Проверка количества файлов
    if (selectedFiles.length + files.length > 5) {
      toast.error("Максимум 5 файлов");

      return;
    }

    // Проверка каждого файла (базовые ограничения)
    for (const file of files) {
      // Проверка размера файла (5MB по умолчанию)
      if (file.size > 5242880) {
        toast.error(
          `Файл ${file.name} слишком большой. Максимальный размер: 5MB`,
        );

        return;
      }

      // Проверка типа файла
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp", "webm", "mp4"];

      if (fileExt && !allowedTypes.includes(fileExt)) {
        toast.error(
          `Тип файла ${fileExt} не поддерживается. Разрешённые типы: ${allowedTypes.join(", ")}`,
        );

        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (subject: string) => {
    return subject
      .toLowerCase()
      .replace(/[^a-zA-Zа-яё0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  };

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {t("title")} {category.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Создайте новую тему для обсуждения в категории
            </p>
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Имя автора */}
            <Input
              description={t("nameDescription")}
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              value={formData.authorName}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, authorName: e.target.value }))
              }
            />

            {/* Тема треда */}
            <Input
              isRequired
              label={t("subjectLabel")}
              placeholder={t("subjectPlaceholder")}
              value={formData.subject}
              variant="bordered"
              onChange={(e) => {
                const subject = e.target.value;

                setFormData((prev) => ({
                  ...prev,
                  subject,
                  // Автогенерация slug только если он пустой
                  threadSlug: prev.threadSlug || generateSlug(subject),
                }));
              }}
            />

            {/* Slug треда */}
            <Input
              description="Используется в URL. Оставьте пустым для автогенерации"
              label="URL-адрес (slug)"
              placeholder="thread-url-slug"
              startContent={
                <span className="text-sm text-gray-500">
                  /forum/categories/{categorySlug}/
                </span>
              }
              value={formData.threadSlug}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, threadSlug: e.target.value }))
              }
            />

            {/* Выбор тегов */}
            {tags && tags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="thread-tags">
                  {t("tagsLabel")}
                </label>
                <Select
                  id="thread-tags"
                  items={tags}
                  label={t("tagsLabel")}
                  placeholder={t("tagsPlaceholder")}
                  selectedKeys={selectedTags}
                  selectionMode="multiple"
                  variant="bordered"
                  onSelectionChange={(keys) =>
                    setSelectedTags(keys as Set<string>)
                  }
                >
                  {(tag: any) => (
                    <SelectItem
                      key={tag.slug}
                      description={tag.description || undefined}
                      startContent={
                        tag.icon ? (
                          /^https?:\/\//.test(tag.icon) ? (
                            <img
                              alt=""
                              className="w-4 h-4 object-cover rounded"
                              src={tag.icon}
                            />
                          ) : (
                            <span className="text-sm">{tag.icon}</span>
                          )
                        ) : null
                      }
                      textValue={tag.name}
                    >
                      {tag.name}
                    </SelectItem>
                  )}
                </Select>

                {/* Превью выбранных тегов */}
                {selectedTags.size > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedTags).map((tagSlug) => {
                      const tag = tags.find((t) => t.slug === tagSlug);

                      if (!tag) return null;

                      return (
                        <Chip
                          key={tag.slug}
                          size="sm"
                          style={{ backgroundColor: tag.color || undefined }}
                          variant="flat"
                          onClose={() => {
                            const newTags = new Set(selectedTags);

                            newTags.delete(tagSlug);
                            setSelectedTags(newTags);
                          }}
                        >
                          {tag.icon ? (
                            /^https?:\/\//.test(tag.icon) ? (
                              <img
                                alt=""
                                className="inline-block w-4 h-4 object-cover rounded mr-1 align-[-2px]"
                                loading="lazy"
                                src={tag.icon}
                              />
                            ) : (
                              <span className="mr-1">{tag.icon}</span>
                            )
                          ) : null}
                          {tag.name}
                        </Chip>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Содержание */}
            <Textarea
              isRequired
              label={t("contentLabel")}
              maxRows={8}
              minRows={4}
              placeholder="Введите содержание треда..."
              value={formData.content}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />

            {/* Загрузка файла */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("fileLabel")}</label>
              <input
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.webm,.mp4"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
                type="file"
                onChange={handleFileChange}
              />

              {/* Список выбранных файлов */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Выбранные файлы ({selectedFiles.length}/5):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      return (
                        <div
                          key={index}
                          className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          {/* Превью медиа */}
                          <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
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
                                onLoadedData={() =>
                                  URL.revokeObjectURL(fileURL)
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📄</span>
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {file.name.split(".").pop()?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Кнопка удаления */}
                            <Button
                              className="absolute top-1 right-1 min-w-unit-6 w-6 h-6 p-0"
                              color="danger"
                              size="sm"
                              variant="solid"
                              onPress={() => removeFile(index)}
                            >
                              ×
                            </Button>

                            {/* Индикатор типа файла */}
                            {isVideo && (
                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                ▶
                              </div>
                            )}
                          </div>

                          {/* Информация о файле */}
                          <div className="p-2">
                            <p
                              className="text-xs text-gray-600 dark:text-gray-400 truncate"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Информация о лимитах */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Максимальный размер файла: 5MB</p>
                <p>Максимум файлов: 5</p>
                <div className="flex flex-wrap gap-1">
                  <span>Поддерживаемые форматы:</span>
                  {["JPG", "PNG", "GIF", "WEBP", "WEBM", "MP4"].map((type) => (
                    <Chip key={type} color="default" size="sm" variant="flat">
                      {type}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              disabled={isLoading}
              variant="light"
              onPress={onClose}
            >
              {t("cancel")}
            </Button>
            <Button color="primary" isLoading={isLoading} type="submit">
              {t("submit")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateThreadModal;

//   const [formData, setFormData] = useState({
//     subject: '',
//     content: '',
//     authorName: '',
//     threadSlug: ''
//   })
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([])
//   const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.content.trim()) {
//       toast.error(t('errorRequired'))
//       return
//     }

//     if (selectedFiles.length > 5) {
//       toast.error('Максимум 5 файлов')
//       return
//     }

//     try {
//       const formDataToSend = new FormData()
//       formDataToSend.append('subject', formData.subject)
//       formDataToSend.append('content', formData.content)
//       formDataToSend.append('authorName', formData.authorName || 'Аноним')

//       // Добавляем slug если указан
//       if (formData.threadSlug.trim()) {
//         formDataToSend.append('threadSlug', formData.threadSlug.trim())
//       }

//       selectedFiles.forEach(file => {
//         formDataToSend.append('images', file)
//       })

//       const thread = await createThread({
//         slug: categorySlug,
//         formData: formDataToSend
//       }).unwrap()

//       // Назначаем выбранные теги
//       if (selectedTags.size > 0) {
//         const tagSlugs = Array.from(selectedTags)
//         for (const tagSlug of tagSlugs) {
//           try {
//             await assignTag({ threadId: thread.id, tagSlug }).unwrap()
//           } catch (tagError) {
//             console.error('Ошибка назначения тега:', tagError)
//           }
//         }
//       }

//       toast.success('Тред создан успешно!')
//       onClose()
//       setFormData({
//         subject: '',
//         content: '',
//         authorName: '',
//         threadSlug: ''
//       })
//       setSelectedFiles([])
//       setSelectedTags(new Set())
//     } catch (error: any) {
//       toast.error(error?.data?.error || t('errorCreate'))
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])

//     if (files.length === 0) return

//     // Проверка количества файлов
//     if (selectedFiles.length + files.length > 5) {
//       toast.error('Максимум 5 файлов')
//       return
//     }

//     // Проверка каждого файла (базовые ограничения)
//     for (const file of files) {
//       // Проверка размера файла (5MB по умолчанию)
//       if (file.size > 5242880) {
//         toast.error(`Файл ${file.name} слишком большой. Максимальный размер: 5MB`)
//         return
//       }

//       // Проверка типа файла
//       const fileExt = file.name.split('.').pop()?.toLowerCase()
//       const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'webm', 'mp4']
//       if (fileExt && !allowedTypes.includes(fileExt)) {
//         toast.error(`Тип файла ${fileExt} не поддерживается. Разрешённые типы: ${allowedTypes.join(', ')}`)
//         return
//       }
//     }

//     setSelectedFiles(prev => [...prev, ...files])
//   }

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index))
//   }

//   const generateSlug = (subject: string) => {
//     return subject
//       .toLowerCase()
//       .replace(/[^a-zA-Zа-яё0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .slice(0, 50)
//   }

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       size="2xl"
//       scrollBehavior="inside"
//     >
//       <ModalContent>
//         <form onSubmit={handleSubmit}>
//           <ModalHeader className="flex flex-col gap-1">
//             <h2 className="text-xl font-bold">{t('title')} {category.name}</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Создайте новую тему для обсуждения в категории
//             </p>
//           </ModalHeader>

//           <ModalBody className="gap-4">
//             {/* Имя автора */}
//             <Input
//               label={t('nameLabel')}
//               placeholder={t('namePlaceholder')}
//               value={formData.authorName}
//               onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
//               variant="bordered"
//               description={t('nameDescription')}
//             />

//             {/* Тема треда */}
//             <Input
//               label={t('subjectLabel')}
//               placeholder={t('subjectPlaceholder')}
//               value={formData.subject}
//               onChange={(e) => {
//                 const subject = e.target.value
//                 setFormData(prev => ({
//                   ...prev,
//                   subject,
//                   // Автогенерация slug только если он пустой
//                   threadSlug: prev.threadSlug || generateSlug(subject)
//                 }))
//               }}
//               variant="bordered"
//               isRequired
//             />

//             {/* Slug треда */}
//             <Input
//               label="URL-адрес (slug)"
//               placeholder="thread-url-slug"
//               value={formData.threadSlug}
//               onChange={(e) => setFormData(prev => ({ ...prev, threadSlug: e.target.value }))}
//               variant="bordered"
//               description="Используется в URL. Оставьте пустым для автогенерации"
//               startContent={<span className="text-sm text-gray-500">/forum/categories/{categorySlug}/</span>}
//             />

//             {/* Выбор тегов */}
//             {tags && tags.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium" htmlFor="thread-tags">{t('tagsLabel')}</label>
//                 <Select
//                   id="thread-tags"
//                   label={t('tagsLabel')}
//                   placeholder={t('tagsPlaceholder')}
//                   selectionMode="multiple"
//                   selectedKeys={selectedTags}
//                   onSelectionChange={(keys) => setSelectedTags(keys as Set<string>)}
//                   variant="bordered"
//                   items={tags}
//                 >
//                   {(tag) => (
//                     <SelectItem
//                     // @ts-ignore
//                       key={tag.slug}
//                     // @ts-ignore
//                       textValue={tag.name}
//                       startContent={
//                     // @ts-ignore
//                         tag.icon ? (
//                     // @ts-ignore
//                           /^https?:\/\//.test(tag.icon) ? (
//                     // @ts-ignore
//                             <img src={tag.icon} alt="" className="w-4 h-4 object-cover rounded" />
//                           ) : (
//                     // @ts-ignore
//                             <span className="text-sm">{tag.icon}</span>
//                           )
//                         ) : null
//                       }
//                     // @ts-ignore
//                       description={tag.description || undefined}
//                     >
//                     {/* @ts-ignore */}
//                       {tag.name}
//                     </SelectItem>
//                   )}
//                 </Select>

//                 {/* Превью выбранных тегов */}
//                 {selectedTags.size > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {Array.from(selectedTags).map((tagSlug) => {
//                     {/* @ts-ignore */}
//                       const tag = tags.find(t => t.slug === tagSlug)
//                       if (!tag) return null
//                       return (
//                         <Chip
//                           key={tag.slug}
//                           size="sm"
//                           variant="flat"
//                           style={{ backgroundColor: tag.color || undefined }}
//                           onClose={() => {
//                             const newTags = new Set(selectedTags)
//                             newTags.delete(tagSlug)
//                             setSelectedTags(newTags)
//                           }}
//                         >
//                           {tag.icon ? (
//                             /^https?:\/\//.test(tag.icon) ? (
//                               <img
//                                 src={tag.icon}
//                                 alt=""
//                                 className="inline-block w-4 h-4 object-cover rounded mr-1 align-[-2px]"
//                                 loading="lazy"
//                               />
//                             ) : (
//                               <span className="mr-1">{tag.icon}</span>
//                             )
//                           ) : null}
//                           {tag.name}
//                         </Chip>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Содержание */}
//             <Textarea
//               label={t('contentLabel')}
//               placeholder="Введите содержание треда..."
//               value={formData.content}
//               onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
//               variant="bordered"
//               minRows={4}
//               maxRows={8}
//               isRequired
//             />

//             {/* Загрузка файла */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('fileLabel')}</label>
//               <input
//                 type="file"
//                 multiple
//                 accept=".jpg,.jpeg,.png,.gif,.webp,.webm,.mp4"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500
//                   file:mr-4 file:py-2 file:px-4
//                   file:rounded-full file:border-0
//                   file:text-sm file:font-semibold
//                   file:bg-primary-50 file:text-primary-700
//                   hover:file:bg-primary-100"
//               />

//               {/* Список выбранных файлов */}
//               {selectedFiles.length > 0 && (
//                 <div className="space-y-3">
//                   <p className="text-sm font-medium">Выбранные файлы ({selectedFiles.length}/5):</p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {selectedFiles.map((file, index) => {
//                       const fileURL = URL.createObjectURL(file);
//                       const isImage = file.type.startsWith('image/');
//                       const isVideo = file.type.startsWith('video/');

//                       return (
//                         <div key={index} className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
//                           {/* Превью медиа */}
//                           <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
//                             {isImage ? (
//                               <img
//                                 src={fileURL}
//                                 alt={file.name}
//                                 className="w-full h-full object-cover"
//                                 onLoad={() => URL.revokeObjectURL(fileURL)}
//                               />
//                             ) : isVideo ? (
//                               <video
//                                 src={fileURL}
//                                 className="w-full h-full object-cover"
//                                 muted
//                                 onLoadedData={() => URL.revokeObjectURL(fileURL)}
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center">
//                                 <div className="text-center">
//                                   <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
//                                     <span className="text-xl">📄</span>
//                                   </div>
//                                   <span className="text-xs text-gray-600 dark:text-gray-400">
//                                     {file.name.split('.').pop()?.toUpperCase()}
//                                   </span>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Кнопка удаления */}
//                             <Button
//                               size="sm"
//                               color="danger"
//                               variant="solid"
//                               className="absolute top-1 right-1 min-w-unit-6 w-6 h-6 p-0"
//                               onPress={() => removeFile(index)}
//                             >
//                               ×
//                             </Button>

//                             {/* Индикатор типа файла */}
//                             {isVideo && (
//                               <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
//                                 ▶
//                               </div>
//                             )}
//                           </div>

//                           {/* Информация о файле */}
//                           <div className="p-2">
//                             <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={file.name}>
//                               {file.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {(file.size / 1024 / 1024).toFixed(1)}MB
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Информация о лимитах */}
//               <div className="text-xs text-gray-500 space-y-1">
//                 <p>Максимальный размер файла: 5MB</p>
//                 <p>Максимум файлов: 5</p>
//                 <div className="flex flex-wrap gap-1">
//                   <span>Поддерживаемые форматы:</span>
//                   {['JPG', 'PNG', 'GIF', 'WEBP', 'WEBM', 'MP4'].map(type => (
//                     <Chip key={type} size="sm" variant="flat" color="default">
//                       {type}
//                     </Chip>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </ModalBody>

//           <ModalFooter>
//             <Button
//               color="danger"
//               variant="light"
//               onPress={onClose}
//               disabled={isLoading}
//             >
//               {t('cancel')}
//             </Button>
//             <Button
//               color="primary"
//               type="submit"
//               isLoading={isLoading}
//             >
//               {t('submit')}
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   )
// }

// export default CreateThreadModal
