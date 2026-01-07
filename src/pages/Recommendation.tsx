import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MapPin,
    Calendar,
    ArrowLeft,
    DollarSign,
    Clock,
    TrendingUp,
    Leaf,
    Zap,
    Banknote,
    Wheat,
    ClipboardList,
    Heart,
    Droplets,
    AlertTriangle,
    Lightbulb,
    Loader2,
    Navigation,
    Sprout,
    Check,
    Cloud,
    Thermometer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    getSeasons,
    getCropTypes,
    generateRecommendations,
    selectCrops,
    Season,
    CropType,
    Crop,
    getDifficultyLabel,
    getWaterRequirementLabel,
    formatTaka,
    getCurrentSeason
} from "@/services/recommendationService";
import LocationSelector from "@/components/farmer/LocationSelector";
import { fetchWeatherOneCall, bangladeshDistricts, toBengaliNumber } from "@/services/weatherService";
import api from "@/services/api";

// Location data interface
interface LocationData {
    division: string;
    division_bn: string;
    district: string;
    district_bn: string;
    upazila: string;
    upazila_bn: string;
    post_office: string;
    post_office_bn: string;
    postal_code: number;
    village: string;
}

// Weather data interface
interface WeatherData {
    temp: number;
    humidity: number;
    description: string;
    wind_speed: number;
    rainfall_chance: number;
    forecast_summary: string;
}

