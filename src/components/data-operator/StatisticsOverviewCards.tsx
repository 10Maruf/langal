import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Sprout, TrendingUp, DollarSign, CheckCircle } from "lucide-react";

interface OverviewStats {
  totalFarmers: number;
  totalLandArea: number;
  totalCrops: number;
  averageYield: number;
  totalRevenue: number;
  activeFields: number;
}

interface StatisticsOverviewCardsProps {
  stats: OverviewStats;
}

const StatisticsOverviewCards = ({ stats }: StatisticsOverviewCardsProps) => {
  const cards = [
    {
      title: "মোট কৃষক",
      value: stats.totalFarmers.toLocaleString('bn-BD'),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "মোট জমির পরিমাণ",
      value: `${stats.totalLandArea.toLocaleString('bn-BD')} একর`,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "মোট ফসলের সংখ্যা",
      value: stats.totalCrops.toLocaleString('bn-BD'),
      icon: Sprout,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "গড় ফলন",
      value: `${stats.averageYield.toLocaleString('bn-BD')} কেজি/একর`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "মোট আয়",
      value: `৳${stats.totalRevenue.toLocaleString('bn-BD')}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "সক্রিয় ক্ষেত",
      value: stats.activeFields.toLocaleString('bn-BD'),
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} ${card.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsOverviewCards;
