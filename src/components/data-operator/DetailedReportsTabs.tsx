import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ComprehensiveRow {
  location: string;
  farmers: number;
  landArea: number;
  crops: number;
  avgYield: string;
  revenue: number;
  status: string;
}

interface CropWiseRow {
  cropName: string;
  cultivatedArea: number;
  totalProduction: number;
  yieldPerAcre: number;
  marketPrice: number;
  totalRevenue: number;
}

interface FarmerRow {
  farmerName: string;
  phone: string;
  landAmount: number;
  cropsCount: number;
  entryType: string;
  lastUpdate: string;
}

interface InputUsageRow {
  inputType: string;
  name: string;
  totalUsage: number;
  unit: string;
  avgPrice: number;
  totalCost: number;
}

interface ChallengeRow {
  challenge: string;
  affectedArea: string;
  affectedFarmers: number;
  severity: string;
  reportedDate: string;
}

interface DetailedReportsTabsProps {
  comprehensiveData: ComprehensiveRow[];
  cropWiseData: CropWiseRow[];
  farmerData: FarmerRow[];
  inputUsageData: InputUsageRow[];
  challengesData: ChallengeRow[];
}

const DetailedReportsTabs = ({
  comprehensiveData,
  cropWiseData,
  farmerData,
  inputUsageData,
  challengesData,
}: DetailedReportsTabsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">বিস্তারিত প্রতিবেদন</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comprehensive" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="comprehensive">সার্বিক রিপোর্ট</TabsTrigger>
            <TabsTrigger value="crop-wise">ফসল ভিত্তিক</TabsTrigger>
            <TabsTrigger value="farmer">কৃষক তথ্য</TabsTrigger>
            <TabsTrigger value="input">উপকরণ ব্যবহার</TabsTrigger>
            <TabsTrigger value="challenges">চ্যালেঞ্জ</TabsTrigger>
          </TabsList>

          {/* Comprehensive Report Tab */}
          <TabsContent value="comprehensive" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>স্থান</TableHead>
                    <TableHead className="text-center">কৃষক</TableHead>
                    <TableHead className="text-center">জমি (একর)</TableHead>
                    <TableHead className="text-center">মোট ফসল</TableHead>
                    <TableHead className="text-center">গড় ফলন</TableHead>
                    <TableHead className="text-center">মোট আয়</TableHead>
                    <TableHead className="text-center">স্থিতি</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comprehensiveData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.location}</TableCell>
                      <TableCell className="text-center">{row.farmers}</TableCell>
                      <TableCell className="text-center">{row.landArea}</TableCell>
                      <TableCell className="text-center">{row.crops}</TableCell>
                      <TableCell className="text-center">{row.avgYield}</TableCell>
                      <TableCell className="text-center">৳{row.revenue.toLocaleString('bn-BD')}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={row.status === 'সক্রিয়' ? 'default' : 'secondary'}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Crop-wise Report Tab */}
          <TabsContent value="crop-wise" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ফসলের নাম</TableHead>
                    <TableHead className="text-center">চাষকৃত জমি</TableHead>
                    <TableHead className="text-center">মোট উৎপাদন</TableHead>
                    <TableHead className="text-center">ফলন/একর</TableHead>
                    <TableHead className="text-center">বাজার মূল্য</TableHead>
                    <TableHead className="text-center">মোট আয়</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cropWiseData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.cropName}</TableCell>
                      <TableCell className="text-center">{row.cultivatedArea} একর</TableCell>
                      <TableCell className="text-center">{row.totalProduction} কেজি</TableCell>
                      <TableCell className="text-center">{row.yieldPerAcre} কেজি</TableCell>
                      <TableCell className="text-center">৳{row.marketPrice}/কেজি</TableCell>
                      <TableCell className="text-center">৳{row.totalRevenue.toLocaleString('bn-BD')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Farmer Information Tab */}
          <TabsContent value="farmer" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>কৃষকের নাম</TableHead>
                    <TableHead>ফোন নম্বর</TableHead>
                    <TableHead className="text-center">জমির পরিমাণ</TableHead>
                    <TableHead className="text-center">ফসলের সংখ্যা</TableHead>
                    <TableHead className="text-center">এন্ট্রির ধরন</TableHead>
                    <TableHead className="text-center">শেষ আপডেট</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmerData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.farmerName}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell className="text-center">{row.landAmount} একর</TableCell>
                      <TableCell className="text-center">{row.cropsCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={row.entryType === 'বিদ্যমান' ? 'default' : 'outline'}>
                          {row.entryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{row.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Input Usage Tab */}
          <TabsContent value="input" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>উপকরণের ধরন</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead className="text-center">মোট ব্যবহার</TableHead>
                    <TableHead className="text-center">একক</TableHead>
                    <TableHead className="text-center">গড় মূল্য</TableHead>
                    <TableHead className="text-center">মোট খরচ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inputUsageData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.inputType}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="text-center">{row.totalUsage.toLocaleString('bn-BD')}</TableCell>
                      <TableCell className="text-center">{row.unit}</TableCell>
                      <TableCell className="text-center">৳{row.avgPrice}</TableCell>
                      <TableCell className="text-center">৳{row.totalCost.toLocaleString('bn-BD')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>চ্যালেঞ্জ/সমস্যা</TableHead>
                    <TableHead className="text-center">প্রভাবিত স্থান</TableHead>
                    <TableHead className="text-center">প্রভাবিত কৃষক</TableHead>
                    <TableHead className="text-center">তীব্রতা</TableHead>
                    <TableHead className="text-center">রিপোর্ট করার তারিখ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challengesData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.challenge}</TableCell>
                      <TableCell className="text-center">{row.affectedArea}</TableCell>
                      <TableCell className="text-center">{row.affectedFarmers}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            row.severity === 'উচ্চ' ? 'destructive' : 
                            row.severity === 'মাঝারি' ? 'default' : 
                            'secondary'
                          }
                        >
                          {row.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{row.reportedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedReportsTabs;
