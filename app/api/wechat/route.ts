import { NextResponse } from 'next/server'
import WechatClient from '@/lib/wechat'

export async function POST(request: Request) {
    try {
        const { action, postId, title, content, summary, author, imageUrl } = await request.json()

        // Check if WeChat is enabled
        if (process.env.WECHAT_PUSH_ENABLED !== 'true') {
            return NextResponse.json(
                { error: '微信公众号推送功能未启用' },
                { status: 403 }
            )
        }

        // Initialize WeChat client
        const wechat = new WechatClient({
            appId: process.env.WECHAT_APP_ID!,
            appSecret: process.env.WECHAT_APP_SECRET!,
        })

        let result: any = {}

        switch (action) {
            case 'uploadImage':
                // Upload image to WeChat
                if (!imageUrl) {
                    return NextResponse.json(
                        { error: '图片 URL 不能为空' },
                        { status: 400 }
                    )
                }
                const mediaData = await wechat.uploadPermanentImage(imageUrl)
                result = mediaData
                break

            case 'addDraft':
                // Add draft article
                if (!title || !content || !imageUrl) {
                    return NextResponse.json(
                        { error: '缺少必要参数' },
                        { status: 400 }
                    )
                }

                // First upload the cover image
                const { media_id: thumb_media_id } = await wechat.uploadPermanentImage(imageUrl)

                // Then create the draft
                const mediaId = await wechat.addDraft({
                    title,
                    author: author || '',
                    digest: summary || '',
                    content,
                    thumb_media_id,
                    show_cover_pic: 1,
                    need_open_comment: 0,
                    only_fans_can_comment: 0,
                })

                result = { media_id: mediaId }
                break

            case 'publish':
                // Publish from draft
                if (!postId) {
                    return NextResponse.json(
                        { error: '缺少文章 ID' },
                        { status: 400 }
                    )
                }
                const publishResult = await wechat.publishArticle(postId)
                result = publishResult
                break

            case 'deleteDraft':
                // Delete draft
                if (!postId) {
                    return NextResponse.json(
                        { error: '缺少文章 ID' },
                        { status: 400 }
                    )
                }
                await wechat.deleteDraft(postId)
                result = { success: true }
                break

            default:
                return NextResponse.json(
                    { error: '未知操作' },
                    { status: 400 }
                )
        }

        return NextResponse.json({ success: true, data: result })
    } catch (error) {
        console.error('微信 API 调用失败:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '微信 API 调用失败' },
            { status: 500 }
        )
    }
}
