import Link from 'next/link';
import { listAllCategories } from '@/lib/taxonomy';

const CategoryList = async () => {
    const categories = await listAllCategories();

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">文章分类</h3>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/view/categories/${category.slug}`}
                        className="rounded-full border border-cyan-500/40 px-3 py-1 text-sm text-cyan-200 hover:bg-cyan-500/10 transition-colors"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;