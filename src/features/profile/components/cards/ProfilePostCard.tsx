"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card as NextCard, CardBody, CardHeader, Image, Button, Spinner } from "@heroui/react";
import { formatToClientDate } from "@/app/utils/formatToClientDate";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import { FcDislike } from "react-icons/fc";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
// TODO: Migrate to React Query - useLikePost/useUnlikePost already exist in features/post/like?


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
        // await unlikePost(postId).unwrap();
      } else {
        setOptimisticLiked(true);
        setOptimisticLikesCount((c) => c + 1);
        // await likePost({ postId }).unwrap();
      }
    } catch (e) {
      // откатим
      setOptimisticLiked(likeByUser);
      setOptimisticLikesCount(likesCount);
    }
  };

  return (
    <NextCard shadow="sm" className="border border-default-100">
      <CardHeader className="justify-between py-3">
        <Link href={`/user/${authorId}`} className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            {avatarFrameUrl && avatarFrameUrl !== 'none' && (
              <img src={avatarFrameUrl} alt="frame" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" />
            )}
            <Image src={authorAvatarUrl || "/default-avatar.png"} alt={authorName} className="w-9 h-9 rounded-xl object-cover " />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{authorName}</span>
              {usernameFrameUrl && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-default-100">decor</span>
              )}
            </div>
            {createdAt && (
              <span className="text-[11px] text-default-500">{formatToClientDate(createdAt as any)}</span>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardBody className="py-0">
        <div className="text-sm">
          <EmojiText text={content} emojiUrls={emojiUrls} />
        </div>
        {imageUrl && (
          <div className="mt-2 overflow-hidden rounded-lg">
            <Image isBlurred src={imageUrl} alt="Изображение поста" className="w-full h-auto object-cover" style={{ maxHeight: 280 }} />
          </div>
        )}
        <div className="flex items-center gap-5 text-default-500 text-xs mt-3">
          <button onClick={handleLike} className="flex items-center gap-1 hover:text-primary transition-colors" disabled={true}>
            {true ? (
              <Spinner size="sm" className="mx-1" />
            ) : (
              <>
                {optimisticLiked ? <FcDislike /> : <MdOutlineFavoriteBorder />}
                <span>{optimisticLikesCount}</span>
              </>
            )}
          </button>
          <Link href={`/posts/${postId}`} className="flex items-center gap-1 hover:text-primary transition-colors">
            <FaRegComment />
            <span>{commentsCount}</span>
          </Link>
          <span className="ml-auto">{views}</span>
        </div>
      </CardBody>
    </NextCard>
  );
};

export default ProfilePostCard;
