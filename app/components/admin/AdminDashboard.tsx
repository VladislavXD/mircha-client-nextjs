'use client'

import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  Spinner
} from '@heroui/react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, FileText, Image, BarChart3, UserCheck, UserX, Lock, Unlock } from 'lucide-react'
import { useGetAdminStatsQuery } from '@/src/services/admin.service'
import { formatFileSize, formatAdminDate } from '@/src/services/admin.utils'

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <CardBody>
          <p className="text-danger">Ошибка загрузки статистики: {error.toString()}</p>
        </CardBody>
      </Card>
    )
  }

  if (!stats || !stats.users || !stats.boards || !stats.threads || !stats.replies || !stats.media) {
    return (
      <Card className="bg-warning-50 border-warning-200">
        <CardBody>
          <p className="text-warning">Данные статистики недоступны</p>
        </CardBody>
      </Card>
    )
  }

  const statCards = [
    {
      title: 'Пользователи',
      value: stats.users?.total || 0,
      subtitle: `Активных: ${stats.users?.active || 0}`,
      color: 'primary' as const,
      icon: Users,
      details: [
        { label: 'Админы', value: stats.users?.admins || 0 },
        { label: 'Модераторы', value: stats.users?.moderators || 0 },
        { label: 'Активные', value: stats.users?.active || 0 },
      ]
    },
    {
      title: 'Борды',
      value: stats.boards?.total || 0,
      subtitle: `Активных: ${stats.boards?.active || 0}`,
      color: 'secondary' as const,
      icon: FileText,
      details: [
        { label: 'Всего', value: stats.boards?.total || 0 },
        { label: 'Активные', value: stats.boards?.active || 0 },
      ]
    },
    {
      title: 'Треды',
      value: stats.threads?.total || 0,
      subtitle: `Сегодня: ${stats.threads?.today || 0}`,
      color: 'success' as const,
      icon: MessageSquare,
      details: [
        { label: 'Всего', value: stats.threads?.total || 0 },
        { label: 'Сегодня', value: stats.threads?.today || 0 },
      ]
    },
    {
      title: 'Ответы',
      value: stats.replies?.total || 0,
      subtitle: `Сегодня: ${stats.replies?.today || 0}`,
      color: 'warning' as const,
      icon: MessageSquare,
      details: [
        { label: 'Всего', value: stats.replies?.total || 0 },
        { label: 'Сегодня', value: stats.replies?.today || 0 },
      ]
    },
    {
      title: 'Медиафайлы',
      value: stats.media?.total || 0,
      subtitle: `Размер: ${formatFileSize(stats.media?.totalSize || 0)}`,
      color: 'danger' as const,
      icon: Image,
      details: [
        { label: 'Файлов', value: stats.media?.total || 0 },
        { label: 'Размер', value: formatFileSize(stats.media?.totalSize || 0) },
      ]
    }
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Панель администратора
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Добро пожаловать в административную панель. Здесь вы можете управлять всеми аспектами форума.
        </p>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon
          
          // Определяем цвета для каждого типа карточки
          const getCardColors = (color: string) => {
            switch (color) {
              case 'primary':
                return {
                  bgClass: 'bg-blue-100',
                  iconClass: 'text-blue-600',
                  chipColor: 'primary' as const
                }
              case 'secondary':
                return {
                  bgClass: 'bg-purple-100',
                  iconClass: 'text-purple-600',
                  chipColor: 'secondary' as const
                }
              case 'success':
                return {
                  bgClass: 'bg-green-100',
                  iconClass: 'text-green-600',
                  chipColor: 'success' as const
                }
              case 'warning':
                return {
                  bgClass: 'bg-yellow-100',
                  iconClass: 'text-yellow-600',
                  chipColor: 'warning' as const
                }
              case 'danger':
                return {
                  bgClass: 'bg-red-100',
                  iconClass: 'text-red-600',
                  chipColor: 'danger' as const
                }
              default:
                return {
                  bgClass: 'bg-gray-100',
                  iconClass: 'text-gray-600',
                  chipColor: 'default' as const
                }
            }
          }
          
          const colors = getCardColors(card.color)
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${colors.bgClass}`}>
                      <IconComponent className={`w-8 h-8 ${colors.iconClass}`} />
                    </div>
                    <Chip
                      color={colors.chipColor}
                      variant="flat"
                      size="sm"
                    >
                      {card.title}
                    </Chip>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </h3>
                    <p className="text-base font-medium text-gray-700">{card.title}</p>
                    <p className="text-sm text-gray-500">{card.subtitle}</p>
                  </div>

                  <Divider className="my-4" />

                  <div className="space-y-3">
                    {card.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{detail.label}:</span>
                        <span className="font-semibold text-gray-900">
                          {typeof detail.value === 'number' ? detail.value.toLocaleString() : detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Статистика пользователей */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              <h3 className="text-base sm:text-lg font-semibold">Пользователи</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Активные пользователи</span>
                  <span>{((stats.users.active / stats.users.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={(stats.users.active / stats.users.total) * 100}
                  color="success"
                  size="sm"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Администраторы</span>
                  <span>{((stats.users.admins / stats.users.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={(stats.users.admins / stats.users.total) * 100}
                  color="danger"
                  size="sm"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Модераторы</span>
                  <span>{((stats.users.moderators / stats.users.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={(stats.users.moderators / stats.users.total) * 100}
                  color="warning"
                  size="sm"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Статистика контента */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary-600" />
              <h3 className="text-base sm:text-lg font-semibold">Активность</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Новых тредов сегодня</span>
                <Chip color="success" variant="flat" size="sm">
                  {stats.threads.today}
                </Chip>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Новых ответов сегодня</span>
                <Chip color="primary" variant="flat" size="sm">
                  {stats.replies.today}
                </Chip>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Активных бордов</span>
                <Chip color="secondary" variant="flat" size="sm">
                  {stats.boards.active}
                </Chip>
              </div>
              
              <Divider />
              
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Общий размер медиа</span>
                <span className="text-xs sm:text-sm font-medium">
                  {formatFileSize(stats.media.totalSize)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Быстрые действия</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors"
            >
              <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-700 text-center">Управление пользователями</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg border border-secondary-200 transition-colors"
            >
              <FileText className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-700 text-center">Управление бордами</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-success-50 hover:bg-success-100 rounded-lg border border-success-200 transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-success-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-success-700 text-center">Модерация контента</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg border border-warning-200 transition-colors"
            >
              <Image className="w-6 h-6 text-warning-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-warning-700 text-center">Управление медиа</p>
            </motion.button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminDashboard
