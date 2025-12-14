# 🎙️ বাংলা TTS সিস্টেম - দ্রুত সারাংশ

## তৈরি করা ফাইলগুলো

### 1. Core Service

- **`src/services/ttsService.ts`** - Main TTS service with Hugging Face API + Web Speech API

### 2. UI Components

- **`src/components/ui/advanced-tts-button.tsx`** - Advanced TTS button component
- **`src/components/ui/tts-button.tsx`** - Existing simple TTS button (kept for compatibility)

### 3. Demo & Examples

- **`src/pages/TTSDemo.tsx`** - Complete demo page with examples
- **`src/examples/tts-examples.tsx`** - Code examples for developers

### 4. Documentation

- **`BANGLA_TTS_GUIDE.md`** - Complete user & developer guide
- **`.env.example`** - Environment variable template
- **`README.md`** - Updated with TTS info

### 5. Configuration

- **`src/App.tsx`** - Added `/tts-demo` route

---

## 🚀 কিভাবে ব্যবহার করবেন

### 1. ব্রাউজার TTS (No Setup Required)

```tsx
import { AdvancedTTSButton } from "@/components/ui/advanced-tts-button";

<AdvancedTTSButton text="আপনার টেক্সট" useHuggingFace={false} showLabel />;
```

✅ কোন সেটআপ লাগবে না
✅ অফলাইনে কাজ করবে
⚠️ কোয়ালিটি কম

### 2. AI TTS (Hugging Face) - Best Quality

**Step 1**: Create `.env` file:

```bash
VITE_HUGGINGFACE_API_KEY=hf_your_token_here
```

**Step 2**: Get API key from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Step 3**: Use in code:

```tsx
<AdvancedTTSButton text="আপনার টেক্সট" useHuggingFace={true} showLabel />
```

✅ সবচেয়ে ভালো কোয়ালিটি
✅ Natural বাংলা উচ্চারণ
✅ Auto-fallback to browser TTS
⚠️ Internet connection লাগবে

---

## 📱 Demo দেখুন

```bash
npm run dev
```

তারপর ব্রাউজারে যান: `http://localhost:5173/tts-demo`

---

## 🎯 যেখানে ব্যবহার করা যাবে

1. **Social Feed Posts** - পোস্ট শোনা
2. **News Articles** - খবর শোনা
3. **Agricultural Tips** - পরামর্শ শোনা
4. **Weather Updates** - আবহাওয়া শোনা
5. **Marketplace Items** - পণ্যের বিবরণ শোনা
6. **Consultation Responses** - বিশেষজ্ঞের উত্তর শোনা

---

## 🔧 সাপোর্টেড মডেল

1. **facebook/mms-tts-ben** - Meta MMS (Primary)
2. **mnatrb/VitsModel-Bangla-Female** - Bengali Female Voice (Secondary)
3. **Web Speech API** - Browser fallback (Always available)

---

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# View demo
# Navigate to: /tts-demo
```

---

## 📚 বিস্তারিত ডকুমেন্টেশন

পড়ুন: [BANGLA_TTS_GUIDE.md](./BANGLA_TTS_GUIDE.md)

---

## ✅ Features

- ✅ Dual-mode TTS (AI + Browser)
- ✅ Auto-fallback mechanism
- ✅ Real-time status updates
- ✅ Progress indicator
- ✅ Play/Stop control
- ✅ Author name support
- ✅ Customizable UI
- ✅ TypeScript support
- ✅ Responsive design

---

**তৈরি করেছেন:** লাঙ্গল টিম ❤️
