import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import api from "@/services/api";
import CropDetailsModal from "@/components/farmer/CropDetailsModal";
import {
    TrendingUp,
    Users,
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
    Bell,
    Sprout,
    Clock,
    CheckCircle,
    DollarSign,
    CalendarClock,
    AlertTriangle,
    Play
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
import cropSelectionIcon from "@/assets/dashboard-icons/crop-selection.png";
import diagnosisIcon from "@/assets/dashboard-icons/diagnosis.png";
import marketplaceIcon from "@/assets/dashboard-icons/marketplace.png";
import weatherIcon from "@/assets/dashboard-icons/weather.png";
import marketPriceBdIcon from "@/assets/dashboard-icons/market-price-bd.png";
import newsIcon from "@/assets/dashboard-icons/news.png";
import consultationIcon from "@/assets/dashboard-icons/consultation.png";
import { Button } from "@/components/ui/button";

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { notifications, unreadCount } = useNotifications();

    // Selected crops state
    const [selectedCrops, setSelectedCrops] = useState<any[]>([]);
    const [cropsLoading, setCropsLoading] = useState(true);
    const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("active");

    // Quick view dialogs state
    const [costDialogOpen, setCostDialogOpen] = useState(false);
    const [fertilizerDialogOpen, setFertilizerDialogOpen] = useState(false);
    const [quickViewCrop, setQuickViewCrop] = useState<any>(null);

    // Helper for crop filtering
    const getSecondaryCrops = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (filterStatus === 'planned') return selectedCrops.filter((c: any) => c.status === 'planned');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (filterStatus === 'completed') return selectedCrops.filter((c: any) => c.status === 'completed');
        return [];
    };

    const getSecondaryTitle = () => {
        if (filterStatus === 'completed') return 'সম্পন্ন ফসল';
        return 'পরিকল্পিত ফসল';
    };

    const getSecondaryColorClass = () => {
        if (filterStatus === 'completed') return 'bg-gray-400';
        return 'bg-blue-400';
    };

    const getSecondaryBgClass = () => {
        if (filterStatus === 'completed') return 'bg-gray-100/80 text-gray-900';
        return 'bg-blue-100/80 text-blue-900';
    };

    // Weather state
    const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
    const [weatherLocation, setWeatherLocation] = useState<string>("");
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    const LAND_UNITS = [
        { value: 'bigha', label: 'বিঘা', factor: 1 },
        { value: 'acre', label: 'একর', factor: 3.03 },
        { value: 'hectare', label: 'হেক্টর', factor: 7.47 },
        { value: 'katha', label: 'কাঠা', factor: 0.05 },
        { value: 'decimal', label: 'শতাংশ', factor: 0.0303 }
    ];

    // Farmer count from database
    const [totalFarmers, setTotalFarmers] = useState<number>(0);
    const [farmerCountLoading, setFarmerCountLoading] = useState(true);

    // My Crops rotating background
    const cropBackgrounds = [
        '/img/my_crop_bg/one.jpg',
        '/img/my_crop_bg/two.jpg',
        '/img/my_crop_bg/three.jpg',
        '/img/my_crop_bg/four.jpg',
        '/img/my_crop_bg/five.jpg'
    ];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    // আজকের দর (এটা API থেকে আনা যাবে)
    const todayPrices = [
        { name: "ধান", price: "২৮", unit: "কেজি", trend: "up" },
        { name: "গম", price: "৪৫", unit: "কেজি", trend: "down" },
        { name: "আলু", price: "২২", unit: "কেজি", trend: "up" },
    ];

    // রাত কিনা চেক করার হেল্পার
    const isNightTime = (): boolean => {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 18; // সন্ধ্যা ৬টা থেকে সকাল ৬টা পর্যন্ত রাত
    };

    // Weather icon helper - দিন/রাত অনুযায়ী
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

    // User type label
    const getUserTypeLabel = (type: string) => {
        switch (type) {
            case 'farmer': return 'কৃষক';
            case 'expert': return 'বিশেষজ্ঞ';
            case 'customer': return 'ক্রেতা';
            default: return '';
        }
    };

    // বাংলা তারিখ ফরম্যাট - "৮ ই ডিসেম্বর, ২০২৫"
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

    // Fetch farmer count from database
    useEffect(() => {
        const fetchFarmerCount = async () => {
            try {
                const response = await api.get('/users/count?type=farmer');
                if (response.data?.count) {
                    setTotalFarmers(response.data.count);
                }
            } catch (error) {
                console.error("Farmer count fetch error:", error);
                // Fallback to a default value
                setTotalFarmers(0);
            } finally {
                setFarmerCountLoading(false);
            }
        };

        fetchFarmerCount();
    }, []);

    // Fetch selected crops
    useEffect(() => {
        const fetchSelectedCrops = async () => {
            try {
                // Remove status filter to see all crops
                const response = await api.get('/recommendations/selected');
                console.log("Selected crops response:", response.data);
                if (response.data?.selected_crops) {
                    setSelectedCrops(response.data.selected_crops);
                } else if (response.data?.data) {
                    // Fallback for alternate response structure
                    setSelectedCrops(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch selected crops:", error);
            } finally {
                setCropsLoading(false);
            }
        };

        // Load offline crops
        const loadOfflineCrops = () => {
            try {
                const offlineData = localStorage.getItem('offline_crop_selections');
                if (offlineData) {
                    const parsed = JSON.parse(offlineData);
                    if (Array.isArray(parsed)) {
                        // Transform offline data to match display format
                        const offlineCrops = parsed.flatMap((selection: any) =>
                            selection.crops.map((crop: any) => ({
                                selection_id: `offline-${Date.now()}-${Math.random()}`,
                                crop_name_bn: crop.name_bn,
                                status: 'offline',
                                image_url: crop.image?.url,
                                start_date: selection.start_date || new Date().toISOString(),
                                progress_percentage: 0,
                                is_offline: true
                            }))
                        );

                        setSelectedCrops(prev => [...prev, ...offlineCrops]);
                    }
                }
            } catch (e) {
                console.error("Error loading offline crops:", e);
            }
        };

        if (user) {
            fetchSelectedCrops().then(() => {
                loadOfflineCrops();
            });
        }
    }, [user]);

    // Rotate crop background every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % cropBackgrounds.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

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

    // ড্যাশবোর্ড আইকন এবং রুট ম্যাপিং
    const dashboardItems = [
        {
            id: "social",
            title: "কৃষি ফিড",
            description: "কৃষক সম্প্রদায়ের সাথে যোগাযোগ করুন",
            image: socialFeedIcon,
            route: "/social-feed",
            color: "bg-blue-500",
            stats: "ঘুরে আসুন"
        },
        {
            id: "recommendation",
            title: "ফসল নির্বাচন",
            description: "উপযুক্ত ফসল বেছে নিন",
            image: cropSelectionIcon,
            route: "/recommendation",
            color: "bg-green-500",
            stats: "AI সহায়তা"
        },
        {
            id: "diagnosis",
            title: "রোগ নির্ণয়",
            description: "ফসলের রোগ শনাক্ত করুন",
            image: diagnosisIcon,
            route: "/diagnosis",
            color: "bg-red-500",
            stats: "AI সহায়তা"
        },
        {
            id: "marketplace",
            title: "বাজার",
            description: "কেনাবেচা করুন",
            image: marketplaceIcon,
            route: "/central-marketplace",
            color: "bg-purple-500",
            stats: "বাজার খুলুন"
        },
        {
            id: "weather",
            title: "আবহাওয়া",
            description: "আবহাওয়ার পূর্বাভাস ও কৃষি পরামর্শ",
            image: weatherIcon,
            route: "/abhaowa-purbabhas",
            color: "bg-orange-500",
            stats: "৭ দিনের পূর্বাভাস"
        },
        // {
        //     id: "news",
        //     title: "বাজারদর",
        //     description: "দৈনিক বাজারদর ও মূল্য তালিকা",
        //     image: marketPriceBdIcon,
        //     route: "/market-prices",
        //     color: "bg-cyan-500",
        //     stats: "আজকের দর"
        // },
        // {
        //     id: "agricultural-news",
        //     title: "কৃষি সংবাদ",
        //     description: "কৃষি বিষয়ক সংবাদ ও তথ্য",
        //     image: newsIcon,
        //     route: "/agricultural-news",
        //     color: "bg-amber-500",
        //     stats: "নতুন সংবাদ"
        // },
        {
            id: "consultation",
            title: "পরামর্শ",
            description: "বিশেষজ্ঞদের পরামর্শ নিন",
            image: consultationIcon,
            route: "/consultation",
            color: "bg-indigo-500",
            stats: "২৪/৭ সেবা"
        }
    ];

    const handleNavigation = (route: string) => {
        navigate(route);
    };

    const handleCropClick = (cropId: number) => {
        setSelectedCropId(cropId);
        setIsCropModalOpen(true);
    };

    const handleCropUpdated = () => {
        // Refetch selected crops when updated/removed
        const fetchSelectedCrops = async () => {
            try {
                const response = await api.get('/recommendations/selected');
                if (response.data?.selected_crops) {
                    setSelectedCrops(response.data.selected_crops);
                } else if (response.data?.data) {
                    setSelectedCrops(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch selected crops:", error);
            }
        };
        fetchSelectedCrops();
    };

    const handleCostClick = (e: React.MouseEvent, crop: any) => {
        e.stopPropagation(); // Prevent card click
        setQuickViewCrop(crop);
        setCostDialogOpen(true);
    };

    const handleFertilizerClick = (e: React.MouseEvent, crop: any) => {
        e.stopPropagation(); // Prevent card click
        setQuickViewCrop(crop);
        setFertilizerDialogOpen(true);
    };

    const handleStartCultivation = async (e: React.MouseEvent, crop: any) => {
        e.stopPropagation();
        try {
            await api.put(`/recommendations/selected/${crop.selection_id}/status`, {
                status: 'active'
            }); // Backend will reset start_date to now()

            // Refresh list
            const response = await api.get('/recommendations/selected');
            if (response.data?.selected_crops) {
                setSelectedCrops(response.data.selected_crops);
            }
        } catch (error) {
            console.error("Failed to start cultivation:", error);
        }
    };

    const getDaysRemaining = (createdAt: string) => {
        if (!createdAt) return 7;
        const created = new Date(createdAt);
        const now = new Date();
        const expirationDate = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
        const diffTime = expirationDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="p-4 pb-20 space-y-4 pt-20 max-w-3xl mx-auto">
                {/* ১. স্বাগত বার্তা with Profile Picture - Glassmorphism Hero Section */}
                <Card className="border border-green-200/50 bg-green-50/60 dark:bg-green-950/30 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardContent className="p-5 relative">
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-200/30 dark:bg-green-400/10 rounded-full blur-sm"></div>
                        <div className="absolute -right-4 top-12 w-20 h-20 bg-green-300/20 dark:bg-green-500/10 rounded-full blur-sm"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative">
                                <Avatar className="h-16 w-16 border-2 border-green-400/40 shadow-lg ring-2 ring-green-300/30">
                                    <AvatarImage src={getProfilePhotoUrl(user?.profilePhoto)} alt={user?.name} />
                                    <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xl font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                                    </>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-green-600 dark:text-green-400 text-sm font-medium">স্বাগতম,</p>
                                <h1 className="text-2xl font-bold tracking-tight text-green-800 dark:text-green-100">{user?.name || 'কৃষক ভাই'}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-green-200/60 dark:bg-green-800/60 text-green-700 dark:text-green-200 border-0 text-xs">
                                        {getUserTypeLabel(user?.type || 'farmer')}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right bg-white/50 dark:bg-green-900/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-200/50">
                                <p className="text-xs text-green-600 dark:text-green-400">আজকের তারিখ</p>
                                <p className="text-lg font-semibold text-green-800 dark:text-green-100">{formatBanglaDate()}</p>
                                {/* Debug Info - Remove later */}
                                <p className="text-[10px] text-muted-foreground mt-1">ID: {user?.user_id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ২. কৃষক সংখ্যা ও আজকের দর */}
                {/* <div className="grid grid-cols-2 gap-3"> */}
                {/* কৃষক সংখ্যা */}
                {/* <Card className="border">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">নিবন্ধিত কৃষক</p>
                                    {farmerCountLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    ) : (
                                        <p className="text-lg font-semibold">{toBengaliNumber(totalFarmers)} জন</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                {/* আজকের দর */}
                {/* <Card
                        className="border cursor-pointer hover:border-primary/50 transition-colors"
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
                                        <p className="text-sm font-medium">ধান ২৮৳/কেজি</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* ৩. আবহাওয়া কার্ড - Simple Design */}
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

                {/* ৪. নির্বাচিত ফসল (Selected Crops) */}
                <div
                    className="space-y-2 relative rounded-xl p-4 -mx-4 transition-all duration-1000"
                    style={{
                        backgroundImage: `url(${cropBackgrounds[currentBgIndex]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Subtle overlay to enhance readability */}
                    <div className="absolute inset-0 bg-background/30 rounded-xl"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-semibold text-lg">আমার ফসল</h3>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[170px] h-8 bg-white/60 backdrop-blur-sm border-white/40 text-xs font-medium">
                                    <SelectValue placeholder="ফিল্টার করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">চলমান (Active)</SelectItem>
                                    <SelectItem value="planned">পরিকল্পিত (Planned)</SelectItem>
                                    <SelectItem value="completed">সম্পন্ন (Completed)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        {cropsLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : selectedCrops.length > 0 ? (
                            <div className="space-y-4">
                                {/* Active Crops Section */}
                                {filterStatus === 'active' && selectedCrops.some((c: any) => c.status === 'active') && (
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <h4 className="font-medium text-sm text-green-800 bg-green-100/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm inline-block">চলমান চাষাবাদ</h4>
                                            <span className="text-xs text-muted-foreground ml-auto bg-white/50 px-2 rounded-full hidden sm:block">নিয়মিত পর্যবেক্ষণ করুন</span>
                                        </div>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {selectedCrops.filter((c: any) => c.status === 'active').map((crop: any) => (
                                                <Card
                                                    key={crop.selection_id}
                                                    className="min-w-[170px] w-[170px] flex-shrink-0 cursor-pointer hover:border-green-500 transition-all backdrop-blur-md bg-white/90 border-green-200/50 shadow-lg hover:shadow-xl ring-2 ring-green-400/20"
                                                    onClick={() => handleCropClick(crop.selection_id)}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="aspect-video rounded-md overflow-hidden mb-2 bg-muted relative">
                                                            {crop.image_url ? (
                                                                <img src={crop.image_url} alt={crop.crop_name_bn} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-green-100">
                                                                    <Sprout className="h-8 w-8 text-green-600" />
                                                                </div>
                                                            )}
                                                            {crop.progress_percentage > 0 && (
                                                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                                                                    <div
                                                                        className="h-full bg-green-500"
                                                                        style={{ width: `${crop.progress_percentage}%` }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-sm truncate text-green-900">{crop.crop_name_bn}</h4>

                                                        {/* Quick Action Icons */}
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            <button
                                                                onClick={(e) => handleCostClick(e, crop)}
                                                                className="flex items-center gap-1 px-2 py-1 text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
                                                            >
                                                                <DollarSign className="h-3 w-3" />
                                                                <span>খরচ</span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleFertilizerClick(e, crop)}
                                                                className="flex items-center gap-1 px-2 py-1 text-[10px] bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors border border-green-200"
                                                            >
                                                                <CalendarClock className="h-3 w-3" />
                                                                <span>সার</span>
                                                            </button>
                                                        </div>

                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">অগ্রগতি</span>
                                                                <span className="font-semibold text-green-600">{Math.round(crop.progress_percentage || 0)}%</span>
                                                            </div>
                                                            {crop.next_action_description && (
                                                                <div className="text-[10px] bg-blue-50 text-blue-700 p-1.5 rounded border border-blue-100 mt-1 line-clamp-2 leading-tight">
                                                                    পরবর্তী: {crop.next_action_description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className={`mt-2 text-[10px] w-full justify-center bg-green-100 text-green-800 border-green-200`}>
                                                            চলমান
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Planned & Other Crops Section */}
                                {getSecondaryCrops().length > 0 && (
                                    <div className="relative z-10 pt-2">
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <div className={`h-2 w-2 rounded-full ${getSecondaryColorClass()}`}></div>
                                            <h4 className={`font-medium text-sm px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm inline-block ${getSecondaryBgClass()}`}>{getSecondaryTitle()}</h4>
                                        </div>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {getSecondaryCrops().map((crop: any) => (
                                                <Card
                                                    key={crop.selection_id}
                                                    className="min-w-[160px] w-[160px] flex-shrink-0 cursor-pointer hover:border-primary transition-all backdrop-blur-md bg-background/80 border-white/20 shadow-md hover:shadow-lg opacity-90 hover:opacity-100"
                                                    onClick={() => handleCropClick(crop.selection_id)}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="aspect-video rounded-md overflow-hidden mb-2 bg-muted grayscale hover:grayscale-0 transition-all duration-300">
                                                            {crop.image_url ? (
                                                                <img src={crop.image_url} alt={crop.crop_name_bn} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-green-100">
                                                                    <Sprout className="h-8 w-8 text-green-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-sm truncate">{crop.crop_name_bn}</h4>

                                                        {/* Quick Action Icons */}
                                                        <div className="flex flex-col gap-2 mt-2">
                                                            {crop.status === 'planned' && (
                                                                <button
                                                                    onClick={(e) => handleStartCultivation(e, crop)}
                                                                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors w-full shadow-sm font-medium"
                                                                >
                                                                    <Play className="h-3 w-3 fill-white" />
                                                                    <span>চাষ শুরু করুন</span>
                                                                </button>
                                                            )}

                                                            <div className="flex items-center gap-1.5 w-full">
                                                                <button
                                                                    onClick={(e) => handleCostClick(e, crop)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
                                                                >
                                                                    <DollarSign className="h-3 w-3" />
                                                                    <span>খরচ</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => handleFertilizerClick(e, crop)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors border border-green-200"
                                                                >
                                                                    <CalendarClock className="h-3 w-3" />
                                                                    <span>সার</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {crop.description_bn && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                                {crop.description_bn}
                                                            </p>
                                                        )}
                                                        <div className="mt-2 space-y-1">
                                                            {crop.duration_days && (
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{toBengaliNumber(crop.duration_days)} দিন</span>
                                                                </div>
                                                            )}
                                                            {crop.yield_per_bigha && (
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Sprout className="h-3 w-3" />
                                                                    <span>
                                                                        {(() => {
                                                                            const unit = LAND_UNITS.find(u => u.value === crop.land_unit);
                                                                            const factor = unit?.factor || 1;
                                                                            const scaledYield = crop.yield_per_bigha.replace(/(\d+(\.\d+)?)/g, (m: string) => {
                                                                                const val = parseFloat(m) * factor;
                                                                                return toBengaliNumber(parseFloat(val.toFixed(1)));
                                                                            });
                                                                            // Extract unit label first word
                                                                            const unitName = (unit?.label || 'বিঘা').split(' ')[0];
                                                                            return `${scaledYield} / ${unitName}`;
                                                                        })()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className={`mt-2 text-[10px] w-full justify-center ${crop.is_offline ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}`}>
                                                            {crop.is_offline ? 'অফলাইন (সিঙ্ক বাকি)' :
                                                                crop.status === 'planned' ? 'পরিকল্পিত' :
                                                                    crop.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card className="border-dashed backdrop-blur-md bg-background/70 border-white/20 shadow-lg">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                                    <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20">
                                        <Sprout className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">কোন ফসল নির্বাচন করা হয়নি</p>
                                        <p className="text-sm text-muted-foreground">আপনার জমির জন্য উপযুক্ত ফসল নির্বাচন করুন</p>
                                    </div>
                                    <Button size="sm" onClick={() => navigate('/recommendation')}>
                                        ফসল নির্বাচন করুন
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* মূল ড্যাশবোর্ড মেনু */}
                <div
                    className="relative rounded-xl p-4 -mx-4"
                    style={{
                        backgroundImage: 'url("/img/farmer_dashbord_bg.svg")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'bottom center',
                        backgroundSize: 'cover'
                    }}
                >
                    {/* Opacity overlay */}
                    <div className="absolute inset-0 bg-background/70 rounded-xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">মূল মেনু</h2>
                            <TTSButton
                                text="কৃষি সেবা মেনু। এখানে কৃষি ফিড, ফসল নির্বাচন, রোগ নির্ণয়, বাজার, আবহাওয়া, বাজারদর, এবং পরামর্শ সেবা পাবেন।"
                                size="icon"
                                variant="ghost"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

                {/* সাহায্য বিভাগ */}
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-semibold">সাহায্য প্রয়োজন?</h3>
                            <p className="text-muted-foreground">
                                কোন সমস্যা হলে আমাদের সাথে যোগাযোগ করুন
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Badge variant="outline" className="py-2 px-4">
                                    📞 হটলাইন: ১৬১২৩
                                </Badge>
                                <Badge variant="outline" className="py-2 px-4">
                                    📱 SMS: ১৬১২৩
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Crop Details Modal */}
            <CropDetailsModal
                cropId={selectedCropId}
                isOpen={isCropModalOpen}
                onClose={() => setIsCropModalOpen(false)}
                onCropUpdated={handleCropUpdated}
            />

            {/* Cost Breakdown Quick View Dialog */}
            <Dialog open={costDialogOpen} onOpenChange={setCostDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            খরচের বিবরণ - {quickViewCrop?.crop_name_bn}
                        </DialogTitle>
                    </DialogHeader>
                    {quickViewCrop?.cost_breakdown && (
                        <div className="space-y-2 text-sm">
                            {Object.entries(typeof quickViewCrop.cost_breakdown === 'string' ? JSON.parse(quickViewCrop.cost_breakdown) : quickViewCrop.cost_breakdown).map(([key, value]) => {
                                const unit = LAND_UNITS.find(u => u.value === quickViewCrop.land_unit);
                                const multiplier = parseFloat(quickViewCrop.land_size) * (unit?.factor || 1);
                                const totalAmount = (value as number) * multiplier;
                                const perUnitAmount = (value as number) * (unit?.factor || 1);

                                return (
                                    <div key={key} className="border-b pb-2 last:border-0 border-dashed border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="capitalize text-muted-foreground">
                                                {key === 'seed' ? 'বীজ' :
                                                    key === 'fertilizer' ? 'সার' :
                                                        key === 'pesticide' ? 'কীটনাশক' :
                                                            key === 'irrigation' ? 'সেচ' :
                                                                key === 'labor' ? 'শ্রমিক' :
                                                                    key === 'other' ? 'অন্যান্য' : key}
                                            </span>
                                            <span className="font-medium">৳{toBengaliNumber(Math.round(totalAmount))}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">
                                            প্রতি {unit?.label.split(' ')[0]}: ৳{toBengaliNumber(Math.round(perUnitAmount))}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-2 border-t-2 border-green-500 flex justify-between items-center font-bold text-base">
                                <span>মোট খরচ</span>
                                <span className="text-green-700">
                                    ৳{toBengaliNumber((() => {
                                        const costData = typeof quickViewCrop.cost_breakdown === 'string' ? JSON.parse(quickViewCrop.cost_breakdown) : quickViewCrop.cost_breakdown;
                                        const unit = LAND_UNITS.find(u => u.value === quickViewCrop.land_unit);
                                        const multiplier = parseFloat(quickViewCrop.land_size) * (unit?.factor || 1);
                                        const total: number = Object.values(costData).reduce((sum: number, val: any) => sum + ((val as number) * multiplier), 0) as number;
                                        return Math.round(total);
                                    })())}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Fertilizer Schedule Quick View Dialog */}
            <Dialog open={fertilizerDialogOpen} onOpenChange={setFertilizerDialogOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-green-600" />
                            সার প্রয়োগের সময়সূচী - {quickViewCrop?.crop_name_bn}
                        </DialogTitle>
                    </DialogHeader>
                    {quickViewCrop?.fertilizer_schedule && (
                        <div className="space-y-4">
                            {(Array.isArray(quickViewCrop.fertilizer_schedule) ? quickViewCrop.fertilizer_schedule :
                                typeof quickViewCrop.fertilizer_schedule === 'string' ? JSON.parse(quickViewCrop.fertilizer_schedule) : []).map((schedule: any, idx: number) => {
                                    const toEnglishNumber = (str: string) => {
                                        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
                                        return str.replace(/[০-৯]/g, (digit) => bengaliDigits.indexOf(digit).toString());
                                    };

                                    return (
                                        <div key={idx} className="bg-muted/30 p-3 rounded-md">
                                            <p className="font-bold text-sm mb-2 text-primary">{schedule.timing}</p>
                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                {schedule.fertilizers?.map((fert: any, fIdx: number) => {
                                                    // Convert Bengali numbers to English first
                                                    const baseAmountEnglish = toEnglishNumber(fert.amount);

                                                    // Calculate total for the user's land
                                                    let multiplier = parseFloat(quickViewCrop.land_size) || 1;
                                                    const unit = LAND_UNITS.find(u => u.value === quickViewCrop.land_unit);
                                                    if (unit) {
                                                        multiplier = multiplier * unit.factor;
                                                    }

                                                    const totalAmount = baseAmountEnglish.replace(/(\d+(\.\d+)?)/g, (match: string) => {
                                                        const num = parseFloat(match);
                                                        if (!isNaN(num)) {
                                                            const val = num * multiplier;
                                                            return parseFloat(val.toFixed(1)).toString();
                                                        }
                                                        return match;
                                                    });

                                                    // Convert base amount to user's selected unit
                                                    const userUnit = LAND_UNITS.find(u => u.value === quickViewCrop.land_unit);
                                                    const perUnitAmount = baseAmountEnglish.replace(/(\d+(\.\d+)?)/g, (match: string) => {
                                                        const num = parseFloat(match);
                                                        if (!isNaN(num) && userUnit) {
                                                            const val = num * userUnit.factor;
                                                            return parseFloat(val.toFixed(1)).toString();
                                                        }
                                                        return match;
                                                    });

                                                    return (
                                                        <div key={fIdx} className="bg-background p-2 rounded border space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-muted-foreground">{fert.name}</span>
                                                                <span className="font-bold text-green-700">{toBengaliNumber(totalAmount)}</span>
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground">
                                                                প্রতি {userUnit?.label.split(' ')[0]}: {toBengaliNumber(perUnitAmount)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    {(!quickViewCrop?.fertilizer_schedule ||
                        (Array.isArray(quickViewCrop.fertilizer_schedule) && quickViewCrop.fertilizer_schedule.length === 0) ||
                        (typeof quickViewCrop.fertilizer_schedule === 'string' && JSON.parse(quickViewCrop.fertilizer_schedule).length === 0)) && (
                            <p className="text-sm text-muted-foreground text-center py-4">সার প্রয়োগের সময়সূচী পাওয়া যায়নি</p>
                        )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FarmerDashboard;
