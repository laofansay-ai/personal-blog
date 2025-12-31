import Link from 'next/link'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

async function checkAuth() {
	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					const cookie = cookieStore.get(name)
					return cookie ? cookie.value : ''
				}
			}
		}
	)

	const {
		data: { session }
	} = await supabase.auth.getSession()
	return !!session
}

export default async function AdminLayout({
	children
}: {
	children: ReactNode
}) {
	// 检查认证状态，如果未认证则重定向
	const authenticated = await checkAuth()
	if (!authenticated) {
		redirect('/login')
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			<header className="bg-gray-800 border-b border-gray-700">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-xl font-bold">博客管理后台</h1>
					<nav>
						<ul className="flex space-x-6">
							<li>
								<Link
									href="/admin/posts"
									className="hover:text-cyan-400 transition-colors"
								>
									文章管理
								</Link>
							</li>
							<li>
								<Link
									href="/admin/categories"
									className="hover:text-cyan-400 transition-colors"
								>
									分类管理
								</Link>
							</li>
							<li>
								<Link
									href="/admin/tags"
									className="hover:text-cyan-400 transition-colors"
								>
									标签管理
								</Link>
							</li>
						</ul>
					</nav>
					<div>
						<form action="/api/logout" method="post">
							<button
								type="submit"
								className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
							>
								退出登录
							</button>
						</form>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	)
}
