# 🚀 Langol Krishi Sahayak - Complete Deployment Guide

## বাংলায় সম্পূর্ণ Deployment নির্দেশিকা

এই গাইডে আপনার সম্পূর্ণ প্রজেক্ট **বিনামূল্যে** Vercel এবং Railway তে deploy করার প্রক্রিয়া বর্ণনা করা হয়েছে।

---

## 📋 প্রয়োজনীয় জিনিস

1. ✅ GitHub Account
2. ✅ Vercel Account (GitHub দিয়ে sign up করুন)
3. ✅ Railway Account (GitHub দিয়ে sign up করুন)
4. ✅ আপনার প্রজেক্টের সব code

---

## 🔧 Part 1: GitHub এ Project Upload করুন

### Step 1.1: Local Git Initialize করুন

```bash
# প্রজেক্ট ফোল্ডারে যান
cd "d:\Software Engineering\3.1\SE 3112 - Software Project Lab II\langal demo\Updated\langol-krishi-sahayak"

# Git initialize করুন (যদি আগে না করা থাকে)
git init

# সব ফাইল add করুন
git add .

# Commit করুন
git commit -m "Initial commit for deployment"
```

### Step 1.2: GitHub এ Repository তৈরি করুন

1. https://github.com এ যান
2. উপরের ডানদিকে **"+"** ক্লিক করুন → **"New repository"**
3. Repository name দিন: `langol-krishi-sahayak`
4. **Public** রাখুন (free deployment এর জন্য)
5. **Create repository** ক্লিক করুন

### Step 1.3: Local Code কে GitHub এ Push করুন

```bash
# আপনার GitHub repository URL যোগ করুন
git remote add origin https://github.com/YOUR_USERNAME/langol-krishi-sahayak.git

# Main branch এ push করুন
git branch -M main
git push -u origin main
```

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 2.1: Vercel Account তৈরি করুন

1. https://vercel.com এ যান
2. **"Sign Up"** ক্লিক করুন
3. **"Continue with GitHub"** নির্বাচন করুন
4. GitHub access authorize করুন

### Step 2.2: Frontend Project Deploy করুন

1. Vercel Dashboard এ **"Add New"** → **"Project"** ক্লিক করুন
2. আপনার `langol-krishi-sahayak` repository select করুন
3. **Import** ক্লিক করুন

### Step 2.3: Build Configuration সেট করুন

**Framework Preset:** Vite

**Root Directory:** `./` (root রাখুন)

**Build Command:**
```bash
npm install && npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### Step 2.4: Environment Variables যোগ করুন

**Environment Variables** section এ যান এবং নিচের variables যোগ করুন:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=Langol Krishi Sahayak
```

> **Note:** `your-backend-url` পরে Railway থেকে পাবেন (Step 3 এ)

### Step 2.5: Deploy করুন

- **"Deploy"** বাটন ক্লিক করুন
- 2-3 মিনিট অপেক্ষা করুন
- Deploy সম্পন্ন হলে আপনার frontend URL পাবেন: `https://your-project.vercel.app`

---

## 🔥 Part 3: Backend & Database Deployment (Railway)

### Step 3.1: Railway Account তৈরি করুন

1. https://railway.app এ যান
2. **"Login"** ক্লিক করুন
3. **"Login with GitHub"** নির্বাচন করুন
4. GitHub access authorize করুন

### Step 3.2: নতুন Project তৈরি করুন

1. Dashboard এ **"New Project"** ক্লিক করুন
2. **"Deploy from GitHub repo"** নির্বাচন করুন
3. `langol-krishi-sahayak` repository select করুন
4. **"Deploy Now"** ক্লিক করুন

### Step 3.3: MySQL Database যোগ করুন

1. আপনার project এ **"+ New"** ক্লিক করুন
2. **"Database"** → **"Add MySQL"** নির্বাচন করুন
3. Railway automatically একটি MySQL database তৈরি করবে

### Step 3.4: Database Connection Info সংগ্রহ করুন

1. MySQL service ক্লিক করুন
2. **"Variables"** ট্যাব এ যান
3. নিচের values কপি করুন:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

### Step 3.5: Laravel Backend Configure করুন

1. আপনার backend service ক্লিক করুন
2. **"Settings"** → **"Root Directory"** এ যান
3. Root Directory সেট করুন: `langal-backend`

### Step 3.6: Environment Variables সেট করুন

**"Variables"** ট্যাব এ যান এবং নিচের সব variables যোগ করুন:

```env
APP_NAME="Langol Krishi Sahayak"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-backend.railway.app

DB_CONNECTION=mysql
DB_HOST=${MYSQL_HOST}
DB_PORT=${MYSQL_PORT}
DB_DATABASE=${MYSQL_DATABASE}
DB_USERNAME=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}

FRONTEND_URL=https://your-frontend.vercel.app

SESSION_DRIVER=cookie
QUEUE_CONNECTION=sync

FILESYSTEM_DISK=public
```

