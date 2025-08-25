import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import FurumPage from './FurumPage'


export const metadata: Metadata = {
	title: 'Forum',
	description: 'Forum page',
	// ...NO_INDEX_PAGE
}

export default function ForumPage() {
	return <FurumPage />
	

}
