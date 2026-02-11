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
    <NextCard shadow="sm" className="border border-default-100">
      <CardHeader className="justify-between py-3">
        <Link href={`/posts/${postId}`} className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image src={postAuthorAvatarUrl || "/default-avatar.png"} alt={postAuthorName || "author"} className="w-8 h-8 rounded-lg object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">Комментарий к посту {postAuthorName || ""}</span>
            <span className="text-[11px] text-default-500">Перейти к посту</span>
          </div>
        </Link>
      </CardHeader>
      <CardBody className="py-0">
        <div className="text-sm">
          <EmojiText text={content} />
        </div>
        {postContent && (
          <div className="mt-2 text-xs text-default-500 line-clamp-2">
            <EmojiText text={postContent} emojiUrls={postEmojiUrls} />
          </div>
        )}
        {postImageUrl && (
          <div className="mt-2 overflow-hidden rounded-lg">
            <Image isBlurred src={postImageUrl} alt="Изображение поста" className="w-full h-auto object-cover" style={{ maxHeight: 200 }} />
          </div>
        )}
      </CardBody>
    </NextCard>
  );
};

export default ProfileCommentItem;
