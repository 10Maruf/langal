/**
 * স্মার্ট কৃষি আবহাওয়া সহায়ক
 * OpenWeatherMap CORS সমস্যার কারণে Local AI ব্যবহার করা হচ্ছে
 */

import {
  fetchWeatherOneCall,
  processWeatherData,
  bangladeshDistricts,
  toBengaliNumber,
  CompleteWeatherData
} from './weatherService';

export interface WeatherAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: CompleteWeatherData;
}

// Cached weather data for session
let cachedWeatherData: CompleteWeatherData | null = null;
let cachedLocation: string | null = null;

// Weather Assistant সেশন শুরু করা
export const startWeatherAssistantSession = async (prompt: string): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  return generateSmartWeatherResponse(prompt);
};

// Weather Assistant সেশন চালিয়ে যাওয়া
export const continueWeatherAssistantSession = async (
  _sessionId: string, 
  prompt: string
): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  return generateSmartWeatherResponse(prompt);
};

// স্মার্ট আবহাওয়া উত্তর তৈরি
const generateSmartWeatherResponse = async (prompt: string): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  const promptLower = prompt.toLowerCase();
  const sessionId = `local_${Date.now()}`;
  
  // অবস্থান খোঁজা (বাংলা ও ইংরেজি দুটোতেই)
  let locationFound: { bn: string; lat: number; lon: number } | null = null;
  for (const [key, district] of Object.entries(bangladeshDistricts)) {
    if (promptLower.includes(key) || prompt.includes(district.bn)) {
      locationFound = district;
      break;
    }
  }

  // প্রশ্নের ধরন নির্ণয়
  const queryType = detectQueryType(promptLower);
  
  // ফসলের নাম খোঁজা
  const cropDetected = detectCropName(prompt);

  // যদি কোনো অবস্থান পাওয়া যায়
  if (locationFound) {
    try {
      const rawData = await fetchWeatherOneCall(locationFound.lat, locationFound.lon);
      const weatherData = processWeatherData(rawData, locationFound.bn);
      
      // Cache করা
      cachedWeatherData = weatherData;
      cachedLocation = locationFound.bn;

      return generateContextualResponse(weatherData, queryType, cropDetected, locationFound.bn);
    } catch (error) {
      console.error('Weather fetch error:', error);
      return {
        answer: `❌ দুঃখিত, ${locationFound.bn} এর আবহাওয়া ডেটা আনতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।`,
        sessionId
      };
    }
  }

  // যদি cached data থাকে এবং কোনো নির্দিষ্ট প্রশ্ন থাকে
  if (cachedWeatherData && cachedLocation) {
    return generateContextualResponse(cachedWeatherData, queryType, cropDetected, cachedLocation);
  }

  // সাধারণ প্রশ্নের উত্তর
  return generateGeneralResponse(queryType);
};

// প্রশ্নের ধরন নির্ণয়
const detectQueryType = (promptLower: string): string => {
  if (promptLower.includes('বৃষ্টি') || promptLower.includes('rain') || promptLower.includes('বর্ষা')) {
    return 'rain';
  }
  if (promptLower.includes('সেচ') || promptLower.includes('পানি') || promptLower.includes('irrigation')) {
    return 'irrigation';
  }
  if (promptLower.includes('রোগ') || promptLower.includes('disease') || promptLower.includes('পোকা')) {
    return 'disease';
  }
  if (promptLower.includes('কাটা') || promptLower.includes('harvest') || promptLower.includes('ফসল তোলা')) {
    return 'harvest';
  }
  if (promptLower.includes('রোপণ') || promptLower.includes('বীজ') || promptLower.includes('planting') || promptLower.includes('লাগানো')) {
    return 'planting';
  }
  if (promptLower.includes('সার') || promptLower.includes('fertilizer')) {
    return 'fertilizer';
  }
  if (promptLower.includes('গরম') || promptLower.includes('তাপ') || promptLower.includes('hot') || promptLower.includes('শীত') || promptLower.includes('cold')) {
    return 'temperature';
  }
  if (promptLower.includes('আগামীকাল') || promptLower.includes('tomorrow') || promptLower.includes('পরের দিন')) {
    return 'tomorrow';
  }
  if (promptLower.includes('সপ্তাহ') || promptLower.includes('week') || promptLower.includes('৭ দিন')) {
    return 'weekly';
  }
  return 'general';
};

// ফসলের নাম খোঁজা
const detectCropName = (prompt: string): string | null => {
  const crops = [
    { names: ['ধান', 'paddy', 'rice'], value: 'ধান' },
    { names: ['গম', 'wheat'], value: 'গম' },
    { names: ['টমেটো', 'tomato'], value: 'টমেটো' },
    { names: ['আলু', 'potato'], value: 'আলু' },
    { names: ['পাট', 'jute'], value: 'পাট' },
    { names: ['সবজি', 'vegetable', 'শাক'], value: 'সবজি' },
    { names: ['আম', 'mango'], value: 'আম' },
    { names: ['মরিচ', 'chili', 'pepper'], value: 'মরিচ' },
    { names: ['পেঁয়াজ', 'onion'], value: 'পেঁয়াজ' },
    { names: ['রসুন', 'garlic'], value: 'রসুন' },
    { names: ['বেগুন', 'brinjal', 'eggplant'], value: 'বেগুন' },
    { names: ['শসা', 'cucumber'], value: 'শসা' },
    { names: ['লাউ', 'gourd'], value: 'লাউ' },
    { names: ['কুমড়া', 'pumpkin'], value: 'কুমড়া' },
    { names: ['ভুট্টা', 'corn', 'maize'], value: 'ভুট্টা' },
    { names: ['সরিষা', 'mustard'], value: 'সরিষা' },
    { names: ['ফুলকপি', 'cauliflower'], value: 'ফুলকপি' },
    { names: ['বাঁধাকপি', 'cabbage'], value: 'বাঁধাকপি' },
  ];

  const promptLower = prompt.toLowerCase();
  for (const crop of crops) {
    for (const name of crop.names) {
      if (promptLower.includes(name) || prompt.includes(name)) {
        return crop.value;
      }
    }
  }
  return null;
};

// প্রসঙ্গ অনুযায়ী উত্তর তৈরি
const generateContextualResponse = (
  weatherData: CompleteWeatherData,
  queryType: string,
  crop: string | null,
  location: string
): { answer: string; sessionId: string; data?: CompleteWeatherData } => {
  const sessionId = `local_${Date.now()}`;
  let answer = '';

  switch (queryType) {
    case 'rain':
      answer = generateRainResponse(weatherData, location);
      break;
    case 'irrigation':
      answer = generateIrrigationResponse(weatherData, location, crop);
      break;
    case 'disease':
      answer = generateDiseaseResponse(weatherData, location, crop);
      break;
    case 'harvest':
      answer = generateHarvestResponse(weatherData, location, crop);
      break;
    case 'planting':
      answer = generatePlantingResponse(weatherData, location, crop);
      break;
    case 'fertilizer':
      answer = generateFertilizerResponse(weatherData, location, crop);
      break;
    case 'temperature':
      answer = generateTemperatureResponse(weatherData, location);
      break;
    case 'tomorrow':
      answer = generateTomorrowResponse(weatherData, location);
      break;
    case 'weekly':
      answer = generateWeeklyResponse(weatherData, location);
      break;
    default:
      answer = generateGeneralWeatherResponse(weatherData, location, crop);
  }

  return { answer, sessionId, data: weatherData };
};

// বৃষ্টি সম্পর্কিত উত্তর
const generateRainResponse = (weatherData: CompleteWeatherData, location: string): string => {
  const hourly = weatherData.ঘণ্টাভিত্তিক;
  const daily = weatherData.দৈনিক;
  
  let answer = `🌧️ **${location}** - বৃষ্টির পূর্বাভাস:\n\n`;
  
  const todayRain = daily[0].বৃষ্টির_সম্ভাবনা;
  if (todayRain > 70) {
    answer += `⚠️ **আজ বৃষ্টি হওয়ার সম্ভাবনা বেশি** (${toBengaliNumber(todayRain)}%)\n`;
  } else if (todayRain > 40) {
    answer += `🌦️ আজ বৃষ্টি হতে পারে (${toBengaliNumber(todayRain)}% সম্ভাবনা)\n`;
  } else {
    answer += `☀️ আজ বৃষ্টির সম্ভাবনা কম (${toBengaliNumber(todayRain)}%)\n`;
  }
  
  const nextRainyHours = hourly.slice(0, 6).filter(h => h.বৃষ্টির_সম্ভাবনা > 50);
  if (nextRainyHours.length > 0) {
    answer += `\n⏰ পরবর্তী ৬ ঘণ্টায় বৃষ্টি হতে পারে:\n`;
    nextRainyHours.forEach(h => {
      answer += `• ${h.সময়}: ${toBengaliNumber(h.বৃষ্টির_সম্ভাবনা)}% সম্ভাবনা\n`;
    });
  }
  
  answer += `\n📅 **আগামী দিনগুলো:**\n`;
  daily.slice(1, 5).forEach(d => {
    const rainIcon = d.বৃষ্টির_সম্ভাবনা > 50 ? '🌧️' : '☀️';
    answer += `${rainIcon} ${d.দিন}: ${d.অবস্থা} (${toBengaliNumber(d.বৃষ্টির_সম্ভাবনা)}%)\n`;
  });
  
  if (todayRain > 60) {
    answer += `\n🌾 **কৃষি পরামর্শ:** বৃষ্টির কারণে আজ সার প্রয়োগ বা কীটনাশক স্প্রে করা উচিত নয়। ফসল কাটা থাকলে দ্রুত সংগ্রহ করুন।`;
  }
  
  return answer;
};

// সেচ সম্পর্কিত উত্তর
const generateIrrigationResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const current = weatherData.বর্তমান;
  const daily = weatherData.দৈনিক;
  const humidity = current.আর্দ্রতা;
  const temp = current.তাপমাত্রা;
  const rainChance = daily[0].বৃষ্টির_সম্ভাবনা;
  
  let answer = `💧 **${location}** - সেচ পরামর্শ${crop ? ` (${crop})` : ''}:\n\n`;
  
  if (rainChance > 60) {
    answer += `❌ **আজ সেচ দেওয়ার দরকার নেই**\n`;
    answer += `• বৃষ্টির সম্ভাবনা: ${toBengaliNumber(rainChance)}%\n`;
    answer += `• প্রাকৃতিক বৃষ্টি থেকে পানি পাবে ফসল\n\n`;
  } else if (humidity > 80) {
    answer += `⚠️ **সেচ কম দিন**\n`;
    answer += `• আর্দ্রতা অনেক বেশি: ${toBengaliNumber(humidity)}%\n`;
    answer += `• অতিরিক্ত পানি ফসলের ক্ষতি করতে পারে\n\n`;
  } else if (temp > 35 && humidity < 50) {
    answer += `✅ **আজ সেচ দেওয়া জরুরি**\n`;
    answer += `• তাপমাত্রা বেশি: ${toBengaliNumber(temp)}°সে\n`;
    answer += `• আর্দ্রতা কম: ${toBengaliNumber(humidity)}%\n`;
    answer += `• সকাল বা বিকেলে সেচ দিন (দুপুরে নয়)\n\n`;
  } else {
    answer += `✅ **সেচ দেওয়া যেতে পারে**\n`;
    answer += `• তাপমাত্রা: ${toBengaliNumber(temp)}°সে\n`;
    answer += `• আর্দ্রতা: ${toBengaliNumber(humidity)}%\n\n`;
  }
  
  if (crop === 'ধান') {
    answer += `🌾 **ধানের জন্য:** ধান ক্ষেতে ২-৩ ইঞ্চি পানি রাখুন। ফুল আসার সময় পানির অভাব হলে ফলন কমবে।`;
  } else if (crop === 'সবজি' || crop === 'টমেটো' || crop === 'বেগুন') {
    answer += `🥬 **সবজির জন্য:** সকালে হালকা সেচ দিন। গোড়ায় পানি জমতে দেবেন না।`;
  } else if (crop === 'আলু') {
    answer += `🥔 **আলুর জন্য:** মাটি ভেজা থাকলে সেচ দেবেন না। অতিরিক্ত পানিতে আলু পচে যায়।`;
  }
  
  answer += `\n\n⏰ **সেচের সেরা সময়:** সকাল ৬-৯টা অথবা বিকেল ৪-৬টা`;
  
  return answer;
};

// রোগ সম্পর্কিত উত্তর
const generateDiseaseResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const current = weatherData.বর্তমান;
  const humidity = current.আর্দ্রতা;
  const temp = current.তাপমাত্রা;
  
  let answer = `🦠 **${location}** - রোগ ও পোকার ঝুঁকি${crop ? ` (${crop})` : ''}:\n\n`;
  
  if (humidity > 80) {
    answer += `⚠️ **উচ্চ ঝুঁকি** - আর্দ্রতা বেশি (${toBengaliNumber(humidity)}%)\n\n`;
    answer += `সম্ভাব্য রোগ:\n`;
    answer += `• 🍄 ব্লাস্ট রোগ (ধানে)\n`;
    answer += `• 🍂 লেট ব্লাইট (আলু/টমেটোতে)\n`;
    answer += `• 🌿 পাতা পোড়া রোগ\n`;
    answer += `• 🪲 জাব পোকার আক্রমণ\n\n`;
    answer += `✅ **প্রতিকার:**\n`;
    answer += `• সকালে পাতা শুকিয়ে গেলে ছত্রাকনাশক স্প্রে করুন\n`;
    answer += `• ক্ষেতে পানি নিষ্কাশনের ব্যবস্থা করুন\n`;
  } else if (temp > 30 && humidity > 60) {
    answer += `⚠️ **মাঝারি ঝুঁকি**\n\n`;
    answer += `সম্ভাব্য সমস্যা:\n`;
    answer += `• 🐛 মাজরা পোকা\n`;
    answer += `• 🦗 পামরি পোকা\n`;
    answer += `• 🍃 পাতা মোড়ানো পোকা\n\n`;
    answer += `✅ নিয়মিত ক্ষেত পর্যবেক্ষণ করুন`;
  } else {
    answer += `✅ **ঝুঁকি কম** - আবহাওয়া অনুকূল\n\n`;
    answer += `তবুও সতর্ক থাকুন এবং নিয়মিত ক্ষেত দেখুন।`;
  }
  
  if (crop === 'ধান') {
    answer += `\n\n🌾 **ধানের জন্য বিশেষ সতর্কতা:**\n`;
    answer += `• ব্লাস্ট দেখা দিলে ট্রাইসাইক্লাজল স্প্রে করুন\n`;
    answer += `• মাজরা পোকা দমনে ফেরোমন ফাঁদ ব্যবহার করুন`;
  }
  
  return answer;
};

// ফসল কাটা সম্পর্কিত উত্তর
const generateHarvestResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const daily = weatherData.দৈনিক;
  const rainNext3Days = daily.slice(0, 3).some(d => d.বৃষ্টির_সম্ভাবনা > 50);
  
  let answer = `🌾 **${location}** - ফসল কাটার পরামর্শ${crop ? ` (${crop})` : ''}:\n\n`;
  
  if (rainNext3Days) {
    answer += `⚠️ **সতর্কতা:** আগামী ৩ দিনে বৃষ্টির সম্ভাবনা আছে!\n\n`;
    answer += `📅 পরবর্তী দিনগুলোর পূর্বাভাস:\n`;
    daily.slice(0, 4).forEach(d => {
      const icon = d.বৃষ্টির_সম্ভাবনা > 50 ? '🌧️' : '☀️';
      answer += `${icon} ${d.দিন}: ${d.অবস্থা} (${toBengaliNumber(d.বৃষ্টির_সম্ভাবনা)}%)\n`;
    });
    answer += `\n✅ **পরামর্শ:**\n`;
    answer += `• বৃষ্টি আসার আগে দ্রুত ফসল কাটুন\n`;
    answer += `• কাটা ফসল শুকনো জায়গায় সংরক্ষণ করুন\n`;
    answer += `• প্লাস্টিক শীট দিয়ে ঢেকে রাখুন\n`;
  } else {
    answer += `✅ **ফসল কাটার জন্য আবহাওয়া উপযুক্ত!**\n\n`;
    answer += `• আগামী কয়েক দিন রোদ থাকবে\n`;
    answer += `• ফসল শুকানোর জন্য ভালো সময়\n\n`;
    answer += `⏰ **সেরা সময়:** সকাল ৮-১১টা (শিশির শুকিয়ে গেলে)`;
  }
  
  return answer;
};

// চারা রোপণ সম্পর্কিত উত্তর
const generatePlantingResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const current = weatherData.বর্তমান;
  const daily = weatherData.দৈনিক;
  const temp = current.তাপমাত্রা;
  const humidity = current.আর্দ্রতা;
  const rainTomorrow = daily[1].বৃষ্টির_সম্ভাবনা;
  
  let answer = `🌱 **${location}** - রোপণ পরামর্শ${crop ? ` (${crop})` : ''}:\n\n`;
  
  if (temp >= 20 && temp <= 32 && humidity >= 50 && humidity <= 85) {
    answer += `✅ **রোপণের জন্য আবহাওয়া ভালো!**\n\n`;
    answer += `• তাপমাত্রা: ${toBengaliNumber(temp)}°সে (উপযুক্ত)\n`;
    answer += `• আর্দ্রতা: ${toBengaliNumber(humidity)}% (উপযুক্ত)\n`;
  } else if (temp > 35) {
    answer += `⚠️ **অতিরিক্ত গরম** - রোপণ সাবধানে করুন\n\n`;
    answer += `• বিকেলে রোপণ করুন\n`;
    answer += `• রোপণের পর ভালো করে সেচ দিন\n`;
    answer += `• ছায়া দেওয়ার ব্যবস্থা করুন\n`;
  } else if (temp < 15) {
    answer += `⚠️ **ঠান্ডা আবহাওয়া** - গ্রীষ্মকালীন ফসল রোপণ করবেন না\n\n`;
    answer += `• শীতকালীন সবজি লাগাতে পারেন\n`;
  }
  
  if (rainTomorrow > 60) {
    answer += `\n💡 **টিপ:** আগামীকাল বৃষ্টির সম্ভাবনা ${toBengaliNumber(rainTomorrow)}%। আজ রোপণ করলে প্রাকৃতিক পানি পাবে!`;
  }
  
  if (crop === 'ধান') {
    answer += `\n\n🌾 **ধান রোপণ:**\n`;
    answer += `• ২৫-৩০ দিনের চারা রোপণ করুন\n`;
    answer += `• সারি থেকে সারি ২০ সেমি রাখুন\n`;
    answer += `• গোড়া ২-৩ সেমি মাটিতে পুঁতুন`;
  } else if (crop === 'টমেটো') {
    answer += `\n\n🍅 **টমেটো রোপণ:**\n`;
    answer += `• বিকেলে রোপণ করুন\n`;
    answer += `• চারায় চারায় ৬০ সেমি দূরত্ব রাখুন\n`;
    answer += `• রোপণের পর হালকা সেচ দিন`;
  }
  
  return answer;
};

// সার প্রয়োগ সম্পর্কিত উত্তর
const generateFertilizerResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const daily = weatherData.দৈনিক;
  const rainToday = daily[0].বৃষ্টির_সম্ভাবনা;
  
  let answer = `🌿 **${location}** - সার প্রয়োগ পরামর্শ${crop ? ` (${crop})` : ''}:\n\n`;
  
  if (rainToday > 60) {
    answer += `❌ **আজ সার দেবেন না!**\n\n`;
    answer += `• বৃষ্টির সম্ভাবনা ${toBengaliNumber(rainToday)}%\n`;
    answer += `• বৃষ্টিতে সার ধুয়ে যাবে\n`;
    answer += `• টাকা ও সার দুটোই নষ্ট হবে\n\n`;
    
    const goodDay = daily.find(d => d.বৃষ্টির_সম্ভাবনা < 40);
    if (goodDay) {
      answer += `✅ **সার দেওয়ার ভালো দিন:** ${goodDay.দিন} (${goodDay.তারিখ})`;
    }
  } else {
    answer += `✅ **সার দেওয়ার জন্য আবহাওয়া ভালো!**\n\n`;
    answer += `• বৃষ্টির সম্ভাবনা কম\n`;
    answer += `• মাটি হালকা ভেজা থাকলে ভালো\n\n`;
    answer += `⏰ **সার দেওয়ার সেরা সময়:** সকাল ৭-১০টা`;
  }
  
  answer += `\n\n💡 **টিপস:**\n`;
  answer += `• ইউরিয়া সার বিকেলে দিলে ভালো\n`;
  answer += `• সার দেওয়ার পর হালকা সেচ দিন\n`;
  answer += `• TSP ও MOP সার এক সাথে দেবেন না`;
  
  return answer;
};

// তাপমাত্রা সম্পর্কিত উত্তর
const generateTemperatureResponse = (weatherData: CompleteWeatherData, location: string): string => {
  const current = weatherData.বর্তমান;
  const daily = weatherData.দৈনিক;
  const temp = current.তাপমাত্রা;
  const feelsLike = current.অনুভূতিমূলক_তাপমাত্রা;
  
  let answer = `🌡️ **${location}** - তাপমাত্রা:\n\n`;
  answer += `এখন: **${toBengaliNumber(temp)}°সে** (অনুভূত ${toBengaliNumber(feelsLike)}°সে)\n`;
  answer += `অবস্থা: ${current.অবস্থা}\n\n`;
  
  answer += `📅 **তাপমাত্রার পূর্বাভাস:**\n`;
  daily.slice(0, 5).forEach(d => {
    answer += `• ${d.দিন}: ${toBengaliNumber(d.সর্বোচ্চ_তাপমাত্রা)}° / ${toBengaliNumber(d.সর্বনিম্ন_তাপমাত্রা)}°\n`;
  });
  
  if (temp > 35) {
    answer += `\n⚠️ **কৃষি সতর্কতা:**\n`;
    answer += `• গরমে ফসলে স্ট্রেস হতে পারে\n`;
    answer += `• সকাল-বিকেলে সেচ দিন\n`;
    answer += `• চারা রোপণ বিকেলে করুন`;
  } else if (temp < 15) {
    answer += `\n❄️ **শীত সতর্কতা:**\n`;
    answer += `• চারা ঢেকে রাখুন\n`;
    answer += `• সকালে সেচ দেবেন না\n`;
    answer += `• শীতকালীন সবজি লাগান`;
  }
  
  return answer;
};

// আগামীকালের পূর্বাভাস
const generateTomorrowResponse = (weatherData: CompleteWeatherData, location: string): string => {
  const tomorrow = weatherData.দৈনিক[1];
  
  let answer = `📅 **${location}** - আগামীকালের আবহাওয়া:\n\n`;
  answer += `${tomorrow.আইকন} ${tomorrow.অবস্থা}\n\n`;
  answer += `🌡️ তাপমাত্রা: ${toBengaliNumber(tomorrow.সর্বোচ্চ_তাপমাত্রা)}° / ${toBengaliNumber(tomorrow.সর্বনিম্ন_তাপমাত্রা)}°\n`;
  answer += `💧 বৃষ্টির সম্ভাবনা: ${toBengaliNumber(tomorrow.বৃষ্টির_সম্ভাবনা)}%\n`;
  answer += `💨 বাতাস: ${toBengaliNumber(tomorrow.বাতাসের_গতি || 0)} কিমি/ঘ\n`;
  
  answer += `\n🌾 **কৃষি পরামর্শ:**\n`;
  if (tomorrow.বৃষ্টির_সম্ভাবনা > 60) {
    answer += `• ফসল কাটা থাকলে আজই সংগ্রহ করুন\n`;
    answer += `• সার বা কীটনাশক স্প্রে করবেন না\n`;
  } else {
    answer += `• ফসলে কাজ করার জন্য ভালো দিন\n`;
    answer += `• সার প্রয়োগ করতে পারেন\n`;
  }
  
  return answer;
};

// সাপ্তাহিক পূর্বাভাস
const generateWeeklyResponse = (weatherData: CompleteWeatherData, location: string): string => {
  const daily = weatherData.দৈনিক;
  
  let answer = `📅 **${location}** - ৭ দিনের পূর্বাভাস:\n\n`;
  
  daily.forEach(d => {
    const rainIcon = d.বৃষ্টির_সম্ভাবনা > 50 ? '🌧️' : '';
    answer += `${d.আইকন} **${d.দিন}** (${d.তারিখ})\n`;
    answer += `   ${toBengaliNumber(d.সর্বোচ্চ_তাপমাত্রা)}°/${toBengaliNumber(d.সর্বনিম্ন_তাপমাত্রা)}° | ${d.অবস্থা} ${rainIcon}\n\n`;
  });
  
  const rainyDays = daily.filter(d => d.বৃষ্টির_সম্ভাবনা > 50).length;
  if (rainyDays > 3) {
    answer += `⚠️ এই সপ্তাহে ${toBengaliNumber(rainyDays)} দিন বৃষ্টির সম্ভাবনা। ফসল কাটা ও শুকানোর পরিকল্পনা করুন।`;
  }
  
  return answer;
};

// সাধারণ আবহাওয়া উত্তর
const generateGeneralWeatherResponse = (weatherData: CompleteWeatherData, location: string, crop: string | null): string => {
  const current = weatherData.বর্তমান;
  const tomorrow = weatherData.দৈনিক[1];
  
  let answer = `🌤️ **${location}** এর আবহাওয়া:\n\n`;
  answer += `${current.আইকন} **এখন:** ${current.অবস্থা}\n`;
  answer += `🌡️ তাপমাত্রা: ${toBengaliNumber(current.তাপমাত্রা)}°সে (অনুভূত ${toBengaliNumber(current.অনুভূতিমূলক_তাপমাত্রা)}°সে)\n`;
  answer += `💧 আর্দ্রতা: ${toBengaliNumber(current.আর্দ্রতা)}%\n`;
  answer += `💨 বাতাস: ${toBengaliNumber(current.বাতাসের_গতি)} কিমি/ঘ ${current.বাতাসের_দিক}\n`;
  answer += `👁️ দৃশ্যমানতা: ${toBengaliNumber(current.দৃশ্যমানতা)} কিমি\n\n`;
  
  answer += `📅 **আগামীকাল:** ${tomorrow.অবস্থা}, ${toBengaliNumber(tomorrow.সর্বোচ্চ_তাপমাত্রা)}°/${toBengaliNumber(tomorrow.সর্বনিম্ন_তাপমাত্রা)}°`;
  if (tomorrow.বৃষ্টির_সম্ভাবনা > 30) {
    answer += ` 🌧️ বৃষ্টি ${toBengaliNumber(tomorrow.বৃষ্টির_সম্ভাবনা)}%`;
  }
  
  // কৃষি পরামর্শ তৈরি
  answer += `\n\n🌾 **কৃষি পরামর্শ:**\n`;
  const temp = current.তাপমাত্রা;
  const humidity = current.আর্দ্রতা;
  const rainChance = weatherData.দৈনিক[0].বৃষ্টির_সম্ভাবনা;
  
  if (rainChance > 60) {
    answer += `• 🌧️ বৃষ্টির সম্ভাবনা বেশি - সার ও কীটনাশক স্প্রে এড়িয়ে চলুন\n`;
  }
  if (temp > 35) {
    answer += `• 🌡️ অতিরিক্ত গরম - সকাল/বিকেলে সেচ দিন\n`;
  }
  if (humidity > 80) {
    answer += `• 💧 আর্দ্রতা বেশি - রোগ-বালাইয়ের দিকে নজর রাখুন\n`;
  }
  if (rainChance < 30 && temp > 30) {
    answer += `• ☀️ রোদ ভালো - ফসল শুকানোর উপযুক্ত সময়\n`;
  }
  
  // ফসল ভিত্তিক পরামর্শ
  if (crop) {
    answer += `\n🌱 **${crop} এর জন্য:**\n`;
    const cropAdvice = getLocalCropAdvice(crop, temp, humidity, rainChance);
    cropAdvice.forEach(a => {
      answer += `${a}\n`;
    });
  }
  
  return answer;
};

// ফসল ভিত্তিক পরামর্শ তৈরি
const getLocalCropAdvice = (crop: string, temp: number, humidity: number, rainChance: number): string[] => {
  const advice: string[] = [];
  
  switch (crop) {
    case 'ধান':
      if (humidity > 80) advice.push('• ব্লাস্ট রোগের ঝুঁকি - নজর রাখুন');
      if (temp > 35) advice.push('• গরমে পানি বেশি লাগবে');
      if (rainChance < 30) advice.push('• সেচ দেওয়া দরকার হতে পারে');
      break;
    case 'টমেটো':
    case 'বেগুন':
      if (humidity > 75) advice.push('• ছত্রাক রোগের ঝুঁকি আছে');
      if (temp > 32) advice.push('• বিকেলে সেচ দিন');
      break;
    case 'আলু':
      if (humidity > 80) advice.push('• লেট ব্লাইটের ঝুঁকি - সতর্ক থাকুন');
      if (rainChance > 60) advice.push('• পানি নিষ্কাশনের ব্যবস্থা করুন');
      break;
    case 'সবজি':
      if (temp > 35) advice.push('• ছায়া দেওয়ার ব্যবস্থা করুন');
      if (humidity < 50) advice.push('• নিয়মিত হালকা সেচ দিন');
      break;
    default:
      advice.push('• নিয়মিত ক্ষেত পর্যবেক্ষণ করুন');
      advice.push('• আবহাওয়া অনুযায়ী সেচ দিন');
  }
  
  if (advice.length === 0) {
    advice.push('• বর্তমান আবহাওয়া চাষের জন্য উপযুক্ত');
  }
  
  return advice;
};

// সাধারণ উত্তর (অবস্থান ছাড়া)
const generateGeneralResponse = (queryType: string): { answer: string; sessionId: string } => {
  const sessionId = `local_${Date.now()}`;
  let answer = '';
  
  switch (queryType) {
    case 'rain':
      answer = '🌧️ বৃষ্টির পূর্বাভাস জানতে আপনার জেলার নাম বলুন।\n\nযেমন: "ঢাকায় কি বৃষ্টি হবে?" বা "বগুড়ায় বৃষ্টির সম্ভাবনা কত?"';
      break;
    case 'irrigation':
      answer = '💧 সেচ পরামর্শের জন্য আপনার জেলার নাম বলুন।\n\nযেমন: "রাজশাহীতে সেচ দেওয়া উচিত?" বা "খুলনায় ধানে সেচ দেব কি?"';
      break;
    case 'disease':
      answer = '🦠 রোগ-বালাই সম্পর্কে জানতে জেলার নাম বলুন।\n\nযেমন: "চট্টগ্রামে ধানে কি রোগ হতে পারে?"';
      break;
    case 'harvest':
      answer = '🌾 ফসল কাটার সময় জানতে জেলার নাম বলুন।\n\nযেমন: "রংপুরে ফসল কাটার আবহাওয়া কেমন?"';
      break;
    case 'planting':
      answer = '🌱 রোপণ পরামর্শের জন্য জেলার নাম বলুন।\n\nযেমন: "ময়মনসিংহে টমেটো লাগানোর সময় কি?"';
      break;
    default:
      answer = `👋 আসসালামু আলাইকুম! আমি আপনার **কৃষি আবহাওয়া সহায়ক**।

আমাকে জিজ্ঞেস করতে পারেন:
• 🌤️ "ঢাকার আবহাওয়া কেমন?"
• 🌧️ "আগামীকাল কি বৃষ্টি হবে?"
• 💧 "সেচ দেওয়া উচিত কি?"
• 🌾 "ধান চাষে কি সমস্যা হবে?"
• 🦠 "রোগ-বালাইয়ের ঝুঁকি আছে?"
• 🌱 "চারা লাগানোর সময় কি?"

আপনার জেলার নাম বলুন, আমি সেখানের আবহাওয়া ও কৃষি পরামর্শ দেব! 🌾`;
  }
  
  return { answer, sessionId };
};
