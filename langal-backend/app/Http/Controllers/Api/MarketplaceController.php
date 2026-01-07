<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceListing;
use App\Models\MarketplaceListingSave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MarketplaceController extends Controller
{
    /**
     * GET /api/marketplace/categories
     * Get all active marketplace categories
     */
    public function getCategories()
    {
        $categories = DB::table('marketplace_categories')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->select('category_id', 'category_name', 'category_name_bn', 'icon_url', 'description')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * GET /api/marketplace
     * Query params: search, category_id, type, location, division, district, upazila, user_upazila, status, sortBy(newest|oldest|price_low|price_high|popular), page, per_page
     */
    public function index(Request $request)
    {
        try {
            $query = MarketplaceListing::query()
                ->with(['category', 'seller.profile']);

        // Filters
        if ($search = $request->string('search')->toString()) {
            // Try FULLTEXT if exists, else fallback to LIKE
            $query->where(function ($q) use ($search) {
                $q->whereRaw('MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)', [$search])
                  ->orWhere('title', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhereJsonContains('tags', $search);
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', (int) $request->category_id);
        }

        if ($type = $request->string('type')->toString()) {
            $query->where('listing_type', $type);
        }

        // Location filtering using postal_code -> location table join
        $division = $request->string('division')->toString();
        $district = $request->string('district')->toString();
        $upazila = $request->string('upazila')->toString();
        
        $hasLocationFilter = !empty($division) || !empty($district) || !empty($upazila);
        
        if ($hasLocationFilter) {
            // Get postal codes matching the location criteria
            $locationQuery = DB::table('location')->select('postal_code');
            
            if (!empty($division)) {
                $locationQuery->where('division_bn', $division);
            }
            
            if (!empty($district)) {
                $locationQuery->where('district_bn', $district);
            }
            
            if (!empty($upazila)) {
                $locationQuery->where('upazila_bn', $upazila);
            }
            
            $matchingPostalCodes = $locationQuery->pluck('postal_code')->toArray();
            
            // Filter listings - strict matching (no loose fallback to avoid showing wrong locations)
            if (!empty($matchingPostalCodes)) {
                // If we found matching postal codes, filter by them
                $query->where(function($q) use ($matchingPostalCodes, $upazila, $district, $division) {
                    $q->whereIn('postal_code', $matchingPostalCodes);
                    
                    // Only add text fallback for the MOST SPECIFIC filter selected
                    // This prevents showing district matches when upazila is selected
                    if (!empty($upazila)) {
                        $q->orWhere('full_location_bn', 'like', "%$upazila%");
                    } elseif (!empty($district)) {
                        $q->orWhere('full_location_bn', 'like', "%$district%");
                    } elseif (!empty($division)) {
                        $q->orWhere('full_location_bn', 'like', "%$division%");
                    }
                });
            } else {
                // No postal codes found, try text search on the most specific filter only
                if (!empty($upazila)) {
                    $query->where('full_location_bn', 'like', "%$upazila%");
                } elseif (!empty($district)) {
                    $query->where('full_location_bn', 'like', "%$district%");
                } elseif (!empty($division)) {
                    $query->where('full_location_bn', 'like', "%$division%");
                }
            }
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        } else {
            $query->where('status', 'active');
        }

        // Get user's location info for proximity-based sorting
        $userVillage = $request->string('user_village')->toString();
        $userPostalCode = $request->string('user_postal_code')->toString();
        $userUpazila = $request->string('user_upazila')->toString();
        $userDistrict = $request->string('user_district')->toString();
        $userDivision = $request->string('user_division')->toString();

        // Sorting with proximity priority: village -> postal_code -> upazila -> district -> division
        $sortBy = $request->string('sortBy')->toString() ?: 'newest';
        
        // Build proximity-based ordering
        // Priority: 0 = same village, 1 = same postal_code, 2 = same upazila, 3 = same district, 4 = same division, 5 = others
        $hasUserLocation = $userVillage || $userPostalCode || $userUpazila || $userDistrict || $userDivision;
        
        if ($hasUserLocation) {
            $caseStatements = [];
            $bindings = [];
            
            // Priority 0: Same village
            if ($userVillage) {
                $caseStatements[] = "WHEN village = ? THEN 0";
                $bindings[] = $userVillage;
            }
            
            // Priority 1: Same postal_code (post office)
            if ($userPostalCode) {
                $caseStatements[] = "WHEN postal_code = ? THEN 1";
                $bindings[] = $userPostalCode;
            }
            
            // Priority 2: Same upazila
            if ($userUpazila) {
                $caseStatements[] = "WHEN full_location_bn LIKE ? THEN 2";
                $bindings[] = "%$userUpazila%";
            }
            
            // Priority 3: Same district
            if ($userDistrict) {
                $caseStatements[] = "WHEN full_location_bn LIKE ? THEN 3";
                $bindings[] = "%$userDistrict%";
            }
            
            // Priority 4: Same division
            if ($userDivision) {
                $caseStatements[] = "WHEN full_location_bn LIKE ? THEN 4";
                $bindings[] = "%$userDivision%";
            }
            
            if (!empty($caseStatements)) {
                $caseQuery = "CASE " . implode(" ", $caseStatements) . " ELSE 5 END";
                $query->orderByRaw($caseQuery, $bindings);
            }
        }
        
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;
            case 'newest':
            default:
                // boosted_at takes priority over created_at
                $query->orderByRaw('COALESCE(boosted_at, created_at) DESC');
                break;
        }

        $perPage = (int) ($request->per_page ?? 12);
        $listings = $query->paginate($perPage);
        
        // Get current user_id from request for is_saved check
        $currentUserId = $request->integer('user_id', 0);
        
        // Get all saved listing IDs for this user in one query
        $savedListingIds = [];
        if ($currentUserId > 0) {
            $savedListingIds = MarketplaceListingSave::where('user_id', $currentUserId)
                ->pluck('listing_id')
                ->toArray();
        }
        
        // Transform data to include proper category/type names
        $listings->getCollection()->transform(function ($listing) use ($savedListingIds) {
            return $this->transformListing($listing, $savedListingIds);
        });

        return response()->json([
            'success' => true,
            'data' => $listings,
        ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Marketplace Index Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /** GET /api/marketplace/{id} */
    public function show(int $id)
    {
        try {
            $listing = MarketplaceListing::with(['category', 'seller.profile'])
                ->find($id);

            if (!$listing) {
                return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
            }

            return response()->json(['success' => true, 'data' => $this->transformListing($listing)]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Marketplace Show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /** POST /api/marketplace */
    public function store(Request $request)
    {
        try {
            // Get authenticated user - this is the primary source for seller_id
            $authenticatedUserId = $request->user() ? $request->user()->user_id : null;
        
        // Validation rules - seller_id is not validated here since we use authenticated user
        $validator = Validator::make($request->all(), [
            'category_id' => 'nullable|integer|exists:marketplace_categories,category_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'type' => 'nullable|string|in:sell,rent,buy,service',
            'listing_type' => 'nullable|string|in:sell,rent,buy,service',
            // New structured location fields
            'postal_code' => 'nullable|integer|exists:location,postal_code',
            'village' => 'nullable|string|max:100',
            'full_location_bn' => 'nullable|string|max:255',
            // Legacy location field (will be stored in full_location_bn)
            'location' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:30',
            'tags' => 'nullable|array',
            'images' => 'nullable|array', // Array of image paths from upload endpoint
            'images.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Set seller_id from authenticated user (required)
        if ($authenticatedUserId) {
            $data['seller_id'] = $authenticatedUserId;
        } else {
            return response()->json(['success' => false, 'message' => 'Authentication required to create listing'], 401);
        }
        
        // Normalize type -> listing_type
        if (isset($data['type']) && !isset($data['listing_type'])) {
            $data['listing_type'] = $data['type'];
            unset($data['type']);
        }
        
        // Handle location - build full_location_bn from postal_code and village
        $village = $data['village'] ?? null;
        $postalCode = $data['postal_code'] ?? null;
        
        // If postal_code provided, fetch location data and format full_location_bn
        if ($postalCode && empty($data['full_location_bn'])) {
            $locationData = DB::table('location')->where('postal_code', $postalCode)->first();
            if ($locationData) {
                $addressParts = [];
                if ($village) $addressParts[] = $village;
                if ($locationData->post_office_bn) $addressParts[] = $locationData->post_office_bn;
                if ($locationData->upazila_bn) $addressParts[] = $locationData->upazila_bn;
                if ($locationData->district_bn) $addressParts[] = $locationData->district_bn;
                $data['full_location_bn'] = implode(', ', $addressParts);
            }
        }
        
        // Fallback: use location field if full_location_bn still empty
        $locationValue = $data['location'] ?? null;
        if (!empty($locationValue) && empty($data['full_location_bn'])) {
            $data['full_location_bn'] = $locationValue;
        }
        unset($data['location']); // Remove location as it's not a column
        
        // Ensure full_location_bn has a value (required field)
        if (empty($data['full_location_bn'])) {
            $data['full_location_bn'] = 'বাংলাদেশ';
        }
        
        // Ensure listing_type has a value (required field)
        if (empty($data['listing_type'])) {
            $data['listing_type'] = 'sell';
        }

        $data['status'] = $data['status'] ?? 'active';
        $data['saves_count'] = 0;
        $data['views_count'] = 0;
        $data['contacts_count'] = 0;

        $listing = MarketplaceListing::create($data);

            return response()->json(['success' => true, 'data' => $listing], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Marketplace Store Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /** PUT /api/marketplace/{id} */
    public function update(Request $request, int $id)
    {
        $listing = MarketplaceListing::find($id);
        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|integer|exists:marketplace_categories,category_id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|max:10',
            'listing_type' => 'sometimes|string|in:sell,rent,buy,service',
            'type' => 'sometimes|string|in:sell,rent,buy,service',
            'location' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|nullable|integer',
            'village' => 'sometimes|nullable|string|max:255',
            'contact_phone' => 'sometimes|string|max:30',
            'tags' => 'sometimes|array',
            'images' => 'sometimes|array',
            'images.*' => 'string',
            'status' => 'sometimes|string|in:active,paused,sold,expired,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        if (isset($data['type'])) {
            $data['listing_type'] = $data['type'];
            unset($data['type']);
        }
        
        // Map location to full_location_bn for consistency
        if (isset($data['location'])) {
            $data['full_location_bn'] = $data['location'];
            unset($data['location']);
        }

        $listing->update($data);
        
        // Reload listing with relationships for proper transformation
        $listing->load(['category', 'seller.profile']);

        return response()->json(['success' => true, 'data' => $this->transformListing($listing)]);
    }

    /** DELETE /api/marketplace/{id} */
    public function destroy(int $id)
    {
        $listing = MarketplaceListing::find($id);
        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
        }

        $listing->delete();
        return response()->json(['success' => true, 'message' => 'Listing deleted']);
    }

    /** GET /api/marketplace/user/{userId} */
    public function userListings(int $userId)
    {
        $listings = MarketplaceListing::with(['category', 'seller.profile'])
            ->where('seller_id', $userId)
            ->orderByDesc('created_at')
            ->get();
        
        // Transform listings to include category_slug
        $transformedListings = $listings->map(function ($listing) {
            return $this->transformListing($listing);
        });
        
        return response()->json(['success' => true, 'data' => $transformedListings]);
    }

    /** GET /api/marketplace/saved/{userId} */
    public function savedListings(int $userId)
    {
        // Get saved listing IDs for this user from marketplace_listing_saves table
        $savedListingIds = DB::table('marketplace_listing_saves')
            ->where('user_id', $userId)
            ->pluck('listing_id');
        
        $listings = MarketplaceListing::with(['category', 'seller.profile'])
            ->whereIn('listing_id', $savedListingIds)
            ->where('status', 'active')
            ->orderByDesc('created_at')
            ->get();
        
        // Transform listings
        $transformedListings = $listings->map(function ($listing) {
            return $this->transformListing($listing);
        });
            
        return response()->json(['success' => true, 'data' => $transformedListings]);
    }

    /** POST /api/marketplace/{id}/view */
    public function incrementView(int $id)
    {
        $updated = MarketplaceListing::where('listing_id', $id)
            ->update(['views_count' => DB::raw('COALESCE(views_count,0) + 1')]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
        }
        return response()->json(['success' => true]);
    }

    /** POST /api/marketplace/{id}/contact */
    public function incrementContact(int $id)
    {
        $updated = MarketplaceListing::where('listing_id', $id)
            ->update(['contacts_count' => DB::raw('COALESCE(contacts_count,0) + 1')]);
        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
        }
        return response()->json(['success' => true]);
    }

    /** POST /api/marketplace/{id}/save (toggle) */
    public function toggleSave(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $userId = (int) $request->user_id;

        $existing = MarketplaceListingSave::where('listing_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            MarketplaceListing::where('listing_id', $id)
                ->update(['saves_count' => DB::raw('GREATEST(COALESCE(saves_count,0) - 1, 0)')]);
            return response()->json(['success' => true, 'saved' => false]);
        }

        MarketplaceListingSave::create(['listing_id' => $id, 'user_id' => $userId]);
        MarketplaceListing::where('listing_id', $id)
            ->update(['saves_count' => DB::raw('COALESCE(saves_count,0) + 1')]);
        return response()->json(['success' => true, 'saved' => true]);
    }

    /** POST /api/marketplace/{id}/boost - Boost listing to top of feed */
    public function boostListing(Request $request, int $id)
    {
        $listing = MarketplaceListing::find($id);
        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Listing not found'], 404);
        }

        // Optional: Check if the user owns this listing
        // $userId = $request->user_id;
        // if ($listing->seller_id !== $userId) {
        //     return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        // }

        // Update boosted_at to current time
        $listing->boosted_at = now();
        $listing->save();

        return response()->json([
            'success' => true,
            'message' => 'বিজ্ঞাপন বুস্ট করা হয়েছে',
            'boosted_at' => $listing->boosted_at,
            'data' => $this->transformListing($listing)
        ]);
    }
    
    /**
     * Transform listing data to include proper category/type names and seller info
     */
    private function transformListing($listing, array $savedListingIds = [])
    {
        $data = $listing->toArray();
        
        // Check if this listing is saved by the current user
        $data['is_saved'] = in_array($listing->listing_id, $savedListingIds);
        
        // Add category name in Bangla and slug for color mapping
        if ($listing->category) {
            $data['category_name'] = $listing->category->category_name;
            $data['category_name_bn'] = $listing->category->category_name_bn;
            $data['category_slug'] = $listing->category->slug;
        }
        
        // Add listing type in Bangla
        $typeMap = [
            'sell' => 'বিক্রয়',
            'rent' => 'ভাড়া',
            'buy' => 'কিনতে চাই',
            'service' => 'সেবা'
        ];
        $data['listing_type_bn'] = $typeMap[$listing->listing_type] ?? $listing->listing_type;
        
        // Map full_location_bn to location for frontend compatibility
        if (!empty($data['full_location_bn'])) {
            $data['location'] = $data['full_location_bn'];
        } elseif ($listing->postal_code) {
            // Fallback: Build location from location table
            $locationData = DB::table('location')
                ->where('postal_code', $listing->postal_code)
                ->first();
            if ($locationData) {
                $locationParts = array_filter([
                    $locationData->upazila_bn ?? $locationData->upazila ?? null,
                    $locationData->district_bn ?? $locationData->district ?? null,
                ]);
                $data['location'] = implode(', ', $locationParts);
            }
        }
        
        // Add location details from location table if postal_code exists
        if ($listing->postal_code) {
            $locationData = $locationData ?? DB::table('location')
                ->where('postal_code', $listing->postal_code)
                ->first();
            
            if ($locationData) {
                $data['location_details'] = [
                    'postal_code' => $listing->postal_code,
                    'district' => $locationData->district,
                    'upazila' => $locationData->upazila,
                    'division' => $locationData->division,
                    'village' => $listing->village,
                ];
            }
        }
        
        // Add seller info with avatar
        if ($listing->seller && $listing->seller->profile) {
            // Use the accessor we fixed in UserProfile model
            $profilePhotoUrl = $listing->seller->profile->profile_photo_url_full;
            
            $data['seller_info'] = [
                'user_id' => $listing->seller->user_id,
                'name' => $listing->seller->profile->full_name ?? 'User',
                'avatar' => $profilePhotoUrl,
                'phone' => $listing->seller->phone,
                'district' => $listing->seller->profile->district,
                'upazila' => $listing->seller->profile->upazila,
                'post_office' => $listing->seller->profile->post_office,
                'verified' => $listing->seller->is_verified,
                'user_type' => $listing->seller->user_type,
            ];
        }
        
        return $data;
    }
}
