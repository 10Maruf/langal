import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, List, Trophy, MapPin, SearchX, Sprout, Tractor, AlertTriangle, User } from "lucide-react";

export interface LocationReportItem {
    name: string;
    farmers: number;
    landArea: number;
    crops: number;
    yield: number;
    revenue: number;
}

interface LocationReportsProps {
    data: LocationReportItem[];
    // New prop for all report types
    reports?: {
        comprehensive: any[];
        cropWise: any[];
        farmer: any[];
        inputUsage: any[];
        challenges: any[];
    };
    scopeLevel: 'division' | 'district' | 'upazila' | 'union' | 'village';
    isLoading?: boolean;
}

const LocationBasedReports = ({ data, reports, scopeLevel, isLoading = false }: LocationReportsProps) => {
    const [viewMode, setViewMode] = useState<'regional' | 'crops' | 'inputs' | 'farmers' | 'challenges'>('regional');

    const sortedData = [...(data || [])].sort((a, b) => b.revenue - a.revenue);

    const getScopeLabel = () => {
        switch (scopeLevel) {
            case 'division': return "বিভাগ ভিত্তিক";
            case 'district': return "জেলা ভিত্তিক";
            case 'upazila': return "উপজেলা ভিত্তিক";
            case 'union': return "ইউনিয়ন ভিত্তিক";
            case 'village': return "গ্রাম ভিত্তিক";
            default: return "লোকেশন ভিত্তিক";
        }
    };

    if (!data || data.length === 0) {
        return (
            <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <SearchX className="h-10 w-10 mb-2 opacity-50" />
                    <p>কোন তথ্য পাওয়া যায়নি</p>
                </CardContent>
            </Card>
        );
    }

    // Regional Table (Existing)
    const renderRegionalTable = () => (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50">
                    <TableHead>এলাকার নাম</TableHead>
                    <TableHead className="text-right">কৃষক</TableHead>
                    <TableHead className="text-right">জমি (শতক)</TableHead>
                    <TableHead className="text-right">ফসল</TableHead>
                    <TableHead className="text-right">ফলন (কেজি)</TableHead>
                    <TableHead className="text-right">আয় (৳)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50/50">
                        <TableCell className="font-semibold text-blue-700">{item.name}</TableCell>
                        <TableCell className="text-right">{(item.farmers || 0).toLocaleString('bn-BD')}</TableCell>
                        <TableCell className="text-right">{(item.landArea || 0).toLocaleString('bn-BD')}</TableCell>
                        <TableCell className="text-right">{(item.crops || 0).toLocaleString('bn-BD')}</TableCell>
                        <TableCell className="text-right">{(item.yield || 0).toLocaleString('bn-BD')}</TableCell>
                        <TableCell className="text-right font-bold text-green-700">
                            {(item.revenue || 0).toLocaleString('bn-BD')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    // Crop Wise Table
    const renderCropWiseTable = () => (
        <Table>
            <TableHeader>
                <TableRow className="bg-orange-50">
                    <TableHead>ফসলের নাম</TableHead>
                    <TableHead className="text-right">চাষকৃত জমি</TableHead>
                    <TableHead className="text-right">মোট উৎপাদন</TableHead>
                    <TableHead className="text-right">একর প্রতি ফলন</TableHead>
                    <TableHead className="text-right">বাজার দর</TableHead>
                    <TableHead className="text-right">মোট আয়</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports?.cropWise?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.cropName}</TableCell>
                        <TableCell className="text-right">{item.cultivatedArea}</TableCell>
                        <TableCell className="text-right">{item.totalProduction}</TableCell>
                        <TableCell className="text-right">{item.yieldPerAcre}</TableCell>
                        <TableCell className="text-right">{item.marketPrice}</TableCell>
                        <TableCell className="text-right font-bold text-green-700">{item.totalRevenue}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    // Input Usage Table
    const renderInputUsageTable = () => (
        <Table>
            <TableHeader>
                <TableRow className="bg-teal-50">
                    <TableHead>উপকরণের ধরন</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead className="text-right">মোট ব্যবহার</TableHead>
                    <TableHead className="text-right">গড় মূল্য</TableHead>
                    <TableHead className="text-right">মোট খরচ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports?.inputUsage?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.inputType}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.totalUsage} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.avgPrice}</TableCell>
                        <TableCell className="text-right font-bold text-teal-700">{item.totalCost}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

     // Farmers Table (Sample)
     const renderFarmersTable = () => (
        <Table>
            <TableHeader>
                <TableRow className="bg-blue-50">
                    <TableHead>কৃষকের নাম</TableHead>
                    <TableHead>মোবাইল</TableHead>
                    <TableHead className="text-right">জমির পরিমাণ</TableHead>
                    <TableHead>ধরণ</TableHead>
                    <TableHead className="text-right">শেষ আপডেট</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports?.farmer?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.farmerName}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell className="text-right">{item.landAmount}</TableCell>
                        <TableCell><Badge variant="outline">{item.entryType}</Badge></TableCell>
                        <TableCell className="text-right">{item.lastUpdate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    // Challenges Table
    const renderChallengesTable = () => (
        <Table>
            <TableHeader>
                <TableRow className="bg-red-50">
                    <TableHead>সমস্যা/চ্যালেঞ্জ</TableHead>
                    <TableHead>আক্রান্ত এলাকা</TableHead>
                    <TableHead>তীব্রতা</TableHead>
                    <TableHead className="text-right">রিপোর্টার তারিখ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports?.challenges?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.challenge}</TableCell>
                        <TableCell>{item.affectedArea}</TableCell>
                        <TableCell>
                            <Badge className={
                                item.severity === 'উচ্চ' ? 'bg-red-500' : 
                                item.severity === 'মাঝারি' ? 'bg-yellow-500' : 'bg-blue-500'
                            }>{item.severity}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.reportedDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Card className=" shadow-sm">
            <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                             <List className="h-5 w-5 text-blue-600" />
                             বিস্তারিত রিপোর্ট
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            বিভিন্ন ক্যাটাগরিতে বিস্তারিত তথ্য বিশ্লেষণ
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
                    <div className="border-b px-4 bg-gray-50/50">
                        <TabsList className="bg-transparent h-12 w-full justify-start gap-4">
                            <TabsTrigger value="regional" className="data-[state=active]:bg-white data-[state=active]:shadow-sm border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-4 h-full">
                                <MapPin className="h-4 w-4 mr-2" /> আঞ্চলিক
                            </TabsTrigger>
                            <TabsTrigger value="crops" className="data-[state=active]:bg-white data-[state=active]:shadow-sm border-b-2 border-transparent data-[state=active]:border-orange-600 rounded-none px-4 h-full">
                                <Sprout className="h-4 w-4 mr-2" /> ফসল ভিত্তিক
                            </TabsTrigger>
                            <TabsTrigger value="inputs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm border-b-2 border-transparent data-[state=active]:border-teal-600 rounded-none px-4 h-full">
                                <Tractor className="h-4 w-4 mr-2" /> উপকরণ
                            </TabsTrigger>
                            <TabsTrigger value="farmers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-4 h-full">
                                <User className="h-4 w-4 mr-2" /> কৃষক
                            </TabsTrigger>
                            <TabsTrigger value="challenges" className="data-[state=active]:bg-white data-[state=active]:shadow-sm border-b-2 border-transparent data-[state=active]:border-red-600 rounded-none px-4 h-full">
                                <AlertTriangle className="h-4 w-4 mr-2" /> সমস্যা
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-0">
                        <TabsContent value="regional" className="m-0 border-none p-0">
                            {renderRegionalTable()}
                        </TabsContent>
                        <TabsContent value="crops" className="m-0 border-none p-0">
                            {reports?.cropWise?.length ? renderCropWiseTable() : <EmptyState />}
                        </TabsContent>
                        <TabsContent value="inputs" className="m-0 border-none p-0">
                            {reports?.inputUsage?.length ? renderInputUsageTable() : <EmptyState />}
                        </TabsContent>
                        <TabsContent value="farmers" className="m-0 border-none p-0">
                            {reports?.farmer?.length ? renderFarmersTable() : <EmptyState />}
                        </TabsContent>
                         <TabsContent value="challenges" className="m-0 border-none p-0">
                            {reports?.challenges?.length ? renderChallengesTable() : <EmptyState />}
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <SearchX className="h-12 w-12 mb-3 opacity-20" />
        <p>এই ক্যাটাগরিতে কোন তথ্য পাওয়া যায়নি</p>
    </div>
);

export default LocationBasedReports;
