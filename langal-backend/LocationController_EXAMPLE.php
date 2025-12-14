<?php
/**
 * Example API endpoint to get locations with Bangla support
 * Place this in: langal-backend/routes/api.php or create a controller
 */

// Example Controller Code:
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    /**
     * Get all locations with optional language support
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLocations(Request $request)
    {
        $lang = $request->query('lang', 'en'); // Default to English
        
        $locations = DB::table('location')->get();
        
        if ($lang === 'bn') {
            // Return Bangla version
            $locations = $locations->map(function ($location) {
                return [
                    'postal_code' => $location->postal_code,
                    'post_office' => $location->post_office_bn ?? $location->post_office,
                    'upazila' => $location->upazila_bn ?? $location->upazila,
                    'district' => $location->district_bn ?? $location->district,
                    'division' => $location->division_bn ?? $location->division,
                ];
            });
        } else {
            // Return English version
            $locations = $locations->map(function ($location) {
                return [
                    'postal_code' => $location->postal_code,
                    'post_office' => $location->post_office,
                    'upazila' => $location->upazila,
                    'district' => $location->district,
                    'division' => $location->division,
                ];
            });
        }
        
        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }
    
    /**
     * Get locations with both languages
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLocationsBilingual()
    {
        $locations = DB::table('location')
            ->select(
                'postal_code',
                'post_office',
                'post_office_bn',
                'upazila',
                'upazila_bn',
                'district',
                'district_bn',
                'division',
                'division_bn'
            )
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }
    
    /**
     * Get divisions (unique)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDivisions(Request $request)
    {
        $lang = $request->query('lang', 'en');
        
        $divisions = DB::table('location')
            ->select('division', 'division_bn')
            ->distinct()
            ->get();
        
        if ($lang === 'bn') {
            $divisions = $divisions->pluck('division_bn', 'division');
        } else {
            $divisions = $divisions->pluck('division');
        }
        
        return response()->json([
            'success' => true,
            'data' => $divisions
        ]);
    }
    
    /**
     * Get districts by division
     * 
     * @param Request $request
     * @param string $division
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDistrictsByDivision(Request $request, $division)
    {
        $lang = $request->query('lang', 'en');
        
        $query = DB::table('location')
            ->select('district', 'district_bn')
            ->where('division', $division)
            ->distinct();
        
        $districts = $query->get();
        
        if ($lang === 'bn') {
            $result = $districts->map(function ($item) {
                return [
                    'value' => $item->district,
                    'label' => $item->district_bn ?? $item->district
                ];
            });
        } else {
            $result = $districts->map(function ($item) {
                return [
                    'value' => $item->district,
                    'label' => $item->district
                ];
            });
        }
        
        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
    
    /**
     * Get upazilas by district
     * 
     * @param Request $request
     * @param string $district
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUpazilasByDistrict(Request $request, $district)
    {
        $lang = $request->query('lang', 'en');
        
        $query = DB::table('location')
            ->select('upazila', 'upazila_bn')
            ->where('district', $district)
            ->distinct();
        
        $upazilas = $query->get();
        
        if ($lang === 'bn') {
            $result = $upazilas->map(function ($item) {
                return [
                    'value' => $item->upazila,
                    'label' => $item->upazila_bn ?? $item->upazila
                ];
            });
        } else {
            $result = $upazilas->map(function ($item) {
                return [
                    'value' => $item->upazila,
                    'label' => $item->upazila
                ];
            });
        }
        
        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
    
    /**
     * Search locations by postal code
     * 
     * @param Request $request
     * @param int $postalCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLocationByPostalCode(Request $request, $postalCode)
    {
        $lang = $request->query('lang', 'en');
        
        $location = DB::table('location')
            ->where('postal_code', $postalCode)
            ->first();
        
        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }
        
        if ($lang === 'bn') {
            $result = [
                'postal_code' => $location->postal_code,
                'post_office' => $location->post_office_bn ?? $location->post_office,
                'upazila' => $location->upazila_bn ?? $location->upazila,
                'district' => $location->district_bn ?? $location->district,
                'division' => $location->division_bn ?? $location->division,
            ];
        } else {
            $result = [
                'postal_code' => $location->postal_code,
                'post_office' => $location->post_office,
                'upazila' => $location->upazila,
                'district' => $location->district,
                'division' => $location->division,
            ];
        }
        
        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
}


/**
 * API Routes to add in routes/api.php:
 * 
 * Route::prefix('locations')->group(function () {
 *     Route::get('/', [LocationController::class, 'getLocations']);
 *     Route::get('/bilingual', [LocationController::class, 'getLocationsBilingual']);
 *     Route::get('/divisions', [LocationController::class, 'getDivisions']);
 *     Route::get('/districts/{division}', [LocationController::class, 'getDistrictsByDivision']);
 *     Route::get('/upazilas/{district}', [LocationController::class, 'getUpazilasByDistrict']);
 *     Route::get('/postal/{postalCode}', [LocationController::class, 'getLocationByPostalCode']);
 * });
 * 
 * Usage Examples:
 * - GET /api/locations?lang=bn  (Bangla)
 * - GET /api/locations?lang=en  (English)
 * - GET /api/locations/divisions?lang=bn
 * - GET /api/locations/districts/Dhaka?lang=bn
 * - GET /api/locations/postal/1000?lang=bn
 */
