"use client";
import React from "react";

import { formatToClientDate } from "@/app/utils/formatToClientDate";

interface ProfileAboutCardProps {
  data: any;
}

export const ProfileAboutCard: React.FC<ProfileAboutCardProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
        О пользователе
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">
            Подписчики:
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {data?.followers.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">
            Подписки:
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {data?.following.length}
          </span>
        </div>
        {data?.location && (
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">
              Локация:
            </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {data?.location}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">
            Регистрация:
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {formatToClientDate(data?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileAboutCard;
