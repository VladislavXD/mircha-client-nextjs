'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, Card, CardBody, Avatar, Spinner, Chip } from '@heroui/react';
import { Search, Clock, X } from 'lucide-react';
import { useSearchUsersQuery } from '@/src/services/user/user.service';
import { useDebounce } from '@/app/hooks/useDebounce';
import Link from 'next/link';

interface SearchHistory {
	id: string;
	name: string;
	avatarUrl?: string;
	timestamp: number;
}

const SearchUser = () => {
	const [query, setQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
	const debouncedQuery = useDebounce(query, 300);
	const containerRef = useRef<HTMLDivElement>(null);

	const { 
		data: users = [], 
		isLoading 
	} = useSearchUsersQuery(debouncedQuery, {
		skip: debouncedQuery.length < 2
	});

	// Загружаем историю поиска из localStorage при монтировании
	useEffect(() => {
		const savedHistory = localStorage.getItem('searchHistory');
		if (savedHistory) {
			try {
				const parsed = JSON.parse(savedHistory);
				// Оставляем только последние 5 записей, отсортированные по времени
				setSearchHistory(parsed.slice(0, 5));
			} catch (error) {
				console.error('Ошибка загрузки истории поиска:', error);
			}
		}
	}, []);

	// Закрытие дропдауна при клике вне компонента
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Сохранение пользователя в историю
	const saveToHistory = (user: any) => {
		const historyItem: SearchHistory = {
			id: user.id,
			name: user.name,
			avatarUrl: user.avatarUrl,
			timestamp: Date.now()
		};

		const newHistory = [
			historyItem,
			...searchHistory.filter(item => item.id !== user.id)
		].slice(0, 5); // Максимум 5 записей

		setSearchHistory(newHistory);
		localStorage.setItem('searchHistory', JSON.stringify(newHistory));
		setQuery('');
		setIsDropdownOpen(false);
	};

	// Очистка истории
	const clearHistory = () => {
		setSearchHistory([]);
		localStorage.removeItem('searchHistory');
	};

	// Удаление конкретной записи из истории
	const removeFromHistory = (id: string, event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const newHistory = searchHistory.filter(item => item.id !== id);
		setSearchHistory(newHistory);
		localStorage.setItem('searchHistory', JSON.stringify(newHistory));
	};

	const showResults = query.length >= 2;
	const showDropdown = isDropdownOpen && (showResults || searchHistory.length > 0);

	// Фильтруем историю для подсказок (если есть частичное совпадение с запросом)
	const getHistorySuggestions = () => {
		if (query.length === 0) return [];
		return searchHistory.filter(item => 
			item.name.toLowerCase().includes(query.toLowerCase()) && 
			query.length > 0 && query.length < 3
		);
	};

	const historySuggestions = getHistorySuggestions();

	return (
		<div className="relative w-full" ref={containerRef}>
			<Input
				placeholder="Поиск"
				value={query}
				variant='bordered'
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => setIsDropdownOpen(true)}
				startContent={<Search size={18} className="text-default-400" />}
				endContent={isLoading && query.length >= 2 ? <Spinner size="sm" /> : null}
				className="w-full"
			/>
			
			{showDropdown && (
				<Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto">
					<CardBody className="p-0">
						{/* Если нет запроса и нет истории */}
						{query.length === 0 && searchHistory.length === 0 && (
							<div className="p-4 text-center text-default-500">
								<Search size={32} className="mx-auto mb-2 opacity-50" />
								<p>Кого будем искать?</p>
							</div>
						)}

						{/* Если нет запроса, но есть история */}
						{query.length === 0 && searchHistory.length > 0 && (
							<div>
								<div className="flex items-center justify-between px-3 py-2 border-b border-default-200">
									<div className="flex items-center gap-2 text-sm text-default-600">
										<Clock size={16} />
										Недавние поиски
									</div>
									<button
										onClick={clearHistory}
										className="text-xs text-default-400 hover:text-default-600 transition-colors"
									>
										Очистить
									</button>
								</div>
								{searchHistory.map((historyItem) => (
									<Link
										key={historyItem.id}
										href={`/user/${historyItem.id}`}
										className="block hover:bg-default-100 transition-colors"
										onClick={() => saveToHistory(historyItem)}
									>
										<div className="flex items-center gap-3 p-3">
											<Avatar
												src={historyItem.avatarUrl || ''}
												size="sm"
												className="shrink-0"
											/>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-sm truncate">
													{historyItem.name}
												</p>
												<p className="text-xs text-default-400">
													{new Date(historyItem.timestamp).toLocaleDateString('ru')}
												</p>
											</div>
											<button
												onClick={(e) => removeFromHistory(historyItem.id, e)}
												className="p-1 hover:bg-default-200 rounded-full transition-colors"
											>
												<X size={14} className="text-default-400" />
											</button>
										</div>
									</Link>
								))}
							</div>
						)}

						{/* Подсказки из истории при частичном вводе */}
						{query.length > 0 && query.length < 3 && historySuggestions.length > 0 && (
							<div>
								<div className="px-3 py-2 border-b border-default-200">
									<p className="text-sm text-default-600">Возможно, вы ищете:</p>
								</div>
								{historySuggestions.map((suggestion) => (
									<div
										key={suggestion.id}
										onClick={() => setQuery(suggestion.name)}
										className="flex items-center gap-3 p-3 hover:bg-default-100 transition-colors cursor-pointer"
									>
										<Avatar
											src={suggestion.avatarUrl || ''}
											size="sm"
											className="shrink-0"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
												{suggestion.name}
											</p>
											<Chip size="sm" variant="flat" className="text-xs">
												Из недавних
											</Chip>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Результаты поиска */}
						{showResults && (
							<div>
								{query.length >= 2 && users.length > 0 && (
									<div className="px-3 py-2 border-b border-default-200">
										<p className="text-sm text-default-600">Результаты поиска:</p>
									</div>
								)}
								{users.length > 0 ? (
									users.map((user) => (
										<Link
											key={user.id}
											href={`/user/${user.id}`}
											className="block hover:bg-default-100 transition-colors"
											onClick={() => saveToHistory(user)}
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
								) : !isLoading && query.length >= 2 ? (
									<div className="p-4 text-center text-default-500">
										Пользователи не найдены
									</div>
								) : null}
							</div>
						)}
					</CardBody>
				</Card>
			)}
		</div>
	);
};

export default SearchUser;