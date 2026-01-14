/*
  diagnosisService.ts
  Gemini-powered crop disease diagnosis from symptoms + optional image.
  Supports fallback to secondary Gemini key and Groq API.
  Frontend-only demo (API key exposed). For production, route via backend.
*/

import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";

export interface Chemical {
  name: string;
  dosePerAcre: number;
  unit: string; // কেজি / লিটার / গ্রাম / মিলি
  pricePerUnit: number;
  note?: string;
  type: string; // fungicide | bactericide | insecticide | virucide | fertilizer
}

export interface Disease {
  name: string;
  probability: number;
  treatment: string;
  cost: number;
  type?: string;
  guideline?: string[];
  chemicals?: Chemical[];
  videos?: string[];
}

interface DiagnoseParams {
  crop: string;
  symptoms: string;
  imageFile?: File | null;
  diseaseTypeHint?: string; // optional extra hint
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const API_KEY_FALLBACK = import.meta.env.VITE_GEMINI_API_KEY_FALLBACK as string | undefined;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

// Debug: Log which keys are available
console.log("API Keys Status:", {
  primaryGemini: API_KEY ? "✓ Available" : "✗ Missing",
  fallbackGemini: API_KEY_FALLBACK ? "✓ Available" : "✗ Missing",
  groq: GROQ_API_KEY ? "✓ Available" : "✗ Missing"
});

if (!API_KEY && !API_KEY_FALLBACK && !GROQ_API_KEY) {
  console.warn("No API keys configured. Add VITE_GEMINI_API_KEY, VITE_GEMINI_API_KEY_FALLBACK, or VITE_GROQ_API_KEY to .env.local");
}

// Instantiate Gemini client lazily to avoid errors if key missing.
const getClient = (key: string) => new GoogleGenerativeAI(key);

// Helper: Process and compress image for API (ensure < 4MB base64)
async function processImageForApi(file: File): Promise<{ base64: string, mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large (restrict to 2048px max dimension)
        const MAX_DIMENSION = 2048; 
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to ensure size is under limit
        // Groq limit is ~4MB base64. 3MB * 1.33 = 4MB. Target 2.5MB to be safe.
        const MAX_SIZE_BYTES = 2.5 * 1024 * 1024; 
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > MAX_SIZE_BYTES && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const parts = dataUrl.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ base64: parts[1], mimeType });
      };
      img.onerror = (e) => reject(new Error("Failed to load image for processing"));
      img.src = event.target?.result as string;
    };
    reader.onerror = (e) => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Prompt builder - Bangla output instructions with strict JSON schema.
function buildPrompt({ crop, symptoms, diseaseTypeHint }: DiagnoseParams): string {
  return `আপনি একজন কৃষি রোগ বিশেষজ্ঞ AI সহকারী। প্রদত্ত ফসল এবং লক্ষণের ভিত্তিতে ১ থেকে ৩টি সম্ভাব্য রোগের JSON অ্যারে দিন।\n\nনির্দেশনা:\n- আউটপুট শুধুমাত্র একটি বৈধ JSON অ্যারে হবে, কোনো অতিরিক্ত টেক্সট বা ব্যাখ্যা নয়।\n- প্রতিটি অবজেক্টের স্কিমা: {\n  name: string (রোগের নাম বাংলায়),\n  probability: number (0-100 পূর্ণসংখ্যা),\n  treatment: string (বাংলায় সংক্ষেপ চিকিৎসা),\n  cost: number (প্রতি একর আনুমানিক প্রাথমিক চিকিৎসা খরচ),\n  type: string (যেমন: ছত্রাক রোগ / ব্যাকটেরিয়া রোগ / ভাইরাস রোগ / পোকার আক্রমণ),\n  guideline: string[] (বাংলায় বুলেট পরামর্শ),\n  chemicals: [ { \n    name: string (বাণিজ্যিক ঔষধ বা কীটনাশকের নাম),\n    dosePerAcre: number (প্রতি একরে কতটুকু লাগবে, সংখ্যায়),\n    unit: string (কেজি|লিটার|গ্রাম|মিলি),\n    pricePerUnit: number (প্রতি এককের আনুমানিক বাজার মূল্য, টাকায়),\n    note: string (ব্যবহার বিধি),\n    type: string (fungicide|insecticide|fertilizer|bactericide|other)\n  } ],\n  videos: string[] (বিশ্বস্ত ইউটিউব/নির্দেশনা লিঙ্ক)\n}\n- যদি সমস্যাটি পোকার আক্রমণ বা মাকড়সা জনিত হয়, তবে অবশ্যই উপযুক্ত কীটনাশক (Insecticide/Miticide) এর নাম উল্লেখ করবেন।\n- chemicals এর dosePerAcre এবং pricePerUnit অত্যন্ত সতর্কতার সাথে দিবেন।\n- cost = chemicals এর মোট খরচ।\n\nইনপুট:\nফসল: ${crop}\nলক্ষণ: ${symptoms}\n${diseaseTypeHint ? `রোগের ধরন ইঙ্গিত: ${diseaseTypeHint}\n` : ""}\n\nআউটপুট: শুধুমাত্র JSON অ্যারে।`;
}

