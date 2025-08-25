import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import Following from './FollowingPage'


export const metadata: Metadata = {
	title: 'Following',
	description: 'List of following',
	// ...NO_INDEX_PAGE
}

export default function FollowingPage() {
	return <Following />
	

}
