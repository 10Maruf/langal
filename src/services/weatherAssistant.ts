/**
 * স্মার্ট কৃষি আবহাওয়া সহায়ক - Powered by Groq AI (Llama 3.3 70B)
 */

import {
  fetchWeatherOneCall,
  processWeatherData,
  bangladeshDistricts,
  CompleteWeatherData
} from './weatherService';

// Environment variable for Groq API Key
// Ensure VITE_GROQ_API_KEY_2 is strict in .env.local
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY_2;

export interface WeatherAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: CompleteWeatherData;
}

// Cached weather data for session to maintain context
let cachedWeatherData: CompleteWeatherData | null = null;
let cachedLocation: string | null = null;

// Weather Assistant সেশন শুরু করা
export const startWeatherAssistantSession = async (
  prompt: string,
  userLocation?: string,
  preFetchedData?: CompleteWeatherData | null
): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  return generateSmartWeatherResponse(prompt, userLocation, preFetchedData);
};

// Weather Assistant সেশন চালিয়ে যাওয়া
export const continueWeatherAssistantSession = async (
  _sessionId: string, 
  prompt: string,
  userLocation?: string,
  preFetchedData?: CompleteWeatherData | null
): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  return generateSmartWeatherResponse(prompt, userLocation, preFetchedData);
};

// স্মার্ট আবহাওয়া উত্তর তৈরি (Groq AI ইন্টিগ্রেশন)
const generateSmartWeatherResponse = async (
  prompt: string, 
  userLocation?: string,
  preFetchedData?: CompleteWeatherData | null
): Promise<{
  answer: string;
  sessionId: string;
  data?: CompleteWeatherData;
}> => {
  const promptLower = prompt.toLowerCase();
  const sessionId = `groq_${Date.now()}`;

  // ০. যদি প্রি-ফেচড ডেটা দেওয়া থাকে (Realtime from UI)
  if (preFetchedData) {
      cachedWeatherData = preFetchedData;
      cachedLocation = preFetchedData.অবস্থান;
      const answer = await callGroqWeatherAI(prompt, preFetchedData, preFetchedData.অবস্থান);
      return { answer, sessionId, data: preFetchedData };
  }
  
  // ১. অবস্থান খোঁজা (Text Search in Bangla/English Districts)
  let locationFound: { bn: string; lat: number; lon: number } | null = null;
  
  // চেক করুন প্রম্পটে কোনো জেলার নাম আছে কিনা
  for (const [key, district] of Object.entries(bangladeshDistricts)) {
    if (promptLower.includes(key) || prompt.includes(district.bn)) {
      locationFound = district;
      break;
    }
  }

  // যদি টেক্সটে না থাকে কিন্তু ইউজারের লোকেশন দেওয়া থাকে (Realtime GPS)
  if (!locationFound && userLocation) {
     // userLocation এর সাথে বাংলা/ইংরেজি ম্যাচ করানোর চেষ্টা
     // userLocation হতে পারে "Dhaka" বা "ঢাকা"
     const userLocLower = userLocation.toLowerCase();
     for (const [key, district] of Object.entries(bangladeshDistricts)) {
        if (userLocLower.includes(key) || userLocation.includes(district.bn)) {
          locationFound = district;
          break;
        }
      }
  }

  // ২. নতুন অবস্থান পাওয়া গেলে ডেটা ফেচ করুন
  if (locationFound) {
    try {
      const rawData = await fetchWeatherOneCall(locationFound.lat, locationFound.lon);
      const weatherData = processWeatherData(rawData, locationFound.bn);
      
      // Cache আপডেট
      cachedWeatherData = weatherData;
      cachedLocation = locationFound.bn;
      
      // AI কে কল করুন (Context: New Weather Data)
      const answer = await callGroqWeatherAI(prompt, weatherData, locationFound.bn);
      return { answer, sessionId, data: weatherData };

    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to AI without data if fetch fails, but warn user
      const answer = await callGroqWeatherAI(prompt + " (Note: Weather data fetch failed for this location)", null, locationFound.bn);
      return { answer, sessionId };
    }
  }

  // ৩. যদি আগের কোনো ডেটা থাকে (Context Retention)
  if (cachedWeatherData && cachedLocation) {
    // AI কে কল করুন (Context: Cached Weather Data)
    const answer = await callGroqWeatherAI(prompt, cachedWeatherData, cachedLocation);
    return { answer, sessionId, data: cachedWeatherData };
  }

  // ৪. কোনো ডেটা নেই => সাধারণ AI কথোপকথন
  // AI কে বলুন যে তার কাছে কোনো আবহাওয়া তথ্য নেই, সে যেন ব্যবহারকারীর কাছে জানতে চায়
  const answer = await callGroqWeatherAI(prompt, null, null);
  return { answer, sessionId };
};


// Groq API কল করার ফাংশন
async function callGroqWeatherAI(
    userPrompt: string, 
    weatherData: CompleteWeatherData | null, 
    location: string | null
): Promise<string> {
    if (!GROQ_API_KEY) {
        return "⚠️ সিস্টেম কনফিগারেশন ত্রুটি: Groq API Key পাওয়া যায়নি। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।";
    }

    // Weather Data কে সুন্দর টেক্সট সামারিতে রূপান্তর
    let weatherContext = "";
    if (weatherData && location) {
        const current = weatherData.বর্তমান;
        const daily = weatherData.দৈনিক;
        
        weatherContext = `
        **বাস্তব আবহাওয়া তথ্য (Real-time Context):**
        - স্থান: ${location}
        - বর্তমান অবস্থা: ${current.অবস্থা}
        - তাপমাত্রা: ${current.তাপমাত্রা}°C (অনুভূত: ${current.অনুভূতিমূলক_তাপমাত্রা}°C)
        - বাতাসের আর্দ্রতা: ${current.আর্দ্রতা}%
        - বাতাসের গতি: ${current.বাতাসের_গতি} km/h (${current.বাতাসের_দিক})
        - দৃশ্যমানতা: ${current.দৃশ্যমানতা} km
        - অতিবেগুনী সূচক (UV): ${current.UV_সূচক}

        **পূর্বাভাস (Forecast):**
        - আজ (${daily[0].দিন}): সর্বোচ্চ ${daily[0].সর্বোচ্চ_তাপমাত্রা}° / সর্বনিম্ন ${daily[0].সর্বনিম্ন_তাপমাত্রা}°, বৃষ্টি: ${daily[0].বৃষ্টির_সম্ভাবনা}%, অবস্থা: ${daily[0].অবস্থা}
        - আগামীকাল (${daily[1].দিন}): সর্বোচ্চ ${daily[1].সর্বোচ্চ_তাপমাত্রা}° / সর্বনিম্ন ${daily[1].সর্বনিম্ন_তাপমাত্রা}°, বৃষ্টি: ${daily[1].বৃষ্টির_সম্ভাবনা}%, অবস্থা: ${daily[1].অবস্থা}
        - পরশু (${daily[2].দিন}): সর্বোচ্চ ${daily[2].সর্বোচ্চ_তাপমাত্রা}° / সর্বনিম্ন ${daily[2].সর্বনিম্ন_তাপমাত্রা}°, বৃষ্টি: ${daily[2].বৃষ্টির_সম্ভাবনা}%, অবস্থা: ${daily[2].অবস্থা}
        `;
    }

    // System Prompt ডিজাইন (Llama 3.3 এর জন্য অপ্টিমাইজড)
    const systemPrompt = `
    ভূমিকা: আপনি 'লাঙ্গল কৃষি সহায়ক'-এর একজন অত্যন্ত অভিজ্ঞ ও সহানুভূতিশীল কৃষি বিশেষজ্ঞ। আপনি কৃষকদের "কৃষি বন্ধু" হিসেবে কথা বলেন। আপনার লক্ষ্য হলো শুধুমাত্র আবহাওয়া জানানো নয়, বরং সেই আবহাওয়া কীভাবে তাদের ফসলের উপর প্রভাব ফেলবে তা সহজ ও প্রাণবন্ত ভাষায় বুঝিয়ে বলা।

    ${weatherContext ? `উপলব্ধ তথ্য:\n${weatherContext}\n(এই তথ্যের ভিত্তিতেই উত্তর দিন। নিজের থেকে আবহাওয়া বানাবেন না।)` : 'উপলব্ধ তথ্য: আপনার কাছে বর্তমানে কোনো নির্দিষ্ট স্থানের আবহাওয়া তথ্য নেই। ব্যবহারকারীকে তার জেলা বা উপজেলার নাম বলতে বলুন।'}

    নির্দেশনা:
    ১. **Tone & Style (কণ্ঠস্বর ও শৈলী):**
       - অত্যন্ত পেশাদার কিন্তু যান্ত্রিক (Robotic) নয়। একজন অভিজ্ঞ কৃষি কর্মকর্তা যেমন কৃষকের সাথে আন্তরিকভাবে কথা বলেন, তেমনভাবে কথা বলুন।
       - বাক্য গঠন হবে সাবলীল, প্রাণবন্ত এবং উৎসাহব্যঞ্জক।
       - শুরুতে সুন্দর সম্ভাষণ (যেমন: "ধন্যবাদ প্রশ্ন করার জন্য", "চমৎকার প্রশ্ন!") এবং শেষে শুভকামনা জানান।

    ২. **কৃষি পরামর্শ (Actionable Advice):**
       - আবহাওয়া তথ্যের সাথে সাথে **"এখন কী করণীয়"** তা স্পষ্টভাবে বলুন।
       - বৃষ্টির সম্ভাবনা থাকলে: "সার বা কীটনাশক প্রয়োগ থেকে বিরত থাকুন" বা "জমির ড্রেনেজ ব্যবস্থা চেক করুন"।
       - রৌদ্রোজ্জ্বল হলে: "ফসল শুকানোর জন্য উপযুক্ত সময়" বা "সেচ দেয়ার প্রয়োজন হতে পারে"।
       - কোনো সতর্কবার্তা থাকলে তা গুরুত্বের সাথে কিন্তু আতঙ্কিত না করে জানান।

    ৩. **বিন্যাস (Formatting):**
       - লম্বা প্যারাগ্রাফ পরিহার করুন।
       - পরামর্শগুলো পয়েন্ট বা বুলেট আকারে দিন যাতে সহজে পড়া যায়।
       - গুরুত্বপূর্ণ শব্দগুলো **বোল্ড** করুন।

    ৪. নির্দিষ্ট কোনো ফসল (ধান, গম, সবজি) নিয়ে প্রশ্ন করলে সেই ফসলের বর্তমান অবস্থা বিবেচনা করে আবহাওয়া-ভিত্তিক পরামর্শ দিন।

    উদাহরণ উত্তর শৈলী:
    "আজকের আবহাওয়া ধান চাষের জন্য বেশ ভালো। তবে আগামী দুদিন বৃষ্টির সম্ভাবনা থাকায় এখন সার না দেয়াই বুদ্ধিমানের কাজ হবে। বরং জমির আইলগুলো একটু দেখে রাখুন।"

    গুরুত্বপূর্ণ: যদি আবহাওয়া তথ্য না থাকে, তবে বিনয়ের সাথে স্থান বা জেলার নাম জানতে চান। ভুল তথ্য দেবেন না।
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // ব্যবহারকারীর জন্য সেরা মডেল (Fast & Accurate Reasoning)
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.5, // Balanced creativity and accuracy
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Groq API Error Details:", errorData);
            return "দুঃখিত, আমার সার্ভারে একটি যান্ত্রিক ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "দুঃখিত, আমি এই মুহূর্তে উত্তরটি তৈরি করতে পারিনি।";

    } catch (error) {
        console.error("Network/Groq Error:", error);
        return "ইন্টারনেট সংযোগ বা সার্ভার সমস্যার কারণে উত্তর দেওয়া যাচ্ছে না।";
    }
}
