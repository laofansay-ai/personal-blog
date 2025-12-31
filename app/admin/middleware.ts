import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	// 对于简单的认证检查，我们检查是否存在Supabase认证cookie
	const cookies = request.headers.get('cookie')
	const isAuthenticated =
		cookies &&
		(cookies.includes('sb-access-token=') ||
			cookies.includes('sb-refresh-token='))

	// 如果访问管理页面但未认证，重定向到登录页面
	if (
		request.nextUrl.pathname.startsWith('/admin') &&
		request.nextUrl.pathname !== '/login' &&
		!isAuthenticated
	) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// 如果已登录但访问登录页面，重定向到管理首页
	if (request.nextUrl.pathname === '/login' && isAuthenticated) {
		return NextResponse.redirect(new URL('/admin', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin/:path*', '/login']
}
