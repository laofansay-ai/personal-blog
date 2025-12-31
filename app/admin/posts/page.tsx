import { useState, useEffect } from 'react'
import { Post, Category, Tag } from '@/lib/posts'
import { supabase } from '@/lib/supabaseClient'

export default function PostsPage() {
	const [posts, setPosts] = useState<Post[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [tags, setTags] = useState<Tag[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingPost, setEditingPost] = useState<Post | null>(null)
	const [formData, setFormData] = useState({
		title: '',
		slug: '',
		summary: '',
		content: '',
		status: 'published',
		categoryId: '',
		tagIds: [] as string[]
	})

	// 获取文章列表
	const fetchPosts = async () => {
		try {
			const { data, error } = await supabase
				.from('posts')
				.select(
					`
          id, 
          slug, 
          title, 
          summary, 
          content, 
          published_at, 
          status, 
          category:categories(id, name, slug),
          tags:post_tags(tag:tags(id, name, slug))
        `
				)
				.order('published_at', { ascending: false })

			if (error) throw error
			setPosts(data as unknown as Post[])
		} catch (error) {
			console.error('获取文章列表失败:', error)
		}
	}

	// 获取分类列表
	const fetchCategories = async () => {
		try {
			const { data, error } = await supabase
				.from('categories')
				.select('id, name, slug')
				.order('name')

			if (error) throw error
			setCategories(data as unknown as Category[])
		} catch (error) {
			console.error('获取分类列表失败:', error)
		}
	}

	// 获取标签列表
	const fetchTags = async () => {
		try {
			const { data, error } = await supabase
				.from('tags')
				.select('id, name, slug')
				.order('name')

			if (error) throw error
			setTags(data as unknown as Tag[])
		} catch (error) {
			console.error('获取标签列表失败:', error)
		}
	}

	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			await Promise.all([fetchPosts(), fetchCategories(), fetchTags()])
			setLoading(false)
		}

		loadData()
	}, [])

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleTagChange = (tagId: string, checked: boolean) => {
		setFormData((prev) => {
			const newTagIds = checked
				? [...prev.tagIds, tagId]
				: prev.tagIds.filter((id) => id !== tagId)
			return { ...prev, tagIds: newTagIds }
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			if (editingPost) {
				// 更新文章
				const { error: updateError } = await supabase
					.from('posts')
					.update({
						title: formData.title,
						slug: formData.slug,
						summary: formData.summary,
						content: formData.content,
						status: formData.status,
						category_id: formData.categoryId || null
					})
					.eq('id', editingPost.id)

				if (updateError) throw updateError

				// 更新标签关系
				// 先删除现有的标签关系
				await supabase.from('post_tags').delete().eq('post_id', editingPost.id)

				// 添加新的标签关系
				if (formData.tagIds.length > 0) {
					const tagRelations = formData.tagIds.map((tagId) => ({
						post_id: editingPost.id,
						tag_id: tagId
					}))

					const { error: insertError } = await supabase
						.from('post_tags')
						.insert(tagRelations)

					if (insertError) throw insertError
				}
			} else {
				// 创建新文章
				const { data: newPost, error: insertError } = await supabase
					.from('posts')
					.insert({
						title: formData.title,
						slug: formData.slug,
						summary: formData.summary,
						content: formData.content,
						status: formData.status,
						category_id: formData.categoryId || null
					})
					.select()
					.single()

				if (insertError) throw insertError

				// 添加标签关系
				if (formData.tagIds.length > 0) {
					const tagRelations = formData.tagIds.map((tagId) => ({
						post_id: newPost.id,
						tag_id: tagId
					}))

					const { error: relationError } = await supabase
						.from('post_tags')
						.insert(tagRelations)

					if (relationError) throw relationError
				}
			}

			// 重置表单
			setFormData({
				title: '',
				slug: '',
				summary: '',
				content: '',
				status: 'published',
				categoryId: '',
				tagIds: []
			})
			setEditingPost(null)
			setShowForm(false)

			// 重新获取数据
			await fetchPosts()
		} catch (error) {
			console.error('保存文章失败:', error)
			alert('保存文章失败: ' + (error as Error).message)
		}
	}

	const handleEdit = async (post: Post) => {
		setEditingPost(post)

		// 获取文章的标签
		const { data: postTags, error: tagError } = await supabase
			.from('post_tags')
			.select('tag_id')
			.eq('post_id', post.id)

		if (tagError) {
			console.error('获取文章标签失败:', tagError)
		}

		setFormData({
			title: post.title,
			slug: post.slug,
			summary: post.summary || '',
			content: post.content || '',
			status: post.status || 'published',
			categoryId: post.category?.id || '',
			tagIds: postTags?.map((pt) => pt.tag_id) || []
		})

		setShowForm(true)
	}

	const handleDelete = async (postId: string) => {
		if (!confirm('确定要删除这篇文章吗？')) return

		try {
			// 删除文章标签关系
			await supabase.from('post_tags').delete().eq('post_id', postId)

			// 删除文章
			const { error } = await supabase.from('posts').delete().eq('id', postId)

			if (error) throw error

			// 重新获取数据
			await fetchPosts()
		} catch (error) {
			console.error('删除文章失败:', error)
			alert('删除文章失败: ' + (error as Error).message)
		}
	}

	const handleCancel = () => {
		setFormData({
			title: '',
			slug: '',
			summary: '',
			content: '',
			status: 'published',
			categoryId: '',
			tagIds: []
		})
		setEditingPost(null)
		setShowForm(false)
	}

	if (loading) {
		return <div className="text-center py-8">加载中...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">文章管理</h1>
				<button
					onClick={() => {
						setFormData({
							title: '',
							slug: '',
							summary: '',
							content: '',
							status: 'published',
							categoryId: '',
							tagIds: []
						})
						setEditingPost(null)
						setShowForm(true)
					}}
					className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
				>
					新增文章
				</button>
			</div>

			{showForm && (
				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">
						{editingPost ? '编辑文章' : '新增文章'}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">标题</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								required
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Slug</label>
							<input
								type="text"
								name="slug"
								value={formData.slug}
								onChange={handleInputChange}
								required
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">摘要</label>
							<textarea
								name="summary"
								value={formData.summary}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
								rows={3}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">内容</label>
							<textarea
								name="content"
								value={formData.content}
								onChange={handleInputChange}
								required
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
								rows={6}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">状态</label>
							<select
								name="status"
								value={formData.status}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							>
								<option value="draft">草稿</option>
								<option value="published">已发布</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">分类</label>
							<select
								name="categoryId"
								value={formData.categoryId}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							>
								<option value="">无分类</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">标签</label>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<label
										key={tag.id}
										className="flex items-center bg-gray-700 px-2 py-1 rounded"
									>
										<input
											type="checkbox"
											checked={formData.tagIds.includes(tag.id)}
											onChange={(e) =>
												handleTagChange(tag.id, e.target.checked)
											}
											className="mr-1"
										/>
										<span>{tag.name}</span>
									</label>
								))}
							</div>
						</div>

						<div className="flex space-x-2">
							<button
								type="submit"
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
							>
								{editingPost ? '更新' : '创建'}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
							>
								取消
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="overflow-x-auto">
				<table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
					<thead className="bg-gray-700">
						<tr>
							<th className="py-3 px-4 text-left">标题</th>
							<th className="py-3 px-4 text-left">状态</th>
							<th className="py-3 px-4 text-left">分类</th>
							<th className="py-3 px-4 text-left">标签</th>
							<th className="py-3 px-4 text-left">发布日期</th>
							<th className="py-3 px-4 text-right">操作</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((post) => (
							<tr
								key={post.id}
								className="border-b border-gray-700 hover:bg-gray-750"
							>
								<td className="py-3 px-4">{post.title}</td>
								<td className="py-3 px-4">
									<span
										className={`px-2 py-1 rounded text-xs ${
											post.status === 'published'
												? 'bg-green-900 text-green-200'
												: 'bg-yellow-900 text-yellow-200'
										}`}
									>
										{post.status === 'published' ? '已发布' : '草稿'}
									</span>
								</td>
								<td className="py-3 px-4">{post.category?.name || '-'}</td>
								<td className="py-3 px-4">
									{post.tags?.map(({ tag }) => tag.name).join(', ') || '-'}
								</td>
								<td className="py-3 px-4">
									{post.published_at
										? new Date(post.published_at).toLocaleDateString()
										: '-'}
								</td>
								<td className="py-3 px-4 text-right">
									<button
										onClick={() => handleEdit(post)}
										className="text-blue-400 hover:text-blue-300 mr-3"
									>
										编辑
									</button>
									<button
										onClick={() => handleDelete(post.id)}
										className="text-red-400 hover:text-red-300"
									>
										删除
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{posts.length === 0 && (
					<div className="text-center py-8 text-gray-400">暂无文章</div>
				)}
			</div>
		</div>
	)
}
