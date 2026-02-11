"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, Chip, Button } from '@heroui/react'
import type { Category } from '@/src/types/forum.types'
type Props = { title: string; categories: Category[] }

export default function CategorySection({ title, categories }: Props){
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button as={Link} href="/forum" size="sm" variant="light">Все категории</Button>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <Link key={cat.id} href={`/forum/${cat.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex items-center justify-between px-4">
                <div>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">{cat.description}</p>
                  )}
                </div>
                {cat._count?.threads !== undefined && (
                  <Chip size="sm" variant="flat">{cat._count.threads} тредов</Chip>
                )}
              </CardHeader>
              {cat.children && cat.children.length > 0 && (
                <CardBody className="pt-0 px-4">
                  <div className="flex flex-wrap gap-2">
                    {cat.children.map(ch => (
                      <Chip key={ch.id} size="sm" variant="bordered">{ch.name}</Chip>
                    ))}
                  </div>
                </CardBody>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
