# Image Migration Guide

Since Railway does not keep local files (they are deleted on every deploy), you need to move your images to a cloud storage like Cloudinary.

## Steps

1.  **Sign up for Cloudinary** (Free tier is enough).
2.  Get your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
3.  Open `scripts/upload_images.js` and replace the placeholders with your credentials.
4.  Open a terminal in this folder (`scripts`) and run:
    ```bash
    npm install cloudinary
    node upload_images.js
    ```
5.  This will upload all your local images to Cloudinary and generate a file named `update_images.sql`.
6.  Run the SQL commands in `update_images.sql` on your Railway database (using a database client or phpMyAdmin if available, or via `mysql` command line).

## For New Uploads

You also need to configure your Laravel backend to upload new images to Cloudinary directly.

1.  Install the package: `composer require cloudinary-labs/cloudinary-laravel`
2.  Add `FILESYSTEM_DISK=cloudinary` to your Railway variables.
3.  Add `CLOUDINARY_URL=...` to your Railway variables.
