// app/api/posts/[id]/meta/route.ts
import { postService } from "@/src/features/post/services/post.service";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mirchan.site";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id;

  try {
    const post = await postService.getPostById(postId);
    const contentStr = typeof post.content === "string" ? post.content : "";
    const plainText = contentStr.replace(/<[^>]*>?/gm, "").trim();
    const description =
      plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;

    const authorName = post.author?.name || "пользователя";
    const pageTitle = `Пост от ${authorName} | Mirchan`;
    const isVideo = post.media?.[0]?.type?.toUpperCase().includes("VIDEO");

    const images = post.media?.map((m) => ({
      url: m.url,
      width: m.width,
      height: m.height,
      type: m.type,
    }));

    const ogVideos = post.media?.map((m) => ({
      url: m.url,
      type: m.type,
    }));

    return Response.json({
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: "article",
        url: `${siteUrl}/posts/${postId}`,
        ...(isVideo ? { videos: ogVideos } : { images }),
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images,
      },
    });
  } catch (error) {
    console.error("Ошибка при генерации метаданных поста:", error);
    return Response.json(
      {
        title: "Пост не найден | Mirchan",
        description: "Запрошенный пост не существует или был удален",
      },
      { status: 404 }
    );
  }
}