"use client";
import React from 'react';
import { Card } from '@heroui/react';
import { formatToClientDate } from '@/app/utils/formatToClientDate';

interface ProfileAboutCardProps {
  data: any;
}

export const ProfileAboutCard: React.FC<ProfileAboutCardProps> = ({ data }) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">О пользователе</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-default-500">Подписчики:</span>
          <span className="font-medium">{data?.followers.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-default-500">Подписки:</span>
          <span className="font-medium">{data?.following.length}</span>
        </div>
        {data?.location && (
          <div className="flex justify-between">
            <span className="text-default-500">Локация:</span>
            <span className="font-medium">{data?.location}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-default-500">Регистрация:</span>
          <span className="font-medium">{formatToClientDate(data?.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileAboutCard;
