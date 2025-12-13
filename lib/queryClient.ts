import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
      gcTime: 30 * 60 * 1000, // 30 минут - время хранения в кеше
      refetchOnWindowFocus: false, // Не рефетчить при фокусе окна
      retry: 1, // Только 1 повтор при ошибке
    },
    mutations: {
      retry: 0, // Мутации не повторяем
    },
  },
})