// Fallback JSON extraction when model returns surrounding text.
function extractJsonArray(raw: string): string | null {
  // Try direct parse first
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return trimmed;
  // Regex to capture first JSON array
  const match = raw.match(/\[\s*{[\s\S]*}\s*\]/);
  return match ? match[0] : null;
}

// Groq API call function with vision support
async function callGroqAPI(prompt: string, imageFile?: File | null): Promise<string> {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");
  
  const messages: any[] = [];
  
  // Build message content with text and optional image
  const content: any[] = [{ type: "text", text: prompt }];
  
  if (imageFile) {
    // Groq requires proper base64 encoding without data URL prefix in some cases
    // Let's try with proper data URL format
    const { base64, mimeType } = await processImageForApi(imageFile);
    
    // Groq expects: data:image/jpeg;base64,<base64_string>
    const imageUrl = `data:${mimeType};base64,${base64}`;
    
    content.push({
      type: "image_url",
      image_url: {
        url: imageUrl
      }
    });
  }
  
  messages.push({
    role: "user",
    content: content
  });

  const requestBody = {
    model: imageFile 
      ? "meta-llama/llama-4-scout-17b-16e-instruct" // Llama 4 Scout vision model (replacement for deprecated llama-3.2 vision models)
      : "llama-3.3-70b-versatile",
    messages: messages,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1
  };

  console.log("Groq request:", { model: requestBody.model, hasImage: !!imageFile });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API error details:", errorText);
    throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Types for multimodal parts to avoid 'any'
type ContentPart = { text: string } | { inlineData: { mimeType: string; data: string } };

function sanitizeDisease(d: unknown): Disease | null {
  if (!d || typeof d !== "object") return null;
  const r = d as Record<string, unknown>;
  const probabilityNum = Math.min(100, Math.max(0, Math.round(Number(r.probability) || 0)));
  const chemicalsArr = Array.isArray(r.chemicals) ? (r.chemicals as unknown[]) : undefined;
  const chemicals: Chemical[] | undefined = chemicalsArr
    ? chemicalsArr.map((c): Chemical => {
        const rc = (c || {}) as Record<string, unknown>;
        const dose = Number(rc.dosePerAcre);
        const price = Number(rc.pricePerUnit);
        return {
          name: String(rc.name ?? ""),
          dosePerAcre: isNaN(dose) ? 0 : dose,
          unit: String(rc.unit ?? "কেজি"),
          pricePerUnit: isNaN(price) ? 0 : price,
          note: rc.note ? String(rc.note) : undefined,
          type: String(rc.type ?? "fungicide"),
        };
      })
    : undefined;

  // Derive cost if missing
  let cost = Number((r as Record<string, unknown>).cost);
  if (isNaN(cost) || cost <= 0) {
    if (chemicals && chemicals.length) {
      const sum = chemicals.reduce((acc, c) => acc + c.dosePerAcre * c.pricePerUnit, 0);
      cost = Math.round(sum);
    } else {
      cost = 0;
    }
  }

  const guidelineArr = Array.isArray(r.guideline) ? (r.guideline as unknown[]) : undefined;
  const videosArr = Array.isArray(r.videos) ? (r.videos as unknown[]) : undefined;

  return {
    name: String(r.name ?? "অজানা"),
    probability: probabilityNum,
    treatment: String(r.treatment ?? "পর্যবেক্ষণ চালিয়ে যান"),
    cost,
    type: r.type ? String(r.type) : undefined,
    guideline: guidelineArr ? guidelineArr.map((g) => String(g)) : undefined,
    chemicals,
    videos: videosArr ? videosArr.filter((v): v is string => typeof v === "string") : undefined,
  };
}

export async function diagnose(params: DiagnoseParams): Promise<Disease[]> {
  const { crop, symptoms, imageFile } = params;
  if (!API_KEY && !API_KEY_FALLBACK && !GROQ_API_KEY) {
    throw new Error("কোন API key কনফিগার করা নেই");
  }
  if (!crop || (!symptoms && !imageFile)) throw new Error("ফসল ও লক্ষণ/ছবি প্রয়োজন");

  const prompt = buildPrompt(params);
  let raw: string = "";
  let apiUsed = "";
  const errors: string[] = [];

  // Try primary Gemini API key first
  if (API_KEY) {
    try {
      console.log("Trying Primary Gemini API...");
      const result = await tryGeminiAPI(API_KEY, prompt, imageFile);
      if (result) {
        raw = result.response.text();
        apiUsed = "Gemini (Primary)";
        console.log("✓ Primary Gemini API successful");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("✗ Primary Gemini API failed:", msg);
      errors.push(`Primary Gemini: ${msg}`);
    }
  }

  // Try fallback Gemini API key
  if (!raw && API_KEY_FALLBACK) {
    try {
      console.log("Trying Fallback Gemini API...");
      const result = await tryGeminiAPI(API_KEY_FALLBACK, prompt, imageFile);
      if (result) {
        raw = result.response.text();
        apiUsed = "Gemini (Fallback)";
        console.log("✓ Fallback Gemini API successful");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("✗ Fallback Gemini API failed:", msg);
      errors.push(`Fallback Gemini: ${msg}`);
    }
  }

  // Try Groq API as final fallback (supports both text and images with vision model)
  if (!raw && GROQ_API_KEY) {
    try {
      console.log(imageFile 
        ? "Trying Groq API with Vision Model (Llama 4 Scout)..."
        : "Trying Groq API (Llama 3.3)...");
      raw = await callGroqAPI(prompt, imageFile);
      apiUsed = imageFile ? "Groq (Llama 4 Scout Vision)" : "Groq (Llama 3.3)";
      console.log("✓ Groq API successful");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("✗ Groq API failed:", msg);
      errors.push(`Groq: ${msg}`);
    }
  }

  if (!raw) {
    console.error("All APIs failed:", errors);
    const errorDetails = errors.length > 0 ? `\n\nবিস্তারিত:\n${errors.join('\n')}` : '';
    throw new Error(`সকল API ব্যর্থ হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।${errorDetails}`);
  }

  console.log(`✓ Diagnosis completed using: ${apiUsed}`);

  const jsonString = extractJsonArray(raw);
  if (!jsonString) throw new Error("মডেল JSON প্রদান করেনি, আবার চেষ্টা করুন");

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("ফলাফল পার্স করা যায়নি");
  }

  if (!Array.isArray(parsed)) throw new Error("অবৈধ JSON ফরম্যাট");

  const diseases = (parsed as unknown[]).map(sanitizeDisease).filter(Boolean) as Disease[];
  return diseases.slice(0, 3); // Limit to 3
}

async function tryGeminiAPI(
  apiKey: string,
  prompt: string,
  imageFile?: File | null
): Promise<GenerateContentResult | null> {
  const client = getClient(apiKey);

  // Updated with working model names (2026)
  const staticPreferred = [
    "gemini-2.5-flash",    // Newest model seen in user dashboard
    "gemini-1.5-flash",    // Stable & Fast
    "gemini-2.0-flash-exp", 
    "gemini-1.5-pro",
    "gemini-1.5-flash-8b",
    "gemini-pro"
  ];

  const parts: ContentPart[] = [{ text: prompt }];
  if (imageFile) {
    const { base64, mimeType } = await processImageForApi(imageFile);
    parts.push({ inlineData: { mimeType: mimeType || imageFile.type || "image/jpeg", data: base64 } });
  }

  let result: GenerateContentResult | null = null;
  const triedModels: string[] = [];
  const modelErrors: Record<string, string> = {};

  async function attempt(models: string[]): Promise<GenerateContentResult | null> {
    for (const m of models) {
      if (triedModels.includes(m)) continue;
      triedModels.push(m);
      try {
        const model = client.getGenerativeModel({ model: m });
        const r = await model.generateContent({ contents: [{ role: "user", parts }] });
        return r;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        modelErrors[m] = msg;
        if (!/\b404\b|not found|not supported/i.test(msg)) {
          // Non-404 error -> propagate (quota, auth etc.)
          throw e;
        }
      }
    }
    return null;
  }

  // 1st pass: static list
  result = await attempt(staticPreferred);

  // 2nd pass: dynamic fetch if all static failed
  if (!result) {
    try {
      const resp = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey
      );
      if (resp.ok) {
        const json = await resp.json();
        const dynamicModels: { name: string; supportedGenerationMethods?: string[] }[] =
          json.models || [];
        const usable = dynamicModels.filter((m) =>
          m.supportedGenerationMethods?.includes("generateContent")
        );
        const ordered = usable
          .sort((a, b) => {
            const ia = staticPreferred.indexOf(a.name);
            const ib = staticPreferred.indexOf(b.name);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
          })
          .map((m) => m.name);
        result = await attempt(ordered);
      }
    } catch {
      /* silent */
    }
  }

  return result;
}
