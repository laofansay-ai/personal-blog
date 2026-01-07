'use client';

import { useState } from 'react';

interface PosterGalleryWithLightboxProps {
    posters: string[];
}

const PosterGalleryWithLightbox = ({ posters }: PosterGalleryWithLightboxProps) => {
    const [selectedImage, setSelectedImage] = useState < string | null > (null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setSelectedImage(posters[index]);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const goToPrevious = () => {
        if (selectedImage) {
            const prevIndex = (currentIndex - 1 + posters.length) % posters.length;
            setCurrentIndex(prevIndex);
            setSelectedImage(posters[prevIndex]);
        }
    };

    const goToNext = () => {
        if (selectedImage) {
            const nextIndex = (currentIndex + 1) % posters.length;
            setCurrentIndex(nextIndex);
            setSelectedImage(posters[nextIndex]);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeLightbox();
        }
    };

    if (!posters || posters.length === 0) {
        return null;
    }

    return (
        <>
            <div className="mt-6 flex flex-col items-center">
                <div className="text-sm text-cyan-300 mb-3">封面</div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {posters.map((poster, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 cursor-pointer transform transition-transform hover:scale-105"
                            onClick={() => openLightbox(index)}
                        >
                            <img
                                src={poster}
                                alt={`海报 ${index + 1}`}
                                className="max-w-xs h-auto rounded-lg border border-cyan-500/50 shadow-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleOverlayClick}
                >
                    <div className="relative max-w-6xl max-h-[90vh]">
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/70"
                            onClick={closeLightbox}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/70"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            aria-label="Previous"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/70"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            aria-label="Next"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <img
                            src={selectedImage}
                            alt={`海报 ${currentIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain"
                        />

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 rounded px-3 py-1">
                            {currentIndex + 1} / {posters.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PosterGalleryWithLightbox;