import re

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add PostCardActions for reposts
repost_block_old = """            />
          </div>
        </div>
      ) : ("""
repost_block_new = """            />
            
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
          </div>
        </div>
      ) : ("""

text = text.replace(repost_block_old, repost_block_new)

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

