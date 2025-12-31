'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/lib/posts'
import { supabase } from '@/lib/supabaseClient'

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		slug: ''
	})

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

	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			await fetchCategories()
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
			if (editingCategory) {
				// 更新分类
				const { error: updateError } = await supabase
					.from('categories')
					.update({
						name: formData.name,
						slug: formData.slug
					})
					.eq('id', editingCategory.id)

				if (updateError) throw updateError
			} else {
				// 创建新分类
				const { error: insertError } = await supabase
					.from('categories')
					.insert({
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
			setEditingCategory(null)
			setShowForm(false)

			// 重新获取数据
			await fetchCategories()
		} catch (error) {
			console.error('保存分类失败:', error)
			alert('保存分类失败: ' + (error as Error).message)
		}
	}

	const handleEdit = (category: Category) => {
		setEditingCategory(category)
		setFormData({
			name: category.name,
			slug: category.slug
		})
		setShowForm(true)
	}

	const handleDelete = async (categoryId: string) => {
		if (!confirm('确定要删除这个分类吗？删除后关联的文章将变为无分类状态。'))
			return

		try {
			const { error } = await supabase
				.from('categories')
				.delete()
				.eq('id', categoryId)

			if (error) throw error

			// 重新获取数据
			await fetchCategories()
		} catch (error) {
			console.error('删除分类失败:', error)
			alert('删除分类失败: ' + (error as Error).message)
		}
	}

	const handleCancel = () => {
		setFormData({
			name: '',
			slug: ''
		})
		setEditingCategory(null)
		setShowForm(false)
	}

	if (loading) {
		return <div className="text-center py-8">加载中...</div>
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">分类管理</h1>
				<button
					onClick={() => {
						setFormData({
							name: '',
							slug: ''
						})
						setEditingCategory(null)
						setShowForm(true)
					}}
					className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
				>
					新增分类
				</button>
			</div>

			{showForm && (
				<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
					<h2 className="text-xl font-semibold mb-4">
						{editingCategory ? '编辑分类' : '新增分类'}
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
								{editingCategory ? '更新' : '创建'}
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
						{categories.map((category) => (
							<tr
								key={category.id}
								className="border-b border-gray-700 hover:bg-gray-750"
							>
								<td className="py-3 px-4">{category.name}</td>
								<td className="py-3 px-4">{category.slug}</td>
								<td className="py-3 px-4 text-right">
									<button
										onClick={() => handleEdit(category)}
										className="text-blue-400 hover:text-blue-300 mr-3"
									>
										编辑
									</button>
									<button
										onClick={() => handleDelete(category.id)}
										className="text-red-400 hover:text-red-300"
									>
										删除
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{categories.length === 0 && (
					<div className="text-center py-8 text-gray-400">暂无分类</div>
				)}
			</div>
		</div>
	)
}
