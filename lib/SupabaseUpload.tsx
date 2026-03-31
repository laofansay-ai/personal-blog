'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

interface SupabaseUploadProps {
    onUpload: (url: string) => void;
    bucket?: string;
    folder?: string;
    multiple?: boolean;
    maxFiles?: number;
    className?: string;
    children?: React.ReactNode;
}

const SupabaseUpload = ({
    onUpload,
    bucket = 'posters',
    folder = 'blog_posters',
    multiple = false,
    maxFiles = 10,
    className = '',
    children
}: SupabaseUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState < string[] > ([]);
    const fileInputRef = useRef < HTMLInputElement > (null);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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

                // Generate unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = folder ? `${folder}/${fileName}` : fileName;

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error('Upload failed:', error);
                    alert(`Upload failed: ${error.message}`);
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath);

                const publicUrl = urlData.publicUrl;

                setUploadedUrls(prev => [...prev, publicUrl]);
                onUpload(publicUrl);
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
        <div className={`supabase-upload ${className}`}>
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

export default SupabaseUpload;
