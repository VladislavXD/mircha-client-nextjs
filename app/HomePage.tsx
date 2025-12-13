'use client'

import React from "react"
import { PostList } from "@/src/features/post"

/**
 * HomePage - главная страница с лентой постов
 * 
 * Использует новую архитектуру с React Query:
 * - PostList из features/post для отображения ленты
 * - CreatePost для авторизованных пользователей
 * - PostCard для каждого поста с оптимистичными обновлениями
 * - Автоматическое управление состояниями загрузки и ошибок
 */
const Posts = () => {
  return <PostList />
}

export default Posts
