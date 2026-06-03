import re

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure Repeat2 is imported
if 'import { Repeat2 }' not in text:
    text = text.replace('import { Heart, Eye, Send, MessageCircle } from "lucide-react";', 'import { Heart, Eye, Send, MessageCircle, Repeat2 } from "lucide-react";')
    # Or just add it top level
    if 'import { Repeat2 }' not in text:
        text = text.replace('import { usePost } from "../../hooks/usePostQueries";', 'import { usePost } from "../../hooks/usePostQueries";\nimport { Repeat2 } from "lucide-react";')


new_block = """  return (
    <Card
      className={`mb-0 relative cursor-pointer transition-all shadow-none bg-white dark:bg-[#101010] ${
        cardFor === "repost"
          ? "border border-neutral-200 dark:border-neutral-800 rounded-2xl mx-[48px] sm:mx-[52px] mb-3 sm:hover:bg-neutral-50 sm:dark:hover:bg-[#181818]"
          : "rounded-none border-x-0 border-t-0 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800/70 sm:hover:bg-neutral-50 sm:dark:hover:bg-[#181818]"
      }`}
      onAuxClick={handleCardAuxClick}
      onClick={handleCardClick}
    >
      {cardFor === "repost" ? (
        <div className="flex flex-col gap-1.5 px-3 pt-3 pb-2">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Repeat2 size={14} className="shrink-0 ml-1" />
            <div className="flex-1 min-w-0">
              <PostCardHeader.Repost
                authorCreatedAt={authorCreatedAt}
                authorId={authorId}
                avatarFrameUrl={avatarFrameUrl}
                avatarUrl={avatarUrl}
                backgroundUrl={backgroundUrl}
                bio={bio}
                createdAt={createdAt}
                followersCount={followersCount}
                followingCount={followingCount}
                isFollowing={isFollowing}
                isOnline={isOnline}
                name={name}
                usernameFrameUrl={usernameFrameUrl}
                onFollowToggle={onFollowToggle}
              />
            </div>
          </div>
          <div className="pl-6">
            <PostCardContent
              cardFor={cardFor}
              content={content as string}
              emojiUrls={emojiUrls}
              hasOriginalPost={!!originalPost}
              inViewRef={inViewRef}
              originalPostElement={
                originalPost ? (
                  <PostCard
                    cardFor="repost"
                    repostId={originalPost.id}
                    onFollowToggle={onFollowToggle}
                  />
                ) : null
              }
              postMedia={postMedia}
              onContentClick={
                cardFor !== "current-post"
                  ? () => router.push(`/posts/${id}`)
                  : undefined
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-3.5 px-4 sm:px-5 pt-4 pb-3">
          {/* LEFT COLUMN: Avatar and vertical line */}
          <PostCardHeader.Left
            authorCreatedAt={authorCreatedAt}
            authorId={authorId}
            avatarFrameUrl={avatarFrameUrl}
            avatarUrl={avatarUrl}
            backgroundUrl={backgroundUrl}
            bio={bio}
            cardFor={cardFor}
            currentUserId={currentUser?.id}
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowing={isFollowing}
            isOnline={isOnline}
            name={name}
            usernameFrameUrl={usernameFrameUrl}
            onFollowToggle={onFollowToggle}
          />

          {/* RIGHT COLUMN: Header, Content, Actions */}
          <div className="flex-1 min-w-0 pb-3">
            <PostCardHeader.Right
              authorCreatedAt={authorCreatedAt}
              authorId={authorId}
              avatarFrameUrl={avatarFrameUrl}
              avatarUrl={avatarUrl}
              backgroundUrl={backgroundUrl}
              bio={bio}
              cardFor={cardFor}
              createdAt={createdAt}
              followersCount={followersCount}
              followingCount={followingCount}
              isDeleteLoading={isDeleteLoading}
              isFollowing={isFollowing}
              isOnline={isOnline}
              name={name}
              usernameFrameUrl={usernameFrameUrl}
              onDelete={modals.deleteModal.onOpen}
              onEdit={modals.editModal.onOpen}
              onFollowToggle={onFollowToggle}
              onReport={modals.reportModal.onOpen}
            />

            <PostCardContent
              cardFor={cardFor}
              content={content as string}
              emojiUrls={emojiUrls}
              hasOriginalPost={!!originalPost}
              inViewRef={inViewRef}
              originalPostElement={
                originalPost ? (
                  <PostCard
                    cardFor="repost"
                    repostId={originalPost.id}
                    onFollowToggle={onFollowToggle}
                  />
                ) : null
              }
              postMedia={postMedia}
              onContentClick={
                cardFor !== "current-post"
                  ? () => router.push(`/posts/${id}`)
                  : undefined
              }
            />

            <PostCardActions
              cardFor={cardFor}
              commentsCount={commentsCount}
              handleLikeWithThrottle={handleLikeWithThrottle}
              isLikeLoading={isLikeLoading}
              isThrottled={isThrottled}
              isUnlikeLoading={isUnlikeLoading}
              likeByUser={likeByUser}
              likesCount={likesCount}
              post={post}
              repostCount={repostCount}
              repostedByUser={repostedByUser}
              viewsCount={viewsCount}
              onActionsClick={
                cardFor !== "current-post"
                  ? () => router.push(`/posts/${id}`)
                  : undefined
              }
              onCommentsOpen={modals.commentsModal.onOpen}
              onShareOpen={modals.shareModal.onOpen}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      )}

      <PostCardModals
        deleteError={error}
        isDeleteLoading={isDeleteLoading}
        modals={modals}
        post={post}
        onDelete={handleDelete}
      />
    </Card>
  );"""

pattern = re.compile(r'  return \(\n    <Card\n      className=`mb-0 relative cursor-pointer.*?</Card>\n  \);', re.DOTALL)
new_text = pattern.sub(new_block, text)

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Done replacing layout in PostCard.")
