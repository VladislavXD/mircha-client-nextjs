// "use client";

// import React from "react";
// import { Spinner } from "@heroui/react";
// import { useTheme } from "next-themes";
// // TODO: Migrate to React Query: Create useCategories hook
// import { useGetCategoriesQuery } from "@/src/services/forum.service.old";
// import Link from "next/link";
// import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
// import MobileForumExtras from "@/shared/components/forum/MobileForumExtras";

// const CategoriesPage = () => {
//   const { theme } = useTheme();
//   const { data: categories, isLoading, error } = useGetCategoriesQuery();

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         {/* Мобильные виджеты: внизу страницы */}
//         <MobileForumExtras />
//       </div>
//     );
//     return (
//       <div className="text-center text-red-500 p-8">
//         <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
//         <p>Не удалось загрузить список категорий</p>
//       </div>
//     );
//   }

//   // Разделяем категории на корневые и дочерние
//   const rootCategories = categories?.filter(cat => !cat.parentId) || [];

//   return (
//     <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
//       <div className="flex justify-center sm:justify-start mb-4 sm:mb-6">
//         <span className="font-bold text-inherit flex items-center gap-2">
//           <img
//             src={theme === "dark" ? "/darkLogo.svg" : "/lightLogo.svg"}
//             className="w-8 sm:w-10"
//             alt=""
//           />
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Категории</h1>
//         </span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {rootCategories.map((category) => (
//           <Link key={category.id} href={`/forum/categories/${category.slug}`}>
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
//               {category.imageUrl && (
//                 <div className="h-32 overflow-hidden">
//                   <img 
//                     src={category.imageUrl} 
//                     alt={category.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
              
//               <CardHeader className="flex justify-between items-start px-4">
//                 <div className="min-w-0 flex-1">
//                   <h3 className="text-lg font-bold text-blue-600 break-words">
//                     {category.name}
//                   </h3>
//                   {category.description && (
//                     <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
//                       {category.description}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex flex-col gap-1 ml-2 shrink-0">
//                   <Chip color="default" size="sm" variant="flat" className="text-xs">
//                     {category._count?.threads || 0} тредов
//                   </Chip>
//                 </div>
//               </CardHeader>

//               {category.children && category.children.length > 0 && (
//                 <CardBody className="pt-0 px-4">
//                   <div className="flex flex-wrap gap-1">
//                     {category.children.map((child) => (
//                       <Chip key={child.id} size="sm" variant="bordered" className="text-xs">
//                         {child.name}
//                       </Chip>
//                     ))}
//                   </div>
//                 </CardBody>
//               )}
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {rootCategories.length === 0 && (
//         <div className="text-center py-12">
//           <h2 className="text-xl font-semibold mb-2">Категории не найдены</h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Пока что нет созданных категорий
//           </p>
//         </div>
//       )}

//       {/* Мобильные виджеты: внизу страницы */}
//       <MobileForumExtras />
//     </div>
//   );
// };

// export default CategoriesPage;