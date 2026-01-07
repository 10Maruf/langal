<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentUploadController extends Controller
{
    /**
     * Upload a document (PDF, DOC, DOCX)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function upload(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
            'folder' => 'nullable|string|in:expert_certifications,nid_documents,reports,others',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $file = $request->file('document');
            $folder = $request->input('folder', 'documents');

            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Store in Azure Blob Storage
            $path = $file->storeAs($folder, $filename, 'azure');

            // Build Azure URL
            $accountName = config('filesystems.disks.azure.name');
            $container = config('filesystems.disks.azure.container');
            $url = sprintf(
                'https://%s.blob.core.windows.net/%s/%s',
                $accountName,
                $container,
                $path
            );

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => [
                    'path' => $path,
                    'url' => $url,
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
