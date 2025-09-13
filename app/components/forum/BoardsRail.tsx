"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, Chip, ScrollShadow } from '@heroui/react'
import type { Board } from '@/src/types/types'

type Props = { boards: Board[] }

export default function 	BoardsRail({ boards }: Props){
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Boards</h2>
      </div>
      <ScrollShadow className="w-full" orientation="horizontal">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {boards.map(board => (
            <Link key={board.id} href={`/forum/${board.name}`}>
              <Card className="min-w-[240px] hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex justify-between items-start px-4">
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
                  <CardBody className="pt-0 px-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-words">{board.description}</p>
                  </CardBody>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </ScrollShadow>
    </div>
  )
}
