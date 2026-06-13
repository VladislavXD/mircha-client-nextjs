"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FcDislike } from "react-icons/fc";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import { formatToClientDate } from "@/app/utils/formatToClientDate";

export type ProfilePostCardProps = {
  postId: string;
  content: string;
  createdAt?: Date | string;
  likesCount?: number;
  commentsCount?: number;
  likeByUser?: boolean;
  views?: number;
  imageUrl?: string;
  emojiUrls?: string[];
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  usernameFrameUrl?: string;
  avatarFrameUrl?: string;
};

const ProfilePostCard: React.FC<ProfilePostCardProps> = ({
  postId,
  content,
  createdAt,
  likesCount = 0,
  commentsCount = 0,
  likeByUser = false,
  views = 0,
  imageUrl,
  emojiUrls = [],
  authorId,
  authorName,
  authorAvatarUrl,
  usernameFrameUrl,
  avatarFrameUrl,
}) => {
  const [optimisticLiked, setOptimisticLiked] = useState(likeByUser);
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(likesCount);

  const handleLike = async () => {
    try {
      if (optimisticLiked) {
        setOptimisticLiked(false);
        setOptimisticLikesCount((c) => Math.max(0, c - 1));
      } else {
        setOptimisticLiked(true);
        setOptimisticLikesCount((c) => c + 1);
      }
    } catch {
      setOptimisticLiked(likeByUser);
      setOptimisticLikesCount(likesCount);
    }
  };

  const initials = authorName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <Link className="flex items-center gap-3" href={`/user/${authorId}`}>
          <div className="relative w-9 h-9 shrink-0">
            {avatarFrameUrl && avatarFrameUrl !== "none" && (
              <img
                alt="frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
                src={avatarFrameUrl}
              />
            )}
            <Avatar className="w-9 h-9 rounded-xl">
              <AvatarImage src={authorAvatarUrl} alt={authorName} />
              <AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{authorName}</span>
              {usernameFrameUrl && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted">
                  decor
                </span>
              )}
            </div>
            {createdAt && (
              <span className="text-[11px] text-muted-foreground">
                {formatToClientDate(createdAt as any)}
              </span>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="py-0 px-4 pb-4">
        <div className="text-sm">
          <EmojiText emojiUrls={emojiUrls} text={content} />
        </div>

        {imageUrl && (
          <div className="relative mt-2 overflow-hidden rounded-lg max-h-[280px]">
            <Image
              alt="Изображение поста"
              className="w-full h-auto object-cover blur-sm scale-105"
              src={imageUrl}
              width={600}
              height={280}
              style={{ maxHeight: 280 }}
            />
          </div>
        )}

        <div className="flex items-center gap-5 text-muted-foreground text-xs mt-3">
          <button
            className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50"
            disabled={true}
            onClick={handleLike}
          >
            {false ? (
              <Loader2 className="w-3 h-3 animate-spin mx-1" />
            ) : (
              <>
                {optimisticLiked ? <FcDislike /> : <MdOutlineFavoriteBorder />}
                <span>{optimisticLikesCount}</span>
              </>
            )}
          </button>
          <Link
            className="flex items-center gap-1 hover:text-primary transition-colors"
            href={`/posts/${postId}`}
          >
            <FaRegComment />
            <span>{commentsCount}</span>
          </Link>
          <span className="ml-auto">{views}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePostCard;