import { listPublishedPosts } from "@/lib/posts";
import Link from "next/link";
import { listAllCategories, listAllTags } from "@/lib/taxonomy";
import CategoriesOnly from "@/components/CategoriesOnly";
import TagsOnly from "@/components/TagsOnly";

export default async function ArticlesView({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const limit = 10; // Number of posts per page

  const [allPosts, categories, tags] = await Promise.all([
    listPublishedPosts(), // Get all published posts
    listAllCategories(),
    listAllTags(),
  ]);

  // Calculate pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/6">
          <CategoriesOnly />
        </div>
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]">文章</h1>
          <div className="mt-6 grid gap-6 sm:grid-cols-1">
            {posts.map((p) => (

              <Link
                key={p.slug}
                href={`/view/articles/${p.slug}`}
                className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]"
              >
                {p.posters && Array.isArray(p.posters) && p.posters.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={p.posters[0]}
                      alt={p.title}
                      className="w-full h-48 object-cover rounded-lg border border-cyan-500/30"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-cyan-100">{p.title}</h2>
                <p className="mt-2 text-cyan-200">{p.summary ?? ""}</p>
                <p className="mt-4 text-sm text-cyan-300/70 text-right">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-right">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                {page > 1 ? (
                  <Link
                    href={`?page=${page - 1}`}
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                  >
                    上一页
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed">
                    上一页
                  </span>
                )}

                <span className="text-cyan-200 px-2">
                  第 {page} 页，共 {totalPages} 页
                </span>

                {page < totalPages ? (
                  <Link
                    href={`?page=${page + 1}`}
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                  >
                    下一页
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed">
                    下一页
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="lg:w-1/6">
          <TagsOnly />
        </div>
      </div>
    </section>
  );
}
