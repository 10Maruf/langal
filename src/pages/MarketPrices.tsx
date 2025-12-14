import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { DollarSign, TrendingUp, TrendingDown, ArrowLeft, RefreshCw, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketPrice {
    item: string;
    currentPrice: number;
    previousPrice: number;
    change: number;
    changePercent: number;
    market: string;
    date: string;
    unit: string;
}

const MarketPrices = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [selectedMarket, setSelectedMarket] = useState<string>('all');

    // Mock market prices data
    const marketPrices: MarketPrice[] = [
        {
            item: 'ধান (আমন)',
            currentPrice: 1250,
            previousPrice: 1200,
            change: 50,
            changePercent: 4.17,
            market: 'কাপ্তাই বাজার',
            date: 'আজ',
            unit: 'মণ'
        },
        {
            item: 'ধান (বোরো)',
            currentPrice: 1300,
            previousPrice: 1280,
            change: 20,
            changePercent: 1.56,
            market: 'কুমিল্লা বাজার',
            date: 'আজ',
            unit: 'মণ'
        },
        {
            item: 'গম',
            currentPrice: 1400,
            previousPrice: 1380,
            change: 20,
            changePercent: 1.45,
            market: 'দিনাজপুর বাজার',
            date: 'আজ',
            unit: 'মণ'
        },
        {
            item: 'আলু',
            currentPrice: 45,
            previousPrice: 50,
            change: -5,
            changePercent: -10,
            market: 'শেরেবাংলা নগর',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'টমেটো',
            currentPrice: 80,
            previousPrice: 75,
            change: 5,
            changePercent: 6.67,
            market: 'কারওয়ান বাজার',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'পেঁয়াজ',
            currentPrice: 60,
            previousPrice: 65,
            change: -5,
            changePercent: -7.69,
            market: 'শ্যামবাজার',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'রসুন',
            currentPrice: 180,
            previousPrice: 175,
            change: 5,
            changePercent: 2.86,
            market: 'কাপ্তান বাজার',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'সরিষা',
            currentPrice: 140,
            previousPrice: 135,
            change: 5,
            changePercent: 3.7,
            market: 'চট্টগ্রাম বাজার',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'ভুট্টা',
            currentPrice: 35,
            previousPrice: 32,
            change: 3,
            changePercent: 9.38,
            market: 'রংপুর বাজার',
            date: 'আজ',
            unit: 'কেজি'
        },
        {
            item: 'মসুর ডাল',
            currentPrice: 120,
            previousPrice: 118,
            change: 2,
            changePercent: 1.69,
            market: 'যশোর বাজার',
            date: 'আজ',
            unit: 'কেজি'
        }
    ];

    const markets = [
        { value: 'all', label: 'সকল বাজার' },
        { value: 'কাপ্তাই বাজার', label: 'কাপ্তাই বাজার' },
        { value: 'কুমিল্লা বাজার', label: 'কুমিল্লা বাজার' },
        { value: 'দিনাজপুর বাজার', label: 'দিনাজপুর বাজার' },
        { value: 'শেরেবাংলা নগর', label: 'শেরেবাংলা নগর' },
        { value: 'কারওয়ান বাজার', label: 'কারওয়ান বাজার' },
        { value: 'শ্যামবাজার', label: 'শ্যামবাজার' }
    ];

    const getFilteredPrices = () => {
        if (selectedMarket === 'all') return marketPrices;
        return marketPrices.filter(price => price.market === selectedMarket);
    };

    const handleRefresh = () => {
        toast({
            title: "দাম আপডেট করা হয়েছে",
            description: "সর্বশেষ বাজারদর লোড করা হয়েছে",
        });
    };

    const getPriceChangeColor = (change: number) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getPriceChangeBg = (change: number) => {
        if (change > 0) return 'bg-green-50 border-green-200';
        if (change < 0) return 'bg-red-50 border-red-200';
        return 'bg-gray-50 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pb-20 pt-14">
                {/* Header */}
                <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                আজকের বাজারদর
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                সর্বশেষ আপডেট: {new Date().toLocaleTimeString('bn-BD')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TTSButton
                            text="আজকের বাজারদর পাতা। এখানে সর্বশেষ বাজারের দাম দেখতে পাবেন।"
                            size="icon"
                            variant="ghost"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* Market Filter */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-2">
                                {markets.map(market => (
                                    <button
                                        key={market.value}
                                        onClick={() => setSelectedMarket(market.value)}
                                        className={`px-3 py-2 rounded-full text-sm border transition-colors flex items-center gap-1 ${selectedMarket === market.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:bg-muted"
                                            }`}
                                    >
                                        <MapPin className="h-3 w-3" />
                                        {market.label}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">দাম বৃদ্ধি</p>
                                        <p className="font-semibold">
                                            {getFilteredPrices().filter(p => p.change > 0).length} টি পণ্য
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <TrendingDown className="h-8 w-8 text-red-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">দাম হ্রাস</p>
                                        <p className="font-semibold">
                                            {getFilteredPrices().filter(p => p.change < 0).length} টি পণ্য
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <DollarSign className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">মোট পণ্য</p>
                                        <p className="font-semibold">{getFilteredPrices().length} টি</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Market Prices Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getFilteredPrices().map((price, index) => (
                            <Card key={index} className={`border-2 ${getPriceChangeBg(price.change)}`}>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{price.item}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {price.unit}
                                            </Badge>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">
                                                ৳{price.currentPrice}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                প্রতি {price.unit}
                                            </div>
                                        </div>

                                        <div className={`flex items-center justify-center gap-2 text-sm ${getPriceChangeColor(price.change)}`}>
                                            {price.change > 0 ? (
                                                <TrendingUp className="h-4 w-4" />
                                            ) : price.change < 0 ? (
                                                <TrendingDown className="h-4 w-4" />
                                            ) : (
                                                <span className="h-4 w-4" />
                                            )}
                                            <span className="font-semibold">
                                                {price.change > 0 ? '+' : ''}{price.change} টাকা
                                            </span>
                                            <span>({price.changePercent > 0 ? '+' : ''}{price.changePercent.toFixed(1)}%)</span>
                                        </div>

                                        <div className="border-t pt-3 space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">আগের দাম:</span>
                                                <span>৳{price.previousPrice}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    বাজার:
                                                </span>
                                                <span>{price.market}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    তারিখ:
                                                </span>
                                                <span>{price.date}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <TTSButton
                                                text={`${price.item}। বর্তমান দাম ${price.currentPrice} টাকা প্রতি ${price.unit}। আগের দাম থেকে ${price.change > 0 ? price.change + ' টাকা বেশি' : Math.abs(price.change) + ' টাকা কম'}। ${price.market} বাজার।`}
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Information Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <h3 className="text-lg font-semibold">বাজারদর সম্পর্কে তথ্য</h3>
                                <p className="text-muted-foreground text-sm">
                                    এই দামগুলো দৈনিক আপডেট করা হয় এবং স্থানীয় বাজারের উপর ভিত্তি করে পরিবর্তিত হতে পারে।
                                    সঠিক দাম জানতে স্থানীয় বাজারে যোগাযোগ করুন।
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Badge variant="outline" className="py-2 px-4">
                                        📞 তথ্য হটলাইন: ১৬১২৩
                                    </Badge>
                                    <Badge variant="outline" className="py-2 px-4">
                                        📱 SMS: দাম লিখে পাঠান ১৬১২৩
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MarketPrices;
