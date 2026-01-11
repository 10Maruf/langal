<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FieldDataCollection;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class FieldDataCollectionController extends Controller
{
    /**
     * Get all field data collections (with filters)
     */
    public function index(Request $request)
    {
        try {
            $query = FieldDataCollection::with(['dataOperator', 'farmer', 'verifiedBy']);

            // Filter by data operator (if not admin)
            $user = Auth::user();
            if ($user->user_type === 'data_operator') {
                $query->byOperator($user->user_id);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('verification_status', $request->status);
            }

            // Filter by farmer
            if ($request->has('farmer_id')) {
                $query->byFarmer($request->farmer_id);
            }

            // Filter by year
            if ($request->has('year')) {
                $query->byYear($request->year);
            }

            // Search by farmer name or phone
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('farmer_name', 'like', "%{$search}%")
                      ->orWhere('farmer_phone', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $data = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Field Data Collection List Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch field data collections',
                'message_bn' => 'ফিল্ড ডেটা লোড করতে ব্যর্থ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new field data collection
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'nullable|exists:users,user_id',
            'farmer_name' => 'nullable|string|max:255',
            'farmer_phone' => 'nullable|string|max:20',
            'farmer_address' => 'nullable|string',
            'land_size' => 'nullable|numeric|min:0',
            'land_size_unit' => 'nullable|in:decimal,bigha,katha,acre',
            'land_service_date' => 'nullable|date',
            'irrigation_status' => 'nullable|string',
            'season' => 'nullable|string',
            'crop_type' => 'nullable|string',
            'organic_fertilizer_application' => 'nullable|string',
            'fertilizer_application' => 'nullable|string',
            'market_price' => 'nullable|numeric|min:0',
            'ph_value' => 'nullable|numeric|min:0|max:14',
            'expenses' => 'nullable|numeric|min:0',
            'production_amount' => 'nullable|numeric|min:0',
            'production_unit' => 'nullable|in:kg,maund,ton,quintal',
            'available_resources' => 'nullable|string',
            'collection_year' => 'nullable|integer|min:2000|max:2100',
            'notes' => 'nullable|string',
            'postal_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'message_bn' => 'ভ্যালিডেশন ব্যর্থ',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user = Auth::user();

            // Verify user is data operator
            if ($user->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can create field data',
                    'message_bn' => 'অনুমোদিত নয়। শুধুমাত্র ডেটা অপারেটর ফিল্ড ডেটা তৈরি করতে পারবেন',
                ], 403);
            }

            // Log incoming request for debugging
            Log::info('Field Data Collection Request:', [
                'user_id' => $user->user_id,
                'farmer_id' => $request->farmer_id,
                'manual_farmer_id' => $request->manual_farmer_id,
                'data_received' => $request->all()
            ]);

            // Get location data from request or fetch from location table using postal_code
            $division = $request->division ?? '';
            $district = $request->district ?? '';
            $upazila = $request->upazila ?? '';
            $union = $request->union ?? '';

            // If location fields are empty but postal_code is provided, fetch from location table
            if (empty($division) && !empty($request->postal_code)) {
                $locationData = DB::table('location')
                    ->where('postal_code', $request->postal_code)
                    ->first();
                
                if ($locationData) {
                    $division = $locationData->division_bn ?? $locationData->division ?? '';
                    $district = $locationData->district_bn ?? $locationData->district ?? '';
                    $upazila = $locationData->upazila_bn ?? $locationData->upazila ?? '';
                    $union = $locationData->post_office_bn ?? $locationData->post_office ?? '';
                    
                    Log::info('Location fetched from postal_code:', [
                        'postal_code' => $request->postal_code,
                        'division' => $division,
                        'district' => $district,
                        'upazila' => $upazila,
                        'union' => $union,
                    ]);
                }
            }

            // Prepare farmer details
            $farmerName = $request->farmer_name;
            $farmerPhone = $request->farmer_phone;
            $farmerAddress = $request->farmer_address;

            if ($request->farmer_id) {
                $farmerUser = User::with('profile')->find($request->farmer_id);
                if ($farmerUser) {
                    $farmerName = $farmerUser->profile->full_name ?? $farmerUser->name ?? $farmerName;
                    $farmerPhone = $farmerUser->phone ?? $farmerPhone;
                    $farmerAddress = $farmerUser->profile->address ?? $farmerAddress;
                }
            } elseif ($request->manual_farmer_id) {
                $manualFarmer = \App\Models\FieldDataFarmer::find($request->manual_farmer_id);
                if ($manualFarmer) {
                    $farmerName = $manualFarmer->full_name;
                    $farmerPhone = $manualFarmer->phone;
                    $farmerAddress = $manualFarmer->address;
                }
            }

            $fieldData = FieldDataCollection::create([
                'data_operator_id' => $user->user_id,
                'farmer_id' => $request->farmer_id,
                'manual_farmer_id' => $request->manual_farmer_id,
                'farmer_name' => $farmerName ?? ($request->farmer_id ? 'Farmer #' . $request->farmer_id : 'Unknown Farmer'),
                'farmer_phone' => $farmerPhone,
                'farmer_address' => $farmerAddress,
                
                // Location fields
                'postal_code' => $request->postal_code,
                'division' => $division,
                'district' => $district,
                'upazila' => $upazila,
                'union' => $union,
                'village' => $request->village,

                // Other fields
                'land_size' => $request->land_size,
                'land_size_unit' => $request->land_size_unit ?? 'decimal',
                'land_service_date' => $request->land_service_date,
                'irrigation_status' => $request->irrigation_status,
                'season' => $request->season,
                'crop_type' => $request->crop_type,
                'organic_fertilizer_application' => $request->organic_fertilizer_application,
                'fertilizer_application' => $request->fertilizer_application,
                'market_price' => $request->market_price,
                'ph_value' => $request->ph_value,
                'expenses' => $request->expenses,
                'production_amount' => $request->production_amount,
                'production_unit' => $request->production_unit ?? 'kg',
                'available_resources' => $request->available_resources,
                'collection_year' => $request->collection_year ?? date('Y'),
                'notes' => $request->notes,
                'verification_status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Field data collected successfully',
                'message_bn' => 'ফিল্ড ডেটা সফলভাবে সংগ্রহ করা হয়েছে',
                'data' => $fieldData->load(['dataOperator', 'farmer']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Field Data Collection Store Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to store field data',
                'message_bn' => 'ফিল্ড ডেটা সংরক্ষণ করতে ব্যর্থ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single field data collection
     */
    public function show($id)
    {
        try {
            $fieldData = FieldDataCollection::with(['dataOperator', 'farmer', 'verifiedBy'])
                ->findOrFail($id);

            $user = Auth::user();
            
            // Check authorization
            if ($user->user_type === 'data_operator' && $fieldData->data_operator_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                    'message_bn' => 'অননুমোদিত অ্যাক্সেস',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $fieldData,
            ]);
        } catch (\Exception $e) {
            Log::error('Field Data Collection Show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Field data not found',
                'message_bn' => 'ফিল্ড ডেটা পাওয়া যায়নি',
            ], 404);
        }
    }

    /**
     * Update field data collection
     */
    public function update(Request $request, $id)
    {
        // ... (validation omitted)

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'message_bn' => 'ভ্যালিডেশন ব্যর্থ',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $fieldData = FieldDataCollection::findOrFail($id);
            $user = Auth::user();

            // Check authorization
            if ($user->user_type === 'data_operator' && $fieldData->data_operator_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                    'message_bn' => 'অননুমোদিত অ্যাক্সেস',
                ], 403);
            }

            // Don't allow update if already verified
            if ($fieldData->verification_status === 'verified') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot update verified data',
                    'message_bn' => 'যাচাইকৃত ডেটা আপডেট করা যাবে না',
                ], 403);
            }

            DB::beginTransaction();

            $fieldData->update($request->only([
                'farmer_name', 'farmer_phone', 'farmer_address',
                'land_size', 'land_size_unit', 'livestock_info',
                'land_service_date', 'irrigation_status',
                'season', 'crop_type', 'organic_fertilizer_application',
                'fertilizer_application', 'tree_fertilizer_info',
                'market_price', 'ph_value', 'expenses',
                'production_amount', 'production_unit',
                'crop_calculation', 'available_resources',
                'seminar_name', 'identity_number', 'collection_year',
                'notes', 'latitude', 'longitude',
            ]));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Field data updated successfully',
                'message_bn' => 'ফিল্ড ডেটা সফলভাবে আপডেট করা হয়েছে',
                'data' => $fieldData->load(['dataOperator', 'farmer']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Field Data Collection Update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update field data',
                'message_bn' => 'ফিল্ড ডেটা আপডেট করতে ব্যর্থ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete field data collection (soft delete)
     */
    public function destroy($id)
    {
        try {
            $fieldData = FieldDataCollection::findOrFail($id);
            $user = Auth::user();

            // Check authorization
            if ($user->user_type === 'data_operator' && $fieldData->data_operator_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                    'message_bn' => 'অননুমোদিত অ্যাক্সেস',
                ], 403);
            }

            // Don't allow delete if already verified
            if ($fieldData->verification_status === 'verified') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete verified data',
                    'message_bn' => 'যাচাইকৃত ডেটা মুছে ফেলা যাবে না',
                ], 403);
            }

            $fieldData->delete();

            return response()->json([
                'success' => true,
                'message' => 'Field data deleted successfully',
                'message_bn' => 'ফিল্ড ডেটা সফলভাবে মুছে ফেলা হয়েছে',
            ]);

        } catch (\Exception $e) {
            Log::error('Field Data Collection Delete Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete field data',
                'message_bn' => 'ফিল্ড ডেটা মুছে ফেলতে ব্যর্থ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics for data operator
     */
    public function statistics(Request $request)
    {
        try {
            $user = Auth::user();
            $query = FieldDataCollection::query();

            if ($user->user_type === 'data_operator') {
                $query->byOperator($user->user_id);
            }

            $year = $request->get('year', date('Y'));
            $query->byYear($year);

            // Get counts for verification statuses
            $total = $query->count();
            $pending = (clone $query)->pending()->count();
            $verified = (clone $query)->verified()->count();
            $rejected = (clone $query)->rejected()->count();
            
            // Get time-based counts
            $thisMonth = (clone $query)->whereMonth('created_at', date('m'))->count();
            $today = (clone $query)->whereDate('created_at', today())->count();
            
            // Get farmer type breakdown
            $registeredFarmers = (clone $query)->whereNotNull('farmer_id')->count();
            $manualFarmers = (clone $query)->whereNotNull('manual_farmer_id')->whereNull('farmer_id')->count();
            
            // Get unique farmer count from field_data_farmers table (manual entries)
            $uniqueManualFarmers = \App\Models\FieldDataFarmer::query();
            if ($user->user_type === 'data_operator') {
                $uniqueManualFarmers->where('created_by', $user->user_id);
            }
            $totalManualFarmersCreated = $uniqueManualFarmers->count();

            $stats = [
                'total' => $total,
                'pending' => $pending,
                'verified' => $verified,
                'rejected' => $rejected,
                'this_month' => $thisMonth,
                'today' => $today,
                'registered_farmers' => $registeredFarmers,
                'manual_farmers' => $manualFarmers,
                'total_manual_farmers_created' => $totalManualFarmersCreated,
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            Log::error('Field Data Statistics Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'message_bn' => 'পরিসংখ্যান লোড করতে ব্যর্থ',
            ], 500);
        }
    }

    /**
     * Verify field data (admin/supervisor only)
     */
    public function verify(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:verified,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $fieldData = FieldDataCollection::findOrFail($id);
            $user = Auth::user();

            // Only admin or supervisor can verify
            if (!in_array($user->user_type, ['admin', 'data_operator'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                    'message_bn' => 'অননুমোদিত',
                ], 403);
            }

            $fieldData->update([
                'verification_status' => $request->status,
                'verification_notes' => $request->notes,
                'verified_at' => now(),
                'verified_by' => $user->user_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Field data verification updated',
                'message_bn' => 'ফিল্ড ডেটা যাচাইকরণ আপডেট করা হয়েছে',
                'data' => $fieldData->load(['dataOperator', 'farmer', 'verifiedBy']),
            ]);

        } catch (\Exception $e) {
            Log::error('Field Data Verification Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Verification failed',
                'message_bn' => 'যাচাইকরণ ব্যর্থ',
            ], 500);
        }
    }
}
