export default function AboutView() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(255,43,214,0.8)]">关于</h1>
      <div className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]">
        <p className="text-cyan-200">
          我是一个热爱技术与设计的开发者，喜欢在霓虹与代码之间寻找平衡。
        </p>
        <p className="mt-3 text-cyan-200">
          这里记录个人技术文章、工具实践与生活分享，风格偏赛博朋克。
        </p>
      </div>
    </section>
  );
}
