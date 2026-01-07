import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get asset paths that work both locally and on GitHub Pages
export function getAssetPath(path: string) {
  const basePath = "";
  return `${basePath}${path}`;
}

// Azure storage URL
const AZURE_STORAGE_URL = 'https://langal.blob.core.windows.net/public';

/**
 * Convert any image URL to proper Azure URL
 * Handles localhost URLs, Railway backend URLs, and relative paths
 * Works for profile photos, marketplace images, post images, etc.
 */
export function getAzureImageUrl(imagePath: string | undefined | null): string | undefined {
  if (!imagePath) return undefined;
  
  // If it's a localhost or Railway backend URL, convert to Azure URL
  if (imagePath.includes('localhost') || imagePath.includes('127.0.0.1') || imagePath.includes('railway.app')) {
    try {
      const url = new URL(imagePath);
      let path = url.pathname;
      // Remove leading /storage/ if present
      path = path.replace(/^\/storage\//, '');
      // Remove leading slash
      path = path.replace(/^\//, '');
      return `${AZURE_STORAGE_URL}/${path}`;
    } catch {
      // If URL parsing fails, try simple string replacement
      const pathMatch = imagePath.match(/\/storage\/(.+)$/);
      if (pathMatch) {
        return `${AZURE_STORAGE_URL}/${pathMatch[1]}`;
      }
    }
  }
  
  // If already a full Azure/HTTPS URL, return as is
  if (imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's just a path (e.g., profile_photos/xxx.jpg or marketplace/xxx.jpg), prepend Azure URL
  if (!imagePath.startsWith('http')) {
    return `${AZURE_STORAGE_URL}/${imagePath.replace(/^\//, '')}`;
  }
  
  // Return as-is for other cases
  return imagePath;
}

// Aliases for backward compatibility
export const getProfilePhotoUrl = getAzureImageUrl;
export const getImageUrl = getAzureImageUrl;
