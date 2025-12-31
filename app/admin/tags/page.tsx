'use client'

import { useState, useEffect } from 'react'
import { Tag } from '@/lib/posts'
import { supabase } from '@/lib/supabaseClient'

export default function TagsPage() {
	const [tags, setTags] = useState<Tag[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingTag, setEditingTag] = useState<Tag | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		slug: ''
	})

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
			await fetchTags()
			setLoading(false)
		}

		loadData()
	}, [])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			if (editingTag) {
				// 更新标签
				const { error: updateError } = await supabase
					.from('tags')
					.update({
						name: formData.name,
						slug: formData.slug
					})
					.eq('id', editingTag.id)

				if (updateError) throw updateError
			} else {
				// 创建新标签
				const { error: insertError } = await supabase.from('tags').insert({
					name: formData.name,
					slug: formData.slug
				})

				if (insertError) throw insertError
			}

			// 重置表单
			setFormData({
				name: '',
				slug: ''
			})
			setEditingTag(null)
			setShowForm(false)

			// 重新获取数据
			await fetchTags()
		} catch (error) {
			console.error('保存标签失败:', error)
			alert('保存标签失败: ' + (error as Error).message)
		}
	}

	const handleEdit = (tag: Tag) => {
		setEditingTag(tag)
		setFormData({
			name: tag.name,
			slug: tag.slug
		})
		setShowForm(true)
	}

	const handleDelete = async (tagId: string) => {
		if (!confirm('确定要删除这个标签吗？删除后关联的文章将失去此标签。')) return

		try {
			const { error } = await supabase.from('tags').delete().eq('id', tagId)

			if (error) throw error

			// 重新获取数据
			await fetchTags()
		} catch (error) {
			console.error('删除标签失败:', error)
			alert('删除标签失败: ' + (error as Error).message)
		}
	}

	const handleCancel = () => {
		setFormData({
			name: '',
			slug: ''
		})
		setEditingTag(null)
		setShowForm(false)
	}

	if (loading) {
		return <div className="text-center py-8">加载中...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">标签管理</h1>
				<button
					onClick={() => {
						setFormData({
							name: '',
							slug: ''
						})
						setEditingTag(null)
						setShowForm(true)
					}}
					className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
				>
					新增标签
				</button>
			</div>

			{showForm && (
				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">
						{editingTag ? '编辑标签' : '新增标签'}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">名称</label>
							<input
								type="text"
								name="name"
								value={formData.name}
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

						<div className="flex space-x-2">
							<button
								type="submit"
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
							>
								{editingTag ? '更新' : '创建'}
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
							<th className="py-3 px-4 text-left">名称</th>
							<th className="py-3 px-4 text-left">Slug</th>
							<th className="py-3 px-4 text-right">操作</th>
						</tr>
					</thead>
					<tbody>
						{tags.map((tag) => (
							<tr
								key={tag.id}
								className="border-b border-gray-700 hover:bg-gray-750"
							>
								<td className="py-3 px-4">{tag.name}</td>
								<td className="py-3 px-4">{tag.slug}</td>
								<td className="py-3 px-4 text-right">
									<button
										onClick={() => handleEdit(tag)}
										className="text-blue-400 hover:text-blue-300 mr-3"
									>
										编辑
									</button>
									<button
										onClick={() => handleDelete(tag.id)}
										className="text-red-400 hover:text-red-300"
									>
										删除
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{tags.length === 0 && (
					<div className="text-center py-8 text-gray-400">暂无标签</div>
				)}
			</div>
		</div>
	)
}
