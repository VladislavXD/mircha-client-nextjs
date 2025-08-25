import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import AuthPage from './AuthPage'


export const metadata: Metadata = {
	title: 'Authentication',
	description: 'Authentication page',
	
}

export default function Authentication() {
	return <AuthPage />
	

}
