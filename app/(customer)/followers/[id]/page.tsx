import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import Followers from './FollowersPage'


export const metadata: Metadata = {
	title: 'Followers',
	// ...NO_INDEX_PAGE
}

export default function FollowersPage() {
	return <Followers />
	

}
