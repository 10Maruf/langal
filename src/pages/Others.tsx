import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Newspaper, MessageSquare, Grid3X3 } from "lucide-react";
import WeatherForecast from "./WeatherForecast";
import NewsFeed from "./NewsFeed";
import Consultation from "./Consultation";

const Others = () => {
  const [activeTab, setActiveTab] = useState("weather");

  const tabs = [
    {
      id: "weather",
      label: "আবহাওয়া পরিকল্পনা",
      icon: Cloud,
      description: "আবহাওয়ার সাথে ফসল পরিকল্পনা"
    },
    {
      id: "news",
      label: "সংবাদ ও বাজার",
      icon: Newspaper,
      description: "কৃষি সংবাদ ও বাজারদর"
    },
    {
      id: "consultation",
      label: "পরামর্শ সেবা",
      icon: MessageSquare,
      description: "বাংলা ভয়েস পরামর্শ"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "weather":
        return <WeatherForecast />;
      case "news":
        return <NewsFeed />;
      case "consultation":
        return <Consultation />;
      default:
        return <WeatherForecast />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 pb-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-primary" />
              অন্যান্য সেবা
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="h-auto p-4 flex-col gap-2"
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default Others;