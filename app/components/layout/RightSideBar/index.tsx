import React from 'react'
import SearchUser from '../../ui/Search'
import NewsWidget from '../../ui/NewsWidget'
import { usePathname } from 'next/navigation'
type Props = {}

const RightSideBar = (props: Props) => {


const pathname = usePathname()

	return (
		<div className="space-y-6">
			<SearchUser />
			{pathname !== '/search' ? <NewsWidget /> : null}
		</div>
	)
}

export default RightSideBar