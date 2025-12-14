/**
 * আবহাওয়া সেবা - OpenWeatherMap One Call API 3.0
 * বাংলাদেশের কৃষকদের জন্য বাংলায় আবহাওয়া পূর্বাভাস
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// API Key
const OPENWEATHER_API_KEY = "47ef88e186bc3c050c8a74fa9964fa81";

// বাংলাদেশের প্রধান জেলাগুলোর স্থানাঙ্ক
export const bangladeshDistricts: { [key: string]: { lat: number; lon: number; bn: string } } = {
  "dhaka": { lat: 23.8103, lon: 90.4125, bn: "ঢাকা" },
  "chattogram": { lat: 22.3569, lon: 91.7832, bn: "চট্টগ্রাম" },
  "khulna": { lat: 22.8456, lon: 89.5403, bn: "খুলনা" },
  "rajshahi": { lat: 24.3745, lon: 88.6042, bn: "রাজশাহী" },
  "sylhet": { lat: 24.8949, lon: 91.8687, bn: "সিলেট" },
  "rangpur": { lat: 25.7439, lon: 89.2752, bn: "রংপুর" },
  "barisal": { lat: 22.7010, lon: 90.3535, bn: "বরিশাল" },
  "mymensingh": { lat: 24.7471, lon: 90.4203, bn: "ময়মনসিংহ" },
  "comilla": { lat: 23.4607, lon: 91.1809, bn: "কুমিল্লা" },
  "gazipur": { lat: 23.9999, lon: 90.4203, bn: "গাজীপুর" },
  "narayanganj": { lat: 23.6238, lon: 90.5000, bn: "নারায়ণগঞ্জ" },
  "bogra": { lat: 24.8510, lon: 89.3697, bn: "বগুড়া" },
  "jessore": { lat: 23.1667, lon: 89.2167, bn: "যশোর" },
  "dinajpur": { lat: 25.6279, lon: 88.6332, bn: "দিনাজপুর" },
  "tangail": { lat: 24.2513, lon: 89.9167, bn: "টাঙ্গাইল" },
  "narsingdi": { lat: 23.9322, lon: 90.7151, bn: "নরসিংদী" },
  "faridpur": { lat: 23.6070, lon: 89.8429, bn: "ফরিদপুর" },
  "pabna": { lat: 24.0064, lon: 89.2372, bn: "পাবনা" },
  "kushtia": { lat: 23.9013, lon: 89.1206, bn: "কুষ্টিয়া" },
  "noakhali": { lat: 22.8696, lon: 91.0995, bn: "নোয়াখালী" }
};

// আবহাওয়ার অবস্থা বাংলায়
const weatherConditionsBangla: { [key: string]: string } = {
  "clear sky": "পরিষ্কার আকাশ",
  "few clouds": "হালকা মেঘ",
  "scattered clouds": "ছড়ানো মেঘ",
  "broken clouds": "ভাঙা মেঘ",
  "overcast clouds": "ঘন মেঘলা",
  "light rain": "হালকা বৃষ্টি",
  "moderate rain": "মাঝারি বৃষ্টি",
  "heavy rain": "ভারী বৃষ্টি",
  "light intensity shower rain": "হালকা ঝরঝরে বৃষ্টি",
  "shower rain": "ঝরঝরে বৃষ্টি",
  "heavy intensity shower rain": "ভারী ঝরঝরে বৃষ্টি",
  "thunderstorm": "বজ্রপাতসহ ঝড়",
  "thunderstorm with light rain": "হালকা বৃষ্টিসহ বজ্রপাত",
  "thunderstorm with rain": "বৃষ্টিসহ বজ্রপাত",
  "thunderstorm with heavy rain": "ভারী বৃষ্টিসহ বজ্রপাত",
  "drizzle": "গুঁড়ি গুঁড়ি বৃষ্টি",
  "light intensity drizzle": "হালকা গুঁড়ি বৃষ্টি",
  "mist": "কুয়াশা",
  "fog": "ঘন কুয়াশা",
  "haze": "ধোঁয়াশা",
  "smoke": "ধোঁয়া",
  "dust": "ধূলিঝড়",
  "sand": "বালুঝড়",
  "squalls": "ঝোড়ো হাওয়া",
  "tornado": "টর্নেডো",
  "snow": "তুষারপাত",
  "light snow": "হালকা তুষার"
};

// আবহাওয়া আইকন ম্যাপিং
const weatherIcons: { [key: string]: string } = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "🌨️", "13n": "🌨️",
  "50d": "🌫️", "50n": "🌫️"
};

// বাতাসের দিক বাংলায়
const windDirectionBangla = (deg: number): string => {
  const directions = ["উত্তর", "উত্তর-পূর্ব", "পূর্ব", "দক্ষিণ-পূর্ব", "দক্ষিণ", "দক্ষিণ-পশ্চিম", "পশ্চিম", "উত্তর-পশ্চিম"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

// দিনের নাম বাংলায়
const getDayNameBangla = (date: Date): string => {
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  return days[date.getDay()];
};

// তারিখ বাংলায়
const getDateBangla = (date: Date): string => {
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

// সংখ্যা বাংলায়
export const toBengaliNumber = (num: number): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => {
    if (d === '.') return '.';
    if (d === '-') return '-';
    return bengaliDigits[parseInt(d)] || d;
  }).join('');
};

// Interfaces
export interface CurrentWeather {
  তাপমাত্রা: number;
  অনুভূতিমূলক_তাপমাত্রা: number;
  আর্দ্রতা: number;
  চাপ: number;
  দৃশ্যমানতা: number;
  বাতাসের_গতি: number;
  বাতাসের_দিক: string;
  মেঘ: number;
  অবস্থা: string;
  আইকন: string;
  সূর্যোদয়: string;
  সূর্যাস্ত: string;
  UV_সূচক: number;
}

export interface HourlyForecast {
  সময়: string;
  তাপমাত্রা: number;
  অবস্থা: string;
  আইকন: string;
  বৃষ্টির_সম্ভাবনা: number;
  আর্দ্রতা: number;
}

export interface DailyForecast {
  দিন: string;
  তারিখ: string;
  সর্বোচ্চ_তাপমাত্রা: number;
  সর্বনিম্ন_তাপমাত্রা: number;
  অবস্থা: string;
  আইকন: string;
  বৃষ্টির_সম্ভাবনা: number;
  আর্দ্রতা: number;
  বাতাসের_গতি: number;
  সারাংশ: string;
}

export interface WeatherAlert {
  শিরোনাম: string;
  বিবরণ: string;
  শুরু: string;
  শেষ: string;
}

export interface CompleteWeatherData {
  অবস্থান: string;
  বর্তমান: CurrentWeather;
  ঘণ্টাভিত্তিক: HourlyForecast[];
  দৈনিক: DailyForecast[];
  সতর্কতা: WeatherAlert[];
  সর্বশেষ_আপডেট: string;
}

// সময় ফরম্যাট করা
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'বিকাল' : 'সকাল';
  const hour12 = hours % 12 || 12;
  return `${period} ${toBengaliNumber(hour12)}:${toBengaliNumber(parseInt(minutes))}`;
};

// OpenWeatherMap One Call API 3.0 কল করা
export const fetchWeatherOneCall = async (lat: number, lon: number): Promise<any> => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&lang=bn&appid=${OPENWEATHER_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // One Call 3.0 সাবস্ক্রিপশন নেই হলে 2.5 API ব্যবহার করব
      console.log("One Call 3.0 failed, trying 2.5 API");
      return await fetchWeather25API(lat, lon);
    }
    return await response.json();
  } catch (error) {
    console.error("Weather API error:", error);
    return await fetchWeather25API(lat, lon);
  }
};

// Fallback: OpenWeatherMap 2.5 API
const fetchWeather25API = async (lat: number, lon: number): Promise<any> => {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=bn&appid=${OPENWEATHER_API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=bn&appid=${OPENWEATHER_API_KEY}`;
  
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("API call failed");
    }
    
    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();
    
    // 2.5 API ডেটা One Call ফরম্যাটে রূপান্তর করা
    return convert25ToOneCallFormat(currentData, forecastData);
  } catch (error) {
    console.error("Weather 2.5 API error:", error);
    throw error;
  }
};

// 2.5 API ডেটা One Call ফরম্যাটে রূপান্তর
const convert25ToOneCallFormat = (current: any, forecast: any): any => {
  const hourly = forecast.list.slice(0, 24).map((item: any) => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    humidity: item.main.humidity,
    clouds: item.clouds.all,
    wind_speed: item.wind.speed,
    weather: item.weather,
    pop: item.pop || 0
  }));
  
  // দিনভিত্তিক পূর্বাভাস তৈরি
  const dailyMap: { [key: string]: any[] } = {};
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });
  
  const daily = Object.entries(dailyMap).slice(0, 7).map(([date, items]: [string, any[]]) => {
    const temps = items.map((i: any) => i.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const midItem = items[Math.floor(items.length / 2)];
    
    return {
      dt: items[0].dt,
      temp: { min: minTemp, max: maxTemp, day: (minTemp + maxTemp) / 2 },
      humidity: midItem.main.humidity,
      wind_speed: midItem.wind.speed,
      weather: midItem.weather,
      pop: Math.max(...items.map((i: any) => i.pop || 0)),
      summary: midItem.weather[0].description
    };
  });
  
  return {
    current: {
      dt: current.dt,
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: current.visibility,
      wind_speed: current.wind.speed,
      wind_deg: current.wind.deg,
      clouds: current.clouds.all,
      weather: current.weather,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      uvi: 0
    },
    hourly,
    daily,
    alerts: []
  };
};

// স্থানাঙ্ক থেকে অবস্থান নাম পাওয়া
export const getLocationName = async (lat: number, lon: number): Promise<string> => {
  try {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        return data[0].local_names?.bn || data[0].name;
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return "অজানা অবস্থান";
};

// অবস্থান নাম থেকে স্থানাঙ্ক পাওয়া
export const getCoordinatesFromLocation = async (locationName: string): Promise<{ lat: number; lon: number } | null> => {
  // প্রথমে বাংলাদেশের জেলা তালিকায় খুঁজি
  const lowerName = locationName.toLowerCase().trim();
  
  // বাংলা থেকে ইংরেজি নাম খোঁজা
  for (const [eng, data] of Object.entries(bangladeshDistricts)) {
    if (eng === lowerName || data.bn === locationName) {
      return { lat: data.lat, lon: data.lon };
    }
  }
  
  // Geocoding API ব্যবহার
  try {
    const queries = [
      `${locationName},BD`,
      `${locationName},Bangladesh`,
      locationName
    ];
    
    for (const query of queries) {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          return { lat: data[0].lat, lon: data[0].lon };
        }
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  
  return null;
};

// সম্পূর্ণ আবহাওয়া ডেটা প্রসেস করা
export const processWeatherData = (rawData: any, locationName: string): CompleteWeatherData => {
  const current = rawData.current;
  const weatherDesc = current.weather[0].description;
  const weatherIcon = current.weather[0].icon;
  
  // বর্তমান আবহাওয়া
  const বর্তমান: CurrentWeather = {
    তাপমাত্রা: Math.round(current.temp),
    অনুভূতিমূলক_তাপমাত্রা: Math.round(current.feels_like),
    আর্দ্রতা: current.humidity,
    চাপ: current.pressure,
    দৃশ্যমানতা: Math.round((current.visibility || 10000) / 1000),
    বাতাসের_গতি: Math.round(current.wind_speed * 3.6), // m/s to km/h
    বাতাসের_দিক: windDirectionBangla(current.wind_deg || 0),
    মেঘ: current.clouds,
    অবস্থা: weatherConditionsBangla[weatherDesc.toLowerCase()] || weatherDesc,
    আইকন: weatherIcons[weatherIcon] || "🌤️",
    সূর্যোদয়: formatTime(current.sunrise),
    সূর্যাস্ত: formatTime(current.sunset),
    UV_সূচক: Math.round(current.uvi || 0)
  };
  
  // ঘণ্টাভিত্তিক পূর্বাভাস (পরবর্তী ২৪ ঘণ্টা)
  const ঘণ্টাভিত্তিক: HourlyForecast[] = (rawData.hourly || []).slice(0, 24).map((hour: any) => {
    const hourWeather = hour.weather[0];
    return {
      সময়: formatTime(hour.dt),
      তাপমাত্রা: Math.round(hour.temp),
      অবস্থা: weatherConditionsBangla[hourWeather.description.toLowerCase()] || hourWeather.description,
      আইকন: weatherIcons[hourWeather.icon] || "🌤️",
      বৃষ্টির_সম্ভাবনা: Math.round((hour.pop || 0) * 100),
      আর্দ্রতা: hour.humidity
    };
  });
  
  // দৈনিক পূর্বাভাস (পরবর্তী ৭ দিন)
  const দৈনিক: DailyForecast[] = (rawData.daily || []).slice(0, 7).map((day: any, index: number) => {
    const date = new Date(day.dt * 1000);
    const dayWeather = day.weather[0];
    
    let দিন = getDayNameBangla(date);
    if (index === 0) দিন = "আজ";
    else if (index === 1) দিন = "আগামীকাল";
    
    return {
      দিন,
      তারিখ: getDateBangla(date),
      সর্বোচ্চ_তাপমাত্রা: Math.round(day.temp.max),
      সর্বনিম্ন_তাপমাত্রা: Math.round(day.temp.min),
      অবস্থা: weatherConditionsBangla[dayWeather.description.toLowerCase()] || dayWeather.description,
      আইকন: weatherIcons[dayWeather.icon] || "🌤️",
      বৃষ্টির_সম্ভাবনা: Math.round((day.pop || 0) * 100),
      আর্দ্রতা: day.humidity,
      বাতাসের_গতি: Math.round(day.wind_speed * 3.6),
      সারাংশ: day.summary || dayWeather.description
    };
  });
  
  // সতর্কতা
  const সতর্কতা: WeatherAlert[] = (rawData.alerts || []).map((alert: any) => ({
    শিরোনাম: alert.event,
    বিবরণ: alert.description,
    শুরু: formatTime(alert.start),
    শেষ: formatTime(alert.end)
  }));
  
  return {
    অবস্থান: locationName,
    বর্তমান,
    ঘণ্টাভিত্তিক,
    দৈনিক,
    সতর্কতা,
    সর্বশেষ_আপডেট: new Date().toLocaleTimeString('bn-BD')
  };
};

// =====================================================
// AI Weather Assistant - চ্যাটবট স্টাইল আবহাওয়া সহায়ক
// =====================================================

export interface WeatherAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export interface WeatherAssistantSession {
  sessionId: string | null;
  messages: WeatherAssistantMessage[];
  location: string | null;
}

// Weather Assistant সেশন শুরু করা
export const startWeatherAssistantSession = async (prompt: string): Promise<{
  answer: string;
  sessionId: string;
  data?: any;
}> => {
  try {
    const response = await fetch('https://api.openweathermap.org/assistant/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': OPENWEATHER_API_KEY
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      answer: data.answer,
      sessionId: data.session_id,
      data: data.data
    };
  } catch (error) {
    console.error('Weather Assistant error:', error);
    // Fallback - নিজস্ব AI উত্তর তৈরি করা
    return generateLocalWeatherResponse(prompt);
  }
};

// Weather Assistant সেশন চালিয়ে যাওয়া
export const continueWeatherAssistantSession = async (
  sessionId: string, 
  prompt: string
): Promise<{
  answer: string;
  sessionId: string;
  data?: any;
}> => {
  try {
    const response = await fetch(`https://api.openweathermap.org/assistant/session/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': OPENWEATHER_API_KEY
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      answer: data.answer,
      sessionId: data.session_id,
      data: data.data
    };
  } catch (error) {
    console.error('Weather Assistant error:', error);
    return generateLocalWeatherResponse(prompt);
  }
};

// Fallback - নিজস্ব আবহাওয়া উত্তর তৈরি
const generateLocalWeatherResponse = async (prompt: string): Promise<{
  answer: string;
  sessionId: string;
  data?: any;
}> => {
  const promptLower = prompt.toLowerCase();
  
  // অবস্থান খোঁজা
  let locationFound = null;
  for (const [key, district] of Object.entries(bangladeshDistricts)) {
    if (promptLower.includes(key) || prompt.includes(district.bn)) {
      locationFound = district;
      break;
    }
  }

  // যদি কোনো অবস্থান পাওয়া যায়
  if (locationFound) {
    try {
      const rawData = await fetchWeatherOneCall(locationFound.lat, locationFound.lon);
      const weatherData = processWeatherData(rawData, locationFound.bn);
      const current = weatherData.বর্তমান;
      
      let answer = `🌤️ **${locationFound.bn}** এর আবহাওয়া:\n\n`;
      answer += `🌡️ তাপমাত্রা: ${toBengaliNumber(current.তাপমাত্রা)}°সে (অনুভূত ${toBengaliNumber(current.অনুভূতিমূলক_তাপমাত্রা)}°সে)\n`;
      answer += `☁️ অবস্থা: ${current.অবস্থা}\n`;
      answer += `💧 আর্দ্রতা: ${toBengaliNumber(current.আর্দ্রতা)}%\n`;
      answer += `💨 বাতাস: ${toBengaliNumber(current.বাতাসের_গতি)} কিমি/ঘ ${current.বাতাসের_দিক} দিক থেকে\n\n`;

      // আগামীকালের পূর্বাভাস
      if (weatherData.দৈনিক.length > 1) {
        const tomorrow = weatherData.দৈনিক[1];
        answer += `\n📅 **আগামীকাল:** ${tomorrow.অবস্থা}, ${toBengaliNumber(tomorrow.সর্বোচ্চ_তাপমাত্রা)}°/${toBengaliNumber(tomorrow.সর্বনিম্ন_তাপমাত্রা)}°`;
        if (tomorrow.বৃষ্টির_সম্ভাবনা > 30) {
          answer += ` 🌧️ বৃষ্টির সম্ভাবনা ${toBengaliNumber(tomorrow.বৃষ্টির_সম্ভাবনা)}%`;
        }
      }

      return {
        answer,
        sessionId: `local_${Date.now()}`,
        data: weatherData
      };
    } catch (error) {
      console.error('Local weather fetch error:', error);
    }
  }

  // সাধারণ প্রশ্নের উত্তর
  if (promptLower.includes('বৃষ্টি') || promptLower.includes('rain')) {
    return {
      answer: '🌧️ বৃষ্টির পূর্বাভাস জানতে আপনার জেলার নাম বলুন। যেমন: "ঢাকায় কি বৃষ্টি হবে?"',
      sessionId: `local_${Date.now()}`
    };
  }

  if (promptLower.includes('গরম') || promptLower.includes('তাপ') || promptLower.includes('hot')) {
    return {
      answer: '🌡️ তাপমাত্রা জানতে আপনার জেলার নাম বলুন। যেমন: "রাজশাহীর তাপমাত্রা কত?"',
      sessionId: `local_${Date.now()}`
    };
  }

  if (promptLower.includes('ফসল') || promptLower.includes('চাষ') || promptLower.includes('crop')) {
    return {
      answer: '🌾 ফসল চাষের পরামর্শের জন্য আপনার জেলা ও ফসলের নাম বলুন। যেমন: "বগুড়ায় ধান চাষের জন্য আবহাওয়া কেমন?"',
      sessionId: `local_${Date.now()}`
    };
  }

  // ডিফল্ট উত্তর
  return {
    answer: `👋 আসসালামু আলাইকুম! আমি আপনার কৃষি আবহাওয়া সহায়ক।

আমাকে জিজ্ঞেস করতে পারেন:
• "ঢাকার আবহাওয়া কেমন?"
• "আগামীকাল কি বৃষ্টি হবে?"
• "ধান চাষের জন্য আবহাওয়া কেমন?"
• "সবজি চাষে কি সমস্যা হবে?"

আপনার জেলার নাম বলুন, আমি সেখানের আবহাওয়া ও কৃষি পরামর্শ দেব! 🌾`,
    sessionId: `local_${Date.now()}`
  };
};

// প্রশ্নের ধরন অনুযায়ী কৃষি-কেন্দ্রিক উত্তর তৈরি
export const generateAgricultureWeatherPrompt = (
  location: string,
  cropName?: string,
  queryType?: 'irrigation' | 'disease' | 'harvest' | 'planting' | 'general'
): string => {
  let prompt = `${location} এর আবহাওয়া সম্পর্কে বলুন`;
  
  if (cropName) {
    prompt = `${location} তে ${cropName} চাষের জন্য আবহাওয়া কেমন?`;
  }

  switch (queryType) {
    case 'irrigation':
      prompt = `${location} তে ${cropName || 'ফসলে'} সেচ দেওয়া উচিত কিনা?`;
      break;
    case 'disease':
      prompt = `${location} এর আবহাওয়ায় ${cropName || 'ফসলে'} কোন রোগের ঝুঁকি আছে?`;
      break;
    case 'harvest':
      prompt = `${location} তে ${cropName || 'ফসল'} কাটার জন্য আবহাওয়া উপযুক্ত কিনা?`;
      break;
    case 'planting':
      prompt = `${location} তে ${cropName || 'চারা'} রোপণের জন্য আবহাওয়া কেমন?`;
      break;
  }

  return prompt;
};
