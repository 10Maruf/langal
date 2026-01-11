<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FarmerAuthController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\ExpertAuthController;
use App\Http\Controllers\Api\DataOperatorAuthController;
use App\Http\Controllers\Api\FieldDataCollectionController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\DocumentUploadController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\CropRecommendationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\TTSDebugController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Langal Krishi Sahayak API is running',
        'timestamp' => now()->toISOString(),
    ]);
});

// User count route
Route::get('/users/count', function (Request $request) {
    $type = $request->query('type', 'farmer');

    $query = \App\Models\User::query();

    if ($type === 'farmer') {
        $query->whereHas('farmer');
    } elseif ($type === 'customer') {
        $query->whereHas('customerBusiness');
    }

    $count = $query->count();

    return response()->json([
        'success' => true,
        'type' => $type,
        'count' => $count
    ]);
});

// Test route
Route::post('/test-post', function () {
    return response()->json([
        'success' => true,
        'message' => 'POST request working',
    ]);
});

// Direct farmer send-otp test (bypassing middleware)
Route::post('/farmer-send-otp-test', [FarmerAuthController::class, 'sendOtp']);

// Farmer Authentication Routes
Route::prefix('farmer')->group(function () {
    // Public routes (no authentication required)
    Route::post('/send-otp', [FarmerAuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [FarmerAuthController::class, 'verifyOtp']);
    Route::post('/register', [FarmerAuthController::class, 'register']);
    Route::post('/resend-otp', [FarmerAuthController::class, 'resendOtp']);
    Route::get('/otp-status', [FarmerAuthController::class, 'otpStatus']);

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [FarmerAuthController::class, 'profile']);
        Route::put('/profile', [FarmerAuthController::class, 'updateProfile']);
        Route::post('/profile', [FarmerAuthController::class, 'updateProfile']); // Support POST for file uploads
        Route::post('/logout', [FarmerAuthController::class, 'logout']);
    });
});

// Customer Authentication Routes
Route::prefix('customer')->group(function () {
    // Public routes (no authentication required)
    Route::get('/business-types', [CustomerAuthController::class, 'getBusinessTypes']);
    Route::post('/send-otp', [CustomerAuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [CustomerAuthController::class, 'verifyOtp']);
    Route::post('/login', [CustomerAuthController::class, 'login']);
    Route::post('/register', [CustomerAuthController::class, 'register']);
    Route::post('/resend-otp', [CustomerAuthController::class, 'resendOtp']);
    
    // Forgot Password routes
    Route::post('/forgot-password/send-otp', [CustomerAuthController::class, 'forgotPasswordSendOtp']);
    Route::post('/forgot-password/reset', [CustomerAuthController::class, 'forgotPasswordReset']);

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [CustomerAuthController::class, 'profile']);
        Route::put('/profile', [CustomerAuthController::class, 'updateProfile']);
        Route::post('/profile', [CustomerAuthController::class, 'updateProfile']); // Support POST for file uploads
        Route::post('/logout', [CustomerAuthController::class, 'logout']);
    });
});

// Expert Authentication & Profile Routes
Route::prefix('expert')->group(function () {
    // Public routes (no authentication required)
    Route::post('/login', [ExpertAuthController::class, 'login']);
    Route::post('/send-otp', [ExpertAuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [ExpertAuthController::class, 'verifyOtp']);
    Route::post('/register', [ExpertAuthController::class, 'register']);
    Route::post('/resend-otp', [ExpertAuthController::class, 'resendOtp']);
    
    // Forgot Password routes
    Route::post('/forgot-password/send-otp', [ExpertAuthController::class, 'forgotPasswordSendOtp']);
    Route::post('/forgot-password/reset', [ExpertAuthController::class, 'forgotPasswordReset']);

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/profile', [ExpertAuthController::class, 'createProfile']);
        Route::put('/profile', [ExpertAuthController::class, 'updateProfile']);
        Route::get('/profile', [ExpertAuthController::class, 'getProfile']);
        Route::post('/logout', [ExpertAuthController::class, 'logout']);
        Route::post('/heartbeat', [ExpertAuthController::class, 'heartbeat']);
    });
});

