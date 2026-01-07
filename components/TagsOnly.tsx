import Link from 'next/link';
import { listAllTags } from '@/lib/taxonomy';

const TagsOnly = async () => {
    const tags = await listAllTags();

    return (
        <div className="sticky top-24">
            {tags.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">文章标签</h3>
                    <div className="space-y-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag.slug}
                                href={`/view/tags/${tag.slug}`}
                                className="block w-full rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/30 transition-colors text-right"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagsOnly;