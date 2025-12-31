import Link from "next/link";
import { listPublishedPosts } from "@/lib/posts";
import { listAllCategories, listAllTags } from "@/lib/taxonomy";

export default async function ArticlesView() {
  const [posts, categories, tags] = await Promise.all([
    listPublishedPosts(20),
    listAllCategories(),
    listAllTags(),
  ]);
  return (
    <section>
      <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]">文章</h1>
      <div className="mt-4 space-y-2">
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <a key={c.slug} href={`/view/categories/${c.slug}`} className="rounded-full border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200">
                {c.name}
              </a>
            ))}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <a key={t.slug} href={`/view/tags/${t.slug}`} className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100">
                #{t.name}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/view/articles/${p.slug}`}
            className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]"
          >
            <h2 className="text-xl font-semibold text-cyan-100">{p.title}</h2>
            <p className="mt-2 text-cyan-200">{p.summary ?? ""}</p>
            <p className="mt-4 text-sm text-cyan-300/70">
              {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {p.category && (
                <span className="rounded-full border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200">
                  {p.category.name}
                </span>
              )}
              {(p.tags ?? []).map(({ tag }) => (
                <span key={tag.slug} className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100">
                  #{tag.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-cyan-200">暂无已发布文章</p>
        )}
      </div>
    </section>
  );
}
