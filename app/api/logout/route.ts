import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST() {
	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					const cookie = cookieStore.get(name)
					return cookie ? cookie.value : ''
				},
				set(
					name: string,
					value: string,
					options: {
						path?: string
						maxAge?: number
						expires?: Date
						secure?: boolean
						httpOnly?: boolean
						domain?: string
						sameSite?: boolean | 'lax' | 'strict' | 'none'
						partitioned?: boolean
					}
				) {
					cookieStore.set(name, value, options)
				},
				remove(
					name: string,
					options: {
						path?: string
						maxAge?: number
						expires?: Date
						secure?: boolean
						httpOnly?: boolean
						domain?: string
						sameSite?: boolean | 'lax' | 'strict' | 'none'
						partitioned?: boolean
					}
				) {
					cookieStore.delete(name)
				}
			}
		}
	)

	await supabase.auth.signOut()

	// 返回重定向响应
	return NextResponse.redirect(
		new URL(
			'/login',
			process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: 'http://localhost:3000'
		)
	)
}
