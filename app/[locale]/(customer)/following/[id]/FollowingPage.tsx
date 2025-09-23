"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/react';
import User from '@/app/components/ui/User';
import GoBack from '@/app/components/ui/GoBack';
import { useGetUserByIdQuery } from '@/src/services/user/user.service';

const Following = () => {
  const {id} = useParams<{ id: string }>()
  const {data, isLoading, error} = useGetUserByIdQuery(id ?? '')

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка загрузки данных</div>
  if (!data) return <div>Данные не найдены</div>
  if (!data.following || !Array.isArray(data.following)) return <div>Список подписок недоступен</div>



  return data.following.length > 0 ?  (
    <div className="gap-5 flex flex-col">
      <GoBack/>
      {
        data.following.map((user)=> {
          // Проверяем, что у нас есть все необходимые данные
          if (!user?.following?.id) {
            console.warn('Invalid following data:', user);
            return null;
          }
          
          return (
            <Link href={`/user/${user.following.id}`} key={user.following.id}>
                <Card>
                  <CardBody className='block'>
                    <User
                      name={user.following.name ?? ''}
                      avatarUrl={user.following.avatarUrl ?? ''}
                      description={user.following.email ?? ''}
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

export default Following