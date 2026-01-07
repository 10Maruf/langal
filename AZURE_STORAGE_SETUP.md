# Azure Storage Setup Guide (Images & Documents)

Since you have the **Azure Student Pack**, using Azure Blob Storage is the best solution for your team. This will allow everyone (and the production server) to use the same centralized storage for **images and documents**.

## 1. Azure Portal Setup

1.  Log in to the [Azure Portal](https://portal.azure.com).
2.  Create a **Storage Account**:
    - Search for "Storage accounts" and click **Create**.
    - **Resource Group**: Create a new one (e.g., `langal-resources`).
    - **Storage account name**: Give it a unique name (e.g., `langalstorage`).
    - **Region**: Choose one close to you (e.g., Southeast Asia).
    - **Redundancy**: LRS (Locally-redundant storage) is cheapest and fine for dev.
3.  Create a **Container**:
    - Go to your new Storage Account > **Data storage** > **Containers**.
    - Click **+ Container**.
    - **Name**: `public` (or `langal-files`).
    - **Public access level**: **Blob** (anonymous read access for blobs only). _This is important so files can be viewed publicly._
4.  Get Credentials:
    - Go to **Security + networking** > **Access keys**.
    - Copy **Storage account name** and **Key 1**.

## 2. Backend Setup (Laravel)

### Install the Azure Driver

Run this command in your `langal-backend` folder:

```bash
composer require league/flysystem-azure-blob-storage
```

_(If this fails due to zip extension, enable `extension=zip` in your `php.ini` file first)_

### Configure Environment (.env)

Add these lines to your `.env` file (and your friends' .env files, and Railway variables):

```dotenv
FILESYSTEM_DISK=azure

AZURE_STORAGE_NAME=your_storage_account_name
AZURE_STORAGE_KEY=your_storage_account_key
AZURE_STORAGE_CONTAINER=public
AZURE_STORAGE_URL=https://your_storage_account_name.blob.core.windows.net/public
```

## 3. Migrating Existing Files

Since you have files on your local computer that need to be on Azure:

1.  Download **[Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/)** (Free tool from Microsoft).
2.  Connect to your Azure account.
3.  Open your `public` container.
4.  Drag and drop your local folders (`marketplace`, `profile_photos`, `nid_photos`, etc.) from `langal-backend/storage/app/public/` into the Azure container.

## 4. Database Update

If your database currently stores full URLs (like `http://localhost:8000/storage/...`), you need to update them to point to Azure.

Run this SQL query (replace the URL with your actual Azure URL):

```sql
UPDATE user_profiles
SET profile_photo_url = REPLACE(profile_photo_url, 'http://localhost:8000/storage/', 'https://<your-account>.blob.core.windows.net/public/');

UPDATE marketplace_listings
SET images = REPLACE(images, 'http://localhost:8000/storage/', 'https://<your-account>.blob.core.windows.net/public/');

-- For Expert Certifications (if any)
UPDATE expert_qualifications
SET certification_document = REPLACE(certification_document, 'http://localhost:8000/storage/', 'https://<your-account>.blob.core.windows.net/public/');
```

## 5. How to Upload Documents (Code Example)

We have added a new API endpoint for document uploads: `POST /api/documents/upload`.

**Request:**

- `document`: File (PDF, DOC, DOCX)
- `folder`: (Optional) Folder name like `expert_certifications`, `reports`

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://your-account.blob.core.windows.net/public/expert_certifications/filename.pdf"
  }
}
```

**Frontend Code Example:**

```javascript
const formData = new FormData();
formData.append("document", fileInput.files[0]);
formData.append("folder", "expert_certifications");

const response = await axios.post("/api/documents/upload", formData);
console.log(response.data.data.url);
```
