# 微信公众号推送功能 - 快速开始

## 🚀 3 分钟快速配置

### 1. 复制并配置环境变量 (1 分钟)

```bash
cp .wechat.env.sample .wechat.env.local
```

编辑 `.wechat.env.local`（或添加到你的 `.env.local`）:

```env
WECHAT_APP_ID=你的公众号 AppID
WECHAT_APP_SECRET=你的公众号 AppSecret
WECHAT_PUSH_ENABLED=true
```

**获取 AppID 和 AppSecret**:
- 访问 https://mp.weixin.qq.com/
- 登录公众号后台
- 设置与开发 → 基本配置

### 2. 执行数据库迁移 (30 秒)

在 Supabase SQL Editor 中运行：

```sql
-- 打开 supabase/14_add_wechat_fields.sql 文件，复制并执行全部内容
```

或直接执行：

```bash
supabase db push
```

### 3. 重启开发服务器 (30 秒)

```bash
npm run dev
```

## 📱 使用方法

### 发布文章到微信

1. **创建文章**
   - 进入 `/admin/posts` 
   - 点击"新增文章"
   - 填写标题、内容、上传封面图
   - 保存文章

2. **推送到微信**
   - 在文章列表中找到刚保存的文章
   - 点击右侧的"推送到微信"按钮（💚 绿色微信图标）
   - 等待系统自动处理

3. **查看效果**
   - 系统会自动上传封面图
   - 创建草稿并发布
   - 返回微信消息 ID

### 推送流程

```
博客文章 → 上传封面图 → 创建草稿 → 发布文章 → 粉丝可见
           (自动)        (自动)      (自动)
```

## ⚙️ 高级配置

### 仅保存到草稿箱（不立即发布）

修改 `lib/wechat.ts` 中的 `publishArticle` 调用为 `addDraft` 即可。

### 自定义推送模板

可以扩展 `WechatArticleData` 接口添加更多字段：
- `need_open_comment`: 开启评论
- `only_fans_can_comment`: 仅粉丝可评论

## 📊 状态追踪

系统会在数据库记录：
- `wechat_media_id`: 微信素材 ID
- `wechat_msg_id`: 微信消息 ID  
- `wechat_published_at`: 发布时间

## ❓ 常见问题

**Q: 找不到"推送到微信"按钮？**  
A: 确保 `WECHAT_PUSH_ENABLED=true`

**Q: 提示授权失败？**  
A: 检查 AppID 和 AppSecret 是否正确

**Q: 图片上传失败？**  
A: 确保图片尺寸 900x383，大小<2MB

**Q: 如何删除已发布的文章？**  
A: 需要在微信后台手动删除，API 不支持删除已群发消息

## 🎨 下一步优化

当前版本是基础实现，你可以：

1. 在文章列表页添加"推送到微信"按钮
2. 添加推送历史记录
3. 集成定时推送功能
4. 添加推送预览功能
5. 支持多账号切换

需要帮助实现这些功能？随时告诉我！

---

**详细文档**: [WECHAT_INTEGRATION.md](WECHAT_INTEGRATION.md)  
**微信官方文档**: https://developers.weixin.qq.com/doc/
