"use client"

import React from 'react'
import { Spinner } from '@heroui/react'
import { useGetBoardsQuery } from '@/src/services/forum.service'
import BoardsList from './BoardsList'
import CategoriesListFull from './CategoriesListFull'

// TEMP: обход ошибки сборки dev-чанка (ReferenceError: ye is not defined)
// В некоторых версиях dev-сборки Turbopack остаётся ссылка на идентификатор `ye`.
// Локальное определение предотвращает падение рантайма.
// TODO: удалить после обновления Next/Turbopack или устранения причины.
const ye: unknown = undefined

export default function ForumHome(){
  const { data: boards, isLoading: loadingBoards, error: boardsError } = useGetBoardsQuery()

  if (loadingBoards) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (boardsError) {
    return (
      <div className="text-center text-red-500 p-8">
  <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
  <p>Не удалось загрузить список бордов</p>
      </div>
    )
  }

  return (
    <div>
      {boards && boards.length > 0 && (
        <BoardsList boards={boards} pageSize={10} />
      )}

      <CategoriesListFull />
    </div>
  )
}
