import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import Following from './FollowingPage'


export const metadata: Metadata = {
	title: 'Following',
	// ...NO_INDEX_PAGE
}

export default function FollowingPage() {
	return <Following />
	

}
