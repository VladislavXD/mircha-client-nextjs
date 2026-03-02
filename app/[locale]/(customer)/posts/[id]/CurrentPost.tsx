"use client"
import React from "react"
import { useParams } from "next/navigation"
import PostCard from "@/src/features/post/components/PostCard"
import GoBack from "@/shared/components/ui/GoBack"
import { Spinner } from "@heroui/react"
import CreateComment from "@/shared/components/ui/post/createComment"
import { usePost } from "@/src/features/post"

const CurrentPost = () => {
	const { id: postId } = useParams<{ id: string }>()
	const { data, isLoading } = usePost(postId)

	if (isLoading) {
		return <Spinner className="flex justify-center h-full" />
	}

 	if (!data) {
		return <div className="text-center">Пост не найден</div>
	}
	
	return (
		<>
			<GoBack />
			<PostCard
				post={data}
				cardFor="current-post"
			/>
			<div className="mt-10">
				<CreateComment />
			</div>
			<div className="mt-10">
				{data.comments && data.comments.length > 0
					? data.comments.map(comment => (
							<PostCard
								key={comment.id}
								post={{
									...comment,
									emojiUrls: comment.emojiUrls || [],
									updatedAt: comment.updatedAt || comment.createdAt,
									author: comment.user,
									authorId: comment.user.id,
									likes: [],
									comments: [],
									views: [],
									likeByUser: false,
									contentSpoiler: false,
									media: [],
									isEdited: comment.updatedAt !== comment.createdAt,
								}}
								cardFor="comment"
								commentId={comment.id}
							/>
						))
					: <div className="text-center text-default-500">Комментариев пока нет</div>}
			</div>
		</>
	)
}

export default CurrentPost
