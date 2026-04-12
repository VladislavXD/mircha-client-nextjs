"use client";
import React from "react";
import Link from "next/link";
import { Card as NextCard, CardBody, CardHeader, Image } from "@heroui/react";

import { EmojiText } from "@/shared/components/ui/EmojiText";

export type ProfileCommentItemProps = {
  commentId: string;
  content: string;
  postId: string;
  postContent?: string;
  postEmojiUrls?: string[];
  postImageUrl?: string;
  postAuthorId?: string;
  postAuthorName?: string;
  postAuthorAvatarUrl?: string;
};

const ProfileCommentItem: React.FC<ProfileCommentItemProps> = ({
  commentId,
  content,
  postId,
  postContent,
  postEmojiUrls,
  postImageUrl,
  postAuthorId,
  postAuthorName,
  postAuthorAvatarUrl,
}) => {
  return (
    <NextCard className="border border-default-100" shadow="sm">
      <CardHeader className="justify-between py-3">
        <Link className="flex items-center gap-3" href={`/posts/${postId}`}>
          <div className="relative w-8 h-8">
            <Image
              alt={postAuthorName || "author"}
              className="w-8 h-8 rounded-lg object-cover"
              src={postAuthorAvatarUrl || "/default-avatar.png"}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">
              Комментарий к посту {postAuthorName || ""}
            </span>
            <span className="text-[11px] text-default-500">
              Перейти к посту
            </span>
          </div>
        </Link>
      </CardHeader>
      <CardBody className="py-0">
        <div className="text-sm">
          <EmojiText text={content} />
        </div>
        {postContent && (
          <div className="mt-2 text-xs text-default-500 line-clamp-2">
            <EmojiText emojiUrls={postEmojiUrls} text={postContent} />
          </div>
        )}
        {postImageUrl && (
          <div className="mt-2 overflow-hidden rounded-lg">
            <Image
              isBlurred
              alt="Изображение поста"
              className="w-full h-auto object-cover"
              src={postImageUrl}
              style={{ maxHeight: 200 }}
            />
          </div>
        )}
      </CardBody>
    </NextCard>
  );
};

export default ProfileCommentItem;
