import { listPostsByTagSlug } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function TagPage({ params }: Props) {
  const resolvedParams = await params;
  const posts = await listPostsByTagSlug(resolvedParams.slug, 50);
  if (posts.length === 0) {
    notFound();
  }
  return (
    <section>
      <h1 className="text-3xl font-bold text-cyan-300">标签：{resolvedParams.slug}</h1>
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
              {p.category && (
                <Link href={`/view/categories/${p.category.slug}`} className="rounded-full border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200">
                  {p.category.name}
                </Link>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
