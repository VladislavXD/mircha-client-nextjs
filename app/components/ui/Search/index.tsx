'use client';

import React, { useState } from 'react';
import { Input, Card, CardBody, Avatar, Spinner } from '@heroui/react';
import { Search } from 'lucide-react';
import { useSearchUsersQuery } from '@/src/services/user/user.service';
import { useDebounce } from '@/app/hooks/useDebounce';
import Link from 'next/link';

const SearchUser = () => {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 300);

	const { 
		data: users = [], 
		isLoading 
	} = useSearchUsersQuery(debouncedQuery, {
		skip: debouncedQuery.length < 2
	});

	const showResults = query.length >= 2;

	return (
		<div className="relative w-full">
			<Input
				placeholder="Поиск"
				value={query}
				variant='bordered'
				onChange={(e) => setQuery(e.target.value)}
				startContent={<Search size={18} className="text-default-400" />}
				endContent={isLoading && query.length >= 2 ? <Spinner size="sm" /> : null}
				className="w-full"
			/>
			
			{showResults && (
				<Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto">
					<CardBody className="p-0">
						{users.length > 0 ? (
							users.map((user) => (
								<Link
									key={user.id}
									href={`/user/${user.id}`}
									className="block hover:bg-default-100 transition-colors"
									onClick={() => setQuery('')}
								>
									<div className="flex items-center gap-3 p-3">
										<Avatar
											src={user.avatarUrl || ''}
											size="sm"
											className="shrink-0"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
												{user.name}
											</p>
											{user.bio && (
												<p className="text-xs text-default-500 truncate">
													{user.bio}
												</p>
											)}
										</div>
										<div className="text-xs text-default-400">
											{user.followersCount || 0} подписчиков
										</div>
									</div>
								</Link>
							))
						) : !isLoading ? (
							<div className="p-4 text-center text-default-500">
								Пользователи не найдены
							</div>
						) : null}
					</CardBody>
				</Card>
			)}
		</div>
	);
};

export default SearchUser;