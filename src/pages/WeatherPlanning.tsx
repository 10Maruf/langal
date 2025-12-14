import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Mic, MapPin, Calendar, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  windSpeed: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }[];
}

const WeatherPlanning = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock weather data
  const mockWeather: WeatherData = {
    temperature: 28,
    humidity: 75,
    rainfall: 12,
    condition: "আংশিক মেঘলা",
    windSpeed: 15,
    forecast: [
      { day: "আজ", temp: 28, condition: "মেঘলা", icon: "☁️" },
      { day: "আগামীকাল", temp: 30, condition: "রোদ", icon: "☀️" },
      { day: "পরশু", temp: 26, condition: "বৃষ্টি", icon: "🌧️" },
      { day: "৪ দিন পর", temp: 27, condition: "মেঘলা", icon: "☁️" },
      { day: "৫ দিন পর", temp: 29, condition: "রোদ", icon: "☀️" },
      { day: "৬ দিন পর", temp: 25, condition: "বৃষ্টি", icon: "🌧️" },
      { day: "৭ দিন পর", temp: 28, condition: "আংশিক মেঘলা", icon: "⛅" }
    ]
  };
  const [location, setLocation] = useState("");
  const [cropName, setCropName] = useState("");
  const [question, setQuestion] = useState("");
  // শুরুতেই mockWeather দেখানো হবে
  const [weather, setWeather] = useState<WeatherData | null>(mockWeather);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeason, setCurrentSeason] = useState("");

  // Auto detect current season based on current date
  const getCurrentSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed

    if (month >= 12 || month <= 2) {
      return "রবি মৌসুম (ডিসেম্বর-ফেব্রুয়ারি)";
    } else if (month >= 3 && month <= 6) {
      return "প্রাক-খরিপ মৌসুম (মার্চ-জুন)";
    } else if (month >= 7 && month <= 8) {
      return "খরিপ ১ মৌসুম (জুলাই-আগস্ট)";
    } else if (month >= 9 && month <= 11) {
      return "খরিপ ২ মৌসুম (সেপ্টেম্বর-নভেম্বর)";
    }
    return "রবি মৌসুম";
  };

  const handleAutoSelectSeason = () => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    toast({
      title: "মৌসুম নির্বাচিত",
      description: `বর্তমান মৌসুম: ${season}`,
    });
  };

  // Auto-select season on page load
  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
  }, []);

  const getCropRecommendations = (crop: string, weather: WeatherData) => {
    const recommendations = [];

    if (weather.temperature > 30) {
      recommendations.push("🌡️ তাপমাত্রা বেশি - ছায়ার ব্যবস্থা করুন বা সকাল/সন্ধ্যায় সেচ দিন");
    }

    if (weather.humidity > 80) {
      recommendations.push("💧 আর্দ্রতা বেশি - ছত্রাক রোগের জন্য সতর্ক থাকুন");
    }

    if (weather.rainfall > 10) {
      recommendations.push("🌧️ বৃষ্টির সম্ভাবনা - নিষ্কাশনের ব্যবস্থা রাখুন");
    }

    if (weather.windSpeed > 20) {
      recommendations.push("💨 বাতাস বেশি - গাছের সাপোর্ট দিন");
    }

    // Crop specific recommendations
    if (crop.includes("ধান")) {
      recommendations.push("🌾 ধানের জন্য - জলাবদ্ধতা এড়িয়ে ৫-১০ সেমি পানি রাখুন");
    } else if (crop.includes("টমেটো")) {
      recommendations.push("🍅 টমেটোর জন্য - পাতায় পানি লাগানো এড়িয়ে চলুন");
    } else if (crop.includes("সবজি")) {
      recommendations.push("🥬 সবজির জন্য - নিয়মিত হালকা সেচ দিন");
    }

    return recommendations;
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'bn-BD';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
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

  const handleLocationFromGPS = () => {
    if ('geolocation' in navigator) {
      toast({
        title: "GPS চালু করা হচ্ছে",
        description: "অনুগ্রহ করে অপেক্ষা করুন...",
      });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding using OpenWeatherMap API
            const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
            const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            const geoResponse = await fetch(reverseGeoUrl);
            let locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`; // fallback

            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.length > 0) {
                const location = geoData[0];
                // Use local name if available, otherwise use English name
                locationName = location.local_names?.bn || location.name || locationName;
              }
            }

            setLocation(locationName);

            toast({
              title: "লোকেশন পাওয়া গেছে",
              description: `আপনার অবস্থান: ${locationName}`,
            });

            // Automatically fetch weather data for the detected location
            const weatherData = await fetchWeatherData(locationName);
            if (weatherData) {
              setWeather(weatherData);
              const recs = getCropRecommendations(cropName, weatherData);
              setRecommendations(recs);
            }
          } catch (error) {
            toast({
              title: "ত্রুটি",
              description: "লোকেশন নাম পেতে সমস্যা হয়েছে।",
              variant: "destructive"
            });
          }
        },
        (error) => {
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
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "সাপোর্ট নেই",
        description: "আপনার ব্রাউজার GPS সাপোর্ট করে না।",
        variant: "destructive"
      });
    }
  };

  const fetchWeatherData = async (locationName: string): Promise<WeatherData | null> => {
    try {
      // OpenWeatherMap API (free tier)
      const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Your actual API key

      // Try multiple URL formats for better location matching
      const locationQueries = [
        locationName, // Original name
        `${locationName},BD`, // With Bangladesh country code
        `${locationName},Bangladesh`, // With full country name
      ];

      let currentData = null;
      let forecastData = null;

      // Try different location formats until one works
      for (const query of locationQueries) {
        try {
          const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=en`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=en`;

          console.log(`Trying query: "${query}"`);
          console.log("Current URL:", currentWeatherUrl);
          console.log("Forecast URL:", forecastUrl);

          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
          ]);

          console.log(`Response for "${query}" - Current:`, currentResponse.status, "Forecast:", forecastResponse.status);

          if (currentResponse.ok && forecastResponse.ok) {
            currentData = await currentResponse.json();
            forecastData = await forecastResponse.json();
            console.log(`Success with query: "${query}"`);
            break; // Exit loop on success
          } else {
            console.log(`Failed with query: "${query}"`);
            if (!currentResponse.ok) {
              const errorText = await currentResponse.text();
              console.log("Current API error:", errorText);
            }
            if (!forecastResponse.ok) {
              const errorText = await forecastResponse.text();
              console.log("Forecast API error:", errorText);
            }
          }
        } catch (queryError) {
          console.log(`Error with query "${query}":`, queryError);
          continue; // Try next query format
        }
      }

      if (!currentData || !forecastData) {
        throw new Error("All location query formats failed");
      }

      console.log("Final current data:", currentData);
      console.log("Final forecast data:", forecastData);

      // Map weather condition to Bengali
      const getConditionInBengali = (condition: string): string => {
        const conditionMap: Record<string, string> = {
          "clear": "পরিষ্কার",
          "clouds": "মেঘলা",
          "rain": "বৃষ্টি",
          "drizzle": "গুঁড়ি গুঁড়ি বৃষ্টি",
          "thunderstorm": "বজ্রবৃষ্টি",
          "snow": "তুষারপাত",
          "mist": "কুয়াশা",
          "fog": "ঘন কুয়াশা",
          "haze": "ধোঁয়াশা"
        };
        return conditionMap[condition.toLowerCase()] || "আংশিক মেঘলা";
      };

      // Get weather icon
      const getWeatherIcon = (condition: string): string => {
        const iconMap: Record<string, string> = {
          "clear": "☀️",
          "clouds": "☁️",
          "rain": "🌧️",
          "drizzle": "🌦️",
          "thunderstorm": "⛈️",
          "snow": "🌨️",
          "mist": "🌫️",
          "fog": "🌫️",
          "haze": "🌫️"
        };
        return iconMap[condition.toLowerCase()] || "⛅";
      };

      // Process 7-day forecast (OpenWeatherMap free tier gives 5-day forecast)
      const dailyForecasts: { [key: string]: any } = {};
      const today = new Date();

      // Group forecast by date and pick noon data (12:00) for each day
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();

        // Prefer noon time (12:00) for daily forecast, otherwise take first entry of the day
        if (!dailyForecasts[dateKey] || date.getHours() >= 12) {
          dailyForecasts[dateKey] = item;
        }
      });

      const dayNames = ["আজ", "আগামীকাল", "পরশু", "৩ দিন পর", "৪ দিন পর", "৫ দিন পর", "৬ দিন পর"];
      const forecastEntries = Object.values(dailyForecasts);

      // Create forecast array with available data + extend if needed
      const forecast = [];
      for (let i = 0; i < 7; i++) {
        if (i < forecastEntries.length) {
          const item: any = forecastEntries[i];
          forecast.push({
            day: dayNames[i] || `${i + 1} দিন পর`,
            temp: Math.round(item.main.temp),
            condition: getConditionInBengali(item.weather[0].main),
            icon: getWeatherIcon(item.weather[0].main)
          });
        } else {
          // Fill remaining days with estimated data based on last available day
          const lastItem = forecastEntries[forecastEntries.length - 1];
          if (lastItem) {
            forecast.push({
              day: dayNames[i] || `${i + 1} দিন পর`,
              temp: Math.round(lastItem.main.temp + (Math.random() * 6 - 3)), // ±3°C variation
              condition: getConditionInBengali(lastItem.weather[0].main),
              icon: getWeatherIcon(lastItem.weather[0].main)
            });
          }
        }
      }

      console.log("Processed forecast:", forecast);

      const result = {
        temperature: Math.round(currentData.main.temp),
        humidity: currentData.main.humidity,
        rainfall: currentData.rain?.["1h"] || currentData.rain?.["3h"] || 0,
        condition: getConditionInBengali(currentData.weather[0].main),
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        forecast
      };

      console.log("Final weather data:", result);
      return result;

    } catch (error) {
      console.error("Weather API error:", error);
      return null;
    }
  };

  const handleWeatherCheck = async () => {
    if (!location) {
      toast({
        title: "তথ্য প্রয়োজন",
        description: "লোকেশন দিন।",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const weatherData = await fetchWeatherData(location);

      if (weatherData) {
        setWeather(weatherData);
        const recs = getCropRecommendations(cropName, weatherData);
        setRecommendations(recs);

        toast({
          title: "আবহাওয়া আপডেট",
          description: `${location} এর লাইভ আবহাওয়া ডেটা লোড হয়েছে।`,
        });
      } else {
        // Fallback to mock data
        setWeather(mockWeather);
        const recs = getCropRecommendations(cropName, mockWeather);
        setRecommendations(recs);

        toast({
          title: "ডেমো ডেটা",
          description: "API কল ব্যর্থ হয়েছে। ডেমো ডেটা দেখানো হচ্ছে। Console দেখুন বিস্তারিত তথ্যের জন্য।",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Weather fetch error:", error);

      // Fallback to mock data on error
      setWeather(mockWeather);
      const recs = getCropRecommendations(cropName, mockWeather);
      setRecommendations(recs);

      toast({
        title: "ত্রুটি",
        description: `আবহাওয়া ডেটা লোড করতে সমস্যা হয়েছে। ${error instanceof Error ? error.message : 'ডেমো ডেটা দেখানো হচ্ছে।'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 pb-20 space-y-4 pt-20">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Cloud className="h-5 w-5 text-primary" />
              আবহাওয়া ভিত্তিক পরিকল্পনা
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">তথ্য দিন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">লোকেশন</label>
                <Input
                  placeholder="যেমন: নোয়াখালী, ঢাকা"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLocationFromGPS}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  GPS দিয়ে লোকেশন নিন
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ফসলের নাম (ঐচ্ছিক)</label>
                <Input
                  placeholder="যেমন: ধান, টমেটো"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </div>
            </div>

            {/* Season Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">বর্তমান মৌসুম</label>
              <div className="flex gap-2">
                <Input
                  placeholder="মৌসুম অটো সিলেক্ট করুন"
                  value={currentSeason}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleAutoSelectSeason}
                  className="whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  অটো সিলেক্ট
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">আবহাওয়া সম্পর্কিত প্রশ্ন</label>
              <Textarea
                placeholder="যেমন: এই আবহাওয়ায় কি করব? বৃষ্টি হলে কি সমস্যা হবে?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                ভয়েস দিয়ে প্রশ্ন করুন
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleWeatherCheck}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "লোড হচ্ছে..." : "আবহাওয়া দেখুন ও সুপারিশ নিন"}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  setLocation("Dhaka");
                  const result = await fetchWeatherData("Dhaka");
                  console.log("Test result:", result);
                  if (result) {
                    setWeather(result);
                    toast({
                      title: "টেস্ট সফল",
                      description: "ঢাকার আবহাওয়া ডেটা পাওয়া গেছে।",
                    });
                  } else {
                    toast({
                      title: "টেস্ট ব্যর্থ",
                      description: "API কল করতে সমস্যা হয়েছে।",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={isLoading}
              >
                টেস্ট
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weather Display */}
        {weather && (
          <>
            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  বর্তমান আবহাওয়া - {location ? location : "লোকেশন নেই"}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWeatherCheck}
                    disabled={isLoading || !location}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-semibold">{weather.temperature}°C</div>
                      <div className="text-sm text-muted-foreground">তাপমাত্রা</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">{weather.humidity}%</div>
                      <div className="text-sm text-muted-foreground">আর্দ্রতা</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">{weather.rainfall}mm</div>
                      <div className="text-sm text-muted-foreground">বৃষ্টিপাত</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-semibold">{weather.windSpeed} km/h</div>
                      <div className="text-sm text-muted-foreground">বাতাসের গতি</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg py-2 px-4">
                    {weather.condition}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">৭ দিনের পূর্বাভাস</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="text-center border rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">{day.day}</div>
                      <div className="text-2xl mb-1">{day.icon}</div>
                      <div className="font-semibold">{day.temp}°C</div>
                      <div className="text-xs text-muted-foreground">{day.condition}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    আবহাওয়া ভিত্তিক সুপারিশ
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLocationFromGPS}
                      className="h-8 w-8 p-0"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4 py-2 bg-primary/5">
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* General Agricultural Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সাধারণ পরামর্শ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>সকাল (৬-৮টা):</strong> সেচ ও স্প্রে করার উত্তম সময়</p>
                  <p><strong>দুপুর (১২-৩টা):</strong> তীব্র রোদে কাজ এড়িয়ে চলুন</p>
                  <p><strong>সন্ধ্যা (৪-৬টা):</strong> ফসল পরিদর্শন ও হালকা কাজের সময়</p>
                  <p><strong>বৃষ্টির আগে:</strong> ছত্রাকনাশক স্প্রে করুন</p>
                  <p><strong>বৃষ্টির পরে:</strong> পানি নিষ্কাশনের ব্যবস্থা দেখুন</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">জরুরি যোগাযোগ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>আবহাওয়া হটলাইন:</strong> ১০৯০</p>
                <p><strong>কৃষি কল সেন্টার:</strong> ১৬১২ৣ</p>
                <p><strong>দুর্যোগ ব্যবস্থাপনা:</strong> ১০৯০</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPlanning;