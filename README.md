# 个人博客系统 Personal Blog System

博客网址：https://media.laofansay.uk/
我的youtobe频道：https://www.youtube.com/@Scarboroug

## 🇨🇳 中文说明

### 项目简介
这是一个现代化的个人博客系统，采用 Next.js 16+ 和 Supabase 构建。系统提供了完整的博客管理功能，包括文章管理、分类管理、标签管理等。

### 功能特性
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **管理后台** - 文章、分类、标签的增删改查
- ✅ **文章海报** - 支持上传多张封面图片
- ✅ **分类与标签** - 完整的内容组织系统
- ✅ **搜索功能** - 根据关键词、分类、标签搜索文章
- ✅ **分页功能** - 文章列表支持分页显示
- ✅ **前后章节导航** - 文章详情页支持上下篇切换
- ✅ **用户认证** - 基于 Supabase 的身份验证系统
- ✅ **云存储** - 图片上传到 Cloudinary
- ✅ **SEO 优化** - 良好的搜索引擎优化

### 技术栈
- **前端**: Next.js 16+, React, TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL)
- **图片存储**: Cloudinary
- **部署**: Vercel 或其他支持 Next.js 的平台

### 快速开始

#### 1. 克隆项目
```bash
git clone <your-repo-url>
cd personal-blog
```

#### 2. 安装依赖
```bash
npm install
# 或
yarn install
```

#### 3. 环境变量配置
复制 `.env.local.sample` 文件并重命名为 `.env.local`，然后填入相应的配置信息：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 4. 数据库设置
本项目使用 Supabase 作为数据库。你需要：

1. 在 [Supabase](https://supabase.com) 创建项目
2. 执行 SQL 文件初始化数据库结构：
   - `supabase/01_schema.sql` - 基础表结构
   - `supabase/02_policies.sql` - 安全策略
   - `supabase/03_seed.sql` - 初始数据
   - `supabase/04_profiles.sql` - 用户资料表
   - `supabase/05_posts_write_policies.sql` - 文章写入权限
   - `supabase/06_triggers.sql` - 触发器
   - `supabase/07_admin_seed.sql` - 管理员数据
   - `supabase/08_categories_tags_schema.sql` - 分类和标签表结构
   - `supabase/09_categories_tags_policies.sql` - 分类和标签权限
   - `supabase/10_categories_tags_seed.sql` - 分类和标签初始数据
   - `supabase/11_posts_posters.sql` - 文章海报字段
   - `supabase/12_fix_posters_null.sql` - 海报字段修复

#### 5. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000` 开始使用。

### 管理后台
- 访问路径: `/admin`
- 登录后可进行文章、分类、标签的管理
- 支持文章发布状态切换（草稿/已发布）
- 支持文章海报图片上传

### 项目结构
```
personal-blog/
├── app/                    # Next.js 16+ App Router 页面
│   ├── admin/             # 管理后台页面
│   ├── api/               # API 路由
│   ├── login/             # 登录页面
│   └── view/              # 博客前台页面
├── components/            # React 组件
├── lib/                   # 工具函数和配置
├── supabase/              # 数据库迁移文件
└── public/                # 静态资源
```

---

## 🇺🇸 English Documentation

### Project Overview
This is a modern personal blog system built with Next.js 16+ and Supabase. The system provides complete blog management features including article management, category management, and tag management.

### Features
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Admin Dashboard** - CRUD operations for articles, categories, and tags
- ✅ **Article Posters** - Support for uploading multiple cover images
- ✅ **Categories & Tags** - Complete content organization system
- ✅ **Search Functionality** - Search by keywords, categories, and tags
- ✅ **Pagination** - Article lists with pagination support
- ✅ **Previous/Next Navigation** - Article navigation between chapters
- ✅ **User Authentication** - Supabase-based authentication system
- ✅ **Cloud Storage** - Images uploaded to Cloudinary
- ✅ **SEO Optimized** - Good search engine optimization

### Tech Stack
- **Frontend**: Next.js 16+, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel or other Next.js supported platforms

### Quick Start

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd personal-blog
```

#### 2. Install dependencies
```bash
npm install
# or
yarn install
```

#### 3. Environment Variables
Copy `.env.local.sample` to `.env.local` and fill in your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 4. Database Setup
This project uses Supabase as the database. You need to:

1. Create a project at [Supabase](https://supabase.com)
2. Execute SQL files to initialize the database structure:
   - `supabase/01_schema.sql` - Base table structure
   - `supabase/02_policies.sql` - Security policies
   - `supabase/03_seed.sql` - Initial data
   - `supabase/04_profiles.sql` - User profiles table
   - `supabase/05_posts_write_policies.sql` - Article write permissions
   - `supabase/06_triggers.sql` - Triggers
   - `supabase/07_admin_seed.sql` - Admin data
   - `supabase/08_categories_tags_schema.sql` - Categories and tags table structure
   - `supabase/09_categories_tags_policies.sql` - Categories and tags permissions
   - `supabase/10_categories_tags_seed.sql` - Categories and tags initial data
   - `supabase/11_posts_posters.sql` - Article poster field
   - `supabase/12_fix_posters_null.sql` - Poster field fixes

#### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to start using.

### Admin Dashboard
- Access path: `/admin`
- Login to manage articles, categories, and tags
- Support article publishing status toggle (Draft/Published)
- Support article poster image upload

### Project Structure
```
personal-blog/
├── app/                    # Next.js 16+ App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── login/             # Login page
│   └── view/              # Blog frontend pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── supabase/              # Database migration files
└── public/                # Static assets
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support
If you have any questions or need help, feel free to open an issue in the GitHub repository.

