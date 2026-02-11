import { api } from "@/src/api";
import { CreateCommentDto } from "../../types";

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

}