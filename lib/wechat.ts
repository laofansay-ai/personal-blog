/**
 * 微信公众号 API 客户端
 * 用于管理微信素材、群发消息等功能
 */

interface WechatConfig {
    appId: string;
    appSecret: string;
}

interface WechatTokenResponse {
    access_token: string;
    expires_in: number;
    errcode?: number;
    errmsg?: string;
}

interface WechatArticleData {
    title: string;
    author: string;
    digest: string;
    content: string;
    thumb_media_id: string;
    show_cover_pic: number;
    need_open_comment?: number;
    only_fans_can_comment?: number;
}

interface WechatUploadResponse {
    media_id: string;
    url: string;
    errcode?: number;
    errmsg?: string;
}

interface WechatPublishResponse {
    errcode: number;
    errmsg: string;
    msg_id: string;
    msg_data_id?: string;
}

type PublishResponse = WechatPublishResponse;

class WechatClient {
    private appId: string;
    private appSecret: string;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;

    constructor(config: WechatConfig) {
        this.appId = config.appId;
        this.appSecret = config.appSecret;
    }

    /**
     * 获取访问令牌
     */
    async getAccessToken(): Promise<string> {
        // 如果令牌未过期，直接返回
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }

        try {
            const response = await fetch(
                `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
            );

            const data: WechatTokenResponse = await response.json();

            if (data.errcode) {
                throw new Error(`获取 Token 失败：${data.errmsg}`);
            }

            this.accessToken = data.access_token;
            // 提前 5 分钟过期
            this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

            return this.accessToken;
        } catch (error) {
            console.error('获取微信 Access Token 失败:', error);
            throw error;
        }
    }

    /**
     * 上传临时素材（图片）
     */
    async uploadTempImage(imageUrl: string): Promise<string> {
        try {
            // 下载图片
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();

            // 上传到微信
            const formData = new FormData();
            formData.append('media', blob, 'image.jpg');

            const token = await this.getAccessToken();
            const uploadResponse = await fetch(
                `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${token}&type=image`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data: WechatUploadResponse = await uploadResponse.json();

            if (data.errcode) {
                throw new Error(`上传图片失败：${data.errmsg}`);
            }

            return data.media_id;
        } catch (error) {
            console.error('上传微信素材失败:', error);
            throw error;
        }
    }

    /**
     * 上传永久素材（图片）
     */
    async uploadPermanentImage(imageUrl: string): Promise<{ media_id: string; url: string }> {
        try {
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();

            const formData = new FormData();
            formData.append('media', blob, 'image.jpg');
            formData.append('description', JSON.stringify({ title: 'blog image' }));

            const token = await this.getAccessToken();
            const uploadResponse = await fetch(
                `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data: WechatUploadResponse = await uploadResponse.json();

            if (data.errcode) {
                throw new Error(`上传永久素材失败：${data.errmsg}`);
            }

            return {
                media_id: data.media_id,
                url: data.url,
            };
        } catch (error) {
            console.error('上传微信永久素材失败:', error);
            throw error;
        }
    }

    /**
     * 新增草稿（推荐方式）
     */
    async addDraft(article: WechatArticleData): Promise<string> {
        try {
            const token = await this.getAccessToken();

            const response = await fetch(
                `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        articles: [article],
                    }),
                }
            );

            const data = await response.json();

            if (data.errcode) {
                throw new Error(`新增草稿失败：${data.errmsg}`);
            }

            return data.media_id;
        } catch (error) {
            console.error('新增微信草稿失败:', error);
            throw error;
        }
    }

    /**
     * 发布图文消息（从草稿箱发布）
     */
    async publishArticle(mediaId: string): Promise<PublishResponse> {
        try {
            const token = await this.getAccessToken();

            const response = await fetch(
                `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        media_id: mediaId,
                    }),
                }
            );

            const data: PublishResponse = await response.json();

            if (data.errcode) {
                throw new Error(`发布文章失败：${data.errmsg}`);
            }

            return data;
        } catch (error) {
            console.error('发布微信文章失败:', error);
            throw error;
        }
    }

    /**
     * 删除草稿
     */
    async deleteDraft(mediaId: string): Promise<void> {
        try {
            const token = await this.getAccessToken();

            const response = await fetch(
                `https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        media_id: mediaId,
                    }),
                }
            );

            const data = await response.json();

            if (data.errcode) {
                throw new Error(`删除草稿失败：${data.errmsg}`);
            }
        } catch (error) {
            console.error('删除微信草稿失败:', error);
            throw error;
        }
    }
}

export default WechatClient;
export type { WechatArticleData, WechatConfig };
