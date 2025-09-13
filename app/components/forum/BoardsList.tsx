"use client"

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, Chip, Pagination } from '@heroui/react'
import type { Board } from '@/src/types/types'

type Props = {
  boards: Board[]
  pageSize?: number
}

export default function BoardsList({ boards, pageSize = 10 }: Props){
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil((boards?.length || 0) / pageSize))
  const pageBoards = useMemo(() => {
    const start = (page - 1) * pageSize
    return (boards || []).slice(start, start + pageSize)
  }, [boards, page, pageSize])

  if (!boards || boards.length === 0){
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <div className="hidden sm:flex items-center gap-3 text-sm text-foreground-500">
          <span>Всего: {boards.length}</span>
          <span>Стр. {page} / {totalPages}</span>
        </div>
      </div>

      {/* Полноширинная адаптивная сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageBoards.map(board => (
          <Link key={board.id} href={`/forum/${board.name}`} className="block">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex justify-between items-start px-4 pt-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-blue-600 break-words">/{board.name}/</h3>
                  <p className="text-sm font-medium break-words">{board.title}</p>
                </div>
                <div className="flex flex-col gap-1 ml-2 shrink-0">
                  {board.isNsfw && (
                    <Chip color="danger" size="sm" variant="flat" className="text-xs">18+</Chip>
                  )}
                  <Chip color="default" size="sm" variant="flat" className="text-xs">
                    {board._count?.threads || 0}
                  </Chip>
                </div>
              </CardHeader>
              {board.description && (
                <CardBody className="pt-2 px-4 pb-4">
                  <p className="text-sm text-foreground-500 line-clamp-3 break-words">{board.description}</p>
                </CardBody>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground-500">
            Показано {pageBoards.length} из {boards.length}. Страница {page} из {totalPages}
          </div>
          <Pagination
            showControls
            total={totalPages}
            page={page}
            onChange={setPage}
            initialPage={1}
            size="md"
            color="primary"
          />
        </div>
      )}
    </div>
  )
}
