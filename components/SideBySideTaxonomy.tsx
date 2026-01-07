import Link from 'next/link';
import { listAllCategories, listAllTags } from '@/lib/taxonomy';

const SideBySideTaxonomy = async () => {
    const [categories, tags] = await Promise.all([
        listAllCategories(),
        listAllTags()
    ]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1 min-w-0">
                {categories.length > 0 && (
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
                )}
            </div>
            <div className="flex-1 min-w-0">
                {tags.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-3">文章标签</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.slug}
                                    href={`/view/tags/${tag.slug}`}
                                    className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-500/30 transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBySideTaxonomy;