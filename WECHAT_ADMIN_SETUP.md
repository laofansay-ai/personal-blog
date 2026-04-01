# 微信公众号推送功能 - 配置说明

## 📋 快速配置（3 步完成）

### 1️⃣ 复制环境变量文件

```bash
cp .wechat.env.sample .wechat.env.local
```

### 2️⃣ 编辑配置文件

打开 `.wechat.env.local`（或添加到你的 `.env.local`），填入以下信息：

```env
# 微信公众号配置
WECHAT_APP_ID=wx1234567890abcdef    # 替换为你的 AppID
WECHAT_APP_SECRET=your_secret_here   # 替换为你的 AppSecret
WECHAT_TOKEN=abcd                    # 自定义 token，用于服务器验证
WECHAT_PUSH_ENABLED=true             # 启用推送功能
```

### 3️⃣ 执行数据库迁移

在 Supabase Dashboard → SQL Editor 中执行：

```sql
-- 打开并执行 supabase/14_add_wechat_fields.sql 的全部内容
```

或直接运行：

```bash
supabase db push
```

### 4️⃣ 重启开发服务器

```bash
npm run dev
```

---

## 🎯 获取微信配置信息

### 步骤 1：登录微信公众平台
访问：https://mp.weixin.qq.com/

### 步骤 2：进入基本配置
**设置与开发** → **基本配置**

### 步骤 3：复制配置信息
- **AppID(应用 ID)**: 复制这个到 `WECHAT_APP_ID`
- **AppSecret(应用密钥)**: 点击"生成"或"重置"，然后复制到 `WECHAT_APP_SECRET`

### 步骤 4：配置 Token（可选）
如果需要接收微信消息：
- 在 **服务器配置** 部分
- URL: `https://your-domain.com/api/wechat`
- Token: `abcd` (自定义一个)
- 保存到 `.wechat.env.local` 的 `WECHAT_TOKEN`

---

## ✅ 使用方法

### 发布文章到微信

1. **创建文章**
   - 进入 `/admin/posts`
   - 点击"新增文章"
   - 填写标题、内容
   - **上传封面图**（必需，作为文章首图）
   - 保存文章

2. **推送到微信**
   - 在文章列表中找到该文章
   - 看到"微信推送"列
   - 点击 **"推送"** 按钮
   - 等待系统自动处理

3. **查看状态**
   - 推送中：显示"推送中..."
   - 成功：显示"已推送"（绿色）
   - 失败：显示错误提示

### 推送流程

```
点击推送按钮
    ↓
上传封面图到微信素材库（自动）
    ↓
创建草稿箱文章（自动）
    ↓
从草稿箱发布（自动）
    ↓
✅ 粉丝可见
```

---

## 📊 后台管理功能

### 文章列表新增列

- **微信推送列**: 显示推送状态和操作按钮
  - 🔵 "推送"按钮 - 未推送时显示
  - 🟡 "推送中..." - 正在推送
  - 🟢 "已推送" - 推送成功

### 数据库字段

系统会自动记录：
- `wechat_media_id`: 微信素材库 ID
- `wechat_msg_id`: 微信消息 ID
- `wechat_published_at`: 微信发布时间

---

## ⚠️ 注意事项

### 图片要求
- **尺寸**: 900x383 像素（推荐）
- **格式**: JPG, PNG
- **大小**: < 2MB
- **位置**: 必须是文章的第一张海报图

### 内容要求
- **标题**: 1-64 个字符
- **摘要**: 不超过 120 个字符
- **正文**: 支持 HTML 格式

### 发布限制
- **订阅号**: 每天可群发 1 次
- **服务号**: 每月可群发 4 次
- **草稿箱**: 无数量限制（建议先保存草稿预览）

---

## ❓ 常见问题

### Q: 找不到"推送"按钮？
A: 确保 `WECHAT_PUSH_ENABLED=true`

### Q: 提示"授权失败"？
A: 
- 检查 AppID 和 AppSecret 是否正确
- 确认公众号已通过认证

### Q: 图片上传失败？
A:
- 检查图片尺寸和大小
- 确保图片 URL 可以公开访问

### Q: 如何删除已推送的文章？
A:
- 需要在微信公众号后台手动删除
- API 不支持删除已群发的消息

### Q: 可以只保存草稿不发布吗？
A:
- 可以！修改 `app/admin/posts/page.tsx` 中的 `handleWechatPush` 函数
- 注释掉第三步"发布"的代码即可

---

## 🎨 高级功能

### 自定义作者名称
修改 `handleWechatPush` 函数中的：
```typescript
author: 'AI 劝退周刊',  // 改成你的公众号名称
```

### 调整推送时间
目前是立即发布，可以改为定时发布（需要额外开发）。

### 多账号管理
可以扩展为支持多个公众号切换推送。

---

## 📚 相关文档

- [详细技术文档](WECHAT_INTEGRATION.md)
- [微信官方文档](https://developers.weixin.qq.com/doc/)
- [快速开始指南](WECHAT_QUICKSTART.md)

---

**配置完成后，就可以在后台文章管理页面使用推送功能了！** 🎉
