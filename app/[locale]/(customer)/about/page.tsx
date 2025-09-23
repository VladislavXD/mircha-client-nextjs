import type { Metadata } from 'next'
import AboutPage from './aboutPage'

export const metadata: Metadata = {
	title: 'О проекте',
  description: 'Mirchan — анонимная социальная сеть для свободного самовыражения: посты с эмодзи, персонализация профиля, умный поиск, лента и чаты.',
}

export default function AboutPageContainer() {
	return <AboutPage />
}
