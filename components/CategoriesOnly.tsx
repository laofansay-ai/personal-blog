import Link from 'next/link';
import { listAllCategories } from '@/lib/taxonomy';

const CategoriesOnly = async () => {
    const categories = await listAllCategories();

    return (
        <div className="sticky top-24">
            {categories.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">文章分类</h3>
                    <div className="space-y-2 sm:grid-cols-1 sm:grid">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/view/categories/${category.slug}`}
                                className="block w-full text-left rounded-lg border border-cyan-500/40 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10 transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesOnly;