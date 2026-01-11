<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SocialFeedReportController extends Controller
{
    /**
     * Get all social feed reports (posts and comments)
     */
    public function getAllReports()
    {
        try {
            // Get post reports with details
            $postReports = DB::table('post_reports as pr')
                ->join('posts as p', 'pr.post_id', '=', 'p.post_id')
                ->join('users as reporter', 'pr.user_id', '=', 'reporter.user_id')
                ->leftJoin('user_profiles as reporter_profile', 'reporter.user_id', '=', 'reporter_profile.user_id')
                ->join('users as author', 'p.author_id', '=', 'author.user_id')
                ->leftJoin('user_profiles as author_profile', 'author.user_id', '=', 'author_profile.user_id')
                ->select(
                    DB::raw("CONCAT('post_', pr.report_id) as id"),
                    DB::raw("'post' as reportType"),
                    'pr.post_id as contentId',
                    'reporter.user_id as reporter_id',
                    'reporter_profile.full_name as reporter_name',
                    'reporter_profile.profile_photo_url as reporter_avatar',
                    'reporter.user_type as reporter_user_type',
                    'pr.report_reason as reason',
                    'pr.created_at as reportedAt',
                    DB::raw("COALESCE(pr.status, 'pending') as status"),
                    'pr.reviewed_by as reviewedBy',
                    'pr.reviewed_at as reviewedAt',
                    'p.content as content_text',
                    'author_profile.full_name as author_name',
                    'author_profile.profile_photo_url as author_avatar',
                    'author_profile.address as author_location',
                    'author.is_verified as author_verified',
                    'author.user_type as author_user_type',
                    'p.created_at as content_postedAt',
                    'p.images as content_images'
                )
                ->get();

            // Get comment reports with details
            $commentReports = DB::table('comment_reports as cr')
                ->join('comments as c', 'cr.comment_id', '=', 'c.comment_id')
                ->join('posts as p', 'c.post_id', '=', 'p.post_id')
                ->join('users as reporter', 'cr.user_id', '=', 'reporter.user_id')
                ->leftJoin('user_profiles as reporter_profile', 'reporter.user_id', '=', 'reporter_profile.user_id')
                ->join('users as author', 'c.author_id', '=', 'author.user_id')
                ->leftJoin('user_profiles as author_profile', 'author.user_id', '=', 'author_profile.user_id')
                ->select(
                    DB::raw("CONCAT('comment_', cr.report_id) as id"),
                    DB::raw("'comment' as reportType"),
                    'cr.comment_id as contentId',
                    'c.post_id as postId',
                    'reporter.user_id as reporter_id',
                    'reporter_profile.full_name as reporter_name',
                    'reporter_profile.profile_photo_url as reporter_avatar',
                    'reporter.user_type as reporter_user_type',
                    'cr.report_reason as reason',
                    'cr.created_at as reportedAt',
                    DB::raw("COALESCE(cr.status, 'pending') as status"),
                    'cr.reviewed_by as reviewedBy',
                    'cr.reviewed_at as reviewedAt',
                    'c.content as content_text',
                    'author_profile.full_name as author_name',
                    'author_profile.profile_photo_url as author_avatar',
                    'author_profile.address as author_location',
                    'author.is_verified as author_verified',
                    'author.user_type as author_user_type',
                    'c.created_at as content_postedAt',
                    DB::raw("NULL as content_images")
                )
                ->get();

            // Merge and format reports
            $allReports = collect($postReports)->concat($commentReports)->map(function($report) {
                return [
                    'id' => $report->id,
                    'reportType' => $report->reportType,
                    'contentId' => (string)$report->contentId,
                    'postId' => isset($report->postId) ? (string)$report->postId : null,
                    'reportedBy' => [
                        'id' => (string)$report->reporter_id,
                        'name' => $report->reporter_name,
                        'avatar' => $this->getFullImageUrl($report->reporter_avatar),
                        'userType' => $report->reporter_user_type
                    ],
                    'reason' => [
                        'id' => $report->reason ?? 'other',
                        'label' => $this->getReasonLabel($report->reason, $report->reportType),
                        'description' => $this->getReasonDescription($report->reason, $report->reportType)
                    ],
                    'reportedAt' => Carbon::parse($report->reportedAt)->toISOString(),
                    'status' => $report->status,
                    'reviewedBy' => $report->reviewedBy,
                    'reviewedAt' => $report->reviewedAt ? Carbon::parse($report->reviewedAt)->toISOString() : null,
                    'content' => [
                        'text' => $report->content_text,
                        'author' => [
                            'name' => $report->author_name,
                            'avatar' => $this->getFullImageUrl($report->author_avatar),
                            'location' => $report->author_location,
                            'verified' => (bool)$report->author_verified,
                            'userType' => $report->author_user_type,
                            'isExpert' => $report->author_user_type === 'expert'
                        ],
                        'postedAt' => Carbon::parse($report->content_postedAt)->toISOString(),
                        'images' => $report->content_images ? $this->formatImageUrls(json_decode($report->content_images)) : []
                    ]
                ];
            })->sortByDesc('reportedAt')->values();

            return response()->json($allReports);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch reports',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get report statistics
     */
    public function getReportStats()
    {
        try {
            $postReportsTotal = DB::table('post_reports')->count();
            $commentReportsTotal = DB::table('comment_reports')->count();
            
            $postReportsPending = DB::table('post_reports')
                ->where('status', 'pending')
                ->orWhereNull('status')
                ->count();
            
            $commentReportsPending = DB::table('comment_reports')
                ->where('status', 'pending')
                ->orWhereNull('status')
                ->count();
            
            $postReportsAccepted = DB::table('post_reports')
                ->where('status', 'accepted')
                ->count();
            
            $commentReportsAccepted = DB::table('comment_reports')
                ->where('status', 'accepted')
                ->count();
            
            $postReportsDeclined = DB::table('post_reports')
                ->where('status', 'declined')
                ->count();
            
            $commentReportsDeclined = DB::table('comment_reports')
                ->where('status', 'declined')
                ->count();

            $stats = [
                'totalReports' => $postReportsTotal + $commentReportsTotal,
                'pendingReports' => $postReportsPending + $commentReportsPending,
                'acceptedReports' => $postReportsAccepted + $commentReportsAccepted,
                'declinedReports' => $postReportsDeclined + $commentReportsDeclined,
                'postReports' => $postReportsTotal,
                'commentReports' => $commentReportsTotal
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Accept a report
     */
    public function acceptReport(Request $request, $reportId)
    {
        try {
            $deleteContent = $request->input('deleteContent', true);
            $adminNote = $request->input('adminNote', '');
            
            // Parse report ID to determine type
            $parts = explode('_', $reportId);
            $type = $parts[0]; // 'post' or 'comment'
            $id = $parts[1];

            if ($type === 'post') {
                // Update post report status
                DB::table('post_reports')
                    ->where('report_id', $id)
                    ->update([
                        'status' => 'accepted',
                        'reviewed_at' => now(),
                        'admin_note' => $adminNote
                    ]);

                // Delete post if requested
                if ($deleteContent) {
                    DB::table('posts')
                        ->where('post_id', DB::table('post_reports')->where('report_id', $id)->value('post_id'))
                        ->update(['is_deleted' => 1]);
                }
            } else {
                // Update comment report status
                DB::table('comment_reports')
                    ->where('report_id', $id)
                    ->update([
                        'status' => 'accepted',
                        'reviewed_at' => now(),
                        'admin_note' => $adminNote
                    ]);

                // Delete comment if requested
                if ($deleteContent) {
                    DB::table('comments')
                        ->where('comment_id', DB::table('comment_reports')->where('report_id', $id)->value('comment_id'))
                        ->update(['is_deleted' => 1]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Report accepted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to accept report',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Decline a report
     */
    public function declineReport(Request $request, $reportId)
    {
        try {
            $adminNote = $request->input('adminNote', '');
            
            // Parse report ID to determine type
            $parts = explode('_', $reportId);
            $type = $parts[0]; // 'post' or 'comment'
            $id = $parts[1];

            if ($type === 'post') {
                DB::table('post_reports')
                    ->where('report_id', $id)
                    ->update([
                        'status' => 'declined',
                        'reviewed_at' => now(),
                        'admin_note' => $adminNote
                    ]);
            } else {
                DB::table('comment_reports')
                    ->where('report_id', $id)
                    ->update([
                        'status' => 'declined',
                        'reviewed_at' => now(),
                        'admin_note' => $adminNote
                    ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Report declined successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to decline report',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper function to get reason label
     */
    private function getReasonLabel($reasonId, $type)
    {
        $postReasons = [
            'spam' => 'স্প্যাম',
            'inappropriate' => 'অনুপযুক্ত',
            'false_info' => 'মিথ্যা তথ্য',
            'harassment' => 'হয়রানি',
            'copyright' => 'কপিরাইট লঙ্ঘন',
            'other' => 'অন্যান্য'
        ];

        $commentReasons = [
            'spam' => 'স্প্যাম',
            'inappropriate' => 'অনুপযুক্ত',
            'harassment' => 'হয়রানি',
            'false_advice' => 'ভুল পরামর্শ',
            'other' => 'অন্যান্য'
        ];

        $reasons = $type === 'post' ? $postReasons : $commentReasons;
        return $reasons[$reasonId] ?? 'অন্যান্য';
    }

    /**
     * Helper function to get reason description
     */
    private function getReasonDescription($reasonId, $type)
    {
        $postReasons = [
            'spam' => 'অবাঞ্ছিত বা পুনরাবৃত্তিমূলক বিষয়বস্তু',
            'inappropriate' => 'অশ্লীল বা আক্রমণাত্মক বিষয়বস্তু',
            'false_info' => 'ভুল বা বিভ্রান্তিকর কৃষি তথ্য',
            'harassment' => 'অন্য ব্যবহারকারীকে হয়রানি করা',
            'copyright' => 'অন্যের বুদ্ধিবৃত্তিক সম্পদ চুরি',
            'other' => 'অন্য কোনো সমস্যা'
        ];

        $commentReasons = [
            'spam' => 'অবাঞ্ছিত মন্তব্য',
            'inappropriate' => 'অশ্লীল বা আক্রমণাত্মক মন্তব্য',
            'harassment' => 'অন্য ব্যবহারকারীকে হয়রানি',
            'false_advice' => 'ক্ষতিকর বা ভুল কৃষি পরামর্শ',
            'other' => 'অন্য কোনো সমস্যা'
        ];

        $reasons = $type === 'post' ? $postReasons : $commentReasons;
        return $reasons[$reasonId] ?? 'অন্য কোনো সমস্যা';
    }

    /**
     * Helper function to get full image URL from Azure Blob Storage
     */
    private function getFullImageUrl($imagePath)
    {
        if (empty($imagePath)) {
            return null;
        }

        // If already a full URL, return as is
        if (str_starts_with($imagePath, 'http://') || str_starts_with($imagePath, 'https://')) {
            return $imagePath;
        }

        // Build Azure Blob Storage URL
        $azureStorageUrl = env('AZURE_STORAGE_URL', 'https://langal.blob.core.windows.net/public');
        return rtrim($azureStorageUrl, '/') . '/' . ltrim($imagePath, '/');
    }

    /**
     * Helper function to format array of image URLs
     */
    private function formatImageUrls($images)
    {
        if (empty($images) || !is_array($images)) {
            return [];
        }

        return array_map(function($image) {
            return $this->getFullImageUrl($image);
        }, $images);
    }
}
