import Link from 'next/link';
import { listAllTags } from '@/lib/taxonomy';

const SideBySideTaxonomy = async () => {
    const [categories, tags] = await Promise.all([
        listAllCategories(),
        listAllTags()
    ]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1 min-w-0">
                {tags.length > 0 && (
                    <div className="mb-6">
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