<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FieldDataCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FieldDataStatisticsController extends Controller
{
    /**
     * Get comprehensive statistics for government reports
     */
    public function getComprehensiveStats(Request $request)
    {
        try {
            $user = Auth::user();

            // Filters
            $division = $request->division;
            $district = $request->district;
            $upazila = $request->upazila;
            $year = $request->year ?? date('Y');
            $month = $request->month;
            $season = $request->season;

            // Base query - use collection_date or created_at for year filtering
            $query = FieldDataCollection::query()
                ->whereYear('collection_date', $year);

            // Apply location filters
            if ($division) {
                $query->where(function($q) use ($division) {
                    $q->where('division_bn', $division)
                      ->orWhere('division', $division);
                });
            }
            if ($district) {
                $query->where(function($q) use ($district) {
                    $q->where('district_bn', $district)
                      ->orWhere('district', $district);
                });
            }
            if ($upazila) {
                $query->where(function($q) use ($upazila) {
                    $q->where('upazila_bn', $upazila)
                      ->orWhere('upazila', $upazila);
                });
            }
            if ($month) {
                $query->whereMonth('collection_date', $month);
            }
            if ($season) {
                $query->where('season', $season);
            }

            // Overview Statistics
            $overview = $this->getOverviewStats($query);

            // Farmer Demographics
            $farmerDemographics = $this->getFarmerDemographics($query);

            // Land Statistics
            $landStats = $this->getLandStatistics($query);

            // Crop Statistics
            $cropStats = $this->getCropStatistics($query);

            // Fertilizer Usage
            $fertilizerStats = $this->getFertilizerStatistics($query);

            // Financial Statistics
            $financialStats = $this->getFinancialStatistics($query);

            // Challenge Analysis
            $challengeStats = $this->getChallengeStatistics($query);

            // Location Breakdown
            $locationBreakdown = $this->getLocationBreakdown($query, $division, $district, $upazila);

            // Monthly Trend
            $monthlyTrend = $this->getMonthlyTrend($year, $division, $district, $upazila);

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => $overview,
                    'farmerDemographics' => $farmerDemographics,
                    'landStats' => $landStats,
                    'cropStats' => $cropStats,
                    'fertilizerStats' => $fertilizerStats,
                    'financialStats' => $financialStats,
                    'challengeStats' => $challengeStats,
                    'locationBreakdown' => $locationBreakdown,
                    'monthlyTrend' => $monthlyTrend,
                ],
                'filters' => [
                    'division' => $division,
                    'district' => $district,
                    'upazila' => $upazila,
                    'year' => $year,
                    'month' => $month,
                    'season' => $season,
                ],
                'generated_at' => now()->format('Y-m-d H:i:s'),
            ]);

        } catch (\Exception $e) {
            Log::error('Comprehensive Stats Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'message_bn' => 'পরিসংখ্যান লোড করতে ব্যর্থ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get overview statistics
     */
    private function getOverviewStats($query)
    {
        $clonedQuery = clone $query;

        return [
            'totalFarmers' => $clonedQuery->count(),
            'totalLandArea' => (clone $query)->sum('total_land') ?? 0,
            'averageLandSize' => (clone $query)->avg('total_land') ?? 0,
            'totalProduction' => (clone $query)->sum('total_production') ?? 0,
            'averageProduction' => (clone $query)->avg('total_production') ?? 0,
            'totalExpenses' => (clone $query)->sum('total_expenses') ?? 0,
            'averageExpenses' => (clone $query)->avg('total_expenses') ?? 0,
            'totalMarketValue' => (clone $query)->sum(DB::raw('COALESCE(total_production, 0) * COALESCE(current_market_price, 0)')) ?? 0,
            'verifiedCount' => (clone $query)->where('verification_status', 'verified')->count(),
            'pendingCount' => (clone $query)->where('verification_status', 'pending')->count(),
        ];
    }

    /**
     * Get farmer demographics
     */
    private function getFarmerDemographics($query)
    {
        // Age distribution (from farmer_dob)
        $ageDistribution = (clone $query)
            ->select(DB::raw("
                CASE
                    WHEN TIMESTAMPDIFF(YEAR, farmer_dob, CURDATE()) < 25 THEN '১৮-২৫ বছর'
                    WHEN TIMESTAMPDIFF(YEAR, farmer_dob, CURDATE()) BETWEEN 25 AND 35 THEN '২৫-৩৫ বছর'
                    WHEN TIMESTAMPDIFF(YEAR, farmer_dob, CURDATE()) BETWEEN 36 AND 45 THEN '৩৬-৪৫ বছর'
                    WHEN TIMESTAMPDIFF(YEAR, farmer_dob, CURDATE()) BETWEEN 46 AND 55 THEN '৪৬-৫৫ বছর'
                    ELSE '৫৫+ বছর'
                END as age_group,
                COUNT(*) as count
            "))
            ->whereNotNull('farmer_dob')
            ->groupBy('age_group')
            ->get();

        // Occupation distribution
        $occupationDistribution = (clone $query)
            ->select('farmer_occupation as name', DB::raw('COUNT(*) as value'))
            ->whereNotNull('farmer_occupation')
            ->groupBy('farmer_occupation')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        return [
            'ageDistribution' => $ageDistribution,
            'occupationDistribution' => $occupationDistribution,
        ];
    }

    /**
     * Get land statistics
     */
    private function getLandStatistics($query)
    {
        // Land size distribution - using total_land column
        $landSizeDistribution = (clone $query)
            ->select(DB::raw("
                CASE
                    WHEN total_land < 50 THEN 'প্রান্তিক (<৫০ শতক)'
                    WHEN total_land BETWEEN 50 AND 250 THEN 'ক্ষুদ্র (৫০-২৫০ শতক)'
                    WHEN total_land BETWEEN 251 AND 750 THEN 'মাঝারি (২৫১-৭৫০ শতক)'
                    ELSE 'বৃহৎ (৭৫০+ শতক)'
                END as category,
                CASE
                    WHEN total_land < 50 THEN 'Marginal (<50 Decimal)'
                    WHEN total_land BETWEEN 50 AND 250 THEN 'Small (50-250 Decimal)'
                    WHEN total_land BETWEEN 251 AND 750 THEN 'Medium (251-750 Decimal)'
                    ELSE 'Large (750+ Decimal)'
                END as category_en,
                COUNT(*) as count,
                SUM(total_land) as totalArea
            "))
            ->whereNotNull('total_land')
            ->groupBy('category', 'category_en')
            ->get();

        // Land ownership distribution
        $ownershipDistribution = (clone $query)
            ->select('land_ownership_type as type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('land_ownership_type')
            ->groupBy('land_ownership_type')
            ->get();

        // Irrigation status
        $irrigationStatus = (clone $query)
            ->select('irrigation_facility as type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('irrigation_facility')
            ->groupBy('irrigation_facility')
            ->get();

        // Land type distribution
        $landTypeDistribution = (clone $query)
            ->select('land_type as type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('land_type')
            ->groupBy('land_type')
            ->get();

        return [
            'landSizeDistribution' => $landSizeDistribution,
            'ownershipDistribution' => $ownershipDistribution,
            'irrigationStatus' => $irrigationStatus,
            'landTypeDistribution' => $landTypeDistribution,
            'totalLandArea' => (clone $query)->sum('total_land') ?? 0,
            'averageLandSize' => (clone $query)->avg('total_land') ?? 0,
        ];
    }

    /**
     * Get crop statistics
     */
    private function getCropStatistics($query)
    {
        // Crop type distribution - using crop_name column
        $cropDistribution = (clone $query)
            ->select('crop_name as name', DB::raw('COUNT(*) as value'))
            ->whereNotNull('crop_name')
            ->where('crop_name', '!=', '')
            ->groupBy('crop_name')
            ->orderByDesc('value')
            ->limit(15)
            ->get();

        // Season distribution
        $seasonDistribution = (clone $query)
            ->select('season as name', DB::raw('COUNT(*) as value'))
            ->whereNotNull('season')
            ->where('season', '!=', '')
            ->groupBy('season')
            ->get();

        // Production by crop - using total_production
        $productionByCrop = (clone $query)
            ->select(
                'crop_name as crop',
                DB::raw('SUM(COALESCE(total_production, 0)) as totalProduction'),
                DB::raw('AVG(COALESCE(total_production, 0)) as avgProduction'),
                DB::raw('COUNT(*) as farmerCount')
            )
            ->whereNotNull('crop_name')
            ->where('crop_name', '!=', '')
            ->groupBy('crop_name')
            ->orderByDesc('totalProduction')
            ->limit(10)
            ->get();

        // Crop variety distribution
        $cropVarietyDistribution = (clone $query)
            ->select('crop_variety as variety', DB::raw('COUNT(*) as count'))
            ->whereNotNull('crop_variety')
            ->where('crop_variety', '!=', '')
            ->groupBy('crop_variety')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return [
            'cropDistribution' => $cropDistribution,
            'seasonDistribution' => $seasonDistribution,
            'productionByCrop' => $productionByCrop,
            'cropVarietyDistribution' => $cropVarietyDistribution,
            'totalProduction' => (clone $query)->sum('total_production') ?? 0,
            'averageProduction' => (clone $query)->avg('total_production') ?? 0,
        ];
    }

    /**
     * Get fertilizer statistics
     */
    private function getFertilizerStatistics($query)
    {
        // Fertilizer usage - using specific columns from database
        // urea_amount, tsp_amount, mp_amount, dap_amount, gypsum_amount, zinc_amount
        // cow_dung, compost, vermicompost

        $organicCount = (clone $query)
            ->where(function($q) {
                $q->where('cow_dung', '>', 0)
                  ->orWhere('compost', '>', 0)
                  ->orWhere('vermicompost', '>', 0);
            })
            ->count();

        $chemicalCount = (clone $query)
            ->where(function($q) {
                $q->where('urea_amount', '>', 0)
                  ->orWhere('tsp_amount', '>', 0)
                  ->orWhere('mp_amount', '>', 0)
                  ->orWhere('dap_amount', '>', 0);
            })
            ->count();

        $totalCount = (clone $query)->count();

        // Fertilizer type usage breakdown
        $fertilizerBreakdown = [
            ['name' => 'ইউরিয়া', 'value' => (clone $query)->where('urea_amount', '>', 0)->count()],
            ['name' => 'টিএসপি', 'value' => (clone $query)->where('tsp_amount', '>', 0)->count()],
            ['name' => 'এমওপি', 'value' => (clone $query)->where('mp_amount', '>', 0)->count()],
            ['name' => 'ডিএপি', 'value' => (clone $query)->where('dap_amount', '>', 0)->count()],
            ['name' => 'জিপসাম', 'value' => (clone $query)->where('gypsum_amount', '>', 0)->count()],
            ['name' => 'জিংক', 'value' => (clone $query)->where('zinc_amount', '>', 0)->count()],
            ['name' => 'গোবর', 'value' => (clone $query)->where('cow_dung', '>', 0)->count()],
            ['name' => 'কম্পোস্ট', 'value' => (clone $query)->where('compost', '>', 0)->count()],
        ];

        return [
            'organicUsage' => [
                'count' => $organicCount,
                'percentage' => $totalCount > 0 ? round(($organicCount / $totalCount) * 100, 2) : 0,
            ],
            'chemicalUsage' => [
                'count' => $chemicalCount,
                'percentage' => $totalCount > 0 ? round(($chemicalCount / $totalCount) * 100, 2) : 0,
            ],
            'fertilizerBreakdown' => $fertilizerBreakdown,
            'bothUsage' => [
                'count' => (clone $query)
                    ->where(function($q) {
                        $q->where('cow_dung', '>', 0)
                          ->orWhere('compost', '>', 0)
                          ->orWhere('vermicompost', '>', 0);
                    })
                    ->where(function($q) {
                        $q->where('urea_amount', '>', 0)
                          ->orWhere('tsp_amount', '>', 0)
                          ->orWhere('mp_amount', '>', 0);
                    })
                    ->count(),
            ],
        ];
    }

    /**
     * Get financial statistics
     */
    private function getFinancialStatistics($query)
    {
        // Expense distribution - using total_expenses column
        $expenseDistribution = (clone $query)
            ->select(DB::raw("
                CASE
                    WHEN total_expenses < 5000 THEN '০-৫০০০ টাকা'
                    WHEN total_expenses BETWEEN 5000 AND 15000 THEN '৫০০০-১৫০০০ টাকা'
                    WHEN total_expenses BETWEEN 15001 AND 30000 THEN '১৫০০১-৩০০০০ টাকা'
                    WHEN total_expenses BETWEEN 30001 AND 50000 THEN '৩০০০১-৫০০০০ টাকা'
                    ELSE '৫০০০০+ টাকা'
                END as category,
                CASE
                    WHEN total_expenses < 5000 THEN 'BDT 0-5,000'
                    WHEN total_expenses BETWEEN 5000 AND 15000 THEN 'BDT 5,001-15,000'
                    WHEN total_expenses BETWEEN 15001 AND 30000 THEN 'BDT 15,001-30,000'
                    WHEN total_expenses BETWEEN 30001 AND 50000 THEN 'BDT 30,001-50,000'
                    ELSE 'BDT 50,000+'
                END as category_en,
                COUNT(*) as count,
                SUM(total_expenses) as totalExpense
            "))
            ->whereNotNull('total_expenses')
            ->where('total_expenses', '>', 0)
            ->groupBy('category', 'category_en')
            ->get();

        // Market price analysis - using crop_name and current_market_price
        $marketPriceStats = (clone $query)
            ->select(
                'crop_name as crop',
                DB::raw('AVG(current_market_price) as avgPrice'),
                DB::raw('MIN(current_market_price) as minPrice'),
                DB::raw('MAX(current_market_price) as maxPrice')
            )
            ->whereNotNull('crop_name')
            ->where('crop_name', '!=', '')
            ->whereNotNull('current_market_price')
            ->where('current_market_price', '>', 0)
            ->groupBy('crop_name')
            ->orderByDesc('avgPrice')
            ->limit(10)
            ->get();

        // Revenue estimation - using total_production, current_market_price, total_income, net_profit
        $revenueStats = (clone $query)
            ->select(
                DB::raw('SUM(COALESCE(total_income, 0)) as estimatedRevenue'),
                DB::raw('SUM(COALESCE(total_expenses, 0)) as totalExpenses'),
                DB::raw('SUM(COALESCE(net_profit, 0)) as estimatedProfit')
            )
            ->first();

        return [
            'expenseDistribution' => $expenseDistribution,
            'marketPriceStats' => $marketPriceStats,
            'revenueStats' => $revenueStats,
            'totalExpenses' => (clone $query)->sum('total_expenses') ?? 0,
            'averageExpenses' => (clone $query)->avg('total_expenses') ?? 0,
            'totalIncome' => (clone $query)->sum('total_income') ?? 0,
            'totalProfit' => (clone $query)->sum('net_profit') ?? 0,
        ];
    }

    /**
     * Get challenge statistics
     */
    private function getChallengeStatistics($query)
    {
        // pH value distribution (soil quality indicator) - using soil_ph_level
        $phDistribution = (clone $query)
            ->select(DB::raw("
                CASE
                    WHEN soil_ph_level < 5.5 THEN 'অম্লীয় (<৫.৫)'
                    WHEN soil_ph_level BETWEEN 5.5 AND 6.5 THEN 'মৃদু অম্লীয় (৫.৫-৬.৫)'
                    WHEN soil_ph_level BETWEEN 6.5 AND 7.5 THEN 'নিরপেক্ষ (৬.৫-৭.৫)'
                    WHEN soil_ph_level BETWEEN 7.5 AND 8.5 THEN 'মৃদু ক্ষারীয় (৭.৫-৮.৫)'
                    ELSE 'ক্ষারীয় (>৮.৫)'
                END as category,
                COUNT(*) as count
            "))
            ->whereNotNull('soil_ph_level')
            ->where('soil_ph_level', '>', 0)
            ->groupBy('category')
            ->get();

        // Challenges distribution
        $challengeDistribution = (clone $query)
            ->select('challenges as name', DB::raw('COUNT(*) as value'))
            ->whereNotNull('challenges')
            ->where('challenges', '!=', '')
            ->groupBy('challenges')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        // Disease found distribution
        $diseaseDistribution = (clone $query)
            ->select('disease_name as name', DB::raw('COUNT(*) as value'))
            ->whereNotNull('disease_name')
            ->where('disease_name', '!=', '')
            ->groupBy('disease_name')
            ->orderByDesc('value')
            ->limit(10)
            ->get();

        return [
            'phDistribution' => $phDistribution,
            'challengeDistribution' => $challengeDistribution,
            'diseaseDistribution' => $diseaseDistribution,
            'averagePH' => (clone $query)->whereNotNull('soil_ph_level')->avg('soil_ph_level') ?? 0,
        ];
    }

    /**
     * Get location breakdown
     */
    private function getLocationBreakdown($query, $division, $district, $upazila)
    {
        // Determine breakdown level
        if ($upazila) {
            // Breakdown by post office (instead of village)
            $breakdown = (clone $query)
                ->select(
                    'post_office_bn as name',
                    'post_office as name_en',
                    DB::raw('COUNT(*) as farmers'),
                    DB::raw('SUM(COALESCE(total_land, 0)) as landArea'),
                    DB::raw('SUM(COALESCE(total_production, 0)) as production'),
                    DB::raw('SUM(COALESCE(total_expenses, 0)) as expenses'),
                    DB::raw('SUM(COALESCE(total_income, 0)) as revenue')
                )
                ->whereNotNull('post_office_bn')
                ->where('post_office_bn', '!=', '')
                ->groupBy('post_office_bn', 'post_office')
                ->orderByDesc('farmers')
                ->limit(20)
                ->get();
        } elseif ($district) {
            // Breakdown by upazila
            $breakdown = (clone $query)
                ->select(
                    'upazila_bn as name',
                    'upazila as name_en',
                    DB::raw('COUNT(*) as farmers'),
                    DB::raw('SUM(COALESCE(total_land, 0)) as landArea'),
                    DB::raw('SUM(COALESCE(total_production, 0)) as production'),
                    DB::raw('SUM(COALESCE(total_expenses, 0)) as expenses'),
                    DB::raw('SUM(COALESCE(total_income, 0)) as revenue')
                )
                ->whereNotNull('upazila_bn')
                ->groupBy('upazila_bn', 'upazila')
                ->orderByDesc('farmers')
                ->get();
        } elseif ($division) {
            // Breakdown by district
            $breakdown = (clone $query)
                ->select(
                    'district_bn as name',
                    'district as name_en',
                    DB::raw('COUNT(*) as farmers'),
                    DB::raw('SUM(COALESCE(total_land, 0)) as landArea'),
                    DB::raw('SUM(COALESCE(total_production, 0)) as production'),
                    DB::raw('SUM(COALESCE(total_expenses, 0)) as expenses'),
                    DB::raw('SUM(COALESCE(total_income, 0)) as revenue')
                )
                ->whereNotNull('district_bn')
                ->groupBy('district_bn', 'district')
                ->orderByDesc('farmers')
                ->get();
        } else {
            // Breakdown by division
            $breakdown = (clone $query)
                ->select(
                    'division_bn as name',
                    'division as name_en',
                    DB::raw('COUNT(*) as farmers'),
                    DB::raw('SUM(COALESCE(total_land, 0)) as landArea'),
                    DB::raw('SUM(COALESCE(total_production, 0)) as production'),
                    DB::raw('SUM(COALESCE(total_expenses, 0)) as expenses'),
                    DB::raw('SUM(COALESCE(total_income, 0)) as revenue')
                )
                ->whereNotNull('division_bn')
                ->groupBy('division_bn', 'division')
                ->orderByDesc('farmers')
                ->get();
        }

        return $breakdown;
    }

    /**
     * Get monthly trend
     */
    private function getMonthlyTrend($year, $division = null, $district = null, $upazila = null)
    {
        $query = FieldDataCollection::query()
            ->whereYear('collection_date', $year);

        if ($division) {
            $query->where(function($q) use ($division) {
                $q->where('division_bn', $division)
                  ->orWhere('division', $division);
            });
        }
        if ($district) {
            $query->where(function($q) use ($district) {
                $q->where('district_bn', $district)
                  ->orWhere('district', $district);
            });
        }
        if ($upazila) {
            $query->where(function($q) use ($upazila) {
                $q->where('upazila_bn', $upazila)
                  ->orWhere('upazila', $upazila);
            });
        }

        $monthlyData = $query
            ->select(
                DB::raw('MONTH(collection_date) as month_num'),
                DB::raw('COUNT(*) as farmers'),
                DB::raw('SUM(COALESCE(total_land, 0)) as landArea'),
                DB::raw('SUM(COALESCE(total_production, 0)) as production'),
                DB::raw('SUM(COALESCE(total_expenses, 0)) as expenses'),
                DB::raw('SUM(COALESCE(total_income, 0)) as revenue')
            )
            ->groupBy('month_num')
            ->orderBy('month_num')
            ->get();

        $months = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ',
            4 => 'এপ্রিল', 5 => 'মে', 6 => 'জুন',
            7 => 'জুলাই', 8 => 'আগস্ট', 9 => 'সেপ্টেম্বর',
            10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর'
        ];

        return $monthlyData->map(function($item) use ($months) {
            return [
                'month' => $months[$item->month_num] ?? $item->month_num,
                'farmers' => $item->farmers,
                'landArea' => $item->landArea ?? 0,
                'production' => $item->production ?? 0,
                'expenses' => $item->expenses ?? 0,
                'revenue' => $item->revenue ?? 0,
            ];
        });
    }

    /**
     * Generate PDF report data
     */
    public function getPdfReportData(Request $request)
    {
        try {
            // Get comprehensive stats
            $statsResponse = $this->getComprehensiveStats($request);
            $statsData = $statsResponse->getData(true);

            if (!$statsData['success']) {
                return $statsResponse;
            }

            // Add report metadata
            $reportData = [
                'title' => 'মাঠ পর্যায়ের কৃষি তথ্য প্রতিবেদন',
                'subtitle' => 'বাংলাদেশ সরকার - কৃষি মন্ত্রণালয়',
                'generatedAt' => now()->format('d/m/Y H:i'),
                'generatedBy' => Auth::user()->name ?? 'System',
                'reportPeriod' => $this->getReportPeriodText($request),
                'locationText' => $this->getLocationText($request),
                'statistics' => $statsData['data'],
                'filters' => $statsData['filters'],
            ];

            return response()->json([
                'success' => true,
                'data' => $reportData,
            ]);

        } catch (\Exception $e) {
            Log::error('PDF Report Data Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report data',
                'message_bn' => 'রিপোর্ট ডেটা তৈরি করতে ব্যর্থ',
            ], 500);
        }
    }

    /**
     * Get report period text
     */
    private function getReportPeriodText($request)
    {
        $year = $request->year ?? date('Y');
        $month = $request->month;

        $months = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ',
            4 => 'এপ্রিল', 5 => 'মে', 6 => 'জুন',
            7 => 'জুলাই', 8 => 'আগস্ট', 9 => 'সেপ্টেম্বর',
            10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর'
        ];

        if ($month) {
            return $months[(int)$month] . ' ' . $year;
        }

        return $year . ' সাল';
    }

    /**
     * Get location text
     */
    private function getLocationText($request)
    {
        $parts = [];

        if ($request->upazila) {
            $parts[] = $request->upazila . ' উপজেলা';
        }
        if ($request->district) {
            $parts[] = $request->district . ' জেলা';
        }
        if ($request->division) {
            $parts[] = $request->division . ' বিভাগ';
        }

        if (empty($parts)) {
            return 'সমগ্র বাংলাদেশ';
        }

        return implode(', ', $parts);
    }
}
