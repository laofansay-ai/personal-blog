import Link from 'next/link'

export default function AdminPage() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">管理后台</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">文章管理</h2>
					<p className="mb-4 text-gray-300">创建、编辑和管理博客文章</p>
					<Link
						href="/admin/posts"
						className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
					>
						管理文章
					</Link>
				</div>

				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">分类管理</h2>
					<p className="mb-4 text-gray-300">管理文章分类</p>
					<Link
						href="/admin/categories"
						className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
					>
						管理分类
					</Link>
				</div>

				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">标签管理</h2>
					<p className="mb-4 text-gray-300">管理文章标签</p>
					<Link
						href="/admin/tags"
						className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition-colors"
					>
						管理标签
					</Link>
				</div>
			</div>
		</div>
	)
}
