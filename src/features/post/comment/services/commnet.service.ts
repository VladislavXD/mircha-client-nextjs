import { api } from "@/src/api";
import { CreateCommentDto } from "../../types";
import { CommentData } from "../hooks/usePostComments";

export class CommentService { 

	public async createComment(data: CreateCommentDto){
		const response = await api.post('comment', data)
		return response
	}

	public async createReply(data: CreateCommentDto & { replyToId: string }){
		const response = await api.post('comment/reply', data)
		return response
	}
	
	public async deleteComment(id: string){
		const response = await api.delete(`comment/${id}`)
		return response
	}

	public async getNewComments(postId: string, userId?: string, cursor?: string): Promise<CommentData[]> {
		let url = `comment/post/${postId}/new`
		const params = new URLSearchParams()
		if (userId) params.set('userId', userId)
		if (cursor) params.set('cursor', cursor)
		if (params.toString()) url += `?${params.toString()}`
		return api.get(url) as Promise<CommentData[]>
	}

	public async getOldComments(postId: string, userId?: string, cursor?: string): Promise<CommentData[]> {
		let url = `comment/post/${postId}/old`
		const params = new URLSearchParams()
		if (userId) params.set('userId', userId)
		if (cursor) params.set('cursor', cursor)
		if (params.toString()) url += `?${params.toString()}`
		return api.get(url) as Promise<CommentData[]>
	}

	public async getPopularComments(postId: string, userId?: string, cursor?: string): Promise<CommentData[]> {
		let url = `comment/post/${postId}/popular`
		const params = new URLSearchParams()
		if (userId) params.set('userId', userId)
		if (cursor) params.set('cursor', cursor)
		if (params.toString()) url += `?${params.toString()}`
		return api.get(url) as Promise<CommentData[]>
	}

	
}

export const commentService = new CommentService()