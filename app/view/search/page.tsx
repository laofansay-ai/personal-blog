import { searchPosts } from "@/lib/posts";
import { listAllCategories, listAllTags } from "@/lib/taxonomy";
import Link from "next/link";

type Props = {
  searchParams?: {
    q?: string;
    category?: string;
    tag?: string;
  };
};

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams?.q || "";
  const category = searchParams?.category || "";
  const tag = searchParams?.tag || "";
  const [posts, categories, tags] = await Promise.all([
    searchPosts({ q, category, tag, limit: 100 }),
    listAllCategories(),
    listAllTags(),
  ]);
  return (
    <section>
      <h1 className="text-3xl font-bold text-cyan-300">搜索</h1>
      <form className="mt-4 flex flex-wrap gap-2" action="/view/search" method="get">
        <input
          className="rounded-lg border border-cyan-500/40 bg-black/30 px-3 py-2 text-cyan-100"
          type="text"
          name="q"
          placeholder="关键字"
          defaultValue={q}
        />
        <select
          className="rounded-lg border border-cyan-500/40 bg-black/30 px-3 py-2 text-cyan-100"
          name="category"
          defaultValue={category}
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-cyan-500/40 bg-black/30 px-3 py-2 text-cyan-100"
          name="tag"
          defaultValue={tag}
        >
          <option value="">全部标签</option>
          {tags.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 px-4 py-2 text-[#0a0a0f]">
          搜索
        </button>
      </form>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/view/articles/${p.slug}`}
            className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60"
          >
            <h2 className="text-xl font-semibold text-cyan-100">{p.title}</h2>
            <p className="mt-2 text-cyan-200">{p.summary ?? ""}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {p.category && (
                <Link
                  href={`/view/categories/${p.category.slug}`}
                  className="rounded-full border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200"
                >
                  {p.category.name}
                </Link>
              )}
              {(p.tags ?? []).map(({ tag }) => (
                <Link
                  key={tag.slug}
                  href={`/view/tags/${tag.slug}`}
                  className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-cyan-200">没有匹配的结果</p>
        )}
      </div>
    </section>
  );
}
