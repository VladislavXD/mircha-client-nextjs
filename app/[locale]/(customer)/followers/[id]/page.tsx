import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import Followers from './FollowersPage'


export const metadata: Metadata = {
	title: 'Followers',
	description: 'List of followers',
	// ...NO_INDEX_PAGE
}

export default function FollowersPage() {
	return <Followers />
	

}
