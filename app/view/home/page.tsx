import { listPublishedPosts } from "@/lib/posts";
import Link from "next/link";

export default async function HomeView() {
  const latest = await listPublishedPosts(2);
  return (
    <section className="space-y-10">
      <div className="rounded-xl p-10 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]">
        <h1 className="text-4xl font-extrabold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]">技术与生活的霓虹记事</h1>
        <p className="mt-4 text-cyan-200">
          记录开发心得、工具实践与个人自媒体素材、生活分享，风格浓烈的赛博朋克。
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/view/articles" className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 text-[#0a0a0f]">开始阅读</Link>
          <Link href="/view/about" className="px-5 py-3 rounded-lg border border-cyan-500/40 text-cyan-200">
            关于我
          </Link>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]">
          <h2 className="text-2xl font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(255,43,214,0.8)]">最新文章</h2>
          <ul className="mt-4 space-y-2">
            {latest.map((p) => (
              <li key={p.slug}>
                <Link className="hover:text-accent-2 text-cyan-200" href={`/view/articles/${p.slug}`}>
                  {p.title}
                </Link>
              </li>
            ))}
            {latest.length === 0 && (
              <li>
                <Link className="text-cyan-200" href="/view/articles">
                  暂无文章，前往文章页
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]">
          <h2 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]">灵感片段</h2>
          <p className="mt-3 text-cyan-200">赛博风格摄影、合成音乐与夜色中的思考。</p>
        </div>
      </div>
    </section>
  );
}
