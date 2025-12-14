import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface UploadedImage {
    path: string;
    url: string;
    full_url: string;
}

interface ImageUploadProps {
    onUploadComplete: (images: UploadedImage[]) => void;
    maxImages?: number;
    existingImages?: string[];
}

export function MarketplaceImageUpload({
    onUploadComplete,
    maxImages = 5,
    existingImages = []
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>(existingImages);
    const [uploadedPaths, setUploadedPaths] = useState<string[]>(existingImages);

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check max limit
        if (previewImages.length + files.length > maxImages) {
            alert(`সর্বোচ্চ ${maxImages}টি ইমেজ আপলোড করতে পারবেন`);
            return;
        }

        setUploading(true);
        const formData = new FormData();

        Array.from(files).forEach(file => {
            formData.append('images', file);
        });

        try {
            const res = await fetch(`${API_BASE}/images/marketplace`, {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (result.success && result.data) {
                const newImages = result.data as UploadedImage[];
                const newPreviews = newImages.map(img => img.full_url);
                const newPaths = newImages.map(img => img.path);

                setPreviewImages(prev => [...prev, ...newPreviews]);
                setUploadedPaths(prev => [...prev, ...newPaths]);

                onUploadComplete(newImages);
            } else {
                alert('আপলোড ব্যর্থ: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('ইমেজ আপলোডে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemoveImage = async (index: number) => {
        const pathToRemove = uploadedPaths[index];

        // Remove from UI immediately
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setUploadedPaths(prev => prev.filter((_, i) => i !== index));

        // Try to delete from server (optional, might fail silently)
        try {
            await fetch(`${API_BASE}/images/marketplace`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: pathToRemove }),
            });
        } catch (error) {
            console.warn('Failed to delete image from server:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <label className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                    ${uploading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                    transition-colors
                `}>
                    <Upload className="w-5 h-5" />
                    <span>
                        {uploading ? 'আপলোড হচ্ছে...' : 'ইমেজ নির্বাচন করুন'}
                    </span>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading || previewImages.length >= maxImages}
                        className="hidden"
                    />
                </label>

                <span className="text-sm text-gray-600">
                    {previewImages.length} / {maxImages} ইমেজ
                </span>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {previewImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={imageUrl}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        e.currentTarget.src = '/placeholder.svg';
                                    }}
                                />
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                                         opacity-0 group-hover:opacity-100 transition-opacity
                                         hover:bg-red-600"
                                title="মুছে ফেলুন"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* First image badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                                    প্রধান ইমেজ
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {previewImages.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">
                        এখনো কোনো ইমেজ নির্বাচন করা হয়নি
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        JPEG, PNG, JPG, WebP (সর্বোচ্চ 5MB প্রতিটি)
                    </p>
                </div>
            )}

            {/* Upload tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-blue-800 mb-1">📌 টিপস:</p>
                <ul className="text-blue-700 space-y-1 ml-4 list-disc">
                    <li>প্রথম ইমেজটি প্রধান ইমেজ হিসেবে দেখানো হবে</li>
                    <li>পরিষ্কার এবং উজ্জ্বল ইমেজ ব্যবহার করুন</li>
                    <li>একাধিক কোণ থেকে ছবি তুলুন</li>
                </ul>
            </div>
        </div>
    );
}

export default MarketplaceImageUpload;
