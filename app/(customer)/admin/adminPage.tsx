'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Spinner,
  Chip
} from '@heroui/react'
import { 
  MdDashboard, 
  MdPeople, 
  MdViewModule, 
  MdForum, 
  MdReply, 
  MdPhoto,
  MdSettings 
} from 'react-icons/md'
import AdminDashboard from '@/app/components/admin/AdminDashboard'
import UserManagement from '@/app/components/admin/UserManagement'
import BoardManagement from '@/app/components/admin/BoardManagement'
import ThreadManagement from '@/app/components/admin/ThreadManagement'
import ReplyManagement from '@/app/components/admin/ReplyManagement'
import MediaManagement from '@/app/components/admin/MediaManagement'
import CategoryManagement from '@/app/components/admin/CategoryManagement'
import TagManagement from '@/app/components/admin/TagManagement'
import { useSelector } from 'react-redux'
import type { RootState } from '@/src/store/store'
import { useCurrentQuery } from '@/src/services/user/user.service'
import { useTheme } from 'next-themes'

const AdminPage: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Используем готовый хук для получения текущего пользователя
  const { data: currentUser, isLoading: isLoadingUser, error: userError } = useCurrentQuery()

  useEffect(() => {
    checkAdminAccess()
  }, [currentUser, userError])

  const checkAdminAccess = () => {
    // Если нет токена в localStorage, перенаправляем
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    // Если произошла ошибка при загрузке пользователя (например, токен недействителен)
    if (userError) {
      console.error('Ошибка проверки доступа:', userError)
      router.push('/')
      return
    }

    // Если пользователь загружен, проверяем его роль
    if (currentUser) {
      if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR') {
        alert('У вас нет прав доступа к админ панели')
        router.push('/')
        return
      }
    }
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const tabs = [
    {
      id: 'dashboard',
      label: 'Панель управления',
      icon: MdDashboard,
      component: <AdminDashboard />,
      allowedRoles: ['ADMIN', 'MODERATOR']
    },
    {
      id: 'users',
      label: 'Пользователи',
      icon: MdPeople,
      component: <UserManagement />,
      allowedRoles: ['ADMIN', 'MODERATOR']
    },
    {
      id: 'boards',
      label: 'Борды',
      icon: MdViewModule,
      component: <BoardManagement />,
      allowedRoles: ['ADMIN']
    },
    {
      id: 'categories',
      label: 'Категории',
      icon: MdViewModule,
      component: <CategoryManagement />,
      allowedRoles: ['ADMIN']
    },
    {
      id: 'tags',
      label: 'Теги',
      icon: MdViewModule,
      component: <TagManagement />,
      allowedRoles: ['ADMIN']
    },
    {
      id: 'threads',
      label: 'Треды',
      icon: MdForum,
      component: <ThreadManagement />,
      allowedRoles: ['ADMIN', 'MODERATOR']
    },
    {
      id: 'replies',
      label: 'Ответы',
      icon: MdReply,
      component: <ReplyManagement />,
      allowedRoles: ['ADMIN', 'MODERATOR']
    },
    {
      id: 'media',
      label: 'Медиа',
      icon: MdPhoto,
      component: <MediaManagement />,
      allowedRoles: ['ADMIN', 'MODERATOR']
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: MdSettings,
      component: <div>Настройки системы (в разработке)</div>,
      allowedRoles: ['ADMIN']
    }
  ]

  // Фильтруем вкладки по ролям пользователя
  const availableTabs = tabs.filter(tab => 
    currentUser?.role && tab.allowedRoles.includes(currentUser.role)
  )

  const currentTab = tabs.find(tab => tab.id === activeTab)

  const {theme} = useTheme()
  return (
    <div className={`min-h-screen ${theme} `}>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Администрирование
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base">
                Панель управления форумом
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Chip color="primary" variant="flat" size="sm">
                {currentUser?.role === 'ADMIN' ? 'Администратор' : 'Модератор'}
              </Chip>
            </div>
          </div>
        </div>

        <Card>
          <CardBody className="p-0">
            <Tabs 
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              classNames={{
                tabList: "gap-2 sm:gap-6 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-3 sm:px-6 h-10 sm:h-12 flex-shrink-0",
                tabContent: "group-data-[selected=true]:text-primary text-xs sm:text-sm"
              }}
            >
              {availableTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <Tab
                    key={tab.id}
                    title={
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      </div>
                    }
                  />
                )
              })}
            </Tabs>

            <div className="p-3 sm:p-6">
              {currentTab?.component}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage
