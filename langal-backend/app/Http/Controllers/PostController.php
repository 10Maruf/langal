<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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
                EXISTS(SELECT 1 FROM post_reports WHERE post_id = p.post_id AND user_id = ?) as is_reported
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            LEFT JOIN user_profiles up ON u.user_id = up.user_id
            WHERE p.is_deleted = 0
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
                    $avatarUrl = url('storage/' . $post->author_avatar);
                }
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
                'likes' => (int)$post->likes_count,
                'comments' => (int)$post->comments_count,
                'reports' => (int)$post->reports_count,
                'postedAt' => $post->created_at,
                'liked' => (bool)$post->is_liked,
                'reported' => (bool)$post->is_reported,
                'isOwnPost' => $post->author_id == ($request->user_id ?? 0)
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
            'user_id' => 'required|integer'
        ]);

        // Log incoming request for debugging
        \Log::info('Create post request:', $request->all());

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $images = $request->input('images', []);
        $imagesJson = json_encode($images);

        $postId = DB::table('posts')->insertGetId([
            'author_id' => $request->user_id,
            'content' => $request->content,
            'post_type' => $request->type,
            'images' => $imagesJson,
            'created_at' => now(),
            'updated_at' => now()
        ]);

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
                    $avatarUrl = url('storage/' . $comment->author_avatar);
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

        $updateData = ['updated_at' => now()];
        if ($request->has('content')) $updateData['content'] = $request->content;
        if ($request->has('type')) $updateData['post_type'] = $request->type;
        if ($request->has('images')) $updateData['images'] = json_encode($request->images);

        DB::table('posts')->where('post_id', $id)->update($updateData);

        // Return updated post
        $updatedPost = DB::table('posts')->where('post_id', $id)->first();

        // We need to fetch the full post structure again to return it consistent with index
        // For simplicity, we'll just return the basic updated fields and let frontend handle it
        // Or we could reuse the query logic from index if we extracted it to a private method.

        return response()->json(['message' => 'Post updated successfully', 'post' => $updatedPost]);
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

            $reported = true;
        }

        return response()->json([
            'reported' => $reported
        ]);
    }
}
