import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileDown, RefreshCw, BarChart3, FileText, Users, MapPin, Sprout, TrendingUp, DollarSign, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

// Components
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import LocationFilterPanel, { LocationData } from "@/components/data-operator/statistics/LocationFilterPanel";

// PDF Generator
import { generateGovtPdfReport } from "@/utils/govtPdfGenerator";
import { generateBanglaPdfReport } from "@/utils/govtPdfGeneratorBangla";

interface OverviewStats {
  totalFarmers: number;
  totalLandArea: number;
  averageLandSize: number;
  totalProduction: number;
  averageProduction: number;
  totalExpenses: number;
  averageExpenses: number;
  totalMarketValue: number;
  verifiedCount: number;
  pendingCount: number;
}

interface StatisticsData {
  overview: OverviewStats;
  farmerDemographics: {
    ageDistribution: { age_group: string; count: number }[];
    occupationDistribution: { name: string; value: number }[];
  };
  landStats: {
    landSizeDistribution: { category: string; count: number; totalArea: number }[];
    ownershipDistribution: { type: string; count: number }[];
    irrigationStatus: { type: string; count: number }[];
    totalLandArea: number;
    averageLandSize: number;
  };
  cropStats: {
    cropDistribution: { name: string; value: number }[];
    seasonDistribution: { name: string; value: number }[];
    productionByCrop: { crop: string; totalProduction: number; avgProduction: number; farmerCount: number }[];
    totalProduction: number;
    averageProduction: number;
  };
  fertilizerStats: {
    organicUsage: { count: number; percentage: number };
    chemicalUsage: { count: number; percentage: number };
    bothUsage: { count: number };
  };
  financialStats: {
    expenseDistribution: { category: string; count: number; totalExpense: number }[];
    marketPriceStats: { crop: string; avgPrice: number; minPrice: number; maxPrice: number }[];
    revenueStats: { estimatedRevenue: number; totalExpenses: number; estimatedProfit: number };
    totalExpenses: number;
    averageExpenses: number;
  };
  locationBreakdown: { name: string; farmers: number; landArea: number; production: number; expenses: number; revenue: number }[];
  monthlyTrend: { month: string; farmers: number; landArea: number; production: number; expenses: number; revenue: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

const FieldDataStatisticsDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  // Data
  const [statsData, setStatsData] = useState<StatisticsData | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        division: location?.division_bn || null,
        district: location?.district_bn || null,
        upazila: location?.upazila_bn || null,
        year: selectedYear,
        month: selectedMonth || null,
        season: selectedSeason || null,
      };

      const response = await api.post('/field-data-stats/comprehensive', payload);

      if (response.data.success) {
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
  }, [location, selectedYear, selectedMonth, selectedSeason, toast]);

  // PDF Export (English)
  const handleExportPDF = async () => {
    if (!statsData) return;
    setIsExporting(true);

    try {
      await generateGovtPdfReport({
        statistics: statsData,
        filters: {
          division: location?.division || null,
          district: location?.district || null,
          upazila: location?.upazila || null,
          year: selectedYear,
          month: selectedMonth,
          season: selectedSeason,
        },
      });

      toast({
        title: "সফল",
        description: "সরকারি প্রতিবেদন PDF (English) ডাউনলোড হয়েছে।",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "ত্রুটি",
        description: "PDF তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // PDF Export (Bangla)
  const handleExportPDFBangla = async () => {
    if (!statsData) return;
    setIsExporting(true);

    try {
      await generateBanglaPdfReport({
        statistics: statsData,
        filters: {
          division: location?.division_bn || null,
          district: location?.district_bn || null,
          upazila: location?.upazila_bn || null,
          year: selectedYear,
          month: selectedMonth,
          season: selectedSeason,
        },
      });

      toast({
        title: "সফল",
        description: "সরকারি প্রতিবেদন PDF (বাংলা) ডাউনলোড হয়েছে।",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "ত্রুটি",
        description: "বাংলা PDF তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Safe number formatting helper
  const formatNumber = (value: any, decimals: number = 0): string => {
    const num = Number(value) || 0;
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString('bn-BD');
  };

  // Overview Cards
  const renderOverviewCards = () => {
    if (!statsData) return null;

    const cards = [
      { title: "মোট কৃষক", value: formatNumber(statsData.overview.totalFarmers), icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
      { title: "মোট জমি (শতক)", value: formatNumber(statsData.overview.totalLandArea), icon: MapPin, color: "text-green-600", bgColor: "bg-green-50" },
      { title: "মোট উৎপাদন", value: formatNumber(statsData.overview.totalProduction), icon: Sprout, color: "text-emerald-600", bgColor: "bg-emerald-50" },
      { title: "গড় উৎপাদন", value: formatNumber(statsData.overview.averageProduction, 2), icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50" },
      { title: "মোট ব্যয়", value: `৳${formatNumber(statsData.overview.totalExpenses)}`, icon: DollarSign, color: "text-red-600", bgColor: "bg-red-50" },
      { title: "বাজার মূল্য", value: `৳${formatNumber(statsData.overview.totalMarketValue)}`, icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{card.title}</p>
                    <p className="text-lg font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.bgColor} ${card.color} p-2 rounded-full`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DataOperatorHeader />

      <main className="container mx-auto px-4 pt-24 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 মাঠ পর্যায়ের কৃষি তথ্য পরিসংখ্যান</h1>
            <p className="text-gray-500">সরকারি প্রতিবেদনের জন্য বিশ্লেষণ ও রিপোর্ট</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { setStatsData(null); setLocation(null); }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              রিসেট
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={fetchStatistics} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
              রিপোর্ট দেখান
            </Button>
            {statsData && (
              <>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleExportPDF} disabled={isExporting}>
                  {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  PDF (English)
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleExportPDFBangla} disabled={isExporting}>
                  {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  PDF (বাংলা)
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <LocationFilterPanel onLocationChange={setLocation} isLoading={isLoading} />
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">বছর</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {[2026, 2025, 2024, 2023].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">মাস</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">সব মাস</option>
                  <option value="1">জানুয়ারি</option>
                  <option value="2">ফেব্রুয়ারি</option>
                  <option value="3">মার্চ</option>
                  <option value="4">এপ্রিল</option>
                  <option value="5">মে</option>
                  <option value="6">জুন</option>
                  <option value="7">জুলাই</option>
                  <option value="8">আগস্ট</option>
                  <option value="9">সেপ্টেম্বর</option>
                  <option value="10">অক্টোবর</option>
                  <option value="11">নভেম্বর</option>
                  <option value="12">ডিসেম্বর</option>
                </select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">মৌসুম</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  <option value="">সব মৌসুম</option>
                  <option value="রবি">রবি (শীতকাল)</option>
                  <option value="খরিফ-১">খরিফ-১ (প্রাক-বর্ষা)</option>
                  <option value="খরিফ-২">খরিফ-২ (বর্ষাকাল)</option>
                  <option value="জায়েদ">জায়েদ (গ্রীষ্মকাল)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Data State */}
        {!statsData ? (
          <Card className="border-dashed border-2 py-12">
            <CardContent className="flex flex-col items-center justify-center text-center text-gray-400">
              <BarChart3 className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">কোন তথ্য নেই</h3>
              <p className="max-w-md">
                পরিসংখ্যান দেখতে ফিল্টার নির্বাচন করে
                <span className="font-bold text-green-600 mx-1">"রিপোর্ট দেখান"</span>
                বাটনে ক্লিক করুন।
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Overview Cards */}
            {renderOverviewCards()}

            {/* Row 1: Crop Distribution + Land Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crop Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    ফসলের বিতরণ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.cropStats?.cropDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {(statsData.cropStats?.cropDistribution || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Land Size Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    জমির আকার অনুযায়ী কৃষক
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.landStats?.landSizeDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="কৃষক সংখ্যা" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Fertilizer Usage + Financial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fertilizer Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    সার ব্যবহারের ধরন
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'জৈব সার', value: statsData.fertilizerStats?.organicUsage?.percentage || 0 },
                          { name: 'রাসায়নিক সার', value: statsData.fertilizerStats?.chemicalUsage?.percentage || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value || 0}%`}
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Expense Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    ব্যয়ের বিভাজন
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.financialStats?.expenseDistribution || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B6B" name="কৃষক সংখ্যা" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📈 মাসিক প্রবণতা</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={statsData.monthlyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="farmers" stroke="#8884d8" name="কৃষক" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="production" stroke="#82ca9d" name="উৎপাদন" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ffc658" name="আয় (৳)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Row 4: Location Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📍 এলাকাভিত্তিক বিশ্লেষণ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">এলাকা</th>
                        <th className="p-3 text-right">কৃষক</th>
                        <th className="p-3 text-right">জমি (শতক)</th>
                        <th className="p-3 text-right">উৎপাদন</th>
                        <th className="p-3 text-right">ব্যয় (৳)</th>
                        <th className="p-3 text-right">আয় (৳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(statsData.locationBreakdown || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium text-blue-700">{item.name || '-'}</td>
                          <td className="p-3 text-right">{formatNumber(item.farmers)}</td>
                          <td className="p-3 text-right">{formatNumber(item.landArea)}</td>
                          <td className="p-3 text-right">{formatNumber(item.production)}</td>
                          <td className="p-3 text-right text-red-600">{formatNumber(item.expenses)}</td>
                          <td className="p-3 text-right text-green-600 font-bold">{formatNumber(item.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default FieldDataStatisticsDashboard;
