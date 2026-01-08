export default function AboutView() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <img
            src="/head/h1.jpg"
            alt="头像"
            className="w-48 h-48 rounded-full border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/30"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(255,43,214,0.8)]">关于</h1>
          <div className="rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#0b0b1b]/70 to-[#160734]/60 shadow-[inset_0_0_20px_rgba(124,58,237,0.2),0_0_12px_rgba(0,234,255,0.15)]">
            <p className="text-cyan-200">
              我是一个热爱技术与设计的开发者，喜欢在霓虹与代码之间寻找平衡。
            </p>
            <p className="mt-3 text-cyan-200">
              这里记录了做自媒体内容的相关、工具实践与生活分享，风格偏赛博朋克。
            </p>
            <p className="mt-3 text-cyan-200">
              博客网址: <a href="https://media.laofansay.uk/" className="text-cyan-400 hover:underline">https://media.laofansay.uk/</a>
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-pink-400">联系方式</h2>
            <div className="mt-4 space-y-2 text-cyan-200">
              <p>邮箱: <a href="mailto:jeneryfan@hotmail.com" className="text-cyan-400 hover:underline">jeneryfan@hotmail.com</a></p>
              <div className="flex items-center gap-4">
                <p>添加我微信: </p>
                <img
                  src="/images/fan-wx.png"
                  alt="微信二维码"
                  className="w-36 h-36 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-pink-400">自媒体频道</h2>
            <div className="mt-4 space-y-2">
              <p className="text-cyan-200">
                关注我的社交媒体频道，获取更多内容与分享！
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/@Scarboroug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  YouTube频道
                </a>
                <a
                  href="https://space.bilibili.com/3546866228660367"  /* TODO: Replace with actual Bilibili URL */
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  Bilibili频道
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