// Public Expert Routes (No authentication required)
Route::prefix('experts')->group(function () {
    Route::get('/', [ExpertAuthController::class, 'getAllExperts']);
    Route::get('/{expert_id}', [ExpertAuthController::class, 'getExpertById']);
});

// Data Operator Authentication Routes
Route::prefix('data-operator')->group(function () {
    // Public routes (no authentication required)
    Route::post('/send-otp', [DataOperatorAuthController::class, 'sendOtp']);
    Route::post('/register', [DataOperatorAuthController::class, 'register']);
    Route::post('/login', [DataOperatorAuthController::class, 'login']);
    
    // Forgot Password routes
    Route::post('/forgot-password/send-otp', [DataOperatorAuthController::class, 'forgotPasswordSendOtp']);
    Route::post('/forgot-password/reset', [DataOperatorAuthController::class, 'forgotPasswordReset']);

    // Statistics route - PUBLIC for testing (move back to protected in production)
    Route::match(['get', 'post'], '/statistics', [DataOperatorAuthController::class, 'getStatistics']);

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [DataOperatorAuthController::class, 'profile']);
        Route::post('/update-profile', [DataOperatorAuthController::class, 'updateProfile']);
        Route::post('/logout', [DataOperatorAuthController::class, 'logout']);

        // Profile verification routes
        Route::get('/farmers', [DataOperatorAuthController::class, 'getFarmers']);
        Route::get('/customers', [DataOperatorAuthController::class, 'getCustomers']);
        Route::get('/experts', [DataOperatorAuthController::class, 'getExperts']);
        Route::post('/verify-profile', [DataOperatorAuthController::class, 'verifyProfile']);

        // Field data collection routes
        Route::get('/field-reports', [DataOperatorAuthController::class, 'getFieldReports']);
        Route::post('/field-reports', [DataOperatorAuthController::class, 'createFieldReport']);
        Route::delete('/field-reports/{reportId}', [DataOperatorAuthController::class, 'deleteFieldReport']);

        // Soil test reports routes
        Route::get('/soil-tests', [DataOperatorAuthController::class, 'getSoilTestReports']);
        Route::post('/soil-tests', [DataOperatorAuthController::class, 'createSoilTestReport']);
        Route::delete('/soil-tests/{reportId}', [DataOperatorAuthController::class, 'deleteSoilTestReport']);

        // Manual farmer entry for field data collection
        Route::post('/field-data-farmers', [DataOperatorAuthController::class, 'createFieldDataFarmer']);
    });
});

// Field Data Collection Routes (Protected - Data Operators only)
Route::prefix('field-data')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [FieldDataCollectionController::class, 'index']);
    Route::post('/', [FieldDataCollectionController::class, 'store']);
    Route::get('/statistics', [FieldDataCollectionController::class, 'statistics']);
    Route::get('/{id}', [FieldDataCollectionController::class, 'show']);
    Route::put('/{id}', [FieldDataCollectionController::class, 'update']);
    Route::delete('/{id}', [FieldDataCollectionController::class, 'destroy']);
    Route::post('/{id}/verify', [FieldDataCollectionController::class, 'verify']);
});

// Test route for authenticated farmer
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Marketplace Routes - Protected routes require authentication
Route::prefix('marketplace')->group(function () {
    // Public routes (anyone can view)
    Route::get('/', [MarketplaceController::class, 'index']);
    Route::get('/categories', [MarketplaceController::class, 'getCategories']);
    Route::get('/user/{userId}', [MarketplaceController::class, 'userListings']);
    Route::get('/saved/{userId}', [MarketplaceController::class, 'savedListings']);
    Route::get('/{id}', [MarketplaceController::class, 'show']);
    Route::post('/{id}/view', [MarketplaceController::class, 'incrementView']);
    Route::post('/{id}/contact', [MarketplaceController::class, 'incrementContact']);

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [MarketplaceController::class, 'store']);
        Route::put('/{id}', [MarketplaceController::class, 'update']);
        Route::delete('/{id}', [MarketplaceController::class, 'destroy']);
        Route::post('/{id}/save', [MarketplaceController::class, 'toggleSave']);
        Route::post('/{id}/boost', [MarketplaceController::class, 'boostListing']);
    });
});

// Image Upload Routes
Route::prefix('images')->group(function () {
    Route::post('/marketplace', [ImageUploadController::class, 'uploadMarketplaceImages']);
    Route::delete('/marketplace', [ImageUploadController::class, 'deleteMarketplaceImage']);
    Route::get('/marketplace/{listingId}', [ImageUploadController::class, 'getListingImages']);
});

// Document Upload Routes
Route::prefix('documents')->group(function () {
    Route::post('/upload', [DocumentUploadController::class, 'upload']);
});

// Location Routes (Public - no authentication required)
Route::prefix('locations')->group(function () {
    Route::get('/postal-code', [LocationController::class, 'getByPostalCode']); // ?postal_code=1000
    Route::get('/divisions', [LocationController::class, 'getDivisions']);
    Route::get('/districts', [LocationController::class, 'getDistricts']); // ?division_bn=ঢাকা
    Route::get('/upazilas', [LocationController::class, 'getUpazilas']); // ?district_bn=ঢাকা
    Route::get('/post-offices', [LocationController::class, 'getPostOffices']); // ?upazila_bn=সাভার
    Route::get('/search', [LocationController::class, 'search']); // ?query=ঢাকা
});

// Social Feed Routes
Route::prefix('social')->group(function () {
    // Public routes
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}/comments', [PostController::class, 'getComments']);

    // Protected routes (require authentication)
    // Note: For now we are not enforcing auth middleware for testing, but in production it should be enabled
    // Route::middleware('auth:sanctum')->group(function () {
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{id}', [PostController::class, 'update']);
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);
        Route::post('/posts/{id}/like', [PostController::class, 'toggleLike']);
        Route::post('/posts/{id}/report', [PostController::class, 'reportPost']);
        Route::post('/posts/{id}/comments', [PostController::class, 'addComment']);
        Route::post('/posts/{postId}/comments/{commentId}/report', [PostController::class, 'reportComment']);

        // Image upload for posts
        Route::post('/upload-images', [ImageUploadController::class, 'uploadPostImages']);
    // });
});

// Crop Recommendation Routes (AI-based)
Route::prefix('recommendations')->group(function () {
    // Public routes (get seasons, crop types, generate recommendations)
    Route::get('/seasons', [CropRecommendationController::class, 'getSeasons']);
    Route::get('/crop-types', [CropRecommendationController::class, 'getCropTypes']);
    Route::post('/generate', [CropRecommendationController::class, 'generate']);
    Route::get('/crop-image', [CropRecommendationController::class, 'getCropImage']);

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/history', [CropRecommendationController::class, 'history']);
        Route::get('/selected', [CropRecommendationController::class, 'getSelectedCrops']);
        Route::post('/select-crops', [CropRecommendationController::class, 'selectCrops']);
        Route::get('/{id}', [CropRecommendationController::class, 'show']);
        Route::put('/selected/{selectionId}/status', [CropRecommendationController::class, 'updateCropStatus']);
        Route::delete('/selected/{selectionId}', [CropRecommendationController::class, 'removeCrop']);
        Route::get('/selected/{selectionId}/details', [CropRecommendationController::class, 'getCropDetails']);
    });
});

