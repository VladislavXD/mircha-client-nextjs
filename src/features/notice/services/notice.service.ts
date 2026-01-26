import { api } from "@/src/api";
import { CreateNoticeDto } from "../types";



class NoticeService {

	public async createNotice(body: CreateNoticeDto){
		const response = await api.post('notices', body)
		return response
	}

	public async getActive(){
		const response = await api.get('notices')
		return response
	}

	public async getAllAdmin(){
		const response = await api.get('notices/admin')
		return response
	}

	public async updateNotice(id: string, body: Partial<CreateNoticeDto>){
		const response = await api.patch(`notices/${id}`, body)
		return response
	}

	public async deleteNotice(id: string){
		const response = await api.delete(`notices/${id}`)
		return response
	}
	
}

export const noticeService = new NoticeService()