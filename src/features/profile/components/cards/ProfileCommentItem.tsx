"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <Link className="flex items-center gap-3" href={`/posts/${postId}`}>
          <div className="relative w-8 h-8 shrink-0">
            <Image
              alt={postAuthorName || "author"}
              className="rounded-lg object-cover"
              src={postAuthorAvatarUrl || "/default-avatar.png"}
              fill
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">
              Комментарий к посту {postAuthorName || ""}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Перейти к посту
            </span>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="py-0 px-4 pb-4">
        <div className="text-sm">
          <EmojiText text={content} />
        </div>

        {postContent && (
          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
            <EmojiText emojiUrls={postEmojiUrls} text={postContent} />
          </div>
        )}

        {postImageUrl && (
          <div className="relative mt-2 overflow-hidden rounded-lg max-h-[200px]">
            <Image
              alt="Изображение поста"
              className="w-full h-auto object-cover blur-sm scale-105"
              src={postImageUrl}
              width={600}
              height={200}
              style={{ maxHeight: 200 }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCommentItem;