/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import WeatherAssistant from "@/components/weather/WeatherAssistant";
import {
    MapPin,
    RefreshCw,
    ArrowLeft,
    Droplets,
    Eye,
    Sunrise,
    Sunset,
    AlertTriangle,
    Calendar,
    Clock,
    Navigation,
    Loader2,
    Mic,
    Wind,
    Sun,
    Bot,
    Thermometer,
    CloudRain,
    Cloud,
    CloudSun,
    Cloudy,
    CloudSnow,
    CloudLightning,
    CloudFog,
    Snowflake,
    Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    fetchWeatherOneCall,
    processWeatherData,
    getCoordinatesFromLocation,
    getLocationName,
    bangladeshDistricts,
    toBengaliNumber,
    CompleteWeatherData
} from "@/services/weatherService";

// আবহাওয়া আইকন ম্যাপিং
const getWeatherIcon = (condition: string, size: string = "h-8 w-8") => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes('পরিষ্কার') || conditionLower.includes('clear')) {
        return <Sun className={`${size} text-amber-500`} />;
    }
    if (conditionLower.includes('বজ্র') || conditionLower.includes('thunder')) {
        return <CloudLightning className={`${size} text-purple-500`} />;
    }
    if (conditionLower.includes('বৃষ্টি') || conditionLower.includes('rain') || conditionLower.includes('ঝরঝরে')) {
        return <CloudRain className={`${size} text-blue-500`} />;
    }
    if (conditionLower.includes('তুষার') || conditionLower.includes('snow')) {
        return <CloudSnow className={`${size} text-cyan-400`} />;
    }
    if (conditionLower.includes('কুয়াশা') || conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('ধোঁয়া')) {
        return <CloudFog className={`${size} text-gray-400`} />;
    }
    if (conditionLower.includes('ঘন মেঘ') || conditionLower.includes('overcast')) {
        return <Cloudy className={`${size} text-gray-500`} />;
    }
    if (conditionLower.includes('মেঘ') || conditionLower.includes('cloud')) {
        return <CloudSun className={`${size} text-gray-400`} />;
    }

    return <Cloud className={`${size} text-gray-400`} />;
};

interface WeatherForecastProps {
    embedded?: boolean;
}

const WeatherForecast = ({ embedded = false }: WeatherForecastProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [location, setLocation] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // বর্তমান মৌসুম নির্ণয়
    const getCurrentSeason = (): string => {
        const month = new Date().getMonth() + 1;
        if (month >= 11 || month <= 2) return "রবি মৌসুম";
        if (month >= 3 && month <= 5) return "প্রাক-খরিপ মৌসুম";
        if (month >= 6 && month <= 9) return "খরিপ মৌসুম";
        return "হেমন্ত মৌসুম";
    };

    // GPS থেকে অবস্থান নেওয়া
    const handleGPSLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: "সাপোর্ট নেই",
                description: "আপনার ব্রাউজার GPS সাপোর্ট করে না।",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        toast({
            title: "অবস্থান খোঁজা হচ্ছে...",
            description: "অনুগ্রহ করে অপেক্ষা করুন"
        });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const locationName = await getLocationName(latitude, longitude);
                    setLocation(locationName);

                    const rawData = await fetchWeatherOneCall(latitude, longitude);
                    const processed = processWeatherData(rawData, locationName);
                    setWeatherData(processed);

                    toast({
                        title: "সফল!",
                        description: `${locationName} এর আবহাওয়া লোড হয়েছে`
                    });
                } catch (error) {
                    toast({
                        title: "ত্রুটি",
                        description: "আবহাওয়া ডেটা লোড করতে সমস্যা হয়েছে",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                setIsLoading(false);
                toast({
                    title: "GPS ত্রুটি",
                    description: "অবস্থান পেতে ব্যর্থ। ম্যানুয়ালি জেলা নির্বাচন করুন।",
                    variant: "destructive"
                });
            },
            { timeout: 10000 }
        );
    };

    // জেলা নির্বাচন করে আবহাওয়া দেখা
    const handleDistrictSelect = useCallback(async (districtKey: string) => {
        const district = bangladeshDistricts[districtKey];
        if (!district) return;

        setIsLoading(true);
        setSelectedDistrict(districtKey);
        setLocation(district.bn);

        try {
            const rawData = await fetchWeatherOneCall(district.lat, district.lon);
            const processed = processWeatherData(rawData, district.bn);
            setWeatherData(processed);

            toast({
                title: "সফল!",
                description: `${district.bn} এর আবহাওয়া লোড হয়েছে`
            });
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "আবহাওয়া ডেটা লোড করতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    // লোকেশন সার্চ করে আবহাওয়া দেখা
    const handleLocationSearch = async () => {
        if (!location.trim()) {
            toast({
                title: "অবস্থান দিন",
                description: "অনুগ্রহ করে একটি অবস্থান/জেলা লিখুন",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const coords = await getCoordinatesFromLocation(location);
            if (!coords) {
                toast({
                    title: "অবস্থান পাওয়া যায়নি",
                    description: "অন্য কোনো অবস্থান চেষ্টা করুন",
                    variant: "destructive"
                });
                setIsLoading(false);
                return;
            }

            const rawData = await fetchWeatherOneCall(coords.lat, coords.lon);
            const processed = processWeatherData(rawData, location);
            setWeatherData(processed);

            toast({
                title: "সফল!",
                description: `${location} এর আবহাওয়া লোড হয়েছে`
            });
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "আবহাওয়া ডেটা লোড করতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // রিফ্রেশ করা
    const handleRefresh = async () => {
        if (selectedDistrict) {
            await handleDistrictSelect(selectedDistrict);
        } else if (location) {
            await handleLocationSearch();
        }
    };

    // ভয়েস ইনপুট
    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'bn-BD';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                toast({
                    title: "🎤 শুনছি...",
                    description: "আপনার জেলা/এলাকার নাম বলুন"
                });
            };

            recognition.onresult = async (event: any) => {
                const transcript = event.results[0][0].transcript;
                setLocation(transcript);
                toast({
                    title: "শোনা হয়েছে",
                    description: `"${transcript}" - এখন আবহাওয়া খোঁজা হচ্ছে...`
                });

                // স্বয়ংক্রিয়ভাবে সার্চ করা
                setIsLoading(true);
                try {
                    const coords = await getCoordinatesFromLocation(transcript);
                    if (coords) {
                        const rawData = await fetchWeatherOneCall(coords.lat, coords.lon);
                        const processed = processWeatherData(rawData, transcript);
                        setWeatherData(processed);
                        toast({
                            title: "সফল!",
                            description: `${transcript} এর আবহাওয়া লোড হয়েছে`
                        });
                    } else {
                        toast({
                            title: "অবস্থান পাওয়া যায়নি",
                            description: "অন্য কোনো নাম বলুন",
                            variant: "destructive"
                        });
                    }
                } catch (error) {
                    toast({
                        title: "ত্রুটি",
                        description: "আবহাওয়া লোড করতে সমস্যা হয়েছে",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoading(false);
                }
            };

            recognition.onerror = (event: any) => {
                toast({
                    title: "ভয়েস ত্রুটি",
                    description: "ভয়েস ইনপুট নিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                    variant: "destructive"
                });
            };

            recognition.start();
        } else {
            toast({
                title: "সাপোর্ট নেই",
                description: "আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না।",
                variant: "destructive"
            });
        }
    };

    // প্রথম লোডে GPS থেকে অবস্থান নেওয়া
    useEffect(() => {
        const loadLocationWeather = async () => {
            if (!navigator.geolocation) {
                // GPS সাপোর্ট না থাকলে ঢাকার আবহাওয়া দেখাও
                handleDistrictSelect("dhaka");
                return;
            }

            setIsLoading(true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const locationName = await getLocationName(latitude, longitude);
                        setLocation(locationName);

                        const rawData = await fetchWeatherOneCall(latitude, longitude);
                        const processed = processWeatherData(rawData, locationName);
                        setWeatherData(processed);
                    } catch (error) {
                        // Error হলে ঢাকার আবহাওয়া দেখাও
                        handleDistrictSelect("dhaka");
                    } finally {
                        setIsLoading(false);
                    }
                },
                () => {
                    // GPS permission denied বা error হলে ঢাকার আবহাওয়া দেখাও
                    setIsLoading(false);
                    handleDistrictSelect("dhaka");
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        };

        loadLocationWeather();
    }, []);

    // UV সূচকের রঙ নির্ধারণ
    const getUVColor = (uv: number): string => {
        if (uv <= 2) return "text-green-500";
        if (uv <= 5) return "text-yellow-500";
        if (uv <= 7) return "text-orange-500";
        if (uv <= 10) return "text-red-500";
        return "text-purple-500";
    };

    // UV সূচকের মাত্রা
    const getUVLevel = (uv: number): string => {
        if (uv <= 2) return "নিম্ন";
        if (uv <= 5) return "মাঝারি";
        if (uv <= 7) return "উচ্চ";
        if (uv <= 10) return "অতি উচ্চ";
        return "চরম";
    };

    return (
        <div className={embedded ? "" : "min-h-screen bg-background"}>
            {!embedded && <Header />}

            <div className={embedded ? "space-y-4" : "p-4 pb-24 pt-20 space-y-4 max-w-4xl mx-auto"}>
                {/* শিরোনাম */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {!embedded && (
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div>
                            <h1 className={embedded ? "text-xl font-semibold" : "text-2xl font-semibold"}>
                                আবহাওয়া পূর্বাভাস
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {getCurrentSeason()}
                            </p>
                        </div>
                    </div>
                    {weatherData && (
                        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                </div>

                {/* অবস্থান নির্বাচন */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="জেলা বা এলাকার নাম লিখুন..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                                    className="pl-9"
                                />
                            </div>
                            <Button onClick={handleLocationSearch} disabled={isLoading} size="icon" variant="outline">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleVoiceInput} disabled={isLoading}>
                                <Mic className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleGPSLocation} disabled={isLoading}>
                                <Navigation className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* লোডিং */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">লোড হচ্ছে...</span>
                    </div>
                )}

                {/* আবহাওয়া ডেটা */}
                {weatherData && !isLoading && (
                    <>
                        {/* বর্তমান আবহাওয়া কার্ড */}
                        <Card>
                            <CardContent className="p-6">
                                {/* অবস্থান */}
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">{weatherData.অবস্থান}</span>
                                </div>

                                {/* প্রধান তাপমাত্রা */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {getWeatherIcon(weatherData.বর্তমান.অবস্থা, "h-16 w-16")}
                                        <div>
                                            <div className="text-5xl font-light">
                                                {toBengaliNumber(weatherData.বর্তমান.তাপমাত্রা)}°
                                            </div>
                                            <div className="text-muted-foreground">
                                                {weatherData.বর্তমান.অবস্থা}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right text-sm text-muted-foreground">
                                        <div>অনুভূত {toBengaliNumber(weatherData.বর্তমান.অনুভূতিমূলক_তাপমাত্রা)}°</div>
                                    </div>
                                </div>

                                {/* বিস্তারিত তথ্য */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                                            <Droplets className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">আর্দ্রতা</div>
                                            <div className="font-semibold">{toBengaliNumber(weatherData.বর্তমান.আর্দ্রতা)}%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <Wind className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">বাতাস</div>
                                            <div className="font-semibold">{toBengaliNumber(weatherData.বর্তমান.বাতাসের_গতি)} কিমি/ঘ</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <Eye className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">দৃশ্যমানতা</div>
                                            <div className="font-semibold">{toBengaliNumber(weatherData.বর্তমান.দৃশ্যমানতা)} কিমি</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950">
                                            <Sun className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">UV সূচক</div>
                                            <div className={`font-semibold ${getUVColor(weatherData.বর্তমান.UV_সূচক)}`}>
                                                {toBengaliNumber(weatherData.বর্তমান.UV_সূচক)} ({getUVLevel(weatherData.বর্তমান.UV_সূচক)})
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* সূর্যোদয়/সূর্যাস্ত */}
                                <div className="flex justify-between mt-4 pt-4 border-t text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Sunrise className="h-4 w-4 text-amber-500" />
                                        <span>সূর্যোদয়: {weatherData.বর্তমান.সূর্যোদয়}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Sunset className="h-4 w-4 text-orange-500" />
                                        <span>সূর্যাস্ত: {weatherData.বর্তমান.সূর্যাস্ত}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* সতর্কতা (যদি থাকে) */}
                        {weatherData.সতর্কতা.length > 0 && (
                            <Card className="border-red-200 dark:border-red-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        আবহাওয়া সতর্কতা
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {weatherData.সতর্কতা.map((alert, index) => (
                                        <div key={index} className="mb-3 last:mb-0">
                                            <div className="font-medium">{alert.শিরোনাম}</div>
                                            <div className="text-sm text-muted-foreground">{alert.বিবরণ}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {alert.শুরু} - {alert.শেষ}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* ট্যাব */}
                        <Tabs defaultValue="দৈনিক" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-10">
                                <TabsTrigger value="ঘণ্টাভিত্তিক" className="text-sm">
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    ঘণ্টাভিত্তিক
                                </TabsTrigger>
                                <TabsTrigger value="দৈনিক" className="text-sm">
                                    <Calendar className="h-4 w-4 mr-1.5" />
                                    ৭ দিন
                                </TabsTrigger>
                                <TabsTrigger value="সহায়ক" className="text-sm">
                                    <Bot className="h-4 w-4 mr-1.5" />
                                    সহায়ক
                                </TabsTrigger>
                            </TabsList>

                            {/* ঘণ্টাভিত্তিক পূর্বাভাস */}
                            <TabsContent value="ঘণ্টাভিত্তিক" className="mt-3">
                                <Card>
                                    <CardContent className="p-4">
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex gap-3">
                                                {weatherData.ঘণ্টাভিত্তিক.slice(0, 12).map((hour, index) => (
                                                    <div key={index} className="flex flex-col items-center min-w-[72px] p-3 rounded-lg border bg-card">
                                                        <span className="text-xs text-muted-foreground">{hour.সময়}</span>
                                                        {getWeatherIcon(hour.অবস্থা, "h-7 w-7 my-2")}
                                                        <span className="font-semibold">{toBengaliNumber(hour.তাপমাত্রা)}°</span>
                                                        <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
                                                            <Droplets className="h-3 w-3" />
                                                            {toBengaliNumber(hour.বৃষ্টির_সম্ভাবনা)}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* দৈনিক পূর্বাভাস */}
                            <TabsContent value="দৈনিক" className="mt-3">
                                <Card>
                                    <CardContent className="p-4 space-y-2">
                                        {weatherData.দৈনিক.map((day, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-[120px]">
                                                    {getWeatherIcon(day.অবস্থা, "h-8 w-8")}
                                                    <div>
                                                        <div className="font-medium">{day.দিন}</div>
                                                        <div className="text-xs text-muted-foreground">{day.তারিখ}</div>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-muted-foreground hidden sm:block flex-1 text-center">
                                                    {day.অবস্থা}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1 text-sm text-blue-500">
                                                        <Droplets className="h-4 w-4" />
                                                        {toBengaliNumber(day.বৃষ্টির_সম্ভাবনা)}%
                                                    </div>
                                                    <div className="text-right min-w-[80px]">
                                                        <span className="font-semibold">{toBengaliNumber(day.সর্বোচ্চ_তাপমাত্রা)}°</span>
                                                        <span className="text-muted-foreground"> / {toBengaliNumber(day.সর্বনিম্ন_তাপমাত্রা)}°</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* AI আবহাওয়া সহায়ক */}
                            <TabsContent value="সহায়ক" className="mt-3">
                                <WeatherAssistant initialLocation={weatherData?.অবস্থান || location} />
                            </TabsContent>
                        </Tabs>

                        {/* সর্বশেষ আপডেট */}
                        <div className="text-center text-xs text-muted-foreground">
                            সর্বশেষ আপডেট: {weatherData.সর্বশেষ_আপডেট}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherForecast;
