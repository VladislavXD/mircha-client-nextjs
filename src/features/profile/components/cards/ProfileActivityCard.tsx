"use client";
import React from "react";
import { Card, Tab, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useUserProfile } from "@/src/features/profile";
import { MdModeComment, MdOutlineContentPaste } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import ProfilePostCard from "./ProfilePostCard";
import ProfileCommentItem from "./ProfileCommentItem";
import ProfileLikeItem from "./ProfileLikeItem";

export const ProfileActivityCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useUserProfile(id);

  console.log("ProfileActivityCard data:", data);
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Активность</h3>
      <div className="text-center text-default-500 py-2">
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" color="primary" variant="bordered" className="w-full p-0 m-0 h-full">
            <Tab
              key="posts"
              title={
                <div className="flex items-center space-x-2">
                  <MdOutlineContentPaste />
                  <span>Посты</span>
                </div>
              }
            >
              <div className="mt-4 space-y-3 text-left">
                {data?.post?.length ? (
                  data.post.map((p) => (
                    <ProfilePostCard
                      key={p.id}
                      postId={p.id}
                      content={p.content}
                      createdAt={p.createdAt}
                      likesCount={p.likes?.length || 0}
                      commentsCount={p.comments?.length || 0}
                      likeByUser={p.likeByUser}
                      views={Array.isArray(p.views) ? p.views.length : 0}
                      imageUrl={p.imageUrl}
                      emojiUrls={p.emojiUrls}
                      authorId={p.authorId || data.id}
                      authorName={p.author?.name || data.name || ''}
                      authorAvatarUrl={p.author?.avatarUrl || data.avatarUrl}
                      usernameFrameUrl={p.author?.usernameFrameUrl || data.usernameFrameUrl}
                      avatarFrameUrl={p.author?.avatarFrameUrl || data.avatarFrameUrl}
                    />
                  ))
                ) : (
                  <div className="text-default-500">Постов пока нет</div>
                )}
              </div>
            </Tab>

            <Tab
              key="comments"
              title={
                <div className="flex items-center space-x-2">
                  <MdModeComment />
                  <span>Комментарии</span>
                </div>
              }
            >
              <div className="mt-4 space-y-3 text-left">
                {data?.comments?.length ? (
                  data.comments.map((c) => {
                    // пост для комментария (если это комментарий к собственному посту, он будет в data.post)
                    const relatedPost = data.post?.find((p) => p.id === c.postId);
                    const postAuthorIsProfileOwner = relatedPost?.authorId === data.id;
                    return (
                      <ProfileCommentItem
                        key={c.id}
                        commentId={c.id}
                        content={c.content}
                        postId={c.postId}
                        postContent={relatedPost?.content || c.post?.content}
                        postEmojiUrls={relatedPost?.emojiUrls || c.post?.emojiUrls}
                        postImageUrl={relatedPost?.imageUrl || c.post?.imageUrl}
                        postAuthorId={relatedPost?.authorId || c.post?.authorId}
                        postAuthorName={postAuthorIsProfileOwner ? (data.name || "") : c.post?.author?.name}
                        postAuthorAvatarUrl={postAuthorIsProfileOwner ? (data.avatarUrl || undefined) : c.post?.author?.avatarUrl}
                      />
                    );
                  })
                ) : (
                  <div className="text-default-500">Комментариев пока нет</div>
                )}
              </div>
            </Tab>

            <Tab
              key="likes"
              title={
                <div className="flex items-center space-x-2">
                  <FcLike />
                  <span>Лайки</span>
                </div>
              }
            >
              <div className="mt-4 space-y-3 text-left">
                {data?.likes?.length ? (
                  data.likes.map((l) => {
                    const likedPost = l.post || data.post?.find((p) => p.id === l.postId);
                    const likedPostAuthorIsProfileOwner = likedPost?.authorId === data.id;
                    return (
                      <ProfileLikeItem
                        key={l.id}
                        likeId={l.id}
                        postId={l.postId}
                        postContent={likedPost?.content}
                        postEmojiUrls={likedPost?.emojiUrls}
                        postImageUrl={likedPost?.imageUrl}
                        postAuthorId={likedPost?.authorId}
                        postAuthorName={likedPostAuthorIsProfileOwner ? (data.name || "") : likedPost?.author?.name}
                        postAuthorAvatarUrl={likedPostAuthorIsProfileOwner ? (data.avatarUrl || undefined) : likedPost?.author?.avatarUrl}
                      />
                    );
                  })
                ) : (
                  <div className="text-default-500">Лайков пока нет</div>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default ProfileActivityCard;
