'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [registrationCode, setRegistrationCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('两次输入的密码不一致')
            setLoading(false)
            return
        }

        // Validate password strength
        if (password.length < 6) {
            setError('密码长度至少为 6 位')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, registrationCode }),
            })

            const result = await response.json()

            if (!response.ok) throw new Error(result.error || '注册失败')

            setSuccess(result.message || '注册成功！')

            // If auto-login is enabled, redirect to admin page
            if (result.data?.session) {
                setTimeout(() => {
                    window.open('/admin', '_blank')
                    router.push('/login')
                }, 1500)
            }
        } catch (err) {
            console.error('注册失败:', err)
            setError('注册失败：' + (err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">管理员注册</h1>

                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded mb-4">
                        {success}
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
                            placeholder="至少 6 位密码"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">确认密码</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            placeholder="再次输入密码"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">注册码</label>
                        <input
                            type="text"
                            value={registrationCode}
                            onChange={(e) => setRegistrationCode(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            placeholder="输入注册码"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded disabled:opacity-50"
                    >
                        {loading ? '注册中...' : '注册'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-center text-sm text-gray-400">
                        已有账户？{' '}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                            立即登录
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
