import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import CurrentPost from './CurrentPost'


export const metadata: Metadata = {
	title: 'Post Details',
	description: 'Details of the post',
	// ...NO_INDEX_PAGE
}

export default function PostDetailsPage() {
	return <CurrentPost />
	

}
