const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// CONFIGURE THESE
const CLOUD_NAME = 'YOUR_CLOUD_NAME';
const API_KEY = 'YOUR_API_KEY';
const API_SECRET = 'YOUR_API_SECRET';

// Path to your local storage public folder
const STORAGE_PATH = path.join(__dirname, '../langal-backend/storage/app/public');

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const sqlFile = path.join(__dirname, 'update_images.sql');
fs.writeFileSync(sqlFile, '-- SQL to update image URLs\n');

async function uploadFolder(folderName) {
    const folderPath = path.join(STORAGE_PATH, folderName);
    if (!fs.existsSync(folderPath)) {
        console.log(`Folder not found: ${folderName}`);
        return;
    }

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        if (file === '.gitignore') continue;

        const filePath = path.join(folderPath, file);
        const relativePath = `${folderName}/${file}`;

        console.log(`Uploading ${relativePath}...`);

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: `langal/${folderName}`,
                public_id: path.parse(file).name,
                use_filename: true,
                unique_filename: false,
                resource_type: "auto"
            });

            const newUrl = result.secure_url;

            // Generate SQL updates
            // We replace both relative path and localhost URL just in case
            const sql = `
-- Update for ${relativePath}
UPDATE user_profiles SET profile_photo_url = REPLACE(profile_photo_url, '${relativePath}', '${newUrl}');
UPDATE user_profiles SET profile_photo_url = REPLACE(profile_photo_url, 'http://localhost:8000/storage/${relativePath}', '${newUrl}');

UPDATE user_profiles SET nid_photo_url = REPLACE(nid_photo_url, '${relativePath}', '${newUrl}');
UPDATE user_profiles SET nid_photo_url = REPLACE(nid_photo_url, 'http://localhost:8000/storage/${relativePath}', '${newUrl}');

UPDATE marketplace_listings SET images = REPLACE(images, '${relativePath}', '${newUrl}');
UPDATE marketplace_listings SET images = REPLACE(images, 'http://localhost:8000/storage/${relativePath}', '${newUrl}');

UPDATE posts SET images = REPLACE(images, '${relativePath}', '${newUrl}');
UPDATE posts SET images = REPLACE(images, 'http://localhost:8000/storage/${relativePath}', '${newUrl}');
`;
            fs.appendFileSync(sqlFile, sql);

        } catch (error) {
            console.error(`Failed to upload ${relativePath}:`, error.message);
        }
    }
}

async function main() {
    console.log('Starting upload...');

    const folders = ['marketplace', 'profile_photos', 'nid_photos', 'posts'];

    for (const folder of folders) {
        await uploadFolder(folder);
    }

    console.log('Done! Check update_images.sql');
}

main();
