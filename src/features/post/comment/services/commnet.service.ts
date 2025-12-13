import { api } from "@/src/api";
import { CreateCommentDto } from "../../types";

export class CommentService { 

	public async createComment(data: CreateCommentDto){
		const response = await api.post('comment', data)
		return response
	}
	
	public async deleteComment(id: string){
		const response = await api.delete(`comment/${id}`)
		return response
	}

}