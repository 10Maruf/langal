import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileDown, RefreshCw, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Components
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import LocationFilterPanel, { LocationData } from "@/components/data-operator/statistics/LocationFilterPanel";
import TimeFilterPanel, { TimeFilter } from "@/components/data-operator/statistics/TimeFilterPanel";
import StatisticsOverviewCards from "@/components/data-operator/StatisticsOverviewCards";
import StatisticsCharts from "@/components/data-operator/StatisticsCharts";
import LocationBasedReports, { LocationReportItem } from "@/components/data-operator/statistics/LocationBasedReports";

// Statistics Data Interface matching Backend Response
interface StatisticsData {
    overview: {
        totalFarmers: number;
        totalLandArea: number;
        totalCrops: number;
        averageYield: number;
        totalRevenue: number;
        activeFields: number;
    };
    locationBreakdown: LocationReportItem[];
    cropDistribution: { name: string; value: number }[];
    monthlyTrend: { month: string; farmers: number; revenue: number }[];
    landUsage: { category: string; area: number }[];
    fertilizerUsage: { type: string; amount: number }[];
    topCrops: { crop: string; yield: number }[];
    regionalComparison: { location: string; value: number }[];
    reports: any;
}

const DataOperatorStatisticsNew2 = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    // Filters State
    const [location, setLocation] = useState<LocationData | null>(null);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>({
        periodType: 'monthly',
        selectedYear: new Date().getFullYear().toString(),
        selectedMonth: (new Date().getMonth() + 1).toString().padStart(2, '0')
    });

    // Data State
    const [statsData, setStatsData] = useState<StatisticsData | null>(null);

    // Determines the breakdown scope based on selected location depth
    const getScopeLevel = (loc: LocationData | null) => {
        if (!loc || !loc.division_bn) return 'division'; // Default check
        if (loc.post_office_bn) return 'union'; // Deepest level supported by backend
        if (loc.upazila_bn) return 'upazila';   // Breakdown by Union
        if (loc.district_bn) return 'district'; // Breakdown by Upazila
        return 'division';                      // Breakdown by District
    };

    // Convert Bangla numerals to English
    const convertBanglaToEnglish = (str: string | undefined): string | null => {
        if (!str) return null;
        const banglaDigits = '০১২৩৪৫৬৭৮৯';
        return str.replace(/[০-৯]/g, (d) => banglaDigits.indexOf(d).toString());
    };

    const fetchStatistics = async () => {
        console.log("=== fetchStatistics called ===");
        console.log("Location:", location);
        console.log("TimeFilter:", timeFilter);
        
        if (!location?.division_bn) {
            console.log("No division selected");
            toast({
                title: "লোকেশন নির্বাচন করুন",
                description: "দয়া করে অন্তত একটি বিভাগ নির্বাচন করুন।",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const scope_level = getScopeLevel(location);
            
            // Convert Bangla year/month to English for API
            const englishYear = convertBanglaToEnglish(timeFilter.selectedYear);
            const englishMonth = convertBanglaToEnglish(timeFilter.selectedMonth);
            
            const payload = {
                // Location Params
                division: location.division_bn,
                district: location.district_bn || null,
                upazila: location.upazila_bn || null,
                union: location.post_office_bn || null, 
                // Note: passing 'post_office_bn' to 'union' param mostly fits the hierarchy unless strict mapping needed
                
                scope_level: scope_level,

                // Time Params - Use English numerals
                period_type: timeFilter.periodType,
                selected_date: timeFilter.selectedDate ? new Date(timeFilter.selectedDate.getTime() - (timeFilter.selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null,
                selected_month: englishMonth,
                selected_year: englishYear,
                custom_start_date: timeFilter.customStartDate ? new Date(timeFilter.customStartDate.getTime() - (timeFilter.customStartDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null,
                custom_end_date: timeFilter.customEndDate ? new Date(timeFilter.customEndDate.getTime() - (timeFilter.customEndDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null,
                
                // Other defaults
                farmer_type: 'all'
            };

            console.log("Payload:", payload);
            const response = await api.post('/data-operator/statistics', payload);
            console.log("Response:", response);
            
            if (response.data.success) {
                console.log("Data received:", response.data.data);
                setStatsData(response.data.data);
                toast({
                    title: "সফল",
                    description: "পরিসংখ্যান হালনাগাদ করা হয়েছে।",
                });
            }
        } catch (error) {
            console.error("Stats Error:", error);
            toast({
                title: "ত্রুটি",
                description: "তথ্য লোড করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // PDF Export Function
    const handleExportPDF = () => {
        if (!statsData) return;
        setIsExporting(true);
        
        try {
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.text("Langal Statistics Report", 14, 22);
            
            doc.setFontSize(11);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
            
            // Scope Info
            let locationText = `Division: ${location?.division_bn || 'All'}`;
            if (location?.district_bn) locationText += `, District: ${location.district_bn}`;
            if (location?.upazila_bn) locationText += `, Upazila: ${location.upazila_bn}`;
            doc.text(locationText, 14, 36);

            // Overview Section
            doc.setFontSize(14);
            doc.text("Overview Summary", 14, 48);
            
            const overviewData = [
                ['Total Farmers', statsData.overview.totalFarmers],
                ['Total Land (Decimals)', statsData.overview.totalLandArea],
                ['Active Crops', statsData.overview.totalCrops],
                ['Avg Yield (Muns)', statsData.overview.averageYield],
                ['Est. Revenue', `${statsData.overview.totalRevenue} BDT`]
            ];
            
            autoTable(doc, {
                startY: 52,
                head: [['Metric', 'Value']],
                body: overviewData,
            });

            // Location Breakdown
            const currentY = (doc as any).lastAutoTable.finalY + 15;
            doc.text("Regional Breakdown", 14, currentY);
            
            const tableData = statsData.locationBreakdown.map(item => [
                item.name, 
                item.farmers, 
                item.landArea, 
                item.crops, 
                item.yield, 
                item.revenue
            ]);

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Region', 'Farmers', 'Land Area', 'Crops', 'Yield', 'Revenue']],
                body: tableData,
            });

            // Top Crops
            const cropsY = (doc as any).lastAutoTable.finalY + 15;
            doc.text("Top Crops by Yield", 14, cropsY);

            const cropsTableData = statsData.topCrops.map(item => [
                item.crop,
                item.yield
            ]);

            autoTable(doc, {
                startY: cropsY + 5,
                head: [['Crop Name', 'Avg Yield']],
                body: cropsTableData,
            });

            doc.save('langal-statistics-report.pdf');
            
            toast({ title: "ডাউনলোড সফল", description: "PDF রিপোর্ট ডাউনলোড হয়েছে।" });
        } catch (error) {
            console.error(error);
            toast({ title: "Export Error", variant: "destructive" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <DataOperatorHeader />
            
            <main className="container mx-auto px-4 pt-24 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">পরিসংখ্যান ড্যাশবোর্ড</h1>
                        <p className="text-gray-500">রিয়েল-টাইম কৃষি তথ্য বিশ্লেষণ এবং রিপোর্ট</p>
                    </div>
                    
                    <div className="flex gap-2">
                         <Button 
                            variant="outline" 
                            onClick={() => {
                                setStatsData(null);
                                setLocation(null);
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            রিসেট
                        </Button>
                        <Button 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={fetchStatistics} 
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                            রিপোর্ট দেখান
                        </Button>
                        {statsData && (
                            <Button 
                                variant="destructive" 
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                PDF ডাউনলোড
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <LocationFilterPanel 
                            onLocationChange={setLocation} 
                            isLoading={isLoading} 
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <TimeFilterPanel 
                            filter={timeFilter} 
                            onChange={setTimeFilter} 
                        />
                    </div>
                </div>

                {/* Dynamic Content */}
                {!statsData ? (
                    <Card className="border-dashed border-2 py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center text-gray-400">
                            <BarChart3 className="h-16 w-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-semibold mb-2">কোন তথ্য নেই</h3>
                            <p className="max-w-md">
                                পরিসংখ্যান দেখতে প্রথমে বাম পাশ থেকে এলাকা নির্বাচন করুন এবং তারপর 
                                <span className="font-bold text-green-600 mx-1">"রিপোর্ট দেখান"</span> 
                                বাটনে ক্লিক করুন।
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Summary Cards */}
                        <StatisticsOverviewCards 
                            stats={statsData.overview} 
                        />

                        {/* Charts Area */}
                        <StatisticsCharts 
                            cropDistribution={statsData.cropDistribution}
                            monthlyTrend={statsData.monthlyTrend}
                            landUsage={statsData.landUsage}
                            fertilizerUsage={statsData.fertilizerUsage}
                            topCrops={statsData.topCrops}
                            regionalComparison={statsData.regionalComparison}
                        />

                        {/* Detailed Reports Table */}
                        <LocationBasedReports 
                            data={statsData.locationBreakdown} 
                            reports={statsData.reports}
                            scopeLevel={getScopeLevel(location)}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default DataOperatorStatisticsNew2;
