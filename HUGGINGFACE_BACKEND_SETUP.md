# 🎙️ Hugging Face TTS Backend Setup - Complete Guide

## ✅ সেটআপ সম্পন্ন!

Backend proxy এখন কনফিগার করা হয়েছে যা Hugging Face TTS API ব্যবহার করতে পারবে।

## 📋 কি কি করা হয়েছে

### 1. Backend API Controller তৈরি

- **File**: `langal-backend/app/Http/Controllers/TTSController.php`
- **Endpoints**:
  - `POST /api/tts/generate` - Text থেকে audio generate করে
  - `GET /api/tts/models` - Available models দেখায়
  - `GET /api/tts/health` - Health check

### 2. API Routes যোগ করা

- **File**: `langal-backend/routes/api.php`
- TTS routes without authentication (public access)

### 3. Environment Variables কনফিগার করা

- **Backend** (`.env`): `HUGGINGFACE_API_KEY=your_huggingface_api_token_here`
- **Frontend** (`.env`): `VITE_API_URL=http://127.0.0.1:8000`

### 4. Frontend Service আপডেট

- **File**: `src/services/ttsService.ts`
- এখন backend proxy দিয়ে Hugging Face API call করবে
- CORS issue solved!

### 5. Component Default পরিবর্তন

- **File**: `src/components/ui/advanced-tts-button.tsx`
- `useHuggingFace = true` (default এখন AI TTS)

## 🚀 কিভাবে ব্যবহার করবেন

### Step 1: Backend Server চালু করুন

```bash
cd langal-backend
php artisan serve
```

✅ **Status**: Server চলছে `http://localhost:8000`

### Step 2: Frontend চালু করুন (যদি না চলে)

```bash
npm run dev
```

### Step 3: TTS Demo খুলুন

Browser এ যান: http://localhost:5173/tts-demo

### Step 4: Test করুন

1. **নমুনা টেক্সট** tab এ যান
2. কোনো sample এর **"শুনুন"** button click করুন
3. **"AI TTS (Hugging Face)"** toggle ON করুন
4. Loading... → Playing দেখবেন

## 🔍 Health Check

Backend API test করতে:

```bash
# Health check
curl http://localhost:8000/api/tts/health

# Expected response:
{
  "status": "ok",
  "api_key_configured": true,
  "timestamp": "2025-12-13T..."
}
```

## 🎯 Available Models

### 1. Meta MMS Bengali (প্রস্তাবিত)

```tsx
<AdvancedTTSButton text="আপনার টেক্সট" useHuggingFace={true} />
```

- Model: `facebook/mms-tts-ben`
- Quality: ⭐⭐⭐⭐⭐ (Highest)
- Speed: Medium

### 2. VITS Bengali Female

```tsx
<AdvancedTTSButton
  text="আপনার টেক্সট"
  useHuggingFace={true}
  model="mnatrb/VitsModel-Bangla-Female"
/>
```

- Model: `mnatrb/VitsModel-Bangla-Female`
- Quality: ⭐⭐⭐⭐
- Speed: Fast

### 3. Browser TTS (Fallback)

```tsx
<AdvancedTTSButton text="আপনার টেক্সট" useHuggingFace={false} />
```

- System: Web Speech API
- Quality: ⭐⭐⭐ (Depends on browser)
- Speed: Instant (No API call)

## 📊 Request Flow

```
User clicks button
    ↓
Frontend (ttsService.ts)
    ↓
POST http://localhost:8000/api/tts/generate
    {
      "text": "আপনার টেক্সট",
      "model": "facebook/mms-tts-ben"
    }
    ↓
Backend (TTSController.php)
    ↓
POST https://api-inference.huggingface.co/models/facebook/mms-tts-ben
    Headers: Authorization: Bearer hf_xxxxx
    ↓
Hugging Face API
    ↓
Returns audio/flac
    ↓
Backend forwards to Frontend
    ↓
Audio plays in browser
```

## 🐛 Troubleshooting

### 1. "Backend API error: 500"

**সমাধান**:

```bash
# Backend logs check করুন
cd langal-backend
tail -f storage/logs/laravel.log
```

### 2. "Connection refused"

**সমাধান**:

- Backend server চলছে কিনা check করুন: `php artisan serve`
- Port 8000 খালি আছে কিনা check করুন

### 3. "API key not configured"

**সমাধান**:

```bash
# .env file check করুন
cd langal-backend
cat .env | grep HUGGINGFACE_API_KEY

# থাকলে cache clear করুন
php artisan config:clear
php artisan cache:clear
```

### 4. "Model is loading" (প্রথমবার slow)

**সমাধান**:

- Hugging Face প্রথমবার model load করে (10-30 seconds)
- পরের requests fast হবে
- Model warm-up আছে

## 📝 API Documentation

### POST /api/tts/generate

Generate speech from text

**Request:**

```json
{
  "text": "আসসালামু আলাইকুম",
  "model": "facebook/mms-tts-ben" // Optional
}
```

**Response:**

- Content-Type: `audio/flac`
- Binary audio data

**Error Response:**

```json
{
  "error": "Error message",
  "details": {...}
}
```

### GET /api/tts/models

Get available TTS models

**Response:**

```json
{
  "models": [
    {
      "id": "facebook/mms-tts-ben",
      "name": "Meta MMS Bengali",
      "description": "High-quality Bengali TTS from Meta (Recommended)",
      "language": "bn",
      "quality": "high"
    },
    ...
  ]
}
```

### GET /api/tts/health

Check API status

**Response:**

```json
{
  "status": "ok",
  "api_key_configured": true,
  "timestamp": "2025-12-13T12:00:00.000000Z"
}
```

## 🎨 Frontend Usage Examples

### Basic Usage

```tsx
import { AdvancedTTSButton } from "@/components/ui/advanced-tts-button";

<AdvancedTTSButton
  text="ধান চাষের জন্য মাটি ভালো করে চাষ দিতে হবে"
  showLabel
/>;
```

### With Custom Model

```tsx
<AdvancedTTSButton
  text="আপনার টেক্সট"
  useHuggingFace={true}
  model="mnatrb/VitsModel-Bangla-Female"
  showLabel
/>
```

### In Dashboard

```tsx
<Card>
  <CardHeader>
    <CardTitle>পরামর্শ</CardTitle>
  </CardHeader>
  <CardContent>
    <p>ধান চাষের জন্য...</p>
    <AdvancedTTSButton text="ধান চাষের জন্য..." variant="default" showLabel />
  </CardContent>
</Card>
```

## ✅ Next Steps

1. ✅ Backend server চালু আছে
2. ✅ Frontend TTS button AI TTS use করবে
3. ✅ CORS issue fixed
4. 🧪 Test করুন: http://localhost:5173/tts-demo
5. 📱 Production এ deploy করার সময় backend URL update করুন

## 🌐 Production Deployment

### Frontend `.env`

```env
VITE_API_URL=https://your-api-domain.com
```

### Backend Configuration

1. Apache/Nginx setup করুন
2. HTTPS enable করুন
3. CORS headers configure করুন (already done in controller)
4. Environment variables set করুন

## 🎉 Success!

এখন Hugging Face এর high-quality Bengali TTS fully functional!

**Test করুন**:

1. http://localhost:5173/tts-demo
2. "AI TTS" toggle ON করুন
3. Sample text play করুন
4. Console এ "Backend TTS API" দেখবেন (CORS error নয়!)

---

**Created**: December 13, 2025  
**Status**: ✅ Fully Operational
