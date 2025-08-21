import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import UserProfile from './ProfilePage'


export const metadata: Metadata = {
	title: 'User Profile',
	// ...NO_INDEX_PAGE
}

export default function ProfilePage() {
	return <UserProfile />
	

}
