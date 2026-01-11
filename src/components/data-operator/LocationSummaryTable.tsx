import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface LocationData {
  name: string;
  farmers: number;
  landArea: number;
  crops: number;
  yield: number;
  revenue: number;
}

interface LocationSummaryTableProps {
  scopeLevel: 'division' | 'district' | 'upazila' | 'union';
  locationName: string;
  data: LocationData[];
  onDrillDown?: (locationName: string) => void;
}

const LocationSummaryTable = ({ scopeLevel, locationName, data, onDrillDown }: LocationSummaryTableProps) => {
  const getScopeTitle = () => {
    switch (scopeLevel) {
      case 'division':
        return 'জেলা ভিত্তিক সারসংক্ষেপ';
      case 'district':
        return 'উপজেলা ভিত্তিক সারসংক্ষেপ';
      case 'upazila':
        return 'ইউনিয়ন ভিত্তিক সারসংক্ষেপ';
      case 'union':
        return 'গ্রাম ভিত্তিক সারসংক্ষেপ';
      default:
        return 'স্থান ভিত্তিক সারসংক্ষেপ';
    }
  };

  const getLocationColumnName = () => {
    switch (scopeLevel) {
      case 'division':
        return 'জেলা';
      case 'district':
        return 'উপজেলা';
      case 'upazila':
        return 'ইউনিয়ন';
      case 'union':
        return 'গ্রাম';
      default:
        return 'স্থান';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {getScopeTitle()} - {locationName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">{getLocationColumnName()}</TableHead>
                <TableHead className="text-center font-bold">কৃষক সংখ্যা</TableHead>
                <TableHead className="text-center font-bold">জমি (একর)</TableHead>
                <TableHead className="text-center font-bold">ফসল সংখ্যা</TableHead>
                <TableHead className="text-center font-bold">ফলন (কেজি/একর)</TableHead>
                <TableHead className="text-center font-bold">আয় (৳)</TableHead>
                {scopeLevel !== 'union' && (
                  <TableHead className="text-center font-bold">বিস্তারিত</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-center">{row.farmers.toLocaleString('bn-BD')}</TableCell>
                  <TableCell className="text-center">{row.landArea.toLocaleString('bn-BD')}</TableCell>
                  <TableCell className="text-center">{row.crops.toLocaleString('bn-BD')}</TableCell>
                  <TableCell className="text-center">{row.yield.toLocaleString('bn-BD')}</TableCell>
                  <TableCell className="text-center">৳{row.revenue.toLocaleString('bn-BD')}</TableCell>
                  {scopeLevel !== 'union' && (
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDrillDown?.(row.name)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        বিস্তারিত
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow className="bg-gray-100 font-bold">
                <TableCell>মোট</TableCell>
                <TableCell className="text-center">
                  {data.reduce((sum, row) => sum + row.farmers, 0).toLocaleString('bn-BD')}
                </TableCell>
                <TableCell className="text-center">
                  {data.reduce((sum, row) => sum + row.landArea, 0).toLocaleString('bn-BD')}
                </TableCell>
                <TableCell className="text-center">
                  {data.reduce((sum, row) => sum + row.crops, 0).toLocaleString('bn-BD')}
                </TableCell>
                <TableCell className="text-center">
                  {(data.reduce((sum, row) => sum + row.yield, 0) / data.length).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  ৳{data.reduce((sum, row) => sum + row.revenue, 0).toLocaleString('bn-BD')}
                </TableCell>
                {scopeLevel !== 'union' && <TableCell></TableCell>}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSummaryTable;
