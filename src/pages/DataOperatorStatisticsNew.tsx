import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, BarChart3, CalendarIcon, Loader2, MapPin, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import StatisticsOverviewCards from "@/components/data-operator/StatisticsOverviewCards";
import LocationSummaryTable from "@/components/data-operator/LocationSummaryTable";
import StatisticsCharts from "@/components/data-operator/StatisticsCharts";
import DetailedReportsTabs from "@/components/data-operator/DetailedReportsTabs";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import axios from "axios";

interface FilterState {
  division?: string;
  district?: string;
  upazila?: string;
  union?: string;
  scopeLevel: 'division' | 'district' | 'upazila' | 'union';
  periodType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  selectedDate?: Date;
  selectedMonth?: string;
  selectedYear?: string;
  customStartDate?: Date;
  customEndDate?: Date;
}

const DataOperatorStatisticsNew = () => {
  const navigate = useNavigate();
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statisticsData, setStatisticsData] = useState<any>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    division: '',
    district: '',
    upazila: '',
    union: '',
    scopeLevel: 'division',
    periodType: 'monthly',
    selectedMonth: '',
    selectedYear: '',
  });

  // Location data from database
  const [divisions, setDivisions] = useState<string[]>(["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [unions, setUnions] = useState<string[]>([]);
  
  // Location hierarchy based on actual database data
  const locationHierarchy: { [key: string]: { [key: string]: string[] } } = {
    "ঢাকা": {
      "ঢাকা": ["দোহার"],
      "গাজীপুর": ["কালিয়াকৈর"],
      "নরসিংদী": ["মনোহরদী", "রায়পুরা", "শিবপুর"]
    },
    "চট্টগ্রাম": {
      "চট্টগ্রাম": ["আনোয়ারা", "পটিয়া"],
      "কক্সবাজার": ["উখিয়া", "চকরিয়া", "রামু"]
    },
    "রাজশাহী": {
      "রাজশাহী": ["চারঘাট", "তানোর", "পবা", "মোহনপুর"],
      "নাটোর": ["গুরুদাসপুর", "নলডাঙ্গা", "বড়াইগ্রাম", "লালপুর"]
    },
    "খুলনা": {
      "খুলনা": ["কয়রা", "দিঘলিয়া", "পাইকগাছা"],
      "যশোর": ["অভয়নগর", "চৌগাছা", "বাঘারপাড়া"]
    },
    "বরিশাল": {
      "বরিশাল": ["বাকেরগঞ্জ", "বাবুগঞ্জ"],
      "পটুয়াখালী": ["গলাচিপা", "দশমিনা", "বাউফল"]
    }
  };
  
  const months = [
    { value: "01", label: "জানুয়ারি" },
    { value: "02", label: "ফেব্রুয়ারি" },
    { value: "03", label: "মার্চ" },
    { value: "04", label: "এপ্রিল" },
    { value: "05", label: "মে" },
    { value: "06", label: "জুন" },
    { value: "07", label: "জুলাই" },
    { value: "08", label: "আগস্ট" },
    { value: "09", label: "সেপ্টেম্বর" },
    { value: "10", label: "অক্টোবর" },
    { value: "11", label: "নভেম্বর" },
    { value: "12", label: "ডিসেম্বর" },
  ];

  const years = ["২০২৬", "২০২৫", "২০২৪", "২০২৩"];

  // Helper function to convert Bengali numerals to English
  const bengaliToEnglish = (str: string): string => {
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = str;
    bengaliNumerals.forEach((bn, index) => {
      result = result.replace(new RegExp(bn, 'g'), englishNumerals[index]);
    });
    return result;
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update dependent selectors
    if (key === 'division') {
      // Load districts for selected division
      const divisionDistricts = Object.keys(locationHierarchy[value] || {});
      setDistricts(divisionDistricts);
      setUpazilas([]);
      setUnions([]);
      // Reset dependent fields
      setFilters(prev => ({ ...prev, district: '', upazila: '', union: '' }));
    } else if (key === 'district') {
      // Load upazilas for selected district
      const districtUpazilas = filters.division && locationHierarchy[filters.division] 
        ? locationHierarchy[filters.division][value] || []
        : [];
      setUpazilas(districtUpazilas);
      setUnions([]);
      setFilters(prev => ({ ...prev, upazila: '', union: '' }));
    } else if (key === 'upazila') {
      // Could load unions here if needed
      setFilters(prev => ({ ...prev, union: '' }));
    }
  };

  const handleGenerateReport = async () => {
    // Validation
    if (!filters.division) {
      alert("অনুগ্রহ করে বিভাগ নির্বাচন করুন");
      return;
    }

    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      
      // Build query parameters
      const params: any = {
        division: filters.division,
        scope_level: filters.scopeLevel,
        period_type: filters.periodType,
      };

      if (filters.district) params.district = filters.district;
      if (filters.upazila) params.upazila = filters.upazila;
      if (filters.union) params.union = filters.union;

      // Time period params
      if (filters.periodType === 'daily' && filters.selectedDate) {
        params.selected_date = format(filters.selectedDate, 'yyyy-MM-dd');
      } else if (filters.periodType === 'monthly') {
        params.selected_month = filters.selectedMonth;
        params.selected_year = bengaliToEnglish(filters.selectedYear || '');
      } else if (filters.periodType === 'yearly' && filters.selectedYear) {
        params.selected_year = bengaliToEnglish(filters.selectedYear);
      } else if (filters.periodType === 'custom' && filters.customStartDate && filters.customEndDate) {
        params.custom_start_date = format(filters.customStartDate, 'yyyy-MM-dd');
        params.custom_end_date = format(filters.customEndDate, 'yyyy-MM-dd');
      }

      console.log('Statistics API Request:', params);

      const response = await axios.get("http://127.0.0.1:8000/api/data-operator/statistics", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Statistics API Response:', response.data);

      if (response.data.success) {
        setStatisticsData(response.data.data);
        setReportGenerated(true);
        console.log('Statistics data set:', response.data.data.overview);
      } else {
        alert("রিপোর্ট তৈরি করতে ব্যর্থ");
      }
    } catch (error: any) {
      console.error("Statistics API Error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('আপনার সেশন মেয়াদ শেষ হয়েছে। অনুগ্রহ করে পুনরায় লগইন করুন।');
        window.location.href = '/login';
      } else {
        alert("রিপোর্ট তৈরি করতে সমস্যা হয়েছে: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFilters({
      division: '',
      district: '',
      upazila: '',
      union: '',
      scopeLevel: 'division',
      periodType: 'monthly',
      selectedMonth: '',
      selectedYear: '',
    });
    setReportGenerated(false);
    setStatisticsData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    alert(`Exporting as ${format.toUpperCase()}... (Not implemented yet)`);
  };

  // Mock data for dashboard components
  const mockOverviewStats = {
    totalFarmers: 2543,
    totalLandArea: 12567,
    totalCrops: 8,
    averageYield: 3250,
    totalRevenue: 45680000,
    activeFields: 1897,
  };

  const mockLocationData = [
    { name: "নরসিংদী", farmers: 567, landArea: 2340, crops: 8, yield: 3200, revenue: 9800000 },
    { name: "গাজীপুর", farmers: 623, landArea: 2890, crops: 7, yield: 3450, revenue: 11200000 },
    { name: "নারায়ণগঞ্জ", farmers: 498, landArea: 1980, crops: 6, yield: 3100, revenue: 8100000 },
    { name: "মানিকগঞ্জ", farmers: 445, landArea: 2145, crops: 8, yield: 3350, revenue: 8900000 },
    { name: "টাঙ্গাইল", farmers: 410, landArea: 3212, crops: 9, yield: 3280, revenue: 7680000 },
  ];

  const mockCropDistribution = [
    { name: "ধান", value: 35 },
    { name: "গম", value: 20 },
    { name: "ভুট্টা", value: 15 },
    { name: "পাট", value: 12 },
    { name: "আলু", value: 10 },
    { name: "অন্যান্য", value: 8 },
  ];

  const mockMonthlyTrend = [
    { month: "জানু", farmers: 420, revenue: 3200 },
    { month: "ফেব্রু", farmers: 450, revenue: 3500 },
    { month: "মার্চ", farmers: 480, revenue: 3800 },
    { month: "এপ্রিল", farmers: 510, revenue: 4100 },
    { month: "মে", farmers: 530, revenue: 4350 },
    { month: "জুন", farmers: 543, revenue: 4568 },
  ];

  const mockLandUsage = [
    { category: "ধান চাষ", area: 4500 },
    { category: "গম চাষ", area: 2800 },
    { category: "সবজি চাষ", area: 3200 },
    { category: "পতিত জমি", area: 2067 },
  ];

  const mockFertilizerUsage = [
    { type: "ইউরিয়া", amount: 12500 },
    { type: "TSP", amount: 8900 },
    { type: "DAP", amount: 7600 },
    { type: "MOP", amount: 6200 },
    { type: "জৈব সার", amount: 15400 },
  ];

  const mockTopCrops = [
    { crop: "ধান", yield: 3450 },
    { crop: "গম", yield: 3200 },
    { crop: "ভুট্টা", yield: 2980 },
    { crop: "পাট", yield: 2750 },
    { crop: "আলু", yield: 4100 },
  ];

  const mockRegionalComparison = [
    { location: "নরসিংদী", value: 85 },
    { location: "গাজীপুর", value: 92 },
    { location: "নারায়ণগঞ্জ", value: 78 },
    { location: "মানিকগঞ্জ", value: 88 },
    { location: "টাঙ্গাইল", value: 81 },
  ];

  const mockComprehensiveData = [
    { location: "নরসিংদী", farmers: 567, landArea: 2340, crops: 8, avgYield: "৩২০০", revenue: 9800000, status: "সক্রিয়" },
    { location: "গাজীপুর", farmers: 623, landArea: 2890, crops: 7, avgYield: "৩৪৫০", revenue: 11200000, status: "সক্রিয়" },
    { location: "নারায়ণগঞ্জ", farmers: 498, landArea: 1980, crops: 6, avgYield: "৩১০০", revenue: 8100000, status: "সক্রিয়" },
  ];

  const mockCropWiseData = [
    { cropName: "ধান", cultivatedArea: 4500, totalProduction: 14625000, yieldPerAcre: 3250, marketPrice: 28, totalRevenue: 40950000 },
    { cropName: "গম", cultivatedArea: 2800, totalProduction: 8960000, yieldPerAcre: 3200, marketPrice: 32, totalRevenue: 28672000 },
    { cropName: "ভুট্টা", cultivatedArea: 1900, totalProduction: 5662000, yieldPerAcre: 2980, marketPrice: 25, totalRevenue: 14155000 },
  ];

  const mockFarmerData = [
    { farmerName: "আব্দুল করিম", phone: "০১৭১২-৩৪৫৬৭৮", landAmount: 5.5, cropsCount: 3, entryType: "বিদ্যমান", lastUpdate: "১০ জানু ২০২৬" },
    { farmerName: "মোঃ রহিম", phone: "০১৮১২-৯৮৭৬৫৪", landAmount: 3.2, cropsCount: 2, entryType: "নতুন এন্ট্রি", lastUpdate: "০৮ জানু ২০২৬" },
    { farmerName: "জাহাঙ্গীর আলম", phone: "০১৯১২-১১২২৩৩", landAmount: 8.0, cropsCount: 4, entryType: "বিদ্যমান", lastUpdate: "০৫ জানু ২০২৬" },
  ];

  const mockInputUsageData = [
    { inputType: "সার", name: "ইউরিয়া", totalUsage: 12500, unit: "কেজি", avgPrice: 25, totalCost: 312500 },
    { inputType: "সার", name: "TSP", totalUsage: 8900, unit: "কেজি", avgPrice: 30, totalCost: 267000 },
    { inputType: "কীটনাশক", name: "ম্যালাথিয়ন", totalUsage: 450, unit: "লিটার", avgPrice: 350, totalCost: 157500 },
  ];

  const mockChallengesData = [
    { challenge: "পোকার আক্রমণ", affectedArea: "নরসিংদী", affectedFarmers: 87, severity: "উচ্চ", reportedDate: "০৫ জানু ২০২৬" },
    { challenge: "সেচের পানির অভাব", affectedArea: "টাঙ্গাইল", affectedFarmers: 124, severity: "মাঝারি", reportedDate: "০৩ জানু ২০২৬" },
    { challenge: "বীজের মান নিম্ন", affectedArea: "গাজীপুর", affectedFarmers: 45, severity: "নিম্ন", reportedDate: "০১ জানু ২০২৬" },
  ];

  if (reportGenerated && statisticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DataOperatorHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Report Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-green-700 mb-2">
                    📊 কৃষি পরিসংখ্যান রিপোর্ট
                  </CardTitle>
                  <p className="text-gray-600">
                    📍 স্থান: {filters.division} 
                    {filters.district && ` > ${filters.district}`}
                    {filters.upazila && ` > ${filters.upazila}`}
                    {filters.union && ` > ${filters.union}`}
                  </p>
                  <p className="text-gray-600">
                    📅 সময়কাল: {filters.periodType === 'daily' && 'দৈনিক'}
                    {filters.periodType === 'weekly' && 'সাপ্তাহিক'}
                    {filters.periodType === 'monthly' && 'মাসিক'}
                    {filters.periodType === 'yearly' && 'বার্ষিক'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleExport('excel')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Excel
                  </Button>
                  <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button onClick={handlePrint} variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" />
                    প্রিন্ট
                  </Button>
                  <Button onClick={handleReset}>
                    🔄 নতুন রিপোর্ট
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Overview Cards */}
          <div className="mb-6">
            <StatisticsOverviewCards stats={statisticsData.overview} />
          </div>

          {/* Location Summary Table */}
          {statisticsData.locationBreakdown.length > 0 && (
            <div className="mb-6">
              <LocationSummaryTable
                scopeLevel={filters.scopeLevel}
                locationName={filters.division || "ঢাকা"}
                data={statisticsData.locationBreakdown}
                onDrillDown={(location) => alert(`Drill down to: ${location}`)}
              />
            </div>
          )}

          {/* Charts */}
          <div className="mb-6">
            <StatisticsCharts
              cropDistribution={statisticsData.cropDistribution}
              monthlyTrend={statisticsData.monthlyTrend}
              landUsage={statisticsData.landUsage}
              fertilizerUsage={statisticsData.fertilizerUsage}
              topCrops={statisticsData.topCrops}
              regionalComparison={statisticsData.regionalComparison}
            />
          </div>

          {/* Detailed Reports Tabs */}
          <div className="mb-6">
            <DetailedReportsTabs
              comprehensiveData={statisticsData.reports.comprehensive}
              cropWiseData={statisticsData.reports.cropWise}
              farmerData={statisticsData.reports.farmer}
              inputUsageData={statisticsData.reports.inputUsage}
              challengesData={statisticsData.reports.challenges}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DataOperatorHeader />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/data-operator-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">কৃষি পরিসংখ্যান ও প্রতিবেদন</h1>
                <p className="text-gray-600">রিপোর্ট তৈরি করতে নিচের ফিল্টার সিলেক্ট করুন</p>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* Location Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                স্থান নির্বাচন করুন
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Division */}
                <div>
                  <Label htmlFor="division">বিভাগ <span className="text-red-500">*</span></Label>
                  <Select value={filters.division} onValueChange={(value) => updateFilter('division', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((div) => (
                        <SelectItem key={div} value={div}>{div}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div>
                  <Label htmlFor="district">জেলা (ঐচ্ছিক)</Label>
                  <Select 
                    value={filters.district} 
                    onValueChange={(value) => updateFilter('district', value)}
                    disabled={!filters.division}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="জেলা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Upazila */}
                <div>
                  <Label htmlFor="upazila">উপজেলা (ঐচ্ছিক)</Label>
                  <Select 
                    value={filters.upazila} 
                    onValueChange={(value) => updateFilter('upazila', value)}
                    disabled={!filters.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="উপজেলা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {upazilas.map((upa) => (
                        <SelectItem key={upa} value={upa}>{upa}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Union */}
                <div>
                  <Label htmlFor="union">ইউনিয়ন (ঐচ্ছিক)</Label>
                  <Select 
                    value={filters.union} 
                    onValueChange={(value) => updateFilter('union', value)}
                    disabled={!filters.upazila}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ইউনিয়ন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {unions.map((un) => (
                        <SelectItem key={un} value={un}>{un}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Scope Level Selection */}
              <div className="border-t pt-4">
                <Label className="mb-3 block">রিপোর্টের পরিধি:</Label>
                <RadioGroup 
                  value={filters.scopeLevel} 
                  onValueChange={(value: any) => updateFilter('scopeLevel', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="division" id="scope-division" />
                    <Label htmlFor="scope-division">শুধু বিভাগের ডেটা দেখুন</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="district" id="scope-district" disabled={!filters.district} />
                    <Label htmlFor="scope-district">শুধু জেলার ডেটা দেখুন</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upazila" id="scope-upazila" disabled={!filters.upazila} />
                    <Label htmlFor="scope-upazila">শুধু উপজেলার ডেটা দেখুন</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="union" id="scope-union" disabled={!filters.union} />
                    <Label htmlFor="scope-union">ইউনিয়ন পর্যন্ত বিস্তারিত দেখুন</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Time Period Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                সময়কাল নির্বাচন করুন
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={filters.periodType} 
                onValueChange={(value: any) => updateFilter('periodType', value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="period-daily" />
                  <Label htmlFor="period-daily">দৈনিক</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="period-weekly" />
                  <Label htmlFor="period-weekly">সাপ্তাহিক</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="period-monthly" />
                  <Label htmlFor="period-monthly">মাসিক</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="period-yearly" />
                  <Label htmlFor="period-yearly">বার্ষিক</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="period-custom" />
                  <Label htmlFor="period-custom">কাস্টম রেঞ্জ</Label>
                </div>
              </RadioGroup>

              <div className="border-t pt-4">
                {filters.periodType === 'daily' && (
                  <div>
                    <Label>তারিখ নির্বাচন করুন</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.selectedDate ? format(filters.selectedDate, "PPP", { locale: bn }) : "তারিখ নির্বাচন করুন"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.selectedDate}
                          onSelect={(date) => updateFilter('selectedDate', date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {filters.periodType === 'monthly' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>মাস নির্বাচন করুন</Label>
                      <Select value={filters.selectedMonth} onValueChange={(value) => updateFilter('selectedMonth', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="মাস" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>বছর নির্বাচন করুন</Label>
                      <Select value={filters.selectedYear} onValueChange={(value) => updateFilter('selectedYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="বছর" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {filters.periodType === 'yearly' && (
                  <div>
                    <Label>বছর নির্বাচন করুন</Label>
                    <Select value={filters.selectedYear} onValueChange={(value) => updateFilter('selectedYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="বছর" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {filters.periodType === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>শুরুর তারিখ</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.customStartDate ? format(filters.customStartDate, "PPP", { locale: bn }) : "শুরু"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.customStartDate}
                            onSelect={(date) => updateFilter('customStartDate', date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>শেষ তারিখ</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.customEndDate ? format(filters.customEndDate, "PPP", { locale: bn }) : "শেষ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.customEndDate}
                            onSelect={(date) => updateFilter('customEndDate', date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleReset}
            >
              🔄 রিসেট করুন
            </Button>
            <Button 
              size="lg"
              onClick={handleGenerateReport}
              disabled={isGenerating || !filters.division}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  রিপোর্ট তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  রিপোর্ট তৈরি করুন
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataOperatorStatisticsNew;
