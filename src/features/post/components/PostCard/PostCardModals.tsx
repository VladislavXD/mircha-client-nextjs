import type { Post, User } from "../../types";

import React, { lazy, Suspense } from "react";

const DeletePost = lazy(
  () => import("@/shared/components/ui/post/PostModals/DeletePost"),
);
const ShareModal = lazy(() => import("../../modals/sharePostModal"));
const EditPostModal = lazy(
  () => import("@/shared/components/ui/post/PostModals/EditPost"),
);
const ReportPostModal = lazy(() => import("../../modals/report"));
const CommentsModal = lazy(() =>
  import("../comments").then((m) => ({ default: m.CommentsModal })),
);
const UserProfileModal = lazy(
  () => import("@/src/features/user/components/UserProfileModal"),
);





type Props = {
  post: Post;
  deleteError: string;
  isDeleteLoading: boolean;
  author?: User
  currentUserId?: string | undefined;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onDelete: () => void;
  modals: {
    deleteModal: { isOpen: boolean; onClose: () => void };
    shareModal: { isOpen: boolean; onClose: () => void };
    editModal: { isOpen: boolean; onClose: () => void };
    reportModal: { isOpen: boolean; onClose: () => void };
    commentsModal: { isOpen: boolean; onClose: () => void };
    profileModal: { isOpen: boolean; onClose: () => void };
  };
};

export const PostCardModals = ({
  post,
  deleteError,
  isDeleteLoading,
  onDelete,
  author,
  currentUserId,
  isFollowing,
  onFollowToggle,
  modals,
}: Props) => {
  const safeContent = typeof post.content === "string" ? post.content : "";

  return (
    <Suspense fallback={null}>
      {modals.deleteModal.isOpen && (
        <DeletePost
          error={deleteError}
          isOpen={modals.deleteModal.isOpen}
          loading={isDeleteLoading}
          onClose={modals.deleteModal.onClose}
          onDelete={onDelete}
        />
      )}
      {modals.shareModal.isOpen && (
        <ShareModal
          isOpen={modals.shareModal.isOpen}
          linkToCopy={`https://mirchan.site/posts/${post.id}`}
          onClose={modals.shareModal.onClose}
        />
      )}
      {modals.editModal.isOpen && (
        <EditPostModal
          initialContent={safeContent}
          initialEmojiUrls={post.emojiUrls}
          isOpen={modals.editModal.isOpen}
          postId={post.id}
          onClose={modals.editModal.onClose}
          onUpdated={modals.editModal.onClose}
        />
      )}
      {modals.reportModal.isOpen && (
        <ReportPostModal
          isOpen={modals.reportModal.isOpen}
          post={post}
          onClose={modals.reportModal.onClose}
        />
      )}
      {modals.commentsModal.isOpen && (
        <CommentsModal
          isOpen={modals.commentsModal.isOpen}
          post={post}
          onClose={modals.commentsModal.onClose}
        />
      )}
       
        {modals.profileModal.isOpen && author && (
        <UserProfileModal
          isOpen={modals.profileModal.isOpen}
          onClose={modals.profileModal.onClose}
          userId={author.id}
          currentUserId={currentUserId}
          name={author.name}
          avatarUrl={author.avatarUrl}
          bio={author.bio}
          backgroundUrl={author.backgroundUrl}
          avatarFrameUrl={author.avatarFrameUrl}
          usernameFrameUrl={author.usernameFrameUrl}
          followersCount={author._count?.followers ?? 0}
          followingCount={author._count?.following ?? 0}
          isFollowing={isFollowing}
          createdAt={author.createdAt}
          showFollowBadge={true}
          onFollowToggle={onFollowToggle}
        />
      )}
    </Suspense>
  );
};
