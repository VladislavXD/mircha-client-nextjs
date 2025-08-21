"use client"
import React, { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/src/hooks/reduxHooks"
import {
  useLazyGetOrCreateChatQuery,
  useMarkMessagesAsReadMutation,
} from "@/src/services/caht.service"
import { socketService } from "@/app/utils/socketService"
import { Card, Input, Button, User, Spinner, Badge } from "@heroui/react"
import { Send, ArrowLeft, Phone, Video } from "lucide-react"
import type { Message } from "@/src/services/caht.service"

export const ChatWindow: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const router = useRouter()
  const currentUser = useAppSelector(state => state.user.current)
  const token = useAppSelector(state => state.user.token)

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; userName: string }[]
  >([])
  const [isOnline, setIsOnline] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [getOrCreateChat, { data: chatData, isLoading }] =
    useLazyGetOrCreateChatQuery()
  const [markAsRead] = useMarkMessagesAsReadMutation()

  // Получаем или создаем чат при загрузке компонента
  useEffect(() => {
    if (userId) {
      getOrCreateChat(userId)
    }
  }, [userId, getOrCreateChat])

  // Подключаемся к Socket.IO и присоединяемся к чату
  useEffect(() => {
    if (token && !socketService.connected) {
      socketService.connect(token).catch(console.error)
    }

    if (chatData?.id) {
      socketService.joinChat(chatData.id)
      setMessages(chatData.messages || [])
      setIsOnline(chatData.isOnline)

      const unreadMessageIds =
        chatData.messages
          ?.filter(msg => !msg.isRead && msg.senderId !== currentUser?.id)
          .map(msg => msg.id) || []

      if (unreadMessageIds.length > 0) {
        markAsRead(chatData.id)
      }
    }
  }, [token, chatData, currentUser?.id, markAsRead])

  // Обработчики Socket.IO событий
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatData?.id) {
        setMessages(prev => [...prev, message])
        if (message.senderId !== currentUser?.id) {
          setTimeout(() => {
            socketService.markAsRead([message.id])
          }, 1000)
        }
      }
    }

    const handleTypingStart = (data: {
      userId: string
      userName: string
      chatId: string
    }) => {
      if (data.chatId === chatData?.id && data.userId !== currentUser?.id) {
        setTypingUsers(prev => {
          const exists = prev.find(user => user.userId === data.userId)
          if (!exists) return [...prev, { userId: data.userId, userName: data.userName }]
          return prev
        })
      }
    }

    const handleTypingStop = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatData?.id) {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId))
      }
    }

    const handleUserStatusChange = (data: {
      userId: string
      isOnline: boolean
      chatId: string
    }) => {
      if (data.chatId === chatData?.id && data.userId === chatData?.otherParticipant?.id) {
        setIsOnline(data.isOnline)
      }
    }

    socketService.onNewMessage(handleNewMessage)
    socketService.onTypingStart(handleTypingStart)
    socketService.onTypingStop(handleTypingStop)
    socketService.onUserStatusChange(handleUserStatusChange)

    return () => {
      socketService.off("new_message", handleNewMessage)
      socketService.off("user_typing_start", handleTypingStart)
      socketService.off("user_typing_stop", handleTypingStop)
      socketService.off("user_status_change", handleUserStatusChange)
    }
  }, [chatData?.id, chatData?.otherParticipant?.id, currentUser?.id])

  // Автопрокрутка к последним сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatData?.id) return
    socketService.sendMessage(chatData.id, newMessage.trim())
    setNewMessage("")
    if (isTyping) {
      socketService.stopTyping(chatData.id)
      setIsTyping(false)
    }
  }

  const handleInputChange = (value: string) => {
    setNewMessage(value)
    if (!chatData?.id) return

    if (value.trim() && !isTyping) {
      socketService.startTyping(chatData.id)
      setIsTyping(true)
    } else if (!value.trim() && isTyping) {
      socketService.stopTyping(chatData.id)
      setIsTyping(false)
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          socketService.stopTyping(chatData.id)
          setIsTyping(false)
        }
      }, 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffInHours < 24) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100dvh-12rem)] sm:h-[calc(100vh-8rem)]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!chatData) {
    return (
      <div className="flex justify-center items-center h-[calc(100dvh-12rem)] sm:h-[calc(100vh-8rem)]">
        <div className="text-red-500">Ошибка загрузки чата</div>
      </div>
    )
  }

  const otherUser = chatData.otherParticipant

  return (
    <div className="flex flex-col bg-gray-50 h-[calc(100dvh-12rem)] sm:h-[calc(100vh-8rem)]">
      {/* Заголовок чата */}
      <Card className="flex-shrink-0 p-4 rounded-none border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              isIconOnly
              variant="light"
              onClick={() => router.push("/chat")}
            >
              <ArrowLeft size={20} />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Badge
                  content=""
                  color={isOnline ? "success" : "default"}
                  variant={isOnline ? "solid" : "flat"}
                  size="sm"
                  isInvisible={!isOnline}
                  placement="bottom-right"
                >
                  <User
                    name={otherUser?.name || "Неизвестный пользователь"}
                    description={isOnline ? "В сети" : "Не в сети"}
                    avatarProps={{
                      src: otherUser?.avatarUrl || undefined,
                      size: "md",
                    }}
                  />
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button isIconOnly variant="light">
              <Phone size={20} />
            </Button>
            <Button isIconOnly variant="light">
              <Video size={20} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          const isOwn = message.senderId === currentUser?.id
          return (
            <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                <div className="break-words">{message.content}</div>
                <div className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {formatMessageTime(message.createdAt)}
                  {isOwn && message.isRead && <span className="ml-2">✓✓</span>}
                </div>
              </div>
            </div>
          )
        })}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">
                {typingUsers.map(user => user.userName).join(", ")} печатает...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода сообщения */}
      <Card className="flex-shrink-0 p-4 rounded-none border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            className="flex-1"
            size="lg"
          />
          <Button
            color="primary"
            isIconOnly
            onClick={handleSendMessage}
            isDisabled={!newMessage.trim()}
            size="lg"
          >
            <Send size={20} />
          </Button>
        </div>
      </Card>
    </div>
  )
}
