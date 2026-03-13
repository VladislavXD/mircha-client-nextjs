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
    const description = plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;


    const authorName = post.author?.name || "пользователя";
    const pageTitle = `Пост от ${authorName} | Mirchan`;

		
    let images;
    if (post.media?.length) {
      let rawUrl = post.media[0].url;

      if (
        rawUrl.includes("res.cloudinary.com") &&
        rawUrl.includes("/video/upload/") &&
        rawUrl.endsWith(".mp4")
      ) {
        rawUrl = rawUrl
          .replace("/video/upload/", "/video/upload/so_1,f_jpg/")
          .replace(".mp4", ".jpg");
      }

      images = [
        {
          url: rawUrl,
          width: 1200,
          height: 630,
        },
      ];
    }

    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: "article",
        url: `${siteUrl}/posts/${postId}`,
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images,
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
