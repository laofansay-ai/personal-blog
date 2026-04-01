# 微信公众号接入指南

## 功能说明

本系统支持将博客文章一键推送到微信公众号，包括以下功能：

- ✅ 上传文章封面图到微信素材库
- ✅ 创建微信草稿箱文章
- ✅ 从草稿箱发布文章
- ✅ 自动同步博客文章内容

## 配置步骤

### 1. 注册微信公众号

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册公众号（需要已认证的公众号才能使用高级接口）
3. 完成开发者认证

### 2. 获取公众号配置信息

在微信公众平台后台：

1. **设置与开发** → **基本配置**
2. 记录以下信息：
   - `AppID(应用 ID)` 
   - `AppSecret(应用密钥)`

### 3. 配置服务器（可选）

如果需要接收微信消息：

1. **设置与开发** → **基本配置** → **服务器配置**
2. 填写：
   - URL: `https://your-domain.com/api/wechat`
   - Token: 自定义 token
   - EncodingAESKey: 随机生成

### 4. 配置环境变量

复制 `.wechat.env.sample` 为 `.wechat.env.local`：

```bash
cp .wechat.env.sample .wechat.env.local
```

然后填入你的配置：

```env
# 微信公众号配置
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_app_secret_here

# 微信服务器配置 Token
WECHAT_TOKEN=abcd

# 是否启用微信推送功能
WECHAT_PUSH_ENABLED=true
```

### 5. 重启开发服务器

```bash
npm run dev
```

## 使用方法

### 发布文章到微信

1. 登录管理后台：`/admin`
2. 进入 **文章管理** 页面
3. 创建或编辑文章
4. 保存后，在文章列表中找到该文章
5. 点击 **推送到微信** 按钮
6. 系统会自动：
   - 上传封面图到微信素材库
   - 创建草稿箱文章
   - 发布到公众号

### 注意事项

1. **图片要求**：
   - 封面图尺寸：900x383 像素
   - 格式：JPG、PNG
   - 大小：< 2MB

2. **内容要求**：
   - 标题：1-64 个字符
   - 摘要：不超过 120 个字符
   - 正文：支持 HTML 格式

3. **发布限制**：
   - 订阅号：每天可群发 1 次
   - 服务号：每月可群发 4 次
   - 草稿箱：无数量限制

## API 接口说明

### POST /api/wechat

请求参数：

```json
{
  "action": "addDraft",  // 或 "publish", "uploadImage", "deleteDraft"
  "postId": "media_id",  // 发布时需要
  "title": "文章标题",
  "content": "文章内容（HTML）",
  "summary": "文章摘要",
  "author": "作者名",
  "imageUrl": "封面图 URL"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "media_id": "wechat_media_id",
    "msg_id": "published_msg_id"
  }
}
```

## 常见问题

### Q: 提示"未授权"错误
A: 确保公众号已通过认证，且 AppID 和 AppSecret 配置正确。

### Q: 图片上传失败
A: 检查图片尺寸和大小是否符合微信要求。

### Q: 发布频率限制
A: 注意订阅号和服务号的群发次数限制，建议先保存到草稿箱。

### Q: 如何预览效果？
A: 可以先保存为草稿，在微信公众号后台预览后再发布。

## 技术实现

- **WechatClient**: 封装微信 API 的客户端类
- **API Endpoint**: `/api/wechat` 处理所有微信相关请求
- **自动 Token 管理**: 自动处理 access_token 的获取和刷新

## 文件结构

```
lib/
  └── wechat.ts          # 微信 API 客户端
app/
  └── api/
      └── wechat/
          └── route.ts   # API 端点
.wechat.env.sample       # 环境变量模板
```

## 下一步优化建议

1. **定时推送**: 设置定时任务自动推送新文章
2. **模板消息**: 支持自定义推送模板
3. **粉丝互动**: 集成评论和点赞功能
4. **数据统计**: 追踪阅读量和分享数据
5. **多账号管理**: 支持多个公众号切换

---

**需要帮助？** 查看 [微信官方文档](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
