// import { instance } from '@/src/api/api.interceptor'
// import type {
//   LatestPostsQuery,
//   LatestPostsResponse,
//   ForumStats,
// } from '@/src/types/forum.types'

// /**
//  * Получить последние посты (OP-посты тредов)
//  */
// export async function getLatestPosts(params: LatestPostsQuery = {}): Promise<LatestPostsResponse> {
//   const { page = 1, limit = 20, board, category, tag, nsfw } = params
  
//   const queryParams = new URLSearchParams()
//   queryParams.set('page', String(page))
//   queryParams.set('limit', String(limit))
//   if (board) queryParams.set('board', board)
//   if (category) queryParams.set('category', category)
//   if (tag) queryParams.set('tag', tag)
//   if (nsfw) queryParams.set('nsfw', nsfw)
  
//   const response = await instance.get(`/forum/posts/latest?${queryParams.toString()}`)
//   return response.data
// }

// /**
//  * Получить статистику форума
//  */
// export async function getForumStats(): Promise<ForumStats> {
//   const response = await instance.get('/forum/stats')
//   return response.data
// }
