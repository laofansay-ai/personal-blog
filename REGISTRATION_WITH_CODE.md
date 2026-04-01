# 管理员注册功能 - 授权码验证

## 🔐 功能说明

注册功能已启用授权码验证，只有知道授权码的用户才能注册管理员账户。

## ⚙️ 配置方法

### 1. 设置授权码

编辑 `.env` 文件，找到以下配置：

```env
# 注册授权码（用于限制用户注册）
WECHAT_REGISTRATION_CODE=AI2026Admin
```

修改为你自己的授权码，例如：

```env
WECHAT_REGISTRATION_CODE=MySecretCode2026
```

### 2. 重启服务器

修改后需要重启开发服务器：

```bash
npm run dev
```

## 📱 注册流程

### 用户注册步骤：

1. **访问注册页面**
   - URL: `/register`

2. **填写信息**
   - 邮箱地址
   - 密码（至少 6 位）
   - 确认密码
   - **注册码**（必需）

3. **提交注册**
   - 系统会验证注册码是否正确
   - ✅ 正确：注册成功，自动跳转到管理后台
   - ❌ 错误：提示"授权码错误，无法注册"

### 注册成功后的操作：

- 自动登录
- 在新窗口打开管理后台
- 可以立即开始管理文章

## 🔒 安全特性

### 授权码验证

```typescript
// API 验证逻辑
const correctCode = process.env.WECHAT_REGISTRATION_CODE
if (!registrationCode || registrationCode !== correctCode) {
    return NextResponse.json(
        { error: '授权码错误，无法注册' },
        { status: 403 }
    )
}
```

### 其他安全措施

- ✅ 密码长度要求（至少 6 位）
- ✅ 密码一致性验证
- ✅ Supabase 认证加密
- ✅ 会话管理和 Cookie 保护

## 💡 使用建议

### 授权码设置建议

**好的授权码特征：**
- ✅ 包含字母和数字组合
- ✅ 长度在 8-20 个字符
- ✅ 不容易被猜到
- ✅ 定期更换

**示例：**
```env
WECHAT_REGISTRATION_CODE=Admin2026!@#Safe
WECHAT_REGISTRATION_CODE=Blog@Secure9527
WECHAT_REGISTRATION_CODE=MyBlog#Admin2026
```

### 分享授权码

**安全方式：**
- 📞 电话告知
- 💬 面对面告诉
- 🔐 加密消息发送

**不安全方式：**
- ❌ 公开发布在网站上
- ❌ 写在公开的 README 中
- ❌ 通过未加密的邮件群发

## 🎨 界面展示

### 注册表单字段

```
┌─────────────────────────────┐
│     管理员注册               │
├─────────────────────────────┤
│ 邮箱                        │
│ [输入邮箱地址]              │
│                             │
│ 密码                        │
│ [输入密码]                  │
│                             │
│ 确认密码                    │
│ [再次输入密码]              │
│                             │
│ 注册码 ⭐                   │
│ [输入注册码]                │
│                             │
│      [注册]                 │
└─────────────────────────────┘
```

## ❓ 常见问题

### Q: 忘记授权码怎么办？
A: 
1. 查看 `.env` 文件中的 `WECHAT_REGISTRATION_CODE`
2. 如果也忘了设置的值，可以重新设置一个新的

### Q: 可以修改授权码吗？
A:
- 可以随时修改
- 修改后需要重启服务器
- 已注册的用户不受影响

### Q: 可以关闭授权码验证吗？
A:
- 可以，删除 `registrationCode` 验证逻辑即可
- 但不建议这样做，会降低安全性

### Q: 授权码有有效期吗？
A:
- 默认没有有效期
- 如需设置有效期，可以在代码中添加时间戳验证

### Q: 一个授权码可以注册多少人？
A:
- 不限制使用次数
- 任何人知道授权码都可以注册
- 所以要妥善保管

## 🔧 代码位置

### 相关文件

1. **配置文件**
   - `.env` - 存储授权码

2. **API 端点**
   - `app/api/register/route.ts` - 验证授权码

3. **前端页面**
   - `app/register/page.tsx` - 注册表单

### 核心代码

**API 验证部分：**
```typescript
// Validate registration code
const correctCode = process.env.WECHAT_REGISTRATION_CODE
if (!registrationCode || registrationCode !== correctCode) {
    return NextResponse.json(
        { error: '授权码错误，无法注册' },
        { status: 403 }
    )
}
```

**前端表单部分：**
```tsx
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
```

## 📋 检查清单

部署前请确认：

- [ ] 已修改默认授权码
- [ ] 授权码足够复杂
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 重启了开发服务器
- [ ] 测试了注册功能
- [ ] 验证了错误提示

## 🚀 下一步优化

可以考虑添加：

1. **授权码过期时间** - 设置有效期
2. **一次性授权码** - 每个码只能用一次
3. **多个授权码** - 支持批量生成
4. **授权码记录** - 记录谁使用了哪个码
5. **邮件审批** - 注册后需要管理员审核

---

**最后更新**: 2026-03-31  
**当前版本**: v1.0  
**默认授权码**: `AI2026Admin`

⚠️ **重要提醒**: 部署生产环境前一定要修改默认授权码！
