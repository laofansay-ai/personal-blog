import Link from 'next/link';
import { listAllTags } from '@/lib/taxonomy';

const TagList = async () => {
    const tags = await listAllTags();

    if (tags.length === 0) {
        return null;
    }

    return (
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
    );
};

export default TagList;