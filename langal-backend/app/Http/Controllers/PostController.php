<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Services\DataOperatorNotificationService;

class PostController extends Controller
{
    // Get all posts (Feed)
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $offset = ($page - 1) * $limit;
        $authorId = $request->query('author_id');

        $query = "
            SELECT
                p.*,
                up.full_name as author_name,
                u.user_type as author_type,
                up.profile_photo_url as author_avatar,
                up.address as author_location,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.post_id) as likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count,
                (SELECT COUNT(*) FROM post_reports WHERE post_id = p.post_id) as reports_count,
                EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.post_id AND user_id = ?) as is_liked,
                EXISTS(SELECT 1 FROM post_reports WHERE post_id = p.post_id AND user_id = ?) as is_reported,
                ml.listing_id as ml_listing_id,
                ml.title as ml_title,
                ml.description as ml_description,
                ml.price as ml_price,
                ml.currency as ml_currency,
                ml.listing_type as ml_listing_type,
                ml.images as ml_images,
                ml.full_location_bn as ml_location,
                mc.category_name as ml_category,
                mc.category_name_bn as ml_category_bn,
                CASE ml.listing_type
                    WHEN 'sell' THEN 'বিক্রয়ের জন্য'
                    WHEN 'rent' THEN 'ভাড়া'
                    WHEN 'buy' THEN 'কিনতে চাই'
                    WHEN 'service' THEN 'সেবা'
                    ELSE ml.listing_type
                END as ml_listing_type_bn
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            LEFT JOIN marketplace_listings ml ON p.marketplace_listing_id = ml.listing_id AND ml.status = 'active'
            LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
            WHERE p.is_deleted = 0
            AND p.approval_status = 'approved'
            AND (
                p.post_type != 'marketplace' 
                OR p.marketplace_listing_id IS NULL 
                OR (p.marketplace_listing_id IS NOT NULL AND ml.listing_id IS NOT NULL AND ml.status = 'active')
            )
        ";

        $params = [$request->user_id ?? 0, $request->user_id ?? 0];

        if ($authorId) {
            $query .= " AND p.author_id = ?";
            $params[] = $authorId;
        }

        $query .= " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        // Fetch posts with author details
        $posts = DB::select($query, $params);

        // Format posts for frontend
        $formattedPosts = array_map(function ($post) {
            // Build full avatar URL
            $avatarUrl = null;
            if ($post->author_avatar) {
                // Check if it's already a full URL
                if (str_starts_with($post->author_avatar, 'http')) {
                    $avatarUrl = $post->author_avatar;
                } else {
                    // Check if it's an Azure path or relative path
                    if (str_contains($post->author_avatar, '/')) {
                        try {
                            // Try to generate Azure URL
                            $accountName = config('filesystems.disks.azure.name');
                            $container = config('filesystems.disks.azure.container');

                            if ($accountName && $container) {
                                $avatarUrl = sprintf(
                                    'https://%s.blob.core.windows.net/%s/%s',
                                    $accountName,
                                    $container,
                                    $post->author_avatar
                                );
                            } else {
                                $avatarUrl = url('storage/' . $post->author_avatar);
                            }
                        } catch (\Exception $e) {
                            $avatarUrl = url('storage/' . $post->author_avatar);
                        }
                    } else {
                        $avatarUrl = url('storage/' . $post->author_avatar);
                    }
                }
            }

            // Process marketplace images if listing exists
            $marketplaceImages = [];
            if ($post->ml_listing_id && $post->ml_images) {
                $rawImages = json_decode($post->ml_images) ?? [];
                $marketplaceImages = array_map(function ($image) {
                    // If it's already a full URL, return as-is
                    if (filter_var($image, FILTER_VALIDATE_URL)) {
                        return $image;
                    }
                    
                    // Generate Azure URL
                    try {
                        $accountName = config('filesystems.disks.azure.name');
                        $container = config('filesystems.disks.azure.container');
                        
                        if ($accountName && $container) {
                            return sprintf(
                                'https://%s.blob.core.windows.net/%s/%s',
                                $accountName,
                                $container,
                                $image
                            );
                        }
                    } catch (\Exception $e) {
                        // Fallback to local storage URL
                        return url('storage/' . $image);
                    }
                    
                    return url('storage/' . $image);
                }, $rawImages);
            }

            return [
                'id' => (string)$post->post_id,
                'author' => [
                    'name' => $post->author_name,
                    'avatar' => $avatarUrl,
                    'location' => $post->author_location ?? 'Bangladesh',
                    'userType' => $post->author_type,
                    'isExpert' => $post->author_type === 'expert'
                ],
                'content' => $post->content,
                'images' => json_decode($post->images) ?? [],
                'type' => $post->post_type,
                // Add marketplace reference if listing exists
                'marketplaceReference' => $post->ml_listing_id ? [
                    'listing_id' => (string)$post->ml_listing_id,
                    'title' => $post->ml_title,
                    'description' => $post->ml_description,
                    'price' => (float)$post->ml_price,
                    'currency' => $post->ml_currency ?? 'BDT',
                    'category' => $post->ml_category,
                    'categoryNameBn' => $post->ml_category_bn,
                    'images' => $marketplaceImages,
                    'listing_type' => $post->ml_listing_type,
                    'listingTypeBn' => $post->ml_listing_type_bn,
                    'location' => $post->ml_location,
                ] : null,
                'likes' => (int)$post->likes_count,
                'comments' => (int)$post->comments_count,
                'reports' => (int)$post->reports_count,
                'postedAt' => $post->created_at,
                'liked' => (bool)$post->is_liked,
                'reported' => (bool)$post->is_reported,
                'isOwnPost' => $post->author_id == ($request->user_id ?? 0),
                'approvalStatus' => $post->approval_status ?? 'approved',
                'approvedAt' => $post->approved_at ?? null
            ];
        }, $posts);

        return response()->json($formattedPosts);
    }

    // Create a new post
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'type' => 'required|in:general,marketplace,question,advice,expert_advice',
            'images' => 'nullable|array',
            'user_id' => 'required|integer',
            'marketplace_listing_id' => 'nullable|integer' // NEW: Support marketplace listing reference
        ]);

        // Log incoming request for debugging
        \Log::info('Create post request:', $request->all());

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $images = $request->input('images', []);
        $imagesJson = json_encode($images);

        // Prepare insert data
        $insertData = [
            'author_id' => $request->user_id,
            'content' => $request->content,
            'post_type' => $request->type,
            'images' => $imagesJson,
            'created_at' => now(),
            'updated_at' => now()
        ];

        // Add marketplace_listing_id if provided
        if ($request->has('marketplace_listing_id') && $request->marketplace_listing_id) {
            $insertData['marketplace_listing_id'] = $request->marketplace_listing_id;
        }

        $postId = DB::table('posts')->insertGetId($insertData);

        return response()->json(['message' => 'Post created successfully', 'id' => $postId], 201);
    }

    // Like/Unlike a post
    public function toggleLike(Request $request, $id)
    {
        $userId = $request->user_id;

        $existingLike = DB::table('post_likes')
            ->where('post_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            DB::table('post_likes')
                ->where('post_id', $id)
                ->where('user_id', $userId)
                ->delete();

            // Decrement likes count in posts table (optional, if you keep count there)
            DB::table('posts')->where('post_id', $id)->decrement('likes_count');

            return response()->json(['liked' => false]);
        } else {
            try {
                DB::table('post_likes')->insert([
                    'post_id' => $id,
                    'user_id' => $userId,
                    'liked_at' => now()
                ]);

                // Increment likes count
                DB::table('posts')->where('post_id', $id)->increment('likes_count');

                return response()->json(['liked' => true]);
            } catch (\Illuminate\Database\QueryException $e) {
                // Handle duplicate entry race condition
                if ($e->errorInfo[1] == 1062) { // Duplicate entry error code
                    // It was already liked by another concurrent request, so we treat it as liked
                    return response()->json(['liked' => true]);
                }
                throw $e;
            }
        }
    }

    // Add a comment
    public function addComment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'user_id' => 'required|exists:users,user_id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $commentId = DB::table('comments')->insertGetId([
            'post_id' => $id,
            'author_id' => $request->user_id,
            'content' => $request->content,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('posts')->where('post_id', $id)->increment('comments_count');

        return response()->json(['message' => 'Comment added', 'id' => $commentId], 201);
    }

    // Get comments for a post
    public function getComments($id)
    {
        $comments = DB::select("
            SELECT
                c.*,
                up.full_name as author_name,
                u.user_type as author_type,
                u.user_id as author_user_id,
                up.profile_photo_url as author_avatar
            FROM comments c
            JOIN users u ON c.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            WHERE c.post_id = ? AND c.is_deleted = 0
            ORDER BY c.created_at ASC
        ", [$id]);

        $formattedComments = array_map(function ($comment) {
            // Build full avatar URL
            $avatarUrl = null;
            if ($comment->author_avatar) {
                if (str_starts_with($comment->author_avatar, 'http')) {
                    $avatarUrl = $comment->author_avatar;
                } else {
                    // Check if it's an Azure path or relative path
                    if (str_contains($comment->author_avatar, '/')) {
                        try {
                            // Try to generate Azure URL
                            $accountName = config('filesystems.disks.azure.name');
                            $container = config('filesystems.disks.azure.container');

                            if ($accountName && $container) {
                                $avatarUrl = sprintf(
                                    'https://%s.blob.core.windows.net/%s/%s',
                                    $accountName,
                                    $container,
                                    $comment->author_avatar
                                );
                            } else {
                                // Fallback to storage URL
                                $avatarUrl = url('storage/' . $comment->author_avatar);
                            }
                        } catch (\Exception $e) {
                            $avatarUrl = url('storage/' . $comment->author_avatar);
                        }
                    } else {
                        $avatarUrl = url('storage/' . $comment->author_avatar);
                    }
                }
            }

            return [
                'id' => (string)$comment->comment_id,
                'author' => [
                    'name' => $comment->author_name,
                    'avatar' => $avatarUrl,
                    'userType' => $comment->author_type,
                    'isExpert' => $comment->author_type === 'expert'
                ],
                'content' => $comment->content,
                'postedAt' => $comment->created_at,
                'likes' => 0,
                'liked' => false,
                'replies' => []
            ];
        }, $comments);

        return response()->json($formattedComments);
    }

    // Update a post
    public function update(Request $request, $id)
    {
        $userId = $request->user_id;

        $post = DB::table('posts')->where('post_id', $id)->first();

        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        if ($post->author_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'string',
            'type' => 'in:general,marketplace,question,advice,expert_advice',
            'images' => 'array'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $updateData = [
            'updated_at' => now(),
            'approval_status' => 'pending' // Set to pending when post is edited
        ];
        if ($request->has('content')) $updateData['content'] = $request->content;
        if ($request->has('type')) $updateData['post_type'] = $request->type;
        if ($request->has('images')) $updateData['images'] = json_encode($request->images);

        DB::table('posts')->where('post_id', $id)->update($updateData);

        // Fetch updated post with all related data (similar to getMyPosts)
        $query = "
            SELECT
                p.*,
                up.full_name as author_name,
                u.user_type as author_type,
                up.profile_photo_url as author_avatar,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.post_id) as likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            WHERE p.post_id = ?
        ";

        $post = DB::selectOne($query, [$id]);

        // Format the post response
        $avatarUrl = null;
        if ($post->author_avatar) {
            if (str_starts_with($post->author_avatar, 'http')) {
                $avatarUrl = $post->author_avatar;
            } else {
                if (str_contains($post->author_avatar, '/')) {
                    try {
                        $accountName = config('filesystems.disks.azure.name');
                        $container = config('filesystems.disks.azure.container');
                        if ($accountName && $container) {
                            $avatarUrl = sprintf(
                                'https://%s.blob.core.windows.net/%s/%s',
                                $accountName,
                                $container,
                                $post->author_avatar
                            );
                        } else {
                            $avatarUrl = url('storage/' . $post->author_avatar);
                        }
                    } catch (\Exception $e) {
                        $avatarUrl = url('storage/' . $post->author_avatar);
                    }
                } else {
                    $avatarUrl = url('storage/' . $post->author_avatar);
                }
            }
        }

        // Process post images
        $postImages = json_decode($post->images) ?? [];
        $formattedImages = array_map(function ($image) {
            if (filter_var($image, FILTER_VALIDATE_URL)) {
                return $image;
            }
            try {
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $image
                    );
                }
            } catch (\Exception $e) {
                return url('storage/' . $image);
            }
            return url('storage/' . $image);
        }, $postImages);

        $formattedPost = [
            'id' => (string)$post->post_id,
            'author' => [
                'name' => $post->author_name,
                'avatar' => $avatarUrl,
                'userType' => $post->author_type,
                'isExpert' => $post->author_type === 'expert'
            ],
            'content' => $post->content,
            'images' => $formattedImages,
            'type' => $post->post_type,
            'likes' => (int)$post->likes_count,
            'comments' => (int)$post->comments_count,
            'postedAt' => $post->created_at,
            'approvalStatus' => $post->approval_status,
            'approvedAt' => $post->approved_at,
            'isOwnPost' => true
        ];

        return response()->json(['message' => 'Post updated successfully', 'post' => $formattedPost]);
    }

    // Delete a post
    public function destroy(Request $request, $id)
    {
        $userId = $request->user_id;

        $post = DB::table('posts')->where('post_id', $id)->first();

        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        if ($post->author_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        DB::table('posts')->where('post_id', $id)->update(['is_deleted' => 1]);

        return response()->json(['message' => 'Post deleted successfully']);
    }

    // Report a post (toggle)
    public function reportPost(Request $request, $id)
    {
        $userId = $request->user_id;
        $reason = $request->report_reason;

        if (!$userId) {
            return response()->json(['error' => 'User ID required'], 400);
        }

        // Check if already reported
        $existingReport = DB::table('post_reports')
            ->where('post_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existingReport) {
            // Remove report
            DB::table('post_reports')
                ->where('post_id', $id)
                ->where('user_id', $userId)
                ->delete();

            $reported = false;
        } else {
            // Add report with reason and post type
            $postType = $request->post_type;
            DB::table('post_reports')->insert([
                'post_id' => $id,
                'user_id' => $userId,
                'report_reason' => $reason,
                'post_type' => $postType,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Get post details for notification
            $post = DB::table('posts')->where('post_id', $id)->first();
            $reporter = DB::table('users')
                ->join('user_profiles', 'users.user_id', '=', 'user_profiles.user_id')
                ->where('users.user_id', $userId)
                ->select('user_profiles.full_name', 'users.user_type')
                ->first();

            // Notify data operators about the report
            $notificationService = new DataOperatorNotificationService();
            $postContent = $post ? substr($post->content, 0, 50) : 'Post';
            $notificationService->notifyPostReport(
                $id,
                $userId,
                $reason,
                $postContent,
                $reporter ? $reporter->full_name : 'Unknown User'
            );

            $reported = true;
        }

        // Get updated report count
        $reportsCount = DB::table('post_reports')->where('post_id', $id)->count();

        return response()->json([
            'reported' => $reported,
            'reports' => $reportsCount
        ]);
    }

    // Report a comment
    public function reportComment(Request $request, $postId, $commentId)
    {
        $userId = $request->user_id;
        $reason = $request->report_reason;

        if (!$userId) {
            return response()->json(['error' => 'User ID required'], 400);
        }

        // Check if already reported
        $existingReport = DB::table('comment_reports')
            ->where('comment_id', $commentId)
            ->where('user_id', $userId)
            ->first();

        if ($existingReport) {
            // Remove report
            DB::table('comment_reports')
                ->where('comment_id', $commentId)
                ->where('user_id', $userId)
                ->delete();

            $reported = false;
        } else {
            // Add report with reason
            DB::table('comment_reports')->insert([
                'comment_id' => $commentId,
                'user_id' => $userId,
                'report_reason' => $reason,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Get comment content for notification
            $comment = DB::table('comments')->where('comment_id', $commentId)->first();
            $reporter = DB::table('users')
                ->join('user_profiles', 'users.user_id', '=', 'user_profiles.user_id')
                ->where('users.user_id', $userId)
                ->select('user_profiles.full_name', 'users.user_type')
                ->first();

            // Notify data operators about the report
            $notificationService = new DataOperatorNotificationService();
            $notificationService->notifyCommentReport(
                $commentId,
                $postId,
                $userId,
                $reason,
                $comment ? substr($comment->comment_text, 0, 50) : 'Comment',
                $reporter ? $reporter->full_name : 'Unknown User'
            );

            $reported = true;
        }

        return response()->json([
            'reported' => $reported
        ]);
    }

    // Get pending posts for Data Operator approval
    public function getPendingPosts(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 20);
        $offset = ($page - 1) * $limit;
        $status = $request->query('status', 'pending'); // pending, approved, rejected

        $query = "
            SELECT
                p.*,
                up.full_name as author_name,
                u.user_type as author_type,
                up.profile_photo_url as author_avatar,
                up.address as author_location,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.post_id) as likes_count,
                (SELECT COUNT(*) FROM post_reports WHERE post_id = p.post_id) as reports_count,
                do_up.full_name as approved_by_name
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            LEFT JOIN users do_user ON p.approved_by = do_user.user_id
            LEFT JOIN user_profiles do_up ON do_user.user_id = do_up.user_id
            WHERE p.is_deleted = 0
            AND p.approval_status = ?
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        ";

        $posts = DB::select($query, [$status, $limit, $offset]);

        $formattedPosts = array_map(function ($post) {
            // Build full avatar URL
            $avatarUrl = null;
            if ($post->author_avatar) {
                if (str_starts_with($post->author_avatar, 'http')) {
                    $avatarUrl = $post->author_avatar;
                } else {
                    if (str_contains($post->author_avatar, '/')) {
                        try {
                            $accountName = config('filesystems.disks.azure.name');
                            $container = config('filesystems.disks.azure.container');
                            if ($accountName && $container) {
                                $avatarUrl = sprintf(
                                    'https://%s.blob.core.windows.net/%s/%s',
                                    $accountName,
                                    $container,
                                    $post->author_avatar
                                );
                            } else {
                                $avatarUrl = url('storage/' . $post->author_avatar);
                            }
                        } catch (\Exception $e) {
                            $avatarUrl = url('storage/' . $post->author_avatar);
                        }
                    } else {
                        $avatarUrl = url('storage/' . $post->author_avatar);
                    }
                }
            }

            // Process post images
            $postImages = json_decode($post->images) ?? [];
            $formattedImages = array_map(function ($image) {
                if (filter_var($image, FILTER_VALIDATE_URL)) {
                    return $image;
                }
                try {
                    $accountName = config('filesystems.disks.azure.name');
                    $container = config('filesystems.disks.azure.container');
                    if ($accountName && $container) {
                        return sprintf(
                            'https://%s.blob.core.windows.net/%s/%s',
                            $accountName,
                            $container,
                            $image
                        );
                    }
                } catch (\Exception $e) {
                    return url('storage/' . $image);
                }
                return url('storage/' . $image);
            }, $postImages);

            return [
                'id' => (string)$post->post_id,
                'author' => [
                    'name' => $post->author_name,
                    'avatar' => $avatarUrl,
                    'location' => $post->author_location ?? 'Bangladesh',
                    'userType' => $post->author_type,
                ],
                'content' => $post->content,
                'images' => $formattedImages,
                'type' => $post->post_type,
                'likes' => (int)$post->likes_count,
                'reports' => (int)$post->reports_count,
                'postedAt' => $post->created_at,
                'approvalStatus' => $post->approval_status,
                'approvedBy' => $post->approved_by_name,
                'approvedAt' => $post->approved_at
            ];
        }, $posts);

        // Get total count
        $totalCount = DB::selectOne("
            SELECT COUNT(*) as count FROM posts 
            WHERE is_deleted = 0 AND approval_status = ?
        ", [$status]);

        return response()->json([
            'posts' => $formattedPosts,
            'pagination' => [
                'total' => $totalCount->count,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($totalCount->count / $limit)
            ]
        ]);
    }

    // Approve a post
    public function approvePost(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'data_operator_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Check if post exists
        $post = DB::table('posts')->where('post_id', $id)->first();
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        // Update post status
        DB::table('posts')
            ->where('post_id', $id)
            ->update([
                'approval_status' => 'approved',
                'approved_by' => $request->data_operator_id,
                'approved_at' => now(),
                'updated_at' => now()
            ]);

        // Notify the post author (optional - can be implemented later)
        // Send notification to author that their post was approved

        return response()->json([
            'message' => 'Post approved successfully',
            'post_id' => $id
        ]);
    }

    // Reject a post
    public function rejectPost(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'data_operator_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Check if post exists
        $post = DB::table('posts')->where('post_id', $id)->first();
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        // Update post status
        DB::table('posts')
            ->where('post_id', $id)
            ->update([
                'approval_status' => 'rejected',
                'approved_by' => $request->data_operator_id,
                'approved_at' => now(),
                'updated_at' => now()
            ]);

        // Notify the post author (optional)
        // Send notification to author that their post was rejected

        return response()->json([
            'message' => 'Post rejected successfully',
            'post_id' => $id
        ]);
    }

    // Get user's own posts (including approval status)
    public function getMyPosts(Request $request)
    {
        $userId = $request->query('user_id');
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $offset = ($page - 1) * $limit;

        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        $query = "
            SELECT
                p.*,
                up.full_name as author_name,
                u.user_type as author_type,
                up.profile_photo_url as author_avatar,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.post_id) as likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            WHERE p.author_id = ? AND p.is_deleted = 0
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        ";

        $posts = DB::select($query, [$userId, $limit, $offset]);

        $formattedPosts = array_map(function ($post) {
            // Build full avatar URL
            $avatarUrl = null;
            if ($post->author_avatar) {
                if (str_starts_with($post->author_avatar, 'http')) {
                    $avatarUrl = $post->author_avatar;
                } else {
                    if (str_contains($post->author_avatar, '/')) {
                        try {
                            $accountName = config('filesystems.disks.azure.name');
                            $container = config('filesystems.disks.azure.container');
                            if ($accountName && $container) {
                                $avatarUrl = sprintf(
                                    'https://%s.blob.core.windows.net/%s/%s',
                                    $accountName,
                                    $container,
                                    $post->author_avatar
                                );
                            } else {
                                $avatarUrl = url('storage/' . $post->author_avatar);
                            }
                        } catch (\Exception $e) {
                            $avatarUrl = url('storage/' . $post->author_avatar);
                        }
                    } else {
                        $avatarUrl = url('storage/' . $post->author_avatar);
                    }
                }
            }

            // Process post images
            $postImages = json_decode($post->images) ?? [];
            $formattedImages = array_map(function ($image) {
                if (filter_var($image, FILTER_VALIDATE_URL)) {
                    return $image;
                }
                try {
                    $accountName = config('filesystems.disks.azure.name');
                    $container = config('filesystems.disks.azure.container');
                    if ($accountName && $container) {
                        return sprintf(
                            'https://%s.blob.core.windows.net/%s/%s',
                            $accountName,
                            $container,
                            $image
                        );
                    }
                } catch (\Exception $e) {
                    return url('storage/' . $image);
                }
                return url('storage/' . $image);
            }, $postImages);

            return [
                'id' => (string)$post->post_id,
                'author' => [
                    'name' => $post->author_name,
                    'avatar' => $avatarUrl,
                    'userType' => $post->author_type,
                    'isExpert' => $post->author_type === 'expert'
                ],
                'content' => $post->content,
                'images' => $formattedImages,
                'type' => $post->post_type,
                'likes' => (int)$post->likes_count,
                'comments' => (int)$post->comments_count,
                'postedAt' => $post->created_at,
                'approvalStatus' => $post->approval_status,
                'approvedAt' => $post->approved_at,
                'isOwnPost' => true
            ];
        }, $posts);

        return response()->json($formattedPosts);
    }
}
