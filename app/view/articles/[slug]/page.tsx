import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
type Props = { params: { slug: string } };

export default async function ArticleDetail({ params }: Props) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") {
    notFound();
  }
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)] text-4xl font-extrabold">
        {post.title}
      </h1>
      <p className="mt-4 text-cyan-200">
        {post.summary ?? ""}
      </p>
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
    </article>
  );
}
