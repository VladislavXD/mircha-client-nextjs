import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import FurumPage from './FurumPage'


export const metadata: Metadata = {
	title: 'Forum',
	// ...NO_INDEX_PAGE
}

export default function ForumPage() {
	return <FurumPage />
	

}