// Notification Routes
Route::middleware('auth:sanctum')->prefix('notifications')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::get('/unread-count', [App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
    Route::post('/mark-all-read', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::post('/{id}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
});

// Text-to-Speech Routes (No authentication required for public TTS)
Route::prefix('tts')->group(function () {
    Route::post('/generate', [TTSController::class, 'generateSpeech']);
    Route::get('/models', [TTSController::class, 'getModels']);
    Route::get('/health', [TTSController::class, 'healthCheck']);
    Route::get('/debug', [TTSDebugController::class, 'testAPI']);
});

// ============================================
// EXPERT-FARMER CONSULTATION SYSTEM ROUTES
// ============================================

use App\Http\Controllers\Api\ExpertAvailabilityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\CallController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\PrescriptionController;

// Expert Availability Routes (Public - view availability)
Route::prefix('experts/{expertId}')->group(function () {
    Route::get('/availability', [ExpertAvailabilityController::class, 'index']);
    Route::get('/slots', [ExpertAvailabilityController::class, 'getAvailableSlots']);
    Route::get('/reviews', [FeedbackController::class, 'getExpertReviews']);
});

// Expert Availability Management (Protected - expert only)
Route::middleware('auth:sanctum')->prefix('expert')->group(function () {
    Route::get('/my-availability', [ExpertAvailabilityController::class, 'getMyAvailability']);
    Route::post('/set-availability', [ExpertAvailabilityController::class, 'setAvailability']);
    Route::post('/availability', [ExpertAvailabilityController::class, 'store']);
    Route::delete('/availability/{id}', [ExpertAvailabilityController::class, 'destroy']);
    Route::post('/unavailable-dates', [ExpertAvailabilityController::class, 'addUnavailableDate']);
    Route::delete('/unavailable-dates/{id}', [ExpertAvailabilityController::class, 'removeUnavailableDate']);
    Route::get('/stats', [AppointmentController::class, 'getExpertStats']);
});

// Appointment Routes (Protected)
Route::middleware('auth:sanctum')->prefix('appointments')->group(function () {
    Route::get('/my', [AppointmentController::class, 'myAppointments']);
    Route::get('/today-count', [AppointmentController::class, 'todayCount']);
    Route::get('/', [AppointmentController::class, 'index']);
    Route::post('/', [AppointmentController::class, 'store']);
    Route::get('/{id}', [AppointmentController::class, 'show'])->whereNumber('id');
    
    // Appointment actions
    Route::put('/{id}/approve', [AppointmentController::class, 'approve']);
    Route::put('/{id}/confirm', [AppointmentController::class, 'approve']); // alias for frontend
    Route::put('/{id}/reject', [AppointmentController::class, 'reject']);
    Route::put('/{id}/reschedule', [AppointmentController::class, 'reschedule']);
    Route::put('/{id}/cancel', [AppointmentController::class, 'cancel']);
    Route::put('/{id}/complete', [AppointmentController::class, 'complete']);
    
    // Feedback & Prescription for appointment
    Route::post('/{id}/feedback', [FeedbackController::class, 'store']);
    Route::get('/{id}/feedback', [FeedbackController::class, 'show']);
    Route::post('/{id}/prescription', [PrescriptionController::class, 'store']);
    
    // Call history for appointment
    Route::get('/{id}/calls', [CallController::class, 'getCallHistory']);
});

// Conversation/Message Routes (Protected)
Route::middleware('auth:sanctum')->prefix('conversations')->group(function () {
    Route::get('/', [MessageController::class, 'getConversations']);
    Route::get('/{appointmentId}/messages', [MessageController::class, 'getMessages']);
    Route::post('/{appointmentId}/messages', [MessageController::class, 'sendMessage']);
    Route::post('/{appointmentId}/read', [MessageController::class, 'markAsRead']);
});

// Message Routes (Protected)
Route::middleware('auth:sanctum')->prefix('messages')->group(function () {
    Route::get('/unread-count', [MessageController::class, 'getUnreadCount']);
    Route::delete('/{id}', [MessageController::class, 'deleteMessage']);
});

// Call Routes (Protected)
Route::middleware('auth:sanctum')->prefix('calls')->group(function () {
    Route::post('/token', [CallController::class, 'generateToken']);
    Route::post('/start', [CallController::class, 'startCall']);
    Route::put('/{id}/answer', [CallController::class, 'answerCall']);
    Route::put('/{id}/reject', [CallController::class, 'rejectCall']);
    Route::put('/{id}/end', [CallController::class, 'endCall']);
    Route::get('/{id}/status', [CallController::class, 'getStatus']);
});

// Prescription Routes (Protected)
Route::middleware('auth:sanctum')->prefix('prescriptions')->group(function () {
    Route::get('/', [PrescriptionController::class, 'index']);
    Route::get('/{id}', [PrescriptionController::class, 'show']);
    Route::put('/{id}', [PrescriptionController::class, 'update']);
    Route::get('/{id}/download', [PrescriptionController::class, 'download']);
});

// Review Routes (Protected)
Route::middleware('auth:sanctum')->prefix('reviews')->group(function () {
    Route::post('/{id}/report', [FeedbackController::class, 'reportReview']);
});
