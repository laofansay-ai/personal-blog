import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: '邮箱和密码不能为空' },
                { status: 400 }
            )
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: '密码长度至少为 6 位' },
                { status: 400 }
            )
        }

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

        // Check if user already exists
        const { data: existingUsers } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        if (existingUsers) {
            return NextResponse.json(
                { error: '该邮箱已被注册' },
                { status: 409 }
            )
        }

        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        // Check if email confirmation is required
        if (data.user?.identities && data.user.identities.length === 0) {
            return NextResponse.json(
                {
                    error: '该邮箱已被注册',
                    needsConfirmation: true
                },
                { status: 409 }
            )
        }

        // Auto-login after successful registration
        if (data.session) {
            return NextResponse.json({
                success: true,
                data,
                message: '注册成功，正在跳转到管理页面...'
            })
        } else {
            return NextResponse.json({
                success: true,
                data,
                message: '注册成功！请检查邮箱以验证账户。'
            })
        }
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: '注册过程中发生错误' },
            { status: 500 }
        )
    }
}
