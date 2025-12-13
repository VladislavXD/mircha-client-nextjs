// import React, { useState, useEffect } from "react";

// import { Controller, useForm } from "react-hook-form";
// import { addToast, Button } from "@heroui/react";
// import ErrorMessage from "../../ErrorMessage";
// import { IoMdCreate } from "react-icons/io";
// // TODO: Migrate to React Query - Create useCreatePost, useLazyGetAllPosts hooks

// import ImageUpload from "../ImageUpload";
// import { EmojiText } from "../../EmojiText";
// import { createImagePreview, revokeImagePreview } from "../ImageUpload/utils";
// import { useTranslations } from "next-intl";
// import RichTextarea, { createEmojiPlugin, createMentionPlugin } from "../../inputs/RichTextarea";
// import { useSelector } from "react-redux";


// type Props = {};

// const CreatePost = (props: Props) => {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);


//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm();

//   const currentText = watch("post", "");
//   const error = errors?.post?.message as string;

//   // Очистка URL предпросмотра при размонтировании компонента
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         revokeImagePreview(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   const handleImageSelect = (file: File | null) => {
//     // Очистка предыдущего предпросмотра
//     if (imagePreview) {
//       revokeImagePreview(imagePreview);
//       setImagePreview(null);
//     }

//     setSelectedImage(file);

//     if (file) {
//       const preview = createImagePreview(file);
//       setImagePreview(preview);
//     }
//   };

//   // Вставка эмодзи обрабатывается в EmojiMentionTextarea

//   const createPostFormDataWithEmojis = (content: string, image?: File) => {
//     const formData = new FormData();
//     formData.append("content", content);

//     if (image) {
//       formData.append("image", image);
//     }

//     if (selectedEmojis.length > 0) {
//       formData.append("emojiUrls", JSON.stringify(selectedEmojis));
//     }

//     return formData;
//   };

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       if (!true) {
//         addToast({
//           title: "Вы не авторизованы",
//           description: "Пожалуйста, войдите в систему.",

//           color: "danger",

//         });
//         setValue("post", "");
//         setSelectedImage(null);
//         setSelectedEmojis([]);
//         if (imagePreview) {
//           revokeImagePreview(imagePreview);
//           setImagePreview(null);
//         }
//         return;
//       }
//       const formData = createPostFormDataWithEmojis(
//         data.post,
//         selectedImage || undefined
//       );
//       // await createPost(formData).unwrap();

//       // Очистка формы
//       setValue("post", "");
//       setSelectedImage(null);
//       setSelectedEmojis([]);
//       if (imagePreview) {
//         revokeImagePreview(imagePreview);
//         setImagePreview(null);
//       }

//       // await triggerAllPosts().unwrap();
//     } catch (err) {
//       console.log(err);
//     }
//   });

//   const t = useTranslations("HomePage");

//   // Вся логика эмодзи и упоминаний вынесена в EmojiMentionTextarea

//   return (
//     <form className="flex-grow" onSubmit={onSubmit}>
//       <Controller
//         name="post"
//         control={control}
//         defaultValue=""
//         render={({ field }) => (
//           <RichTextarea
//             value={field.value}
//             onChange={(v) => setValue("post", v, { shouldDirty: true, shouldValidate: true })}
//             placeholder={t("CreatePost.CreatePostInput")}
//             disabled={false}
//             className="mb-2"
//             plugins={[
//               createMentionPlugin(),
//               createEmojiPlugin({ onUrlsChange: setSelectedEmojis }),
//             ]}
//           />
//         )}
//       />

//       <div className="mb-5 flex gap-3">
//         <ImageUpload
//           onImageSelect={handleImageSelect}
//           preview={imagePreview}
//           disabled={isLoading}
//         />
//   {/* Emoji кнопки уже внутри EmojiMentionTextarea; оставляем ImageUpload рядом */}
//       </div>

//       {(selectedEmojis.length > 0 || currentText) && (
//         <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border border-default-200 shadow-sm">
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-2 h-2 rounded-full bg-primary"></div>
//             <span className="text-sm font-medium text-default-600">
//               {t("CreatePost.previewPost")}
//             </span>
//           </div>
//           <div className="bg-background/70 backdrop-blur-sm rounded-lg p-3 border border-default-200/50">
//             <EmojiText
//               key={currentText}
//               text={currentText || "Начните писать..."}
//               emojiUrls={selectedEmojis}
//               className="text-default-700 leading-relaxed"
//             />
//             {currentText === "" && (
//               <div className="text-default-400 italic">
//                 Ваш пост будет отображаться здесь
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {error && <ErrorMessage error={error} />}

//       <Button
//         color="success"
//         isLoading={isLoading}
//         className="flex-end relative  rounded-full hover:-translate-y-1 px-12 shadow-xl  after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
//         endContent={<IoMdCreate />}
//         type="submit"
//       >
//         {t("CreatePost.addPost")}
//       </Button>
//     </form>
//   );
// };

// export default CreatePost;
