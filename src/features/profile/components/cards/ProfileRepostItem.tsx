"use client";
import React from "react";
import Link from "next/link";
import { Repeat } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const initials = postAuthorName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 border border-border shadow-sm">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Заголовок репоста */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Repeat className="text-green-600 dark:text-green-400" size={16} />
            </div>
            <span className="text-sm font-medium text-foreground/70">
              Вы репостнули
            </span>
          </div>
          {createdAt && (
            <Badge className="text-xs" variant="secondary">
              {formatToClientDate(createdAt)}
            </Badge>
          )}
        </div>

        {/* Комментарий к репосту */}
        {repostComment && (
          <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border-l-4 border-primary">
            <p className="text-sm font-medium leading-relaxed">{repostComment}</p>
          </div>
        )}

        {/* Оригинальный пост */}
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          {/* Автор */}
          {postAuthorId && (
            <Link
              className="flex items-center gap-3 mb-3 group"
              href={`/user/${postAuthorId}`}
            >
              <Avatar className="flex-shrink-0 ring-2 ring-border group-hover:ring-primary transition-all size-8">
                <AvatarImage src={postAuthorAvatarUrl} alt={postAuthorName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                {postAuthorName}
              </span>
            </Link>
          )}

          {/* Контент */}
          <Link className="block group" href={`/posts/${postId}`}>
            {safeContent && (
              <div className="mb-3">
                <EmojiText
                  className="text-sm text-muted-foreground leading-relaxed line-clamp-4 group-hover:text-foreground transition-colors"
                  emojiUrls={postEmojiUrls}
                  text={safeContent}
                />
              </div>
            )}

            {postImageUrl && (
              <div className="rounded-lg overflow-hidden shadow-sm">
                <img
                  alt="Post media"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={postImageUrl}
                />
              </div>
            )}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileRepostItem;