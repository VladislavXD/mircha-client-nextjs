'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Button,
  Chip,
  Spinner,
} from '@heroui/react'
import { 
  MdDashboard, 
  MdPeople, 
  MdViewModule, 
  MdForum, 
  MdNotifications,
  MdMenu,
  MdClose,
  MdLogout
} from 'react-icons/md'
import { useCurrentUser } from '@/src/hooks/user'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user: currentUser, isLoading: isLoadingUser, error: userError } = useCurrentUser()

  // Определяем локаль из пути
  const locale = pathname?.match(/^\/(ru|en)/)?.[1] || 'ru'
  const localePrefix = `/${locale}`

  // Проверка доступа
  React.useEffect(() => {
    if (userError) {
      router.push('/')
      return
    }
    if (currentUser && currentUser.role !== 'ADMIN') {
      alert('У вас нет прав доступа к админ панели')
      router.push('/')
    }
  }, [currentUser, userError, router])

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Панель',
      icon: MdDashboard,
      path: `${localePrefix}/admin/dashboard`,
    },
    {
      id: 'users',
      label: 'Пользователи',
      icon: MdPeople,
      path: `${localePrefix}/admin/users`,
    },
    {
      id: 'boards',
      label: 'Борды',
      icon: MdViewModule,
      path: `${localePrefix}/admin/boards`,
    },
    {
      id: 'categories',
      label: 'Категории',
      icon: MdViewModule,
      path: `${localePrefix}/admin/categories`,
    },
    {
      id: 'notices',
      label: 'Уведомления',
      icon: MdNotifications,
      path: `${localePrefix}/admin/notices`,
    },
    {
      id: 'threads',
      label: 'Треды',
      icon: MdForum,
      path: `${localePrefix}/admin/threads`,
    },
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    router.push(`${localePrefix}/`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-content1 border-b border-divider">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onPress={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </Button>
            <h1 className="text-lg font-bold">Админ-панель</h1>
          </div>
          <Chip color="primary" variant="flat" size="sm">
            Admin
          </Chip>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-content1 border-r border-divider z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:w-64
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="hidden lg:flex items-center justify-between px-4 py-4 border-b border-divider">
            <h1 className="text-xl font-bold">Админ-панель</h1>
            <Chip color="primary" variant="flat" size="sm">
              Admin
            </Chip>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 mt-14 lg:mt-0">
            <div className="space-y-1 px-2 ">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <Button
                    key={item.id}
                    onPress={() => handleNavigate(item.path)}
                    className={`
                      w-full justify-start gap-3 h-12
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-transparent hover:bg-default-100'
                      }
                    `}
                    variant="light"
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-divider">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-default-500 truncate">{currentUser.email}</p>
            </div>
            <Button
              onPress={handleLogout}
              className="w-full justify-start gap-3"
              variant="light"
              color="danger"
            >
              <MdLogout size={20} />
              <span className="text-sm">Выйти на главную</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          lg:ml-64
          pt-16 lg:pt-0
          transition-all duration-300
        `}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
