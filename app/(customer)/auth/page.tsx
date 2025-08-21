import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import AuthPage from './AuthPage'


export const metadata: Metadata = {
	title: 'Authentication',
	// ...NO_INDEX_PAGE
}

export default function Authentication() {
	return <AuthPage />
	

}
