"use client";

import React from "react";
import { Avatar, Card, CardBody } from "@heroui/react";
import { Heart, MessageCircle, Repeat2, Eye } from "lucide-react";
import Link from "next/link";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import PostMediaSlider, { type PostMedia } from "../PostMediaSlider/index";
import { timeAgo } from "@/src/utils/timeAgo";
import type { Post } from "../../types";

interface PostPreviewProps {
  post: Post;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const {
    author,
    content,
    emojiUrls = [],
    createdAt,
    likesCount = 0,
    commentsCount = 0,
    viewsCount = 0,
    media = [],
  } = post;

  // Подготовка медиа
  const postMedia: PostMedia[] = React.useMemo(() => {
    const mediaArray = (post as any)?.media;
    if (Array.isArray(mediaArray) && mediaArray.length > 0) {
      return mediaArray.map((m: any) => {
        let mediaType: "image" | "video" = "image";
        if (m.type) {
          const typeUpper = String(m.type).toUpperCase();
          mediaType = typeUpper === "VIDEO" ? "video" : "image";
        } else if (m.mimeType) {
          mediaType = m.mimeType.startsWith("video/") ? "video" : "image";
        }
        
        return {
          url: m.url || m,
          type: mediaType,
          spoiler: m.spoiler || false
        };
      });
    }
    return [];
  }, [post]);

  const safeContent = typeof content === "string" ? content : "";
  const repostCount = (post as any)?.repostCount || 0;

  return (
    <div className="w-full">
      <style jsx>{`
        .comments-modal-media {
          max-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .comments-modal-media img,
        .comments-modal-media video {
          max-height: 350px !important;
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }
      `}</style>
      
      {/* Author Info */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Link href={`/profile/${author.id}`}>
          <Avatar
            src={author.avatarUrl}
            name={author.name}
            size="sm"
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity w-8 h-8 sm:w-10 sm:h-10"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Link 
              href={`/profile/${author.id}`}
              className="font-semibold text-sm sm:text-base hover:underline truncate"
            >
              {author.name}
            </Link>
            <Link 
              href={`/profile/${author.id}`}
              className="text-xs sm:text-sm text-default-400 hover:underline truncate"
            >
              @{author.username}
            </Link>
          </div>
          <div className="text-[10px] sm:text-xs text-default-400 mt-0.5">
            {timeAgo(createdAt)}
          </div>
        </div>
      </div>

      {/* Post Content */}
      {safeContent && (
        <div className="mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">
          <EmojiText text={safeContent} emojiUrls={emojiUrls} />
        </div>
      )}

      {/* Media */}
      {postMedia.length > 0 && (
        <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden comments-modal-media">
          <PostMediaSlider 
            media={postMedia}
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center gap-3 sm:gap-6 pt-2 sm:pt-3 border-t border-divider flex-wrap">
        {/* Likes */}
        <div className="flex items-center gap-1 sm:gap-2 text-default-500">
          <Heart size={16} className="text-danger sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-medium">{likesCount}</span>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1 sm:gap-2 text-default-500">
          <MessageCircle size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-medium">{commentsCount}</span>
        </div>

        {/* Reposts */}
        <div className="flex items-center gap-1 sm:gap-2 text-default-500">
          <Repeat2 size={16} className="text-success sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-medium">{repostCount}</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1 sm:gap-2 text-default-500">
          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-medium">
            {viewsCount > 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : viewsCount}
          </span>
        </div>
      </div>
    </div>
  );
};
