# Langal Krishi Sahayak - Farmer Authentication API

## 🎉 **Backend Status: LIVE & RUNNING!**

✅ **Laravel Server**: http://127.0.0.1:8000  
✅ **API Base URL**: http://127.0.0.1:8000/api  
✅ **Health Check**: Working ✓

### **Current Server Status:**

- Laravel server successfully running on port 8000
- API endpoints are accessible
- Ready for frontend integration

---

## Backend Setup Summary

### ✅ Completed Components:

1. **Laravel Project Structure**

   - Laravel 12 backend in `langal-backend/` folder
   - MySQL database configuration
   - Models: User, Farmer, Otp, UserProfile
   - Services: OtpService
   - Controllers: FarmerAuthController

2. **Database Integration**
   - Connected to existing `langol_krishi_sahayak` database
   - Compatible with existing `users`, `farmers`, `user_profiles` tables
   - New `otps` table for OTP verification

## API Endpoints

### Base URL: `http://localhost:8000/api`

### 1. Health Check

```
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "message": "Langal Krishi Sahayak API is running",
  "timestamp": "2024-11-09T..."
}
```

### 2. Send OTP

```
POST /api/farmer/send-otp
Content-Type: application/json

{
  "phone": "01712345678"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp_id": 1,
    "expires_in": 5,
    "phone": "8801712345678",
    "otp_code": "123456" // Only in development mode
  }
}
```

### 3. Verify OTP & Login

```
POST /api/farmer/verify-otp
Content-Type: application/json

{
  "phone": "01712345678",
  "otp_code": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "phone": "8801712345678",
      "email": null,
      "user_type": "farmer",
      "is_verified": true,
      "is_active": true,
      "profile": {...},
      "farmer": {...}
    },
    "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer"
  }
}
```

### 4. Resend OTP

```
POST /api/farmer/resend-otp
Content-Type: application/json

{
  "phone": "01712345678"
}
```

### 5. Get OTP Status

```
GET /api/farmer/otp-status?phone=01712345678
```

### 6. Get Farmer Profile (Protected)

```
GET /api/farmer/profile
Authorization: Bearer {token}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "phone": "8801712345678",
      "email": null,
      "user_type": "farmer",
      "profile": {
        "full_name": "কৃষক নাম",
        "address": "গ্রামের ঠিকানা",
        ...
      },
      "farmer": {
        "farm_location": "ফার্মের অবস্থান",
        "farm_size": 2.5,
        "primary_crops": ["ধান", "গম"],
        ...
      }
    }
  }
}
```

### 7. Update Profile (Protected)

```
PUT /api/farmer/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "farmer@example.com",
  "full_name": "আপডেট করা নাম",
  "address": "নতুন ঠিকানা",
  "farm_location": "নতুন ফার্মের অবস্থান",
  "farm_size": 3.0,
  "primary_crops": ["ধান", "গম", "ভুট্টা"]
}
```

### 8. Logout (Protected)

```
POST /api/farmer/logout
Authorization: Bearer {token}
```

## Frontend Integration Guide

### 1. Update Frontend API Service

Update your `FarmerLogin.tsx` to call these APIs:

```typescript
// In your FarmerLogin component
const API_BASE_URL = "http://localhost:8000/api";

const handlePhoneSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/farmer/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "OTP পাঠানো হয়েছে",
        description: data.message,
      });

      // For development - show OTP code
      if (data.data.otp_code) {
        console.log("OTP Code:", data.data.otp_code);
      }

      setCurrentStep("otp");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: "ত্রুটি",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/farmer/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp_code: otp }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user));

      toast({
        title: "সফল",
        description: data.message,
      });

      // Redirect to farmer dashboard
      navigate("/farmer-dashboard");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: "ত্রুটি",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Create API Service File

Create `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8000/api";

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async sendOtp(phone: string) {
    const response = await fetch(`${API_BASE_URL}/farmer/send-otp`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ phone }),
    });
    return response.json();
  }

  async verifyOtp(phone: string, otp_code: string) {
    const response = await fetch(`${API_BASE_URL}/farmer/verify-otp`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ phone, otp_code }),
    });
    return response.json();
  }

  async getFarmerProfile() {
    const response = await fetch(`${API_BASE_URL}/farmer/profile`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async updateProfile(data: any) {
    const response = await fetch(`${API_BASE_URL}/farmer/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/farmer/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    return response.json();
  }
}

export default new ApiService();
```

## Next Steps

### To Run the Backend:

1. Fix composer dependencies (install required PHP extensions)
2. Run `php artisan migrate` to create OTP table
3. Start server with `php artisan serve`

### To Test:

1. Use Postman to test the API endpoints
2. Update frontend to use real API calls
3. Test complete farmer login flow

### Database Requirements:

- Make sure MySQL is running
- Database `langol_krishi_sahayak` exists
- At least one farmer user exists in the `users` table with `user_type='farmer'`

### Sample Test Data:

```sql
-- Insert a test farmer user
INSERT INTO users (email, password_hash, user_type, phone, is_verified, is_active)
VALUES (null, '$2y$10$dummy_hash', 'farmer', '8801712345678', 1, 1);
```

The backend is ready for farmer authentication! 🎉
