<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Determine recipient ID based on user type
        $recipientId = $user->id; // Default to user ID
        
        // If notifications are stored by user ID (users table id), this is fine.
        // If stored by farmer_id, we need to check the schema.
        // Based on CropRecommendationController: 'recipient_id' => $recipientId
        // And $recipientId comes from Auth::id() in selectCrops.
        // So it uses the users table ID.

        $notifications = DB::table('notifications')
            ->where('recipient_id', $recipientId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $userId = Auth::id();

        $updated = DB::table('notifications')
            ->where('id', $id)
            ->where('recipient_id', $userId)
            ->update(['is_read' => true]);

        if ($updated) {
            return response()->json(['success' => true, 'message' => 'Marked as read']);
        }

        return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $userId = Auth::id();

        DB::table('notifications')
            ->where('recipient_id', $userId)
            ->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'All marked as read']);
    }
    
    /**
     * Get unread count
     */
    public function unreadCount()
    {
        $userId = Auth::id();
        
        $count = DB::table('notifications')
            ->where('recipient_id', $userId)
            ->where('is_read', false)
            ->count();
            
        return response()->json(['success' => true, 'count' => $count]);
    }
}
