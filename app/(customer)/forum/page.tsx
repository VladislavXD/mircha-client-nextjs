"use client";

import React from "react";
import { useGetBoardsQuery } from "@/src/services/forum.service";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import CreateBoardModal from "./components/CreateBoardModal";
import { useTheme } from "next-themes";




const ForumPage = () => {
  const { data: boards, isLoading, error } = useGetBoardsQuery();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить список бордов</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <span
          className="font-bold text-inherit flex items-center gap-2"
        >
          <img
            src={theme === "dark" ? "/darkLogo.svg" : "/lightLogo.svg"}
            className="w-8 sm:w-10"
            alt=""
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Mirchan - Forum</h1>
        </span>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() => setShowCreateModal(true)}
          className="self-start sm:self-auto"
        >
          <span className="hidden sm:inline">Создать борд</span>
          <span className="sm:hidden">Создать</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {boards?.map((board) => (
          <Link key={board.id} href={`/forum/${board.name}`} >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex justify-between items-start px-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-600 break-words">
                    /{board.name}/
                  </h3> 
                  <p className="text-base sm:text-lg font-medium break-words">{board.title}</p>
                </div>
                <div className="flex flex-col gap-1 ml-2 shrink-0">
                  {board.isNsfw && (
                    <Chip color="danger" size="sm" variant="flat" className="text-xs">
                      NSFW
                    </Chip>
                  )}
                  <Chip color="default" size="sm" variant="flat" className="text-xs">
                    <span className="hidden sm:inline">{board._count?.threads || 0} тредов</span>
                    <span className="sm:hidden">{board._count?.threads || 0}</span>
                  </Chip>
                </div>
              </CardHeader>

              {board.description && (
                <CardBody className="pt-0 px-3 sm:px-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                    {board.description}
                  </p>
                </CardBody>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {boards?.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Нет доступных бордов</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Создайте первый борд для начала дискуссии
          </p>
        </div>
      )}

      {/* Плавающая кнопка создания борда */}
      <div className="fixed bottom-4 right-2 sm:right-4 z-50">
        <Button
          color="primary"
          size="md"
          onPress={() => setShowCreateModal(true)}
          className="rounded-full shadow-lg text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Создать</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>

      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default ForumPage;
