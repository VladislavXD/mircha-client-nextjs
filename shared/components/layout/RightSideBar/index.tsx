"use client"
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
			{!pathname.includes('/search') ? <SearchUser /> : null}
			{!pathname.includes('/search') ? <NewsWidget /> : null}
			<LatestPosts />
			<ForumStats />
		</div>
	)
}

export default RightSideBar