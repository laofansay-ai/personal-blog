import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: '登录过程中发生错误' }, { status: 500 })
    }
}