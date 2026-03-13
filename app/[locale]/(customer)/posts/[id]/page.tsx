import type { Metadata } from 'next'
import { postService } from '@/src/features/post/services/post.service'
import CurrentPost from './CurrentPost'

type Props = {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = await params
	const postId = resolvedParams.id

	try {
		const post = await postService.getPostById(postId)

		const contentStr = typeof post.content === 'string' ? post.content : '';
		const plainText = contentStr.replace(/<[^>]*>?/gm, '').trim();
		const description = plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;

		const authorName = post.author?.name || 'пользователя';
		const pageTitle = `Пост от ${authorName} | Mirchan`;
		const images = post.media && post.media.length > 0 ? [post.media[0].url] : undefined;

		return {
			title: pageTitle,
			description: description || 'Смотреть подробности поста на Mirchan',
			openGraph: {
				title: pageTitle,
				description: description || 'Смотреть подробности поста на Mirchan',
				type: 'article',
				url: `/posts/${postId}`,
				images: images,
			},
			twitter: {
				card: 'summary_large_image',
				title: pageTitle,
				description: description || 'Смотреть подробности поста на Mirchan',
				images: images,
			},
		}
	} catch (error) {
		console.error('Ошибка при генерации метаданных поста:', error)
		return {
			title: 'Пост не найден | Mirchan',
			description: 'Запрошенный пост не существует или был удален',
		}
	}
}




export default function PostDetailsPage() {
	return <CurrentPost />
}
