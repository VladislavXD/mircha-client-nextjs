// "use client";

// import React, { useState } from "react";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Input,
//   Textarea,
//   Switch,
//   Select,
//   SelectItem,
//   Chip,
// } from "@heroui/react";
// // TODO: Migrate to React Query: Create useCreateBoard hook
// // @ts-ignore
// import { toast } from "sonner";
// import { useTranslations } from "next-intl";

// import { useCreateBoard } from "@/src/features/admin";

// interface CreateBoardModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const t = useTranslations("Forum.createBoard");
//   const [createBoard, { isLoading }] = useCreateBoard();

//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     description: "",
//     isNsfw: false,
//     maxFileSize: 5242880, // 5MB
//     allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
//     postsPerPage: 15,
//     threadsPerPage: 10,
//     bumpLimit: 500,
//     imageLimit: 150,
//   });

//   const availableFileTypes = [
//     "jpg",
//     "jpeg",
//     "png",
//     "gif",
//     "webp",
//     "webm",
//     "mp4",
//     "mov",
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name.trim() || !formData.title.trim()) {
//       toast.error(t("errorRequired"));

//       return;
//     }

//     try {
//       await createBoard(formData).unwrap();
//       toast.success("Борд создан успешно!");
//       onClose();
//       setFormData({
//         name: "",
//         title: "",
//         description: "",
//         isNsfw: false,
//         maxFileSize: 5242880,
//         allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
//         postsPerPage: 15,
//         threadsPerPage: 10,
//         bumpLimit: 500,
//         imageLimit: 150,
//       });
//     } catch (error: any) {
//       toast.error(error?.data?.error || t("errorCreate"));
//     }
//   };

//   const handleFileTypeToggle = (fileType: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       allowedFileTypes: prev.allowedFileTypes.includes(fileType)
//         ? prev.allowedFileTypes.filter((type) => type !== fileType)
//         : [...prev.allowedFileTypes, fileType],
//     }));
//   };

//   const fileSizeOptions = [
//     { label: "1 MB", value: 1048576 },
//     { label: "5 MB", value: 5242880 },
//     { label: "10 MB", value: 10485760 },
//     { label: "25 MB", value: 26214400 },
//     { label: "50 MB", value: 52428800 },
//   ];

//   return (
//     <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onClose}>
//       <ModalContent>
//         <form onSubmit={handleSubmit}>
//           <ModalHeader>
//             <h2 className="text-xl font-bold">{t("title")}</h2>
//           </ModalHeader>

//           <ModalBody className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 required
//                 description="1-10 символов, только буквы и цифры"
//                 label={t("nameLabel")}
//                 maxLength={10}
//                 placeholder="b, g, v..."
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, name: e.target.value }))
//                 }
//               />

//               <Input
//                 required
//                 label={t("titleLabel")}
//                 placeholder="Random, Technology..."
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, title: e.target.value }))
//                 }
//               />
//             </div>

//             <Textarea
//               label={t("descriptionLabel")}
//               maxRows={3}
//               placeholder="Описание борда..."
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//             />

//             <div className="flex items-center gap-4">
//               <Switch
//                 isSelected={formData.isNsfw}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, isNsfw: value }))
//                 }
//               >
//                 NSFW контент
//               </Switch>
//             </div>

//             <Select
//               label={t("maxFileSizeLabel")}
//               selectedKeys={[formData.maxFileSize.toString()]}
//               onSelectionChange={(keys) => {
//                 const value = Array.from(keys)[0] as string;

//                 setFormData((prev) => ({
//                   ...prev,
//                   maxFileSize: parseInt(value),
//                 }));
//               }}
//             >
//               {fileSizeOptions.map((option) => (
//                 <SelectItem key={option.value}>{option.label}</SelectItem>
//               ))}
//             </Select>

//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Разрешенные типы файлов
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {availableFileTypes.map((type) => (
//                   <Chip
//                     key={type}
//                     className="cursor-pointer"
//                     color={
//                       formData.allowedFileTypes.includes(type)
//                         ? "primary"
//                         : "default"
//                     }
//                     variant={
//                       formData.allowedFileTypes.includes(type)
//                         ? "solid"
//                         : "bordered"
//                     }
//                     onClick={() => handleFileTypeToggle(type)}
//                   >
//                     {type}
//                   </Chip>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label={t("postsPerPageLabel")}
//                 max={50}
//                 max={50}
//                 min={5}
//                 type="number"
//                 value={formData.postsPerPage.toString()}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     postsPerPage: parseInt(e.target.value) || 15,
//                   }))
//                 }
//               />

//               <Input
//                 label={t("threadsPerPageLabel")}
//                 max={25}
//                 min={5}
//                 type="number"
//                 value={formData.threadsPerPage.toString()}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     threadsPerPage: parseInt(e.target.value) || 10,
//                   }))
//                 }
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label={t("bumpLimitLabel")}
//                 max={1000}
//                 min={50}
//                 type="number"
//                 value={formData.bumpLimit.toString()}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     bumpLimit: parseInt(e.target.value) || 500,
//                   }))
//                 }
//               />

//               <Input
//                 label={t("imageLimitLabel")}
//                 max={500}
//                 min={10}
//                 type="number"
//                 value={formData.imageLimit.toString()}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     imageLimit: parseInt(e.target.value) || 150,
//                   }))
//                 }
//               />
//             </div>
//           </ModalBody>

//           <ModalFooter>
//             <Button disabled={isLoading} variant="light" onPress={onClose}>
//               {t("cancel")}
//             </Button>
//             <Button color="primary" isLoading={isLoading} type="submit">
//               {t("submit")}
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CreateBoardModal;
