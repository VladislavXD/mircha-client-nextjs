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
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Администрирование
              </h1>
              <p className="mt-2 ">
                Панель управления форумом
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Chip color="primary" variant="flat">
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
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-6 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              {availableTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <Tab
                    key={tab.id}
                    title={
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    }
                  />
                )
              })}
            </Tabs>

            <div className="p-6">
              {currentTab?.component}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage
