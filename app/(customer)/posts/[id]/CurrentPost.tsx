"use client"
import React from "react"
import { useRouter, useParams } from "next/navigation"
import { useGetPostByIdQuery } from "@/src/services/post/post.service"
import Card from "@/app/components/ui/post/Card"
import GoBack from "@/app/components/ui/GoBack"
import { createComment } from "@/src/services/post/comments.service"
import { Spinner } from "@heroui/react"
import CreateComment from "@/app/components/ui/post/createComment"

const CurrentPost = () => {
	const router = useRouter()
	// const { id: postId } = router.query as { id: string }

	const { id: postId } = useParams<{ id: string }>()
	const { data } = useGetPostByIdQuery(postId ?? "")

	if (!data) {
		return <><Spinner className="flex justify-c	enter h-full"/></>
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
			/>
			<div className="mt-10">
				<CreateComment />
			</div>
			<div className="mt-10">
				{data.comments
					? data.comments.map(comment => (
							<Card
								cardFor="comment"
								key={comment.id}
								avatarUrl={comment.user.avatarUrl ?? ""}
								content={comment.content}
								name={comment.user.name ?? ""}
								authorId={comment.user.id ?? ""}
								commentId={comment.id}
								id={id}
							/>
						))
					: null}
			</div>
		</>
	)
}

export default CurrentPost
