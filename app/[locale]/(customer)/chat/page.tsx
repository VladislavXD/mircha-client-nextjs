import type { Metadata } from 'next'
// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import { ChatList } from './ChatList'
import Container from '@/app/components/layout/container'


export const metadata: Metadata = {
	title: 'Chat List',
  description: 'List of chat conversations',
	// ...NO_INDEX_PAGE
}

export default function ChatPage() {
	return <Container><ChatList /></Container>
	

}
