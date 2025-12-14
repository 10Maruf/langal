import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CustomerBottomNav } from "@/components/layout/CustomerBottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CustomerSocialFeed from "./CustomerSocialFeed";
import CentralMarketplace from "./CentralMarketplace";
import CustomerNewsFeed from "./CustomerNewsFeed";
import CustomerHistory from "./CustomerHistory";
import WeatherForecast from "./WeatherForecast";

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("social");

    const renderActiveTab = () => {
        switch (activeTab) {
            case "social":
                return <CustomerSocialFeed showHeader={false} />;
            case "marketplace":
                return <CentralMarketplace showHeader={false} />;
            case "news":
                return <CustomerNewsFeed />;
            case "weather":
                return <WeatherForecast embedded={true} />;
            default:
                return <CustomerSocialFeed showHeader={false} />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 pb-20">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        স্বাগতম, {user?.name || 'ক্রেতা'}
                    </h1>
                    <p className="text-muted-foreground">
                        তাজা কৃষিপণ্য কেনাকাটার ড্যাশবোর্ড
                    </p>
                </div>

                {activeTab === "social" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-muted-foreground">মোট অর্ডার</p>
                                        <p className="text-2xl font-bold">১৫</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Package className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-muted-foreground">প্রসেসিং</p>
                                        <p className="text-2xl font-bold">৩</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Truck className="h-8 w-8 text-orange-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-muted-foreground">ডেলিভারি</p>
                                        <p className="text-2xl font-bold">১</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {renderActiveTab()}
            </main>

            <CustomerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};

export default CustomerDashboard;