const Recommendation = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    // Location state
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [fullAddress, setFullAddress] = useState("");

    // GPS coordinates for weather
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    // Weather data
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);

    // Season and crop type
    const [season, setSeason] = useState("");
    const [cropType, setCropType] = useState("all");

    // Data from API
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [cropTypes, setCropTypes] = useState<CropType[]>([]);

    // Recommendations
    const [crops, setCrops] = useState<Crop[]>([]);
    const [seasonTips, setSeasonTips] = useState("");
    const [weatherAdvisory, setWeatherAdvisory] = useState("");
    const [recommendationId, setRecommendationId] = useState<number | null>(null);

    // UI State
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set());
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Fetch weather when coordinates change
    useEffect(() => {
        if (coordinates) {
            fetchWeatherData(coordinates.lat, coordinates.lon);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);

    // Try to get weather from location data
    useEffect(() => {
        if (locationData?.district_bn && !coordinates) {
            // Find district coordinates from bangladeshDistricts
            const districtKey = Object.keys(bangladeshDistricts).find(
                key => bangladeshDistricts[key].bn === locationData.district_bn
            );
            if (districtKey) {
                const { lat, lon } = bangladeshDistricts[districtKey];
                setCoordinates({ lat, lon });
            }
        }
    }, [locationData, coordinates]);

    const loadInitialData = async () => {
        try {
            // Load seasons and crop types
            const [seasonsRes, typesRes] = await Promise.all([
                getSeasons(),
                getCropTypes(),
            ]);

            setSeasons(seasonsRes.seasons);
            setSeason(seasonsRes.current_season); // Auto-select current season
            setCropTypes(typesRes.crop_types);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            // Set fallback data
            setSeasons([
                { key: 'rabi', name_bn: 'রবি মৌসুম', period: '১৬ অক্টোবর - ১৫ মার্চ', name_en: 'Rabi', period_en: '', description_bn: '', color: '#FFB6C1' },
                { key: 'kharif1', name_bn: 'খরিফ-১ মৌসুম', period: '১৬ মার্চ - ১৫ জুলাই', name_en: 'Kharif-1', period_en: '', description_bn: '', color: '#FFFACD' },
                { key: 'kharif2', name_bn: 'খরিফ-২ মৌসুম', period: '১৬ জুলাই - ১৫ অক্টোবর', name_en: 'Kharif-2', period_en: '', description_bn: '', color: '#87CEEB' },
            ]);
            setCropTypes([
                { key: 'all', name_bn: 'সব ধরন', name_en: 'All', icon: '🌱' },
                { key: 'rice', name_bn: 'ধান', name_en: 'Rice', icon: '🌾' },
                { key: 'vegetables', name_bn: 'সবজি', name_en: 'Vegetables', icon: '🥬' },
                { key: 'fruits', name_bn: 'ফল', name_en: 'Fruits', icon: '🍎' },
                { key: 'spices', name_bn: 'মসলা', name_en: 'Spices', icon: '🌶️' },
                { key: 'pulses', name_bn: 'ডাল', name_en: 'Pulses', icon: '🫘' },
                { key: 'oilseeds', name_bn: 'তৈলবীজ', name_en: 'Oilseeds', icon: '🌻' },
                { key: 'tubers', name_bn: 'কন্দ ফসল', name_en: 'Tubers', icon: '🥔' },
            ]);
            setSeason(getCurrentSeason());
        }
    };

    const fetchWeatherData = async (lat: number, lon: number) => {
        setIsLoadingWeather(true);
        try {
            const weather = await fetchWeatherOneCall(lat, lon);
            if (weather && weather.current) {
                const current = weather.current;
                const daily = weather.daily || [];

                // Calculate rainfall chance from forecast
                const rainfallChance = daily.length > 0
                    ? Math.round((daily.slice(0, 3).reduce((sum: number, d: { pop?: number }) => sum + (d.pop || 0), 0) / 3) * 100)
                    : 0;

                // Create forecast summary
                const forecastSummary = daily.slice(0, 3).map((d: { weather?: Array<{ description?: string }> }) =>
                    d.weather?.[0]?.description || ''
                ).filter(Boolean).join(', ');

                setWeatherData({
                    temp: Math.round(current.temp),
                    humidity: current.humidity,
                    description: current.weather?.[0]?.description || 'অজানা',
                    wind_speed: Math.round(current.wind_speed * 3.6), // m/s to km/h
                    rainfall_chance: rainfallChance,
                    forecast_summary: forecastSummary
                });

                toast({
                    title: "আবহাওয়া তথ্য পাওয়া গেছে",
                    description: `তাপমাত্রা: ${toBengaliNumber(Math.round(current.temp))}°সে`,
                });
            }
        } catch (error) {
            console.error('Failed to fetch weather:', error);
        } finally {
            setIsLoadingWeather(false);
        }
    };

    const handleLocationFromGPS = () => {
        if (!('geolocation' in navigator)) {
            toast({
                title: "সাপোর্ট নেই",
                description: "আপনার ব্রাউজার GPS সাপোর্ট করে না।",
                variant: "destructive"
            });
            return;
        }

        setIsLoadingLocation(true);
        toast({
            title: "GPS চালু করা হচ্ছে",
            description: "অনুগ্রহ করে অপেক্ষা করুন...",
        });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Set coordinates for weather
                setCoordinates({ lat: latitude, lon: longitude });

                // Detect division based on coordinates
                let detectedDivision = "ঢাকা";
                let detectedDivisionEn = "Dhaka";

                if (latitude >= 22.0 && latitude <= 22.5 && longitude >= 91.0 && longitude <= 92.5) {
                    detectedDivision = "চট্টগ্রাম";
                    detectedDivisionEn = "Chattogram";
                } else if (latitude >= 23.4 && latitude <= 24.0 && longitude >= 90.0 && longitude <= 91.0) {
                    detectedDivision = "ঢাকা";
                    detectedDivisionEn = "Dhaka";
                } else if (latitude >= 24.0 && latitude <= 25.5 && longitude >= 88.0 && longitude <= 90.0) {
                    detectedDivision = "রাজশাহী";
                    detectedDivisionEn = "Rajshahi";
                } else if (latitude >= 22.0 && latitude <= 23.0 && longitude >= 89.0 && longitude <= 90.5) {
                    detectedDivision = "খুলনা";
                    detectedDivisionEn = "Khulna";
                } else if (latitude >= 22.0 && latitude <= 23.0 && longitude >= 90.0 && longitude <= 91.0) {
                    detectedDivision = "বরিশাল";
                    detectedDivisionEn = "Barishal";
                } else if (latitude >= 24.0 && latitude <= 25.5 && longitude >= 90.5 && longitude <= 92.5) {
                    detectedDivision = "সিলেট";
                    detectedDivisionEn = "Sylhet";
                } else if (latitude >= 25.0 && latitude <= 26.5 && longitude >= 88.5 && longitude <= 90.0) {
                    detectedDivision = "রংপুর";
                    detectedDivisionEn = "Rangpur";
                } else if (latitude >= 24.5 && latitude <= 25.5 && longitude >= 89.5 && longitude <= 90.5) {
                    detectedDivision = "ময়মনসিংহ";
                    detectedDivisionEn = "Mymensingh";
                }

                // Set location data
                setLocationData({
                    division: detectedDivisionEn,
                    division_bn: detectedDivision,
                    district: "",
                    district_bn: "",
                    upazila: "",
                    upazila_bn: "",
                    post_office: "",
                    post_office_bn: "",
                    postal_code: 0,
                    village: ""
                });
                setFullAddress(detectedDivision);
                setIsLoadingLocation(false);

                toast({
                    title: "লোকেশন পাওয়া গেছে",
                    description: `আপনার বিভাগ: ${detectedDivision}`,
                });
            },
            (error) => {
                setIsLoadingLocation(false);
                let errorMessage = "অজানা ত্রুটি।";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "GPS অনুমতি দেওয়া হয়নি।";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "লোকেশন পাওয়া যাচ্ছে না।";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "GPS সময় শেষ।";
                        break;
                }
                toast({
                    title: "GPS ত্রুটি",
                    description: errorMessage,
                    variant: "destructive"
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    const handleRecommend = async () => {
        if (!locationData?.division_bn || !season || !cropType) {
            toast({
                title: "তথ্য প্রয়োজন",
                description: "অবস্থান, মৌসুম এবং ফসলের ধরন নির্বাচন করুন।",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const locationStr = fullAddress || locationData.division_bn;

            const result = await generateRecommendations({
                location: locationStr,
                division: locationData.division_bn,
                district: locationData.district_bn,
                upazila: locationData.upazila_bn,
                season,
                crop_type: cropType,
                // Include weather data for more accurate recommendations
                weather_data: weatherData ? {
                    temperature: weatherData.temp,
                    humidity: weatherData.humidity,
                    rainfall_chance: weatherData.rainfall_chance,
                    description: weatherData.description,
                    forecast: weatherData.forecast_summary
                } : undefined
            });

            if (result.success) {
                setCrops(result.data.crops);
                setSeasonTips(result.data.season_tips);
                setWeatherAdvisory(result.data.weather_advisory);
                setRecommendationId(result.recommendation_id || null);
                setStep(2);

                toast({
                    title: "সুপারিশ প্রস্তুত",
                    description: `${result.data.crops.length}টি ফসলের সুপারিশ পাওয়া গেছে।`,
                });
            } else {
                throw new Error('Failed to get recommendations');
            }
        } catch (error) {
            console.error('Recommendation error:', error);
            toast({
                title: "ত্রুটি",
                description: "সুপারিশ পেতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCropSelection = (cropName: string) => {
        const newSelected = new Set(selectedCrops);
        if (newSelected.has(cropName)) {
            newSelected.delete(cropName);
        } else {
            newSelected.add(cropName);
        }
        setSelectedCrops(newSelected);
    };

    const getFilteredCrops = () => {
        if (!activeFilter) return crops;

        const minCost = Math.min(...crops.map(c => c.cost_per_bigha));
        const maxProfit = Math.max(...crops.map(c => c.profit_per_bigha));

        return crops.filter(crop => {
            switch (activeFilter) {
                case "lowCost":
                    return crop.cost_per_bigha <= minCost * 1.3;
                case "highProfit":
                    return crop.profit_per_bigha >= maxProfit * 0.7;
                case "easy":
                    return crop.difficulty === "easy";
                case "quick":
                    return crop.duration_days <= 90;
                default:
                    return true;
            }
        });
    };

    const handleSelectCrops = async () => {
        const selectedCropData = crops.filter(c => selectedCrops.has(c.name));

        if (selectedCropData.length === 0) {
            toast({
                title: "ফসল নির্বাচন করুন",
                description: "অন্তত একটি ফসল নির্বাচন করুন।",
                variant: "destructive"
            });
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('auth_token');

        if (token) {
            try {
                await selectCrops({
                    recommendation_id: recommendationId || undefined,
                    crops: selectedCropData,
                });

                toast({
                    title: "সফল!",
                    description: "ফসল আপনার তালিকায় যোগ হয়েছে। নোটিফিকেশন চালু আছে।",
                });
            } catch (error: any) {
                if (error.message === 'OFFLINE_SAVED') {
                    toast({
                        title: "অফলাইনে সংরক্ষিত",
                        description: "সার্ভার সংযোগ নেই। সংযোগ ফিরে আসলে এটি স্বয়ংক্রিয়ভাবে সেভ হবে।",
                        variant: "default", // or a warning color if available
                    });
                } else {
                    console.error('Failed to save selection:', error);
                    toast({
                        title: "ত্রুটি",
                        description: "ফসল সংরক্ষণ করা যায়নি।",
                        variant: "destructive"
                    });
                }
            }
        }

        setStep(3);
    };

    const getSeasonInfo = (seasonKey: string) => {
        return seasons.find(s => s.key === seasonKey);
    };

    const renderStep1 = () => (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    তথ্য দিন
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Location Selection using LocationSelector */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        অবস্থান নির্বাচন করুন
                    </label>

                    <LocationSelector
                        value={locationData}
                        onChange={(location) => {
                            setLocationData(location);
                            // Try to get coordinates for weather
                            const districtKey = Object.keys(bangladeshDistricts).find(
                                key => bangladeshDistricts[key].bn === location.district_bn
                            );
                            if (districtKey) {
                                const { lat, lon } = bangladeshDistricts[districtKey];
                                setCoordinates({ lat, lon });
                            }
                        }}
                        onAddressChange={setFullAddress}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLocationFromGPS}
                        disabled={isLoadingLocation}
                        className="w-full"
                    >
                        {isLoadingLocation ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Navigation className="h-4 w-4 mr-2" />
                        )}
                        GPS দিয়ে লোকেশন ও আবহাওয়া নিন
                    </Button>
                </div>

                {/* Weather Display */}
                {weatherData && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Cloud className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800">বর্তমান আবহাওয়া</span>
                            {isLoadingWeather && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-red-500" />
                                <span>তাপমাত্রা: {toBengaliNumber(weatherData.temp)}°সে</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span>আর্দ্রতা: {toBengaliNumber(weatherData.humidity)}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cloud className="h-4 w-4 text-gray-500" />
                                <span>{weatherData.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-cyan-500" />
                                <span>বৃষ্টির সম্ভাবনা: {toBengaliNumber(weatherData.rainfall_chance)}%</span>
                            </div>
                        </div>
                        {weatherData.forecast_summary && (
                            <p className="text-xs text-blue-700 mt-2">
                                পূর্বাভাস: {weatherData.forecast_summary}
                            </p>
                        )}
                    </div>
                )}

                {/* Season Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        মৌসুম নির্বাচন করুন
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {seasons.map((s) => (
                            <button
                                key={s.key}
                                onClick={() => setSeason(s.key)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${season === s.key
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                                style={{ backgroundColor: season === s.key ? `${s.color}40` : undefined }}
                            >
                                <div className="font-semibold text-sm">{s.name_bn}</div>
                                <div className="text-xs text-muted-foreground">{s.period}</div>
                                {season === s.key && (
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                        {s.key === getCurrentSeason() ? 'বর্তমান মৌসুম' : 'নির্বাচিত'}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Crop Type Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-amber-600" />
                        ফসলের ধরন
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {cropTypes.map((type) => (
                            <button
                                key={type.key}
                                onClick={() => setCropType(type.key)}
                                className={`p-3 rounded-lg border text-center transition-all ${cropType === type.key
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-xl">{type.icon}</span>
                                <div className="text-sm font-medium mt-1">{type.name_bn}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleRecommend}
                        className="flex-1"
                        disabled={isLoading || !locationData?.division_bn || !season}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                AI বিশ্লেষণ করছে...
                            </>
                        ) : (
                            <>
                                {weatherData ? '🌤️ আবহাওয়াসহ সেরা ফসল দেখুন' : 'সেরা ফসল দেখুন'}
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setLocationData(null);
                            setFullAddress("");
                            setCoordinates(null);
                            setWeatherData(null);
                            setSeason(getCurrentSeason());
                            setCropType("all");
                        }}
                    >
                        রিসেট
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const renderStep2 = () => (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        সুপারিশকৃত ফসল - {fullAddress || locationData?.division_bn} • {getSeasonInfo(season)?.name_bn}
                    </CardTitle>

                    {/* Weather Advisory */}
                    {weatherData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                            <div className="flex items-start gap-2">
                                <Cloud className="h-4 w-4 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <span className="font-medium">আবহাওয়া বিবেচনায় নেওয়া হয়েছে:</span>
                                    <span className="ml-1">
                                        তাপমাত্রা {toBengaliNumber(weatherData.temp)}°সে,
                                        আর্দ্রতা {toBengaliNumber(weatherData.humidity)}%,
                                        বৃষ্টির সম্ভাবনা {toBengaliNumber(weatherData.rainfall_chance)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    {seasonTips && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
                                <p className="text-sm text-green-800">{seasonTips}</p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {[
                            { key: "lowCost", label: "কম খরচ", icon: DollarSign, color: "text-green-600" },
                            { key: "highProfit", label: "বেশি লাভ", icon: TrendingUp, color: "text-blue-600" },
                            { key: "easy", label: "সহজ", icon: Leaf, color: "text-emerald-600" },
                            { key: "quick", label: "দ্রুত", icon: Zap, color: "text-yellow-600" }
                        ].map(filter => {
                            const IconComponent = filter.icon;
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(activeFilter === filter.key ? null : filter.key)}
                                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors flex items-center gap-1.5 ${activeFilter === filter.key
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                        }`}
                                >
                                    <IconComponent className={`h-3.5 w-3.5 ${activeFilter === filter.key ? "" : filter.color}`} />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="border rounded-lg overflow-hidden">
                                    <Skeleton className="h-40 w-full" />
                                    <div className="p-3 space-y-2">
                                        <Skeleton className="h-6 w-2/3" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {getFilteredCrops().map((crop, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${selectedCrops.has(crop.name)
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border"
                                        }`}
                                >
                                    {/* Crop Image */}
                                    <div className="relative h-40 overflow-hidden bg-gray-100">
                                        {crop.image?.url ? (
                                            <img
                                                src={crop.image.url}
                                                alt={crop.name_bn}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                                                <Wheat className="h-16 w-16 text-green-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            {crop.difficulty === "easy" && (
                                                <Badge variant="secondary" className="bg-white/90 text-xs flex items-center gap-1">
                                                    <Leaf className="h-3 w-3" />
                                                    সহজ
                                                </Badge>
                                            )}
                                            {crop.duration_days <= 90 && (
                                                <Badge variant="secondary" className="bg-white/90 text-xs flex items-center gap-1">
                                                    <Zap className="h-3 w-3" />
                                                    দ্রুত
                                                </Badge>
                                            )}
                                        </div>
                                        {selectedCrops.has(crop.name) && (
                                            <div className="absolute top-2 left-2">
                                                <div className="bg-primary text-white rounded-full p-1">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3">
                                        <div className="mb-3">
                                            <h3 className="font-semibold text-base">{crop.name_bn}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{crop.description_bn}</p>
                                        </div>

                                        <div className="space-y-2 text-sm mb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span>খরচ:</span>
                                                </span>
                                                <span className="font-medium">{formatTaka(crop.cost_per_bigha)}/বিঘা</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Wheat className="h-4 w-4 text-amber-600" />
                                                    <span>ফলন:</span>
                                                </span>
                                                <span className="font-medium">{crop.yield_per_bigha}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4 text-purple-600" />
                                                    <span>সময়:</span>
                                                </span>
                                                <span className="font-medium">{crop.duration_days} দিন</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Droplets className="h-4 w-4 text-blue-600" />
                                                    <span>পানি:</span>
                                                </span>
                                                <span className={`font-medium ${getWaterRequirementLabel(crop.water_requirement).color}`}>
                                                    {getWaterRequirementLabel(crop.water_requirement).label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4" />
                                                    প্রত্যাশিত লাভ:
                                                </span>
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatTaka(crop.profit_per_bigha)}
                                                </span>
                                            </div>
                                            <Button
                                                variant={selectedCrops.has(crop.name) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => toggleCropSelection(crop.name)}
                                                className="w-full"
                                            >
                                                {selectedCrops.has(crop.name) ? "নির্বাচিত ✓" : "নির্বাচন করুন"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardContent>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            ফেরত যান
                        </Button>
                        <Button
                            onClick={handleSelectCrops}
                            disabled={selectedCrops.size === 0}
                            className="flex-1"
                        >
                            নির্বাচিত ফসল নিয়ে এগিয়ে যান ({selectedCrops.size})
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    const renderStep3 = () => {
        const selectedCropData = crops.filter(c => selectedCrops.has(c.name));

        return (
            <>
                {selectedCropData.map((crop, index) => (
                    <Card key={index} className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="text-2xl">
                                    {cropTypes.find(t => t.key === crop.type)?.icon || '🌱'}
                                </span>
                                {crop.name_bn} - বিস্তারিত পরিকল্পনা
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center gap-1.5">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span>খরচ: {formatTaka(crop.cost_per_bigha)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Wheat className="h-4 w-4 text-amber-600" />
                                    <span>ফলন: {crop.yield_per_bigha}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Banknote className="h-4 w-4 text-blue-600" />
                                    <span>দাম: {crop.market_price}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-purple-600" />
                                    <span>সময়কাল: {crop.duration_days} দিন</span>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            {crop.cost_breakdown && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        খরচের বিবরণ (প্রতি বিঘা):
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                        {Object.entries(crop.cost_breakdown).map(([key, value]) => (
                                            <div key={key} className="flex justify-between bg-muted/20 p-2 rounded">
                                                <span className="capitalize">
                                                    {key === 'seed' ? 'বীজ' :
                                                        key === 'fertilizer' ? 'সার' :
                                                            key === 'pesticide' ? 'কীটনাশক' :
                                                                key === 'irrigation' ? 'সেচ' :
                                                                    key === 'labor' ? 'শ্রমিক' : 'অন্যান্য'}:
                                                </span>
                                                <span className="font-medium">{formatTaka(value as number)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cultivation Plan */}
                            {crop.cultivation_plan && crop.cultivation_plan.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5 text-indigo-600" />
                                        চাষাবাদ পরিকল্পনা:
                                    </h4>
                                    {crop.cultivation_plan.map((phase, idx) => (
                                        <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                                            <div className="font-medium">{phase.phase}</div>
                                            <div className="text-sm text-muted-foreground mb-2">{phase.days}</div>
                                            <ul className="text-sm space-y-1">
                                                {phase.tasks.map((task, taskIdx) => (
                                                    <li key={taskIdx}>• {task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Fertilizer Schedule */}
                            {crop.fertilizer_schedule && crop.fertilizer_schedule.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Sprout className="h-5 w-5 text-green-600" />
                                        সার প্রয়োগ সময়সূচী:
                                    </h4>
                                    {crop.fertilizer_schedule.map((schedule, idx) => (
                                        <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="font-medium text-green-800 mb-2">{schedule.timing}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {schedule.fertilizers.map((fert, fIdx) => (
                                                    <Badge key={fIdx} variant="outline" className="bg-white">
                                                        {fert.name}: {fert.amount}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Risks */}
                            {crop.risks && crop.risks.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="h-5 w-5" />
                                        সম্ভাব্য ঝুঁকি:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {crop.risks.map((risk, idx) => (
                                            <Badge key={idx} variant="destructive" className="bg-red-100 text-red-800">
                                                {risk}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tips */}
                            {crop.tips && crop.tips.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2 text-yellow-600">
                                        <Lightbulb className="h-5 w-5" />
                                        পরামর্শ:
                                    </h4>
                                    <ul className="text-sm space-y-1 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        {crop.tips.map((tip, idx) => (
                                            <li key={idx}>💡 {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Profit Summary */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <Heart className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatTaka(crop.profit_per_bigha)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        প্রত্যাশিত লাভ (প্রতি বিঘা)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                ফেরত যান
                            </Button>
                            <Button onClick={() => navigate('/')} className="flex-1">
                                হোম এ যান
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="p-4 pb-20 space-y-4 pt-20">
                {/* Header Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="p-2 mr-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Wheat className="h-5 w-5 text-green-600" />
                            AI ফসল সুপারিশ
                        </CardTitle>
                    </CardHeader>
                </Card>

                {/* Step Content */}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default Recommendation;
