-- 为 posts 表添加微信公众号相关字段

-- 添加微信媒体 ID 字段（用于存储草稿箱或已发布的媒体 ID）
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS wechat_media_id VARCHAR(255);

-- 添加微信消息 ID 字段（用于存储已发布的消息 ID）
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS wechat_msg_id VARCHAR(255);

-- 添加微信发布时间
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS wechat_published_at TIMESTAMP WITH TIME ZONE;

-- 添加评论索引
COMMENT ON COLUMN posts.wechat_media_id IS '微信素材库媒体 ID';
COMMENT ON COLUMN posts.wechat_msg_id IS '微信消息 ID';
COMMENT ON COLUMN posts.wechat_published_at IS '微信发布时间';
