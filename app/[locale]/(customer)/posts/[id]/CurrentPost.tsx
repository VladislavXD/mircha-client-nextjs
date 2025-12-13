"use client"
import React from "react"
import { useParams } from "next/navigation"
import Card from "@/shared/components/ui/post/Card"
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

	const {
		content,
		id,
		authorId,
		comments,
		likes,
		author,
		likeByUser,
		createdAt,
		emojiUrls,
		imageUrl,
		views,
	} = data
	
	return (
		<>
			<GoBack />
			<Card
				cardFor="current-post"
				avatarUrl={author.avatarUrl ?? ""}
				content={content}
				name={author.name ?? ""}
				likesCount={likes.length}
				commentsCount={comments.length}
				authorId={authorId}
				id={id}
				likeByUser={likeByUser}
				createdAt={createdAt}
				emojiUrls={emojiUrls}
				imageUrl={imageUrl}
				views={views?.length || 0}
			/>
			<div className="mt-10">
				<CreateComment />
			</div>
			<div className="mt-10">
				{comments && comments.length > 0
					? comments.map(comment => (
							<Card
								cardFor="comment"
								key={comment.id}
								avatarUrl={comment.user.avatarUrl ?? ""}
								content={comment.content}
								emojiUrls={comment.emojiUrls || []}
								name={comment.user.name ?? ""}
								authorId={comment.user.id ?? ""}
								commentId={comment.id}
								id={id}
							/>
						))
					: <div className="text-center text-default-500">Комментариев пока нет</div>}
			</div>
		</>
	)
}

export default CurrentPost
