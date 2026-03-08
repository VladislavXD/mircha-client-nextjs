import { api } from "@/src/api";


/**
 * Like Service - API методы для работы с лайками постов и комментариев
 */
export class LikeService { 

  public async likePost(postId: string) {
    return api.post("likes", { postId })
  }

  public async unlikePost(postId: string) {
    return api.delete(`likes/${postId}`)
  }

  public async likeComment(commentId: string) {
    return api.post(`likes/comment/${commentId}`, {})
  }

  public async unlikeComment(commentId: string) {
    return api.delete(`likes/comment/${commentId}`)
  }

}
