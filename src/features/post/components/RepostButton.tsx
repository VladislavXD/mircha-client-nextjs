"use client"

import React, { useState } from 'react'
import { Repeat } from 'lucide-react'
import { useCreateRepost, useDeleteRepost } from '../hooks/useRepost'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Avatar, Card, CardBody } from '@heroui/react'
import { EmojiText } from '@/shared/components/ui/EmojiText'
import type { Post } from '../types'

interface RepostButtonProps {
  postId: string
  repostedByUser?: boolean
  repostCount?: number
  showCount?: boolean
  post?: Post // Добавляем данные о посте для превью
}

/**
 * Кнопка репоста с оптимистичным обновлением.
 * 
 * Features:
 * - Мгновенный отклик UI (optimistic updates)
 * - Модалка для добавления комментария к репосту
 * - Fire-and-forget паттерн (без async/await)
 * 
 * Usage:
 * ```tsx
 * <RepostButton 
 *   postId="post-id"
 *   repostedByUser={false}
 *   repostCount={5}
 * />
 * ```
 */
export const RepostButton: React.FC<RepostButtonProps> = ({
  postId,
  repostedByUser = false,
  repostCount = 0,
  showCount = true,
  post,
  
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState('')
  
  const { mutate: createRepost, isPending: isCreating } = useCreateRepost()
  const { mutate: deleteRepost, isPending: isDeleting } = useDeleteRepost()

  const isPending = isCreating || isDeleting

  /**
   * ✅ Fire-and-forget: немедленный UI отклик
   * ❌ НЕ используй async/await - это задерживает optimistic update
   */
  const handleRepost = () => {
    if (repostedByUser) {
      // Удаляем репост
      deleteRepost(postId)
    } else {
      // Открываем модалку для комментария (опционально)
      setIsModalOpen(true)
    }
  }

  const handleConfirmRepost = () => {
    createRepost({ 
      postId, 
      comment: comment.trim() || undefined 
    })
    setIsModalOpen(false)
    setComment('')
  }

  const handleQuickRepost = (e: React.MouseEvent) => {
    // Shift+Click для быстрого репоста без комментария
    if (e.shiftKey) {
      e.stopPropagation()
      createRepost({ postId })
    }
  }

  return (
    <>
      <button

        data-repost-button
        onClick={e=> {
          e.stopPropagation() // Предотвращаем всплытие, чтобы не открывать пост
          handleRepost()
        }}
        onClickCapture={handleQuickRepost}
        disabled={isPending}
        className={`
          flex items-center justify-center gap-2 cursor-pointer 
          bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-700/50 
          px-2 py-1 rounded-2xl select-none 
          active:scale-95 transition-all duration-200 hover:scale-105
          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={repostedByUser ? 'Отменить репост' : 'Репостнуть (Shift+Click для быстрого репоста)'}
      >
        <Repeat 
          size={24}
          className={`
            w-5 h-5 sm:w-5 sm:h-6 stroke-1 transition-colors
            ${repostedByUser ? 'text-green-500' : 'text-default-600'}
          `}
        />
        {showCount && repostCount > 0 && (
          <span className={`
            font-normal text-l
            ${repostedByUser ? 'text-green-500' : 'text-default-600'}
          `}>
            {repostCount}
          </span>
        )}
      </button>

      {/* Модалка для добавления комментария к репосту */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Добавить комментарий к репосту
          </ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Ваш комментарий (опционально)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              minRows={3}
              maxRows={6}
              maxLength={280}
            />
            <p className="text-xs text-default-400">
              {comment.length}/280
            </p>

            {/* Превью поста */}
            {post && (
              <Card className="mt-4 border border-default-200 dark:border-default-100">
                <CardBody className="p-4">
                  {/* Автор поста */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      src={post.author?.avatarUrl}
                      name={post.author?.name || post.author?.username}
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-default-900">
                        {post.author?.name || post.author?.username}
                      </span>
                      <span className="text-xs text-default-500">
                        @{post.author?.username}
                      </span>
                    </div>
                  </div>

                  {/* Содержимое поста с правильным рендерингом */}
                  <div className="text-sm line-clamp-6">
                    <EmojiText 
                      text={typeof post.content === 'string' ? post.content : JSON.stringify(post.content)}
                      emojiUrls={post.emojiUrls || []}
                      className="text-default-700"
                    />
                  </div>
                </CardBody>
              </Card>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default" 
              variant="light" 
              onPress={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleConfirmRepost}
              isLoading={isPending}
            >
              Репостнуть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
