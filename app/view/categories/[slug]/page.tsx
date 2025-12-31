import { listPostsByCategorySlug } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export default async function CategoryPage({ params }: Props) {
  const posts = await listPostsByCategorySlug(params.slug, 50);
  if (posts.length === 0) {
    notFound();
  }
  return (
    <section>
      <h1 className="text-3xl font-bold text-cyan-300">分类：{posts[0].category?.name}</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/view/articles/${p.slug}`}
            className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60"
          >
            <h2 className="text-xl font-semibold text-cyan-100">{p.title}</h2>
            <p className="mt-2 text-cyan-200">{p.summary ?? ""}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(p.tags ?? []).map(({ tag }) => (
                <Link key={tag.slug} href={`/view/tags/${tag.slug}`} className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100">
                  #{tag.name}
                </Link>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