> **Important:** APP_KEY generate করতে local এ `php artisan key:generate --show` run করুন

### Step 3.7: Build & Start Commands সেট করুন

**Settings** → **"Deploy"** section এ:

**Build Command:**
```bash
composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Start Command:**
```bash
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}
```

### Step 3.8: Database Import করুন

Railway MySQL এ connect করার জন্য:

1. MySQL Workbench বা phpMyAdmin use করুন
2. Railway থেকে পাওয়া credentials দিয়ে connect করুন
3. আপনার `Langal_xampp.sql` file import করুন

**অথবা Railway CLI দিয়ে:**

```bash
# Railway CLI install করুন
npm i -g @railway/cli

# Login করুন
railway login

# Project link করুন
railway link

# Database এ connect করুন
railway run mysql -h ${MYSQL_HOST} -P ${MYSQL_PORT} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < Langal_xampp.sql
```

### Step 3.9: Public Domain সেট করুন

1. Backend service এ যান
2. **"Settings"** → **"Networking"** → **"Generate Domain"**
3. আপনার backend URL কপি করুন: `https://your-backend.railway.app`

---

## 🔗 Part 4: Frontend ও Backend Connect করুন

### Step 4.1: Vercel এ Environment Variable আপডেট করুন

1. Vercel Dashboard → আপনার project
2. **"Settings"** → **"Environment Variables"**
3. `VITE_API_URL` আপডেট করুন:
```
https://your-backend.railway.app/api
```
4. **"Redeploy"** করুন

### Step 4.2: Railway এ CORS সেট করুন

আপনার Laravel backend এ `config/cors.php` চেক করুন:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:5173'),
],
```

Railway এ `FRONTEND_URL` variable আপডেট করুন:
```
https://your-frontend.vercel.app
```

---

## ✅ Part 5: Deployment যাচাই করুন

### চেক করুন:

1. ✅ Frontend URL খুলুন: `https://your-project.vercel.app`
2. ✅ API endpoint test করুন: `https://your-backend.railway.app/api/health`
3. ✅ Login/Registration কাজ করছে কিনা
4. ✅ Database connection ঠিক আছে কিনা
5. ✅ Image upload কাজ করছে কিনা

---

## 🔄 Part 6: Automatic Deployment Setup

### এখন যখনই আপনি GitHub এ code push করবেন:

1. **Vercel** automatically frontend redeploy করবে
2. **Railway** automatically backend redeploy করবে

```bash
# Local changes করার পর
git add .
git commit -m "Your changes"
git push origin main

# Automatically deploy হয়ে যাবে! 🎉
```

---

## 🆓 Free Tier সীমাবদ্ধতা

### Vercel Free Plan:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Custom domains
- ✅ Automatic HTTPS

### Railway Free Plan:
- ✅ $5 free credit/month
- ✅ ~500 hours runtime
- ✅ 1 GB RAM
- ✅ 1 GB storage

> **Tip:** Monthly $5 credit দিয়ে ছোট projects চালানো যায়। বেশি traffic হলে upgrade করতে হবে।

---

## 🐛 Common Issues & Solutions

### Issue 1: "Application Error" Vercel এ

**সমাধান:**
- Build logs চেক করুন
- `package.json` এ সব dependencies আছে কিনা দেখুন
- Environment variables ঠিক আছে কিনা চেক করুন

### Issue 2: Backend "500 Error" Railway তে

**সমাধান:**
- Railway logs চেক করুন: `railway logs`
- Database connection ঠিক আছে কিনা verify করুন
- `APP_KEY` সেট করা আছে কিনা চেক করুন

### Issue 3: CORS Error

**সমাধান:**
```php
// langal-backend/config/cors.php
'allowed_origins' => ['*'], // Development এর জন্য
// Production এ specific domain দিন
```

### Issue 4: Database Connection Failed

**সমাধান:**
- Railway MySQL variables সঠিকভাবে linked আছে কিনা চেক করুন
- `DB_HOST`, `DB_PORT` ইত্যাদি ঠিক আছে কিনা verify করুন

---

## 📞 সাহায্য প্রয়োজন?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Laravel Deployment: https://laravel.com/docs/deployment

---

## 🎯 Next Steps

1. ✅ Custom domain setup করুন (optional)
2. ✅ SSL certificates (automatic হয়)
3. ✅ Monitoring সেট করুন
4. ✅ Backup strategy তৈরি করুন

---

**সফল Deployment এর জন্য শুভকামনা! 🚀**
