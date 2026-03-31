'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface CloudinaryUploadProps {
    onUpload: (url: string) => void;
    folder?: string;
    multiple?: boolean;
    maxFiles?: number;
    className?: string;
    children?: React.ReactNode;
}

const CloudinaryUpload = ({
    onUpload,
    folder = 'blog_posters',
    multiple = false,
    maxFiles = 10,
    className = '',
    children
}: CloudinaryUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState < string[] > ([]);
    const fileInputRef = useRef < HTMLInputElement > (null);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            // Limit number of files if multiple is enabled
            const filesToUpload = multiple ?
                Array.from(files).slice(0, maxFiles) :
                [files[0]];

            for (const file of filesToUpload) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select only image files');
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // You'll need to set this in your env
                if (folder) {
                    formData.append('folder', folder);
                }

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    const secureUrl = data.secure_url;
                    setUploadedUrls(prev => [...prev, secureUrl]);
                    onUpload(secureUrl);
                } else {
                    console.error('Upload failed:', data);
                    alert(`Upload failed: ${data.error?.message || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`cloudinary-upload ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
                multiple={multiple}
            />

            <button
                type="button"
                onClick={triggerFileSelect}
                disabled={uploading}
                className="flex items-center justify-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded disabled:opacity-50"
            >
                {uploading ? '上传中...' : children || '上传图片'}
            </button>

            {uploading && (
                <div className="mt-2 text-cyan-400">正在上传...</div>
            )}

            {uploadedUrls.length > 0 && (
                <div className="mt-2 text-sm text-cyan-300">
                    已上传 {uploadedUrls.length} 张图片
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;