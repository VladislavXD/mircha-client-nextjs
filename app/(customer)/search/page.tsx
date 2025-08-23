import type { Metadata } from 'next'
import SearchPage from './searchPage'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'



export const metadata: Metadata = {
	title: 'Search',
	// ...NO_INDEX_PAGE
}

export default function SearchPageWrapper() {
	return <SearchPage />
	

}
