"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/react';
import User from '@/app/components/ui/User';
import GoBack from '@/app/components/ui/GoBack';
import { useGetUserByIdQuery } from '@/src/services/user/user.service';
import { useSelector } from 'react-redux';
import { selectCurrent } from '@/src/store/user/user.slice';
import NotAuthenticated from '@/app/components/ui/notAuthenticated';

const Followers = () => {
  const {id} = useParams<{ id: string }>()
  const current = useSelector(selectCurrent)
  const {data, isLoading, error} = useGetUserByIdQuery(id ?? '')

  if(!current){
    return <NotAuthenticated/>
  }
  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка загрузки данных</div>
  if (!data) return <div>Данные не найдены</div>
  if (!data.followers || !Array.isArray(data.followers)) return <div>Список подписчиков недоступен</div>


  return data.followers.length > 0 ?  (
    <div className="gap-5 flex flex-col">
      <GoBack/>
      {
        data.followers.map((user)=> {
          // Проверяем, что у нас есть все необходимые данные
          if (!user?.follower?.id) {
            console.warn('Invalid follower data:', user);
            return null;
          }
          
          return (
            <Link href={`/user/${user.follower.id}`} key={user.follower.id}>
                <Card>
                  <CardBody className='block'>
                    <User
                      name={user.follower.name ?? ''}
                      avatarUrl={user.follower.avatarUrl ?? ''}
                      description={user.follower.email ?? ''}
                    />
                  </CardBody>
                </Card>
            </Link>
          );
        }).filter(Boolean) /* Убираем null элементы */
      }
    </div>
  ) : (
      <h2>Подписчики отсувствуют</h2>
  )
}

export default Followers