<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload single or multiple images for marketplace listings
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadMarketplaceImages(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $uploadedPaths = [];

        try {
            $images = $request->file('images');

            // Handle single image upload
            if (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $image) {
                // Generate unique filename
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

                // Store in Azure Blob Storage (or default disk configured in .env)
                $path = $image->storeAs('marketplace', $filename, 'azure');

                // Build Azure URL
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                $fullUrl = sprintf(
                    'https://%s.blob.core.windows.net/%s/%s',
                    $accountName,
                    $container,
                    $path
                );

                // Return Azure URL - store only the path in DB
                $uploadedPaths[] = [
                    'path' => $path,
                    'url' => $fullUrl,
                    'full_url' => $fullUrl,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'data' => $uploadedPaths,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Image upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an image from storage
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteMarketplaceImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $path = $request->input('path');

        // Security: ensure path is within marketplace directory
        if (!str_starts_with($path, 'marketplace/')) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image path',
            ], 400);
        }

        try {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);

                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all images for a specific listing
     *
     * @param int $listingId
     * @return JsonResponse
     */
    public function getListingImages(int $listingId): JsonResponse
    {
        // This would query the database for the listing's images
        // For now, return placeholder response
        return response()->json([
            'success' => true,
            'data' => [],
        ]);
    }

    /**
     * Upload images for social feed posts
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadPostImages(Request $request): JsonResponse
    {
        // Check if any files were uploaded
        if (!$request->hasFile('images')) {
            return response()->json([
                'success' => false,
                'message' => 'No images provided',
                'errors' => ['images' => ['No image files were uploaded']],
            ], 422);
        }

        $uploadedUrls = [];

        try {
            $images = $request->file('images');

            // Handle single image upload
            if (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $image) {
                // Generate unique filename
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

                // Store in Azure Blob Storage
                $path = $image->storeAs('posts', $filename, 'azure');

                // Build Azure URL
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                $fullUrl = sprintf(
                    'https://%s.blob.core.windows.net/%s/%s',
                    $accountName,
                    $container,
                    $path
                );

                // Return Azure URL for frontend use
                $uploadedUrls[] = $fullUrl;
            }

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'urls' => $uploadedUrls,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Image upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
