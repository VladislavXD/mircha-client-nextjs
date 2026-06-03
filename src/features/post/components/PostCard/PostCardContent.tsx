import React from "react";

import PostMediaSlider, { type PostMedia } from "../PostMediaSlider/index";

import { EmojiText } from "@/shared/components/ui/EmojiText";
import { PollFormatted } from "../Poll/types/poll.types";
import { PollItem } from "@/components/ui/PollItem";
import { PollCard } from "../Poll/components/PollCard";

// Because we're in /PostCard it's easiest to take PostCard from the parent or we'll inject it.
// To avoid circular dependency, we can pass it as a render prop or inject children.
// Or we just import PostCard from "../PostCard" (which will be the old one or new index.tsx)

type Props = {
  content: string;
  emojiUrls: string[];
  postMedia: PostMedia[];
  cardFor?: "comment" | "post" | "current-post" | "repost";
  inViewRef: React.RefObject<HTMLDivElement | null>;
  onContentClick?: () => void;
  // Repost related
  hasOriginalPost?: boolean;
  originalPostElement?: React.ReactNode;
  poll?: PollFormatted;
  postId: string;
};

export const PostCardContent = ({
  content,
  emojiUrls,
  postMedia,
  cardFor,
  inViewRef,
  onContentClick,
  hasOriginalPost,
  originalPostElement,
  poll,
  postId,
}: Props) => {
  const safeContent = typeof content === "string" ? content : "";

	const hasContent = safeContent.trim().length > 0
	const hasMedia = postMedia.length > 0
	const hasRepost = hasOriginalPost && cardFor !== "repost"

	// Если нет контента, медиа и репоста, не рендерим ничего
	if (!hasContent && !hasMedia && !hasRepost && !poll) {
		return null;
	}

  return (
    <>
      {/* Текст поста */}
      {hasContent && (
        <div
          ref={inViewRef as any}
          className="cursor-pointer"
          onClick={onContentClick}
        >
          <EmojiText
            className="font-serif text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed tracking-wide whitespace-pre-wrap"
            emojiUrls={emojiUrls}
            text={safeContent}
          />
        </div>
      )}

      {/* inViewRef без контента — нужен для трекинга просмотров */}
      {!hasContent && <div ref={inViewRef as any} />}

      {/* Media */}
      {hasMedia && (
        <div
          className="mt-2 rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <PostMediaSlider media={postMedia} />
        </div>
      )}
      {
        poll && (
          <PollCard postId={postId} poll={poll}/>
        )
      }
      {/* Repost */}
      {hasRepost && (
        <div
          className="mt-3 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {originalPostElement}
        </div>
      )}
    </>
  );

};
