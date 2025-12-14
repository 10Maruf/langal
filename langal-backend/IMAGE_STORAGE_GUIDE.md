# Image Storage Setup & Usage Guide

## 📁 ইমেজ কোথায় থাকবে?

### Backend (Laravel)

```
langal-backend/
├── storage/
│   └── app/
│       └── public/           # Private storage
│           └── marketplace/  # ← ইউজার আপলোড ইমেজ এখানে
│               ├── uuid1.jpg
│               ├── uuid2.png
│               └── ...
└── public/
    └── storage/              # ← Symlink (storage/app/public এর লিংক)
        └── marketplace/      # Public URL access
```

### Frontend (React/Vite)

```
src/
└── assets/
    └── marketplace/  # ← Dummy/প্লেসহোল্ডার ইমেজ (development)
        ├── tractor.png
        ├── rice-seed.png
        └── ...
```

---

## 🔧 সেটআপ স্টেপস

### 1️⃣ Storage Symlink তৈরি করুন

Laravel storage থেকে public folder এ লিংক তৈরি:

```powershell
cd langal-backend
php artisan storage:link
```

এটা `public/storage` → `storage/app/public` এর symlink তৈরি করবে।

### 2️⃣ Filesystem Config চেক করুন

`config/filesystems.php` এ নিচের কনফিগ থাকা উচিত:

```php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
],
```

### 3️⃣ .env এ APP_URL সেট করুন

```
APP_URL=http://localhost:8000
```

---

## 🚀 ইমেজ আপলোড API Usage

### নতুন API Endpoints

```
POST   /api/images/marketplace        # Upload images
DELETE /api/images/marketplace        # Delete image
GET    /api/images/marketplace/{id}   # Get listing images
```

### Example: Upload Images

**Request (Multipart Form Data):**

```javascript
const formData = new FormData();
formData.append("images", file1);
formData.append("images", file2);

const response = await fetch("http://localhost:8000/api/images/marketplace", {
    method: "POST",
    body: formData,
});

const result = await response.json();
```

**Response:**

```json
{
    "success": true,
    "message": "Images uploaded successfully",
    "data": [
        {
            "path": "marketplace/550e8400-e29b-41d4-a716-446655440000.jpg",
            "url": "/storage/marketplace/550e8400-e29b-41d4-a716-446655440000.jpg",
            "full_url": "http://localhost:8000/storage/marketplace/550e8400-e29b-41d4-a716-446655440000.jpg"
        }
    ]
}
```

### Example: Create Listing with Images

**প্রথমে ইমেজ আপলোড করুন, তারপর listing তৈরি করুন:**

```javascript
// Step 1: Upload images
const uploadRes = await fetch("/api/images/marketplace", {
    method: "POST",
    body: formData,
});
const { data: uploadedImages } = await uploadRes.json();

// Step 2: Create listing with image paths
const imagePaths = uploadedImages.map((img) => img.path);

const listingRes = await fetch("/api/marketplace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        seller_id: 1,
        title: "ট্রাক্টর ভাড়া",
        description: "৭৫ এইচপি ট্রাক্টর",
        price: 2500,
        images: imagePaths, // ← এখানে paths পাঠান
        // ... other fields
    }),
});
```

---

## 🎨 Frontend React Component Example

### ImageUpload Component

```tsx
// src/components/marketplace/ImageUpload.tsx
import { useState } from "react";

interface UploadedImage {
    path: string;
    url: string;
    full_url: string;
}

export function ImageUpload({
    onUploadComplete,
}: {
    onUploadComplete: (images: UploadedImage[]) => void;
}) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        Array.from(files).forEach((file) => {
            formData.append("images", file);
        });

        try {
            const res = await fetch(
                "http://localhost:8000/api/images/marketplace",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await res.json();

            if (result.success) {
                onUploadComplete(result.data);
            } else {
                alert("আপলোড ব্যর্থ: " + result.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("ইমেজ আপলোডে সমস্যা হয়েছে");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="btn btn-primary">
                {uploading ? "আপলোড হচ্ছে..." : "ইমেজ নির্বাচন করুন"}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
        </div>
    );
}
```

### Usage in Listing Form:

```tsx
const [uploadedImages, setUploadedImages] = useState<string[]>([]);

<ImageUpload
    onUploadComplete={(images) => {
        const paths = images.map((img) => img.path);
        setUploadedImages((prev) => [...prev, ...paths]);
    }}
/>;

// When submitting listing:
const listingData = {
    // ... other fields
    images: uploadedImages,
};
```

---

## 🗄️ Database Schema

ডাটাবেসে `marketplace_listings` টেবিলে images কলাম JSON array হিসেবে থাকবে:

```sql
-- Example data
{
  "title": "পাওয়ার টিলার",
  "images": [
    "marketplace/550e8400-e29b-41d4-a716-446655440000.jpg",
    "marketplace/660e9500-f30c-52e5-b827-557766551111.png"
  ]
}
```

Laravel Eloquent automatically JSON encode/decode করবে কারণ model এ cast করা আছে:

```php
protected $casts = [
    'images' => 'array',
];
```

---

## 🛡️ Security Features

### 1. File Validation

-   Max size: 5MB per image
-   Allowed types: jpeg, png, jpg, webp
-   Frontend validation + Backend validation both

### 2. Unique Filenames

-   UUID ব্যবহার করে collision avoid
-   Original filename expose না হওয়া

### 3. Storage Isolation

-   User uploads আলাদা folder এ
-   Application code থেকে আলাদা

### 4. Delete Protection

-   Path validation (শুধু marketplace/ folder)
-   Unauthorized access prevent

---

## 🔍 Troubleshooting

### ❌ Images না দেখালে

**Check 1: Symlink আছে কি?**

```powershell
php artisan storage:link
```

**Check 2: Storage folder permissions (Linux/Mac)**

```bash
chmod -R 775 storage
chown -R www-data:www-data storage
```

**Check 3: .env এ APP_URL ঠিক আছে?**

```
APP_URL=http://localhost:8000
```

**Check 4: Browser console এ URL ঠিক আসছে?**

```
http://localhost:8000/storage/marketplace/xxxxx.jpg
```

### ❌ Upload failing

-   PHP upload limits চেক করুন (`php.ini`):

    ```ini
    upload_max_filesize = 10M
    post_max_size = 10M
    ```

-   Laravel logs দেখুন:
    ```powershell
    tail -f storage/logs/laravel.log
    ```

---

## 🎯 Production Considerations

### CloudFlare R2 / AWS S3 Integration (পরে)

```php
// config/filesystems.php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
],
```

### Image Optimization

-   Install Intervention Image package
-   Auto-resize/compress on upload
-   Generate thumbnails

### CDN Setup

-   CloudFlare CDN
-   Laravel Mix asset versioning

---

## ✅ সারাংশ

| Feature        | Location                                              |
| -------------- | ----------------------------------------------------- |
| Upload API     | `/api/images/marketplace`                             |
| Storage Path   | `storage/app/public/marketplace/`                     |
| Public URL     | `http://localhost:8000/storage/marketplace/xxxxx.jpg` |
| Database Field | `images` column (JSON array)                          |
| Max File Size  | 5MB per image                                         |
| Allowed Types  | jpeg, png, jpg, webp                                  |

এখন আপনার marketplace listing এ ইউজাররা সরাসরি ইমেজ আপলোড করতে পারবে! 🎉
