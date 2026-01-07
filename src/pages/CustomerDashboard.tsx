import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
    TrendingUp,
    MapPin,
    Droplets,
    Wind,
    Loader2,
    Sun,
    Moon,
    Cloud,
    CloudRain,
    CloudSun,
    CloudMoon,
    ChevronRight,
    Clock,
    CheckCircle,
    Store,
    ShoppingBag
} from "lucide-react";
import {
    fetchWeatherOneCall,
    processWeatherData,
    getLocationName,
    toBengaliNumber,
    CompleteWeatherData
} from "@/services/weatherService";
import { getProfilePhotoUrl } from "@/lib/utils";

// Import dashboard icons
import socialFeedIcon from "@/assets/dashboard-icons/social-feed.png";
import marketplaceIcon from "@/assets/dashboard-icons/marketplace.png";
import weatherIcon from "@/assets/dashboard-icons/weather.png";
import marketPriceBdIcon from "@/assets/dashboard-icons/market-price-bd.png";
import newsIcon from "@/assets/dashboard-icons/news.png";

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Weather state
    const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
    const [weatherLocation, setWeatherLocation] = useState<string>("");
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    // রাত কিনা চেক করার হেল্পার
    const isNightTime = (): boolean => {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 18;
    };

    // Weather icon helper
    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        const isNight = isNightTime();


        if (c.includes('পরিষ্কার') || c.includes('clear')) {
            return isNight
                ? <Moon className="h-10 w-10 text-indigo-400" />
                : <Sun className="h-10 w-10 text-amber-500" />;
        }
        if (c.includes('বৃষ্টি') || c.includes('rain')) return <CloudRain className="h-10 w-10 text-blue-500" />;
        if (c.includes('মেঘ') && c.includes('হালকা')) {
            return isNight
                ? <CloudMoon className="h-10 w-10 text-slate-400" />
                : <CloudSun className="h-10 w-10 text-gray-400" />;
        }
        if (c.includes('মেঘ')) {
            return isNight
                ? <CloudMoon className="h-10 w-10 text-slate-400" />
                : <CloudSun className="h-10 w-10 text-gray-400" />;
        }
        return <Cloud className="h-10 w-10 text-gray-400" />;
    };

    // বাংলা তারিখ ফরম্যাট
    const formatBanglaDate = () => {
        const banglaMonths = [
            'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
            'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];
        const today = new Date();
        const day = toBengaliNumber(today.getDate());
        const month = banglaMonths[today.getMonth()];
        const year = toBengaliNumber(today.getFullYear());
        return `${day} ই ${month}, ${year}`;
    };

    // Fetch weather on mount using GPS
    useEffect(() => {
        const fetchWeather = async () => {
            setWeatherLoading(true);
            setWeatherError(null);

            if (!navigator.geolocation) {
                setWeatherError("GPS সমর্থিত নয়");
                setWeatherLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const locationName = await getLocationName(latitude, longitude);
                        const rawData = await fetchWeatherOneCall(latitude, longitude);
                        const processed = processWeatherData(rawData, locationName);

                        setWeatherData(processed);
                        setWeatherLocation(locationName);
                    } catch (error) {
                        console.error("Weather fetch error:", error);
                        setWeatherError("আবহাওয়া লোড করতে সমস্যা");
                    } finally {
                        setWeatherLoading(false);
                    }
                },
                (error) => {
                    console.error("GPS error:", error);
                    setWeatherError("অবস্থান পাওয়া যায়নি");
                    setWeatherLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        };

        fetchWeather();
    }, []);

    // ড্যাশবোর্ড আইকন এবং রুট ম্যাপিং - Customer specific
    const dashboardItems = [
        {
            id: "social",
            title: "কৃষি ফিড",
            description: "কৃষি সম্প্রদায়ের সাথে যোগাযোগ করুন",
            image: socialFeedIcon,
            route: "/social-feed",
            color: "bg-blue-500",
            stats: "নতুন পোস্ট দেখুন"
        },
        {
            id: "marketplace",
            title: "বাজার",
            description: "তাজা কৃষিপণ্য কিনুন",
            image: marketplaceIcon,
            route: "/central-marketplace",
            color: "bg-purple-500",
            stats: "নতুন পণ্য উপলব্ধ"
        },
        {
            id: "weather",
            title: "আবহাওয়া",
            description: "আবহাওয়ার পূর্বাভাস দেখুন",
            image: weatherIcon,
            route: "/abhaowa-purbabhas",
            color: "bg-orange-500",
            stats: "৭ দিনের পূর্বাভাস"
        },
        {
            id: "news",
            title: "বাজারদর",
            description: "দৈনিক বাজারদর ও মূল্য তালিকা",
            image: marketPriceBdIcon,
            route: "/market-prices",
            color: "bg-cyan-500",
            stats: "আজকের দর"
        },
        {
            id: "agricultural-news",
            title: "কৃষি সংবাদ",
            description: "কৃষি বিষয়ক সংবাদ ও তথ্য",
            image: newsIcon,
            route: "/agricultural-news",
            color: "bg-amber-500",
            stats: "নতুন সংবাদ"
        }
    ];

    const handleNavigation = (route: string) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="p-4 pb-8 space-y-4 pt-20 max-w-3xl mx-auto">
                {/* ১. স্বাগত বার্তা with Profile Picture - Purple/Blue Theme */}
                <Card className="border border-purple-200/50 bg-gradient-to-br from-purple-50/60 to-blue-50/60 dark:from-purple-950/30 dark:to-blue-950/30 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardContent className="p-5 relative">
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-sm"></div>
                        <div className="absolute -right-4 top-12 w-20 h-20 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-sm"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative">
                                <Avatar className="h-16 w-16 border-2 border-purple-400/40 shadow-lg ring-2 ring-purple-300/30">
                                    <AvatarImage src={getProfilePhotoUrl(user?.profilePhoto)} alt={user?.name} />
                                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xl font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                {user?.verificationStatus && (
                                    <>
                                        {user.verificationStatus === 'approved' && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-md">
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        {user.verificationStatus === 'pending' && (
                                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 shadow-md">
                                                <Clock className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        {user.verificationStatus === 'rejected' && (
                                            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 shadow-md">
                                                <Clock className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">স্বাগতম,</p>
                                <h1 className="text-2xl font-bold tracking-tight text-purple-800 dark:text-purple-100">{user?.name || 'ক্রেতা'}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-purple-200/60 dark:bg-purple-800/60 text-purple-700 dark:text-purple-200 border-0 text-xs">
                                        <Store className="h-3 w-3 mr-1" />
                                        ক্রেতা/ব্যবসায়ী
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right bg-white/50 dark:bg-purple-900/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-200/50">
                                <p className="text-xs text-purple-600 dark:text-purple-400">আজকের তারিখ</p>
                                <p className="text-lg font-semibold text-purple-800 dark:text-purple-100">{formatBanglaDate()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ২. Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    {/* আজকের দর */}
                    <Card
                        className="border cursor-pointer hover:border-primary/50 transition-colors hover:shadow-md"
                        onClick={() => navigate("/market-prices")}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">আজকের দর</p>
                                        <p className="text-sm font-medium">বাজার মূল্য দেখুন</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* বাজারে যান */}
                    <Card
                        className="border cursor-pointer hover:border-primary/50 transition-colors hover:shadow-md"
                        onClick={() => navigate("/central-marketplace")}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                                        <ShoppingBag className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">বাজারে যান</p>
                                        <p className="text-sm font-medium">পণ্য কিনুন</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ৩. আবহাওয়া কার্ড */}
                <Card
                    className="border cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate("/abhaowa-purbabhas")}
                >
                    <CardContent className="p-4">
                        {weatherLoading ? (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                <span className="text-sm text-muted-foreground">আবহাওয়া লোড হচ্ছে...</span>
                            </div>
                        ) : weatherError ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Cloud className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">আবহাওয়া</p>
                                        <p className="text-xs text-muted-foreground">{weatherError}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ) : weatherData ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {getWeatherIcon(weatherData.বর্তমান.অবস্থা)}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-semibold">
                                                {toBengaliNumber(weatherData.বর্তমান.তাপমাত্রা)}°
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {weatherData.বর্তমান.অবস্থা}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span>{weatherLocation}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right text-xs text-muted-foreground space-y-1">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Droplets className="h-3 w-3" />
                                            {toBengaliNumber(weatherData.বর্তমান.আর্দ্রতা)}%
                                        </div>
                                        <div className="flex items-center gap-1 justify-end">
                                            <Wind className="h-3 w-3" />
                                            {toBengaliNumber(weatherData.বর্তমান.বাতাসের_গতি)} কিমি/ঘ
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                {/* ৪. মূল ড্যাশবোর্ড মেনু */}
                <div
                    className="relative rounded-xl p-4 -mx-4 overflow-hidden"
                    style={{
                        backgroundImage: 'url("/img/customer_dashboard_bg.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Opacity overlay */}
                    <div className="absolute inset-0 bg-background/70 rounded-xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">সেবা সমূহ</h2>
                            <TTSButton
                                text="ক্রেতা সেবা মেনু। এখানে কৃষি ফিড, বাজার, আবহাওয়া, বাজারদর, এবং কৃষি সংবাদ পাবেন।"
                                size="icon"
                                variant="ghost"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {dashboardItems.map((item) => {
                                return (
                                    <Card
                                        key={item.id}
                                        className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-white/30 dark:border-white/10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-gray-800/60"
                                        onClick={() => handleNavigation(item.route)}
                                    >
                                        <CardContent className="p-6 text-center space-y-3">
                                            <div className="mx-auto w-20 h-20 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center p-2 border border-white/50 dark:border-white/10">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                                <Badge variant="secondary" className="text-xs bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                                                    {item.stats}
                                                </Badge>
                                            </div>

                                            <div className="mt-2">
                                                <TTSButton
                                                    text={`${item.title}। ${item.description}। ${item.stats}`}
                                                    size="icon"
                                                    variant="outline"
                                                    className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-white/40"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ৫. সাহায্য বিভাগ */}
                <Card className="border-purple-200/50">
                    <CardContent className="p-6">
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-semibold">সাহায্য প্রয়োজন?</h3>
                            <p className="text-muted-foreground">
                                কোন সমস্যা হলে আমাদের সাথে যোগাযোগ করুন
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Badge variant="outline" className="py-2 px-4 border-purple-300">
                                    📞 হটলাইন: ১৬১২৩
                                </Badge>
                                <Badge variant="outline" className="py-2 px-4 border-purple-300">
                                    📱 SMS: ১৬১২৩
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default CustomerDashboard;
