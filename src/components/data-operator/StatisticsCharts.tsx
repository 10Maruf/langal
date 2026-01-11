import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StatisticsChartsProps {
  cropDistribution: { name: string; value: number }[];
  monthlyTrend: { month: string; farmers: number; revenue: number }[];
  landUsage: { category: string; area: number }[];
  fertilizerUsage: { type: string; amount: number }[];
  topCrops: { crop: string; yield: number }[];
  regionalComparison: { location: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

const StatisticsCharts = ({
  cropDistribution,
  monthlyTrend,
  landUsage,
  fertilizerUsage,
  topCrops,
  regionalComparison,
}: StatisticsChartsProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Crop Distribution Pie + Monthly Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ফসলের বিতরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">মাসিক প্রবণতা</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="farmers" stroke="#8884d8" name="কৃষক সংখ্যা" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="আয় (হাজার ৳)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Land Usage Bar + Fertilizer Usage Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Usage Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">জমির ব্যবহার</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={landUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="area" fill="#8884d8" name="জমি (একর)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fertilizer Usage Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">সার ব্যবহার</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fertilizerUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" name="পরিমাণ (কেজি)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Top Crops Bar + Regional Comparison Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Crops Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">শীর্ষ ফসলের ফলন</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCrops} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="crop" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="#FFBB28" name="ফলন (কেজি/একর)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Comparison Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">আঞ্চলিক তুলনা</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={regionalComparison}>
                <PolarGrid />
                <PolarAngleAxis dataKey="location" />
                <PolarRadiusAxis />
                <Radar name="মান" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Farmer Growth Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">কৃষকের বৃদ্ধি</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="farmers" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="কৃষক সংখ্যা" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCharts;
