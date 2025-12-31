'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			})

			if (error) throw error

			// 登录成功，重定向到管理页面
			router.push('/admin')
			router.refresh()
		} catch (err) {
			console.error('登录失败:', err)
			setError('登录失败: ' + (err as Error).message)
		} finally {
			setLoading(false)
		}
	}

	// 处理访客登录
	const handleGuestLogin = async () => {
		setLoading(true)
		setError('')

		try {
			// 使用预设的管理员账户登录
			const { data, error } = await supabase.auth.signInWithPassword({
				email: 'admin@example.com',
				password: 'Admin123!@#'
			})

			if (error) throw error

			// 登录成功，重定向到管理页面
			router.push('/admin')
			router.refresh()
		} catch (err) {
			console.error('访客登录失败:', err)
			setError('访客登录失败: ' + (err as Error).message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full max-w-md">
				<h1 className="text-2xl font-bold text-center mb-6">管理员登录</h1>

				{error && (
					<div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">邮箱</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							placeholder="输入邮箱地址"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">密码</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							placeholder="输入密码"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded disabled:opacity-50"
					>
						{loading ? '登录中...' : '登录'}
					</button>
				</form>

				<div className="mt-6 pt-6 border-t border-gray-700">
					<p className="text-center text-sm text-gray-400 mb-3">
						或使用访客账户登录（仅用于演示）
					</p>
					<button
						onClick={handleGuestLogin}
						disabled={loading}
						className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded disabled:opacity-50"
					>
						访客登录
					</button>
				</div>
			</div>
		</div>
	)
}
