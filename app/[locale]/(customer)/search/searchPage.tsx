	import NewsWidget from '@/app/components/ui/NewsWidget'
import SearchUser from '@/app/components/ui/Search'

import React from 'react'
	
	type Props = {}
	
	const SearchPage = (props: Props) => {
		
		

		return (
			<>
				<div className="">
					<SearchUser/>
					
				</div>
				<div className="mt-5">
					<NewsWidget />
				</div>
			</>
		)
	}
	
	export default SearchPage