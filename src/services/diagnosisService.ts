/*
  diagnosisService.ts
  Gemini-powered crop disease diagnosis from symptoms + optional image.
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

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is missing. Add it to .env.local");
}

// Instantiate Gemini client lazily to avoid errors if key missing.
const getClient = () => new GoogleGenerativeAI(API_KEY || "");

// Helper: convert image file to base64 string (without headers)
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Prompt builder - Bangla output instructions with strict JSON schema.
function buildPrompt({ crop, symptoms, diseaseTypeHint }: DiagnoseParams): string {
  return `আপনি একজন কৃষি রোগ বিশেষজ্ঞ AI সহকারী। প্রদত্ত ফসল এবং লক্ষণের ভিত্তিতে ১ থেকে ৩টি সম্ভাব্য রোগের JSON অ্যারে দিন।\n\nনির্দেশনা:\n- আউটপুট শুধুমাত্র একটি বৈধ JSON অ্যারে হবে, কোনো অতিরিক্ত টেক্সট বা ব্যাখ্যা নয়।\n- প্রতিটি অবজেক্টের স্কিমা: {\n  name: string (রোগের নাম বাংলায়),\n  probability: number (0-100 পূর্ণসংখ্যা),\n  treatment: string (বাংলায় সংক্ষেপ চিকিৎসা),\n  cost: number (প্রতি একর আনুমানিক প্রাথমিক চিকিৎসা খরচ),\n  type: string (যেমন: ছত্রাক রোগ / ব্যাকটেরিয়া রোগ / ভাইরাস রোগ / কীটনাশক সমস্যা),\n  guideline: string[] (বাংলায় বুলেট পরামর্শ),\n  chemicals: [ { name, dosePerAcre (number), unit (কেজি|লিটার|গ্রাম|মিলি), pricePerUnit (number), note (optional), type (fungicide|bactericide|insecticide|virucide|fertilizer) } ],\n  videos: string[] (বিশ্বস্ত ইউটিউব/নির্দেশনা লিঙ্ক, সর্বোচ্চ ২টি)\n}\n- cost যদি নির্ভরযোগ্যভাবে অনুমান করা না যায় তবে chemicals থেকে ডোজ * pricePerUnit ধরে একটি সংক্ষিপ্ত estimate দিন।\n- probability পৃথকভাবে 0-100 এর মধ্যে যৌক্তিক মান (একটি রোগ >90 হলে অন্যগুলো সাধারণত কম হবে)।\n- Bengali ভাষায় সব টেক্সট লিখুন।\n\nইনপুট:\nফসল: ${crop}\nলক্ষণ: ${symptoms}\n${diseaseTypeHint ? `রোগের ধরন ইঙ্গিত: ${diseaseTypeHint}\n` : ""}\n\nআউটপুট: শুধুমাত্র JSON অ্যারে।`;
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
  if (!API_KEY) throw new Error("Gemini API key missing");
  if (!crop || (!symptoms && !imageFile)) throw new Error("ফসল ও লক্ষণ/ছবি প্রয়োজন");

  const prompt = buildPrompt(params);
  const client = getClient();

  // Static preferred order (will be filtered by dynamic model listing if 404s happen)
  const staticPreferred = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-pro-vision"
  ];

  const parts: ContentPart[] = [{ text: prompt }];
  if (imageFile) {
    const base64 = await fileToBase64(imageFile);
    parts.push({ inlineData: { mimeType: imageFile.type || "image/jpeg", data: base64 } });
  }

  let result: GenerateContentResult | null = null;
  const triedModels: string[] = [];
  const modelErrors: Record<string,string> = {};

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
  // Dynamic listing requires REST call; implement inline to avoid undefined function.
  if (!result) {
    try {
      const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY);
      if (resp.ok) {
        const json = await resp.json();
        const dynamicModels: { name: string; supportedGenerationMethods?: string[] }[] = json.models || [];
        const usable = dynamicModels.filter(m => m.supportedGenerationMethods?.includes("generateContent"));
        const ordered = usable.sort((a,b)=>{
          const ia = staticPreferred.indexOf(a.name);
          const ib = staticPreferred.indexOf(b.name);
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        }).map(m=>m.name);
        result = await attempt(ordered);
      }
    } catch {/* silent */}
  }

  if (!result) {
    const errSummary = Object.entries(modelErrors).map(([m,msg])=>`* ${m}: ${msg}`).join("\n");
    throw new Error("সমর্থিত Gemini মডেল পাওয়া যায়নি বা এন্ডপয়েন্ট অপ্রাপ্য।\nচেষ্টা করা মডেলসমূহ:\n"+errSummary+"\nপরবর্তী পদক্ষেপ: API key region/model enablement যাচাই করুন বা একটি ভিন্ন key ব্যবহার করুন।");
  }
  const raw = result.response.text();
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
