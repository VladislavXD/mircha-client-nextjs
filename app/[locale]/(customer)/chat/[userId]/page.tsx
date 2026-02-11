import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import { ChatWindow } from './ChatWindow'
import Container from '@/shared/components/layout/container'


export const metadata: Metadata = {
	title: 'Chat List',
	// ...NO_INDEX_PAGE
}

export default function ProfilePage() {
	return <ChatWindow />
	

}
