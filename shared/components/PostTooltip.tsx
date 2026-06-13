"use client";

import type { Thread, Reply } from "@/src/types/types";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

import MediaThumbnail from "@/shared/components/MediaThumbnail";

interface PostTooltipProps {
  post: Thread | Reply;
  isOP?: boolean;
}

const PostTooltip: React.FC<PostTooltipProps> = ({ post, isOP = false }) => {
  const isThread = "boardId" in post;
  const postNumber = isThread ? 1 : (post as Reply).postNumber;

  return (
    <Card className="max-w-xs sm:max-w-md shadow-lg border">
      <CardHeader className="pb-2 px-3">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-1 flex-wrap text-xs">
            <span className="font-medium text-green-600">
              {post.authorName || "Анон"}
            </span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
            <span className="text-muted-foreground/70">
              {new Date(post.createdAt).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-blue-500 font-mono">#{postNumber}</span>
            <span className="text-muted-foreground/70 font-mono">{post.shortId}</span>
            {isOP && (
              <Badge variant="default" className="text-xs px-1.5 py-0">
                OP
              </Badge>
            )}
          </div>
        </div>

        {/* Тема треда для OP поста */}
        {isOP && isThread && (post as Thread).subject && (
          <div className="w-full mt-1">
            <h3 className="text-sm font-semibold text-blue-600">
              {(post as Thread).subject}
            </h3>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 px-3">
        <div className="flex gap-2 sm:gap-3">
          {/* Медиа превью */}
          {(post.mediaFiles && post.mediaFiles.length > 0) || post.imageUrl ? (
            <div className="flex-shrink-0">
              {post.mediaFiles && post.mediaFiles.length > 0 ? (
                <div className="space-y-1">
                  <MediaThumbnail
                    className="border border-border"
                    name={post.mediaFiles[0].name}
                    showInfo={false}
                    size={post.mediaFiles[0].size}
                    thumbnailUrl={post.mediaFiles[0].thumbnailUrl}
                    type={post.mediaFiles[0].type}
                    url={post.mediaFiles[0].url}
                    variant="small"
                  />
                  {post.mediaFiles.length > 1 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{post.mediaFiles.length - 1} файлов
                    </div>
                  )}
                </div>
              ) : (
                <MediaThumbnail
                  className="border border-border"
                  name={post.imageName}
                  showInfo={false}
                  size={post.imageSize}
                  thumbnailUrl={post.thumbnailUrl}
                  url={post.imageUrl!}
                  variant="small"
                />
              )}
            </div>
          ) : null}

          {/* Содержание поста */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm">
              <p className="line-clamp-3 sm:line-clamp-4 whitespace-pre-wrap">
                {post.content.length > 120
                  ? post.content.substring(0, 120) + "..."
                  : post.content}
              </p>
            </div>

            {/* Информация о файлах */}
            {((post.mediaFiles && post.mediaFiles.length > 0) ||
              post.imageUrl) && (
              <div className="mt-2 text-xs text-muted-foreground">
                {post.mediaFiles && post.mediaFiles.length > 0 ? (
                  <>
                    <div className="truncate">
                      📎 {post.mediaFiles.length} файлов
                    </div>
                    <div>
                      {(
                        post.mediaFiles.reduce(
                          (acc, file) => acc + (file.size || 0),
                          0,
                        ) / 1024
                      ).toFixed(1)}{" "}
                      KB
                    </div>
                  </>
                ) : (
                  <>
                    {post.imageName && (
                      <div className="truncate">📎 {post.imageName}</div>
                    )}
                    {post.imageSize && (
                      <div>{(post.imageSize / 1024).toFixed(1)} KB</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTooltip;