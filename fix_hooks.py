import re

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

new_block = """  // ======= HOOKS (MUST BE ON TOP) =======
  const imageUrl = (post as any)?.image ?? (post as any)?.imageUrl;
  
  const postMedia: PostMedia[] = React.useMemo(() => {
    if (!post) return [];
    const mediaArray = (post as any)?.media;

    if (Array.isArray(mediaArray) && mediaArray.length > 0) {
      return mediaArray.map((m: any) => {
        let mediaType: "image" | "video" = "image";
        if (m.type) {
          mediaType = String(m.type).toUpperCase() === "VIDEO" ? "video" : "image";
        } else if (m.mimeType) {
          mediaType = m.mimeType.startsWith("video/") ? "video" : "image";
        }
        return { url: m.url || m, type: mediaType, spoiler: m.spoiler || false };
      });
    }
    if (imageUrl) {
      return [{ url: imageUrl, type: "image" as const, spoiler: false }];
    }
    return [];
  }, [post, imageUrl]);

  const { mutate: likePost, isPending: isLikeLoading } = useLikePost();
  const { mutate: unlikePost, isPending: isUnlikeLoading } = useUnlikePost();
  const { mutate: deletePost, isPending: isDeleteLoading } = useDeletePost();
  const { mutate: addView } = useAddView();

  const [error, setError] = useState("");
  const [viewSent, setViewSent] = useState(false);
  const modals = usePostCardModals();
  const inViewRef = useRef<HTMLDivElement | null>(null);

  const handleLike = () => {
    if (!currentUser) return setError("Вы не авторизованы");
    if (isLikeLoading || isUnlikeLoading || !post) return;

    if (post.likeByUser) {
      unlikePost(post.id, { onError: (err) => setError(err.message || "Ошибка при снятии лайка") });
    } else {
      likePost(post.id, { onError: (err) => setError(err.message || "Ошибка при добавлении лайка") });
    }
  };

  const { throttledCallback: handleLikeWithThrottle, isThrottled } = useThrottle(handleLike, 2000);

  const handleDelete = () => {
    if (!post) return;
    deletePost(post.id, {
      onSuccess: () => {
        modals.deleteModal.onClose();
        if (cardFor === "current-post") router.push("/");
      },
      onError: (err) => {
        setError(err.message || "Ошибка при удалении поста");
        modals.deleteModal.onClose();
      },
    });
  };

  const postId = post?.id;
  useEffect(() => {
    if (postgres://0223a985e316690b5e81479fbfb6ac81b54b398c2a66341ad2f563a42ee04967:sk_a9W9Bed0x || viewSent || !postId || cardFor !== "post" || !currentUser) return;
    const el = inViewRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            timeoutId = setTimeout(() => {
              if (entry.isIntersecting) {
                addView(postId, {});
                setViewSent(true);
                observer.disconnect();
              }
            }, 1000);
          } else {
            if (timeoutId) clearTimeout(timeoutId);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [post, postId, viewSent, cardFor, currentUser, addView]);

  const authorId = post?.author?.id ?? "";
  const { isOnline } = useOnlineStatus(authorId);
  // ========================================

  if (!post) {
    if (isRepostLoading) {
      return (
        <div className="px-4 py-3 animate-pulse space-y-2">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
        </div>
      );
    }
    return null;
  }

  const {
    id = "",
    author,
    content,
    emojiUrls = [],
    createdAt,
    likes = [],
    comments = [],
    likesCount: serverLikesCount,
    commentsCount: serverCommentsCount,
    likeByUser = false,
    views = [],
    viewsCount: serverViewsCount,
    repostCount = 0,
    originalPost,
    repostedByUser = false,
  } = post;

  const {
    name = "",
    avatarUrl = "",
    usernameFrameUrl,
    avatarFrameUrl,
    backgroundUrl,
    bio,
    createdAt: authorCreatedAt,
    followers = [],
    following = [],
  } = author || {};

  const likesCount = serverLikesCount ?? likes.length;
  const commentsCount = serverCommentsCount ?? comments.length;
  const viewsCount = serverViewsCount ?? views.length;
  const followersCount = followers.length;
  const followingCount = following.length;
  const isFollowing = currentUser
    ? followers.some((f) => f.followerId === currentUser.id)
    : false;"""

pattern = re.compile(r'  if \(!post\) \{.*?const \{ isOnline \} = useOnlineStatus\(authorId\);', re.DOTALL)
new_text = pattern.sub(new_block, text)

with open('/home/neivo/myCode/mirchan/web/client-next/src/features/post/components/PostCard/index.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Done replacing.")
