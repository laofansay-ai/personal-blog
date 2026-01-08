import type { Metadata } from 'next'
import Link from 'next/link'
import { listAllCategories, listAllTags } from '@/lib/taxonomy'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: '斯卡布罗',
	description: '一个展示个人自媒体素材博文和生活分享的博客'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const [categories, tags] = await Promise.all([
		listAllCategories(),
		listAllTags()
	])
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#0a0a0f] via-[#0f0f2b] to-[#190036] text-cyan-100`}
			>
				<div className="min-h-screen">
					<header className="sticky top-0 z-50 border-b border-cyan-500/30 bg-black/40 backdrop-blur">
						<nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
							<Link
								href="/view/home"
								className="flex items-center space-x-2 text-2xl font-bold tracking-widest text-cyan-300"
							>
								<img
									src="/head/logo.jpg"
									alt="Logo"
									className="w-12 h-8 rounded-md"
								/>
								<span>斯卡布罗</span>
							</Link>
							<div className="flex gap-6">
								<Link
									href="/view/home"
									className="hover:text-pink-300 text-cyan-200"
								>
									首页
								</Link>
								<Link
									href="/view/articles"
									className="hover:text-pink-300 text-cyan-200"
								>
									文章
								</Link>
								<Link
									href="/view/about"
									className="hover:text-pink-300 text-cyan-200"
								>
									关于
								</Link>
								<Link
									href="/view/search"
									className="hover:text-pink-300 text-cyan-200"
								>
									搜索
								</Link>
								<Link
									href="/admin"
									className="hover:text-pink-300 text-cyan-200"
								>
									管理
								</Link>
							</div>
						</nav>
						<div className="mx-auto max-w-5xl px-6 pb-4">
							<form
								className="mb-3 flex gap-2"
								action="/view/search"
								method="get"
							>
								<input
									className="w-full rounded-lg border border-cyan-500/40 bg-black/30 px-3 py-2 text-cyan-100"
									type="text"
									name="q"
									placeholder="搜索文章"
								/>
								<button className="rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 px-4 py-2 text-[#0a0a0f]">
									搜索
								</button>
							</form>
						</div>
					</header>
					<main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
					<footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-cyan-300/70">
						© {new Date().getFullYear()} 个人自媒体素材博客
					</footer>
				</div>
			</body>
		</html>
	)
}
