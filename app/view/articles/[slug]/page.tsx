import { getPostBySlug, listPublishedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import PosterGalleryWithLightbox from "@/components/PosterGalleryWithLightbox";

type Props = { params: Promise<{ slug: string }> };

export default async function ArticleDetail({ params }: Props) {
  const resolvedParams = await params;
  console.log('ArticleDetail params:', resolvedParams);
  const { slug } = resolvedParams;
  console.log('ArticleDetail slug:', slug);

  if (!slug) {
    console.error('No slug provided to ArticleDetail page');
    notFound();
  }

  // Get current post and all published posts for navigation
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    listPublishedPosts() // Get all published posts
  ]);

  if (!post) {
    console.error(`Article with slug '${slug}' not found in database.`);
    notFound();
  }

  if (post.status !== "published") {
    console.error(`Article with slug '${slug}' has status '${post.status}', not published.`);
    notFound();
  }

  // Find current post index and get previous/next posts
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
  );
  const currentIndex = sortedPosts.findIndex(p => p.slug === slug);

  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)] text-4xl font-extrabold">
        {post.title}
      </h1>
      <p className="mt-4 text-cyan-200">
        {post.summary ?? ""}
      </p>

      {/* Posters */}
      {post.posters && Array.isArray(post.posters) && post.posters.length > 0 && (
        <PosterGalleryWithLightbox posters={post.posters} />
      )}

      <div className="mt-8 rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)] whitespace-pre-wrap text-cyan-100">
        {post.content ?? ""}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {post.category && (
          <Link
            href={`/view/categories/${post.category.slug}`}
            className="rounded-full border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200"
          >
            {post.category.name}
          </Link>
        )}
        {(post.tags ?? []).map(({ tag }) => (
          <Link
            key={tag.slug}
            href={`/view/tags/${tag.slug}`}
            className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100"
          >
            #{tag.name}
          </Link>
        ))}
      </div>

      {/* Previous/Next Navigation */}
      <div className="mt-8 flex justify-between">
        {prevPost ? (
          <Link
            href={`/view/articles/${prevPost.slug}`}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
          >
            ← 上一章: {prevPost.title}
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed">
            ← 上一章
          </span>
        )}

        {nextPost ? (
          <Link
            href={`/view/articles/${nextPost.slug}`}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
          >
            下一章: {nextPost.title} →
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed">
            下一章 →
          </span>
        )}
      </div>
    </article>
  );
}
