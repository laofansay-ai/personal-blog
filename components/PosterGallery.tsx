'use client';

import { useState, useEffect } from 'react';

interface PosterGalleryProps {
    posters: string[];
}

const PosterGallery = ({ posters }: PosterGalleryProps) => {
    const [loadedImages, setLoadedImages] = useState < Record < number, boolean>> ({});

    useEffect(() => {
        // Initialize loaded state for all posters
        const initialLoadedState = posters.reduce((acc, _, index) => {
            acc[index] = true; // Assume loaded initially
            return acc;
        }, {} as Record<number, boolean>);
        setLoadedImages(initialLoadedState);
    }, [posters]);

    const handleImageError = (index: number) => {
        setLoadedImages(prev => ({
            ...prev,
            [index]: false
        }));
    };

    if (!posters || posters.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col items-center">
            <div className="text-sm text-cyan-300 mb-3">文章海报</div>
            <div className="flex flex-wrap gap-4 justify-center">
                {posters.map((poster, index) => (
                    <div key={index} className="flex-shrink-0">
                        {loadedImages[index] ? (
                            <img
                                src={poster}
                                alt={`海报 ${index + 1}`}
                                className="max-w-xs h-auto rounded-lg border border-cyan-500/50 shadow-lg"
                                onError={() => handleImageError(index)}
                            />
                        ) : (
                            <div className="w-48 h-32 flex items-center justify-center bg-gray-700 rounded-lg border border-cyan-500/50">
                                <span className="text-gray-400">图片加载失败</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PosterGallery;