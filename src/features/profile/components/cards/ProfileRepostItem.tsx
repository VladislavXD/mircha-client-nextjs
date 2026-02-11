"use client";
import React from "react";
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import Link from "next/link";
import { Repeat } from "lucide-react";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import { formatToClientDate } from "@/app/utils/formatToClientDate";

interface ProfileRepostItemProps {
  repostId: string;
  repostComment?: string;
  postId: string;
  postContent?: string | object;
  postEmojiUrls?: string[];
  postImageUrl?: string;
  postAuthorId?: string;
  postAuthorName?: string;
  postAuthorAvatarUrl?: string;
  createdAt?: string;
}

const ProfileRepostItem: React.FC<ProfileRepostItemProps> = ({
  repostId,
  repostComment,
  postId,
  postContent,
  postEmojiUrls = [],
  postImageUrl,
  postAuthorId,
  postAuthorName,
  postAuthorAvatarUrl,
  createdAt,
}) => {
  const safeContent = typeof postContent === "string" ? postContent : "";

  return (
    <Card 
      className="w-full hover:shadow-lg transition-all duration-300 border border-default-200"
      shadow="sm"
    >
      <CardBody className="p-5 gap-4">
        {/* Заголовок репоста */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-full">
              <Repeat size={16} className="text-success-600 dark:text-success-400" />
            </div>
            <span className="text-sm font-medium text-default-700">
              Вы репостнули
            </span>
          </div>
          {createdAt && (
            <Chip
              size="sm"
              variant="flat"
              className="text-xs bg-default-100"
            >
              {formatToClientDate(createdAt)}
            </Chip>
          )}
        </div>

        {/* Комментарий к репосту */}
        {repostComment && (
          <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border-l-4 border-primary-500">
            <p className="text-sm text-default-900 font-medium leading-relaxed">
              {repostComment}
            </p>
          </div>
        )}

        {/* Оригинальный пост */}
        <div className="p-4 bg-default-50 dark:bg-default-100/50 rounded-xl border border-default-200">
          {/* Автор */}
          {postAuthorId && (
            <Link 
              href={`/user/${postAuthorId}`}
              className="flex items-center gap-3 mb-3 group"
            >
              <Avatar
                src={postAuthorAvatarUrl}
                name={postAuthorName}
                size="sm"
                className="flex-shrink-0 ring-2 ring-default-200 group-hover:ring-primary-400 transition-all"
              />
              <span className="text-sm font-semibold text-default-900 group-hover:text-primary-600 transition-colors">
                {postAuthorName}
              </span>
            </Link>
          )}

          {/* Контент */}
          <Link 
            href={`/posts/${postId}`} 
            className="block group"
          >
            {safeContent && (
              <div className="mb-3">
                <EmojiText
                  text={safeContent}
                  emojiUrls={postEmojiUrls}
                  className="text-sm text-default-700 leading-relaxed line-clamp-4 group-hover:text-default-900 transition-colors"
                />
              </div>
            )}

            {/* Изображение */}
            {postImageUrl && (
              <div className="rounded-lg overflow-hidden shadow-sm">
                <img
                  src={postImageUrl}
                  alt="Post media"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileRepostItem;

