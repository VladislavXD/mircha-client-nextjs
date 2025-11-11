import { useDebounce } from "@/src/hooks/useDebounce";
import { useSearchUsersQuery } from "@/src/services/user/user.service";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/react";
import React from "react";
import type { User } from "@/src/types/types";

type Props = {
  showHit: boolean;
	mention: string |  null
	onSelect?: (user: User) => void;
};

const Mention = (props: Props) => {
	const { showHit, mention, onSelect } = props;

	if (!mention) {
		return null;
	}

	const debouncedQuery = useDebounce(mention || '', 300);

	const { 
			data: users = [], 
			isLoading 
		} = useSearchUsersQuery(debouncedQuery, {
			skip: debouncedQuery.length < 2
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
