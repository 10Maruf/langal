/**
 * আবহাওয়া উইজেট কম্পোনেন্ট
 * হোম পেজে দেখানোর জন্য ছোট আবহাওয়া কার্ড
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Cloud,
    Droplets,
    Wind,
    ChevronRight,
    Loader2,
    AlertTriangle
} from "lucide-react";
import {
    fetchWeatherOneCall,
    processWeatherData,
    bangladeshDistricts,
    toBengaliNumber,
    CompleteWeatherData
} from "@/services/weatherService";

interface WeatherWidgetProps {
    district?: string; // Default district key
    showAlerts?: boolean;
    compact?: boolean;
}

const WeatherWidget = ({
    district = "dhaka",
    showAlerts = true,
    compact = false
}: WeatherWidgetProps) => {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWeather();
    }, [district]);

    const loadWeather = async () => {
        const districtData = bangladeshDistricts[district];
        if (!districtData) {
            setError("জেলা পাওয়া যায়নি");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const rawData = await fetchWeatherOneCall(districtData.lat, districtData.lon);
            const processed = processWeatherData(rawData, districtData.bn);
            setWeatherData(processed);
            setError(null);
        } catch (err) {
            setError("আবহাওয়া লোড করতে সমস্যা হয়েছে");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900">
                <CardContent className="p-4 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2">আবহাওয়া লোড হচ্ছে...</span>
                </CardContent>
            </Card>
        );
    }

    if (error || !weatherData) {
        return (
            <Card className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-4">
                    <p className="text-center text-muted-foreground">{error}</p>
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={loadWeather}>
                        আবার চেষ্টা করুন
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const current = weatherData.বর্তমান;
    const tomorrow = weatherData.দৈনিক[1];
    const hasAlerts = weatherData.সতর্কতা.length > 0;
    const hasRainToday = weatherData.দৈনিক[0]?.বৃষ্টির_সম্ভাবনা > 50;

    if (compact) {
        return (
            <Card
                className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/50 dark:to-blue-900/50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/abhaowa-purbabhas')}
            >
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{current.আইকন}</span>
                            <div>
                                <div className="text-2xl font-bold">{toBengaliNumber(current.তাপমাত্রা)}°সে</div>
                                <div className="text-sm text-muted-foreground">{current.অবস্থা}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium">{weatherData.অবস্থান}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Droplets className="h-3 w-3" />
                                {toBengaliNumber(current.আর্দ্রতা)}%
                                <Wind className="h-3 w-3 ml-1" />
                                {toBengaliNumber(current.বাতাসের_গতি)} কিমি/ঘ
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-sky-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
            <CardContent className="p-0">
                {/* সতর্কতা ব্যানার */}
                {showAlerts && (hasAlerts || hasRainToday) && (
                    <div className={`px-4 py-2 flex items-center gap-2 text-sm ${hasAlerts ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                        <AlertTriangle className="h-4 w-4" />
                        {hasAlerts
                            ? weatherData.সতর্কতা[0].শিরোনাম
                            : `🌧️ আজ বৃষ্টির সম্ভাবনা ${toBengaliNumber(weatherData.দৈনিক[0]?.বৃষ্টির_সম্ভাবনা || 0)}%`
                        }
                    </div>
                )}

                <div className="p-4">
                    {/* বর্তমান আবহাওয়া */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-5xl">{current.আইকন}</span>
                            <div>
                                <div className="text-4xl font-bold">{toBengaliNumber(current.তাপমাত্রা)}°</div>
                                <div className="text-sm text-muted-foreground">{current.অবস্থা}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium text-lg">{weatherData.অবস্থান}</div>
                            <div className="text-sm text-muted-foreground">
                                অনুভূত {toBengaliNumber(current.অনুভূতিমূলক_তাপমাত্রা)}°
                            </div>
                        </div>
                    </div>

                    {/* অতিরিক্ত তথ্য */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <Droplets className="h-5 w-5 mx-auto text-blue-500" />
                            <div className="text-sm font-medium mt-1">{toBengaliNumber(current.আর্দ্রতা)}%</div>
                            <div className="text-xs text-muted-foreground">আর্দ্রতা</div>
                        </div>
                        <div className="text-center">
                            <Wind className="h-5 w-5 mx-auto text-slate-500" />
                            <div className="text-sm font-medium mt-1">{toBengaliNumber(current.বাতাসের_গতি)}</div>
                            <div className="text-xs text-muted-foreground">কিমি/ঘ</div>
                        </div>
                        <div className="text-center">
                            <Cloud className="h-5 w-5 mx-auto text-gray-500" />
                            <div className="text-sm font-medium mt-1">{toBengaliNumber(current.মেঘ)}%</div>
                            <div className="text-xs text-muted-foreground">মেঘ</div>
                        </div>
                    </div>

                    {/* আগামীকালের পূর্বাভাস */}
                    {tomorrow && (
                        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{tomorrow.আইকন}</span>
                                <div>
                                    <div className="font-medium">আগামীকাল</div>
                                    <div className="text-sm text-muted-foreground">{tomorrow.অবস্থা}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">
                                    {toBengaliNumber(tomorrow.সর্বোচ্চ_তাপমাত্রা)}° / {toBengaliNumber(tomorrow.সর্বনিম্ন_তাপমাত্রা)}°
                                </div>
                                {tomorrow.বৃষ্টির_সম্ভাবনা > 30 && (
                                    <Badge variant="secondary" className="text-xs">
                                        🌧️ {toBengaliNumber(tomorrow.বৃষ্টির_সম্ভাবনা)}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* বিস্তারিত দেখুন বাটন */}
                    <Button
                        variant="ghost"
                        className="w-full mt-3 text-blue-600 hover:text-blue-700"
                        onClick={() => navigate('/abhaowa-purbabhas')}
                    >
                        বিস্তারিত দেখুন
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeatherWidget;
