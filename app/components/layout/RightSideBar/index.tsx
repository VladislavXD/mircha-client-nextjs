import React from 'react'
import SearchUser from '../../ui/Search'
import NewsWidget from '../../ui/NewsWidget'
import { usePathname } from 'next/navigation'
import LatestPosts from '../../ui/LatestPosts'
import ForumStats from '../../ui/ForumStats'
type Props = {}

const RightSideBar = (props: Props) => {


const pathname = usePathname()

	return (
		<div className="space-y-6">
			<SearchUser />
			{pathname !== '/search' ? <NewsWidget /> : null}
			<LatestPosts />
			<ForumStats />
		</div>
	)
}

export default RightSideBar