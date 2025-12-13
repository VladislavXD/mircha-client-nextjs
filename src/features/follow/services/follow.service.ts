import { api } from "@/src/api";
import { FollowersResponse, FollowingResponse, FollowResponse } from "../types";

class FollowService{

	public async followUser(followingId: string){
		const response = await api.post<FollowResponse>(`follow/${followingId}`)
		return response
	}

	public async unfollow(followingId: string){
		const response = await api.delete<FollowResponse>(`follow/${followingId}`)
		return response
	}


	public async getFollowers(userId: string, page = 1, limit = 20) {
    const response = await api.get<FollowersResponse>(
      `follow/${userId}/followers?page=${page}&limit=${limit}`
    )
    return response
  }

  /**
   * Получить подписки
   */
  public async getFollowing(userId: string, page = 1, limit = 20) {
    const response = await api.get<FollowingResponse>(
      `follow/${userId}/following?page=${page}&limit=${limit}`
    )
    return response
  }


	/**
   * Проверить подписку
   */
  public async isFollowing(targetUserId: string) {
    const response = await api.get<{ isFollowing: boolean }>(
      `follow/${targetUserId}/is-following`
    )
    return response
  }

  /**
   * Получить статистику
   */
  public async getStats(userId: string) {
    const response = await api.get<{
      followersCount: number
      followingCount: number
    }>(`follow/${userId}/stats`)
    return response
  }
}


export const followService = new FollowService()
