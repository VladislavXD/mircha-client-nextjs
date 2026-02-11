import { useDebounce } from "@/src/hooks/useDebounce";
import { useSearchUsers } from "@/src/features/user/hooks";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/react";
import React from "react";
import type { IUser } from "@/src/features/user/types";

type Props = {
  showHit: boolean;
	mention: string |  null
	onSelect?: (user: IUser) => void;
};

/**
 * Mention - компонент для поиска и выбора пользователей при упоминании
 * 
 * Поддерживает:
 * - Debounced поиск (300ms)
 * - @упоминания
 * - Минимум 2 символа для поиска
 * - Отображение аватара, имени и био
 */
const Mention = (props: Props) => {
	const { showHit, mention, onSelect } = props;

	if (!mention) {
		return null;
	}

	const debouncedQuery = useDebounce(mention || '', 300);

	const { 
			data: users = [], 
			isLoading,
			isError
		} = useSearchUsers(debouncedQuery, {
			enabled: debouncedQuery.length >= 2
		});
	
		const showResults = mention.length >= 2;
	
		

	
  return (
    <div>
      <Card>
				<CardHeader>
					{isLoading ? 'Загрузка...' : showHit ? `Результаты по запросу: ${mention}` : 'Введите минимум 2 символа'}
				</CardHeader>
				<CardBody>
				{showResults && (
					<>
						{users.length > 0 ? (
							users.map((user) => (
								<div
									key={user.id}
									className="block hover:bg-default-100 transition-colors cursor-pointer"
										onClick={() => onSelect?.(user)}
								>
									<div className="flex items-center gap-3 p-3">
										<Avatar
											isBordered
											isFocusable
											radius="full"
											src={user.avatarUrl || ''}
											alt={user.name}
											className="w-8 h-8 rounded-full shrink-0"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
													@{user.name}
											</p>
											{user.bio && (
												<p className="text-xs text-default-500 truncate">
													{user.bio}
												</p>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<p className="p-3 text-sm text-default-500">
								Нет пользователей для отображения
							</p>
						)}
					</>
				)}
				
				</CardBody>
      </Card>
    </div>
  );
};

export default Mention;
