import type { Metadata } from "next";
import { postService } from "@/src/features/post/services/post.service";
import CurrentPost from "./CurrentPost";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirchan.site";
  try {
    const post = await postService.getPostById(postId);
    const contentStr = typeof post.content === "string" ? post.content : "";
    const plainText = contentStr.replace(/<[^>]*>?/gm, "").trim();
    const description =
      plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;

    const authorName = post.author?.name || "пользователя";
    const pageTitle = `Пост от ${authorName} | Mirchan`;

    const isVideo = post.media?.[0]?.type.includes("VIDEO")

    if (isVideo) {
      return {
        title: pageTitle,
        description,
        openGraph: {
          title: pageTitle,
          description,
          type: "article",
          url: `${siteUrl}/posts/${postId}`,
          videos: post.media?.map((m) => ({
            url: m.url,
            type: m.type,
          })),
        },
        twitter: {
          card: "summary_large_image",
          title: pageTitle,
          description,
          images: post.media?.map((m) => ({
            url: m.url,
            width: m.width,
            height: m.height,
            type: m.type,
          })),
        },
      };
    }
    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: "article",
        url: `${siteUrl}/posts/${postId}`,
        
        images: post?.media?.map(m=> ({
          url: m.url,
          width: m.width,
          height: m.height,
          type: m.type
        }))
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images: post.media?.map((m) => ({
            url: m.url,
            width: m.width,
            height: m.height,
            type: m.type,
          })),
      },
    };
  } catch (error) {
    console.error("Ошибка при генерации метаданных поста:", error);
    return {
      title: "Пост не найден | Mirchan",
      description: "Запрошенный пост не существует или был удален",
    };
  }
}

export default function PostDetailsPage() {
  return <CurrentPost />;
}
