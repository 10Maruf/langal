# 🎯 Consultation System - Complete Implementation Plan

## 📋 Overview

এই ডকুমেন্টে পুরো Consultation System এর implementation plan দেওয়া আছে।

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONSULTATION SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌────────────┐ │
│  │   FARMER    │────▶│  MESSAGING  │◀───▶│   EXPERT    │────▶│  FEEDBACK  │ │
│  │    APP      │     │   SYSTEM    │     │  DASHBOARD  │     │   SYSTEM   │ │
│  └─────────────┘     └─────────────┘     └─────────────┘     └────────────┘ │
│         │                   │                   │                   │       │
│         ▼                   ▼                   ▼                   ▼       │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌────────────┐ │
│  │ APPOINTMENT │────▶│    CALL     │◀───▶│    PUSH     │────▶│ PRESCRIPTION│ │
│  │  SCHEDULER  │     │   SYSTEM    │     │NOTIFICATIONS│     │   SYSTEM   │ │
│  │             │     │  (AGORA)    │     │   (FCM)     │     │            │ │
│  └─────────────┘     └─────────────┘     └─────────────┘     └────────────┘ │
│         │                   │                   │                   │       │
│         └───────────────────┴───────────────────┴───────────────────┘       │
│                                     │                                        │
│                                     ▼                                        │
│                           ┌─────────────────┐                                │
│                           │   LARAVEL API   │                                │
│                           │    BACKEND      │                                │
│                           └─────────────────┘                                │
│                                     │                                        │
│                                     ▼                                        │
│                           ┌─────────────────┐                                │
│                           │     MySQL       │                                │
│                           │    DATABASE     │                                │
│                           └─────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Tables Summary

### 🆕 নতুন Tables (10টি)

| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| `expert_availability` | Expert এর available time slots | expert_id, day_of_week, start_time, end_time |
| `expert_unavailable_dates` | Expert এর ছুটির দিন | expert_id, unavailable_date, reason |
| `consultation_appointments` | Main appointment booking | farmer_id, expert_id, scheduled_date, status |
| `consultation_messages` | Chat messages | sender_id, receiver_id, content, message_type |
| `consultation_calls` | Call records (Agora) | appointment_id, call_type, agora_channel, duration |
| `consultation_feedback` | Farmer ratings & reviews | appointment_id, overall_rating, review_text |
| `consultation_prescriptions` | Expert advice/prescription | appointment_id, diagnosis, prescription |
| `notification_tokens` | Push notification tokens | user_id, device_token, device_type |
| `notification_queue` | Notification sending queue | user_id, title, body, status |
| `conversation_participants` | Conversation tracking | conversation_id, user_id, role |

### 🔄 Updated Tables

| Table | New Columns |
|-------|-------------|
| `expert_qualifications` | is_available_for_consultation, response_time_hours, average_rating, total_reviews, bio |
| `notifications` | notification_category, priority, action_url, action_type, image_url |

---

## 🔄 Workflow Diagrams

### 1️⃣ Appointment Booking Flow

```
┌──────────────┐                                      ┌──────────────┐
│    FARMER    │                                      │    EXPERT    │
└──────┬───────┘                                      └──────┬───────┘
       │                                                      │
       │  1. Browse Expert List                               │
       │─────────────────────────▶                            │
       │                                                      │
       │  2. View Expert Profile                              │
       │─────────────────────────▶                            │
       │                                                      │
       │  3. Check Available Slots                            │
       │─────────────────────────▶                            │
       │                                                      │
       │  4. Select Date, Time, Type                          │
       │─────────────────────────▶                            │
       │                                                      │
       │  5. Submit Request                                   │
       │─────────────────────────▶                            │
       │                                                      │
       │                          6. Notification ────────────│───▶ 📱
       │                                                      │
       │                          7. View Request             │
       │                          ◀───────────────────────────│
       │                                                      │
       │                          8. Approve/Reject/Reschedule│
       │                          ◀───────────────────────────│
       │                                                      │
       │  9. Notification ◀───────────────────────────────────│
       │◀──────📱                                             │
       │                                                      │
       │  10. View Status                                     │
       │─────────────────────────▶                            │
       │                                                      │
       ▼                                                      ▼
```

### 2️⃣ Call Flow (Scheduled Time)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    FARMER    │         │    SERVER    │         │    EXPERT    │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │   Reminder (30 min)    │   Reminder (30 min)   │
       │◀───────────────────────│───────────────────────▶│
       │                        │                        │
       │                  (Scheduled Time)               │
       │                        │                        │
       │   Join Call Button     │   Join Call Button     │
       │◀───────────────────────│───────────────────────▶│
       │                        │                        │
       │   Request Agora Token  │                        │
       │───────────────────────▶│                        │
       │                        │                        │
       │   Token + Channel      │   Token + Channel      │
       │◀───────────────────────│───────────────────────▶│
       │                        │                        │
       │   ┌────────────────────┴────────────────────┐   │
       │   │              AGORA CALL                 │   │
       │◀──│    Audio/Video Connection Active       │──▶│
       │   │                                         │   │
       │   │   Chat available during call           │   │
       │   │   Screen share (video only)            │   │
       │   │   Image sharing                        │   │
       │   │                                         │   │
       │   │         Duration: Max 20 min           │   │
       │   └────────────────────┬────────────────────┘   │
       │                        │                        │
       │   Call Ended           │   Call Ended           │
       │◀───────────────────────│───────────────────────▶│
       │                        │                        │
       │   Rate Expert          │   Write Prescription   │
       │───────────────────────▶│◀───────────────────────│
       │                        │                        │
       ▼                        ▼                        ▼
```

### 3️⃣ Messaging Flow

```
┌──────────────┐                                      ┌──────────────┐
│    FARMER    │                                      │    EXPERT    │
└──────┬───────┘                                      └──────┬───────┘
       │                                                      │
       │  1. Start Conversation                               │
       │─────────────────────────▶                            │
       │  "আমার ধানের পাতায় দাগ পড়ছে"                         │
       │                                                      │
       │                          2. Push Notification ───────│───▶ 📱
       │                                                      │
       │                          3. View & Reply             │
       │◀─────────────────────────────────────────────────────│
       │                          "ছবি পাঠান"                  │
       │                                                      │
       │  4. Push Notification ◀──────────────────────────────│
       │◀──────📱                                             │
       │                                                      │
       │  5. Send Image                                       │
       │─────────────────────────▶                            │
       │  📷 [crop_disease.jpg]                               │
       │                                                      │
       │                          6. View Image               │
       │◀─────────────────────────────────────────────────────│
       │                          "এটা ব্লাস্ট রোগ..."          │
       │                                                      │
       │  7. Request Appointment                              │
       │─────────────────────────▶                            │
       │  "ভিডিও কলে বিস্তারিত জানতে চাই"                       │
       │                                                      │
       ▼                                                      ▼
```

---

## 🛠️ Implementation Steps

### Phase 1: Database Setup ✅
- [x] Design complete database schema
- [ ] Run migration SQL
- [ ] Test foreign keys and constraints
- [ ] Verify triggers and procedures

### Phase 2: Backend API Development
```
📁 langal-backend/app/
├── Models/
│   ├── ExpertAvailability.php
│   ├── ConsultationAppointment.php
│   ├── ConsultationMessage.php
│   ├── ConsultationCall.php
│   ├── ConsultationFeedback.php
│   ├── ConsultationPrescription.php
│   ├── NotificationToken.php
│   └── NotificationQueue.php
├── Http/Controllers/Api/
│   ├── ExpertAvailabilityController.php
│   ├── AppointmentController.php
│   ├── MessageController.php
│   ├── CallController.php
│   ├── FeedbackController.php
│   ├── PrescriptionController.php
│   └── NotificationController.php
├── Services/
│   ├── AgoraService.php
│   ├── NotificationService.php
│   └── AppointmentService.php
└── Events/ (for real-time)
    ├── MessageSent.php
    ├── CallInitiated.php
    └── AppointmentStatusChanged.php
```

### Phase 3: Frontend UI Development
```
📁 src/
├── pages/
│   ├── consultation/
│   │   ├── ExpertListPage.tsx
│   │   ├── ExpertProfilePage.tsx
│   │   ├── BookAppointmentPage.tsx
│   │   ├── MyAppointmentsPage.tsx
│   │   ├── AppointmentDetailsPage.tsx
│   │   └── VideoCallPage.tsx
│   ├── expert-dashboard/
│   │   ├── ExpertDashboard.tsx
│   │   ├── AppointmentRequestsPage.tsx
│   │   ├── AvailabilitySettingsPage.tsx
│   │   ├── WritePrescriptionPage.tsx
│   │   └── MyReviewsPage.tsx
│   └── chat/
│       ├── ConversationsPage.tsx
│       └── ChatRoomPage.tsx
├── components/
│   ├── consultation/
│   │   ├── ExpertCard.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── CallControls.tsx
│   │   └── PrescriptionView.tsx
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ImagePreview.tsx
│   │   └── TypingIndicator.tsx
│   └── notifications/
│       ├── NotificationBadge.tsx
│       └── NotificationList.tsx
└── hooks/
    ├── useAgora.ts
    ├── useWebSocket.ts
    ├── useNotifications.ts
    └── useAppointment.ts
```

### Phase 4: Agora Integration
- [ ] Create Agora account (free tier)
- [ ] Get App ID and App Certificate
- [ ] Implement token generation (backend)
- [ ] Implement Agora SDK (frontend)
- [ ] Test audio/video calls

### Phase 5: Push Notifications
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Implement FCM in Android (Capacitor)
- [ ] Store device tokens
- [ ] Create notification sender service

### Phase 6: Real-time Features
- [ ] Set up Laravel WebSocket (Pusher or Socket.io)
- [ ] Implement real-time messaging
- [ ] Implement call signaling
- [ ] Implement typing indicators

---

## 📱 API Endpoints Design

### Expert Availability
```
GET    /api/experts                          # List all experts
GET    /api/experts/{id}                     # Expert profile
GET    /api/experts/{id}/availability        # Get available slots
POST   /api/experts/{id}/availability        # Set availability (expert only)
DELETE /api/experts/{id}/availability/{id}   # Remove slot
POST   /api/experts/{id}/unavailable-dates   # Add unavailable date
```

### Appointments
```
GET    /api/appointments                     # List my appointments
POST   /api/appointments                     # Request new appointment
GET    /api/appointments/{id}                # Appointment details
PUT    /api/appointments/{id}/approve        # Expert approves
PUT    /api/appointments/{id}/reject         # Expert rejects
PUT    /api/appointments/{id}/reschedule     # Expert proposes new time
PUT    /api/appointments/{id}/confirm        # Farmer confirms reschedule
PUT    /api/appointments/{id}/cancel         # Cancel appointment
POST   /api/appointments/{id}/join           # Get call token
```

### Messages
```
GET    /api/conversations                    # List conversations
GET    /api/conversations/{id}/messages      # Get messages
POST   /api/conversations/{id}/messages      # Send message
POST   /api/conversations/{id}/read          # Mark as read
POST   /api/messages/{id}/upload             # Upload attachment
```

### Calls
```
POST   /api/calls/token                      # Generate Agora token
POST   /api/calls/start                      # Start call
PUT    /api/calls/{id}/answer                # Answer call
PUT    /api/calls/{id}/end                   # End call
GET    /api/calls/{id}/status                # Check call status
```

### Feedback & Prescription
```
POST   /api/appointments/{id}/feedback       # Submit feedback
GET    /api/experts/{id}/reviews             # Get expert reviews
POST   /api/appointments/{id}/prescription   # Write prescription
GET    /api/prescriptions/{id}               # View prescription
```

### Notifications
```
POST   /api/notifications/token              # Register device token
GET    /api/notifications                    # Get notifications
PUT    /api/notifications/{id}/read          # Mark as read
PUT    /api/notifications/read-all           # Mark all as read
DELETE /api/notifications/{id}               # Delete notification
```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme
```scss
// Primary Colors
$primary-green: #2E7D32;      // Main action buttons
$primary-dark: #1B5E20;       // Headers, important text

// Status Colors
$status-pending: #FFA726;     // Orange - Pending
$status-approved: #66BB6A;    // Green - Approved
$status-rejected: #EF5350;    // Red - Rejected
$status-completed: #42A5F5;   // Blue - Completed

// Call Colors
$audio-call: #7B1FA2;         // Purple - Audio
$video-call: #1976D2;         // Blue - Video
$chat: #00897B;               // Teal - Chat

// Urgency Colors
$urgency-low: #78909C;        // Grey
$urgency-medium: #FFA726;     // Orange
$urgency-high: #EF5350;       // Red
$urgency-urgent: #D32F2F;     // Dark Red
```

### Component Design

#### Expert Card
```
┌─────────────────────────────────────────────────────┐
│  ┌──────┐                                           │
│  │ 👨‍⚕️ │  ড. রমিজ উদ্দিন                            │
│  │photo │  ফসল নির্বাচন বিশেষজ্ঞ                      │
│  └──────┘                                           │
│                                                     │
│  ⭐ 4.8  |  📞 150+ কলs  |  💬 2 ঘণ্টায় উত্তর         │
│                                                     │
│  🎥 ভিডিও  📞 অডিও  💬 চ্যাট                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          পরামর্শ নিন                         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### Appointment Card
```
┌─────────────────────────────────────────────────────┐
│  APT-2026-00001                    🟡 অপেক্ষমাণ      │
│─────────────────────────────────────────────────────│
│                                                     │
│  📅 ১৫ জানুয়ারি, ২০২৬                               │
│  ⏰ সন্ধ্যা ৭:০০ - ৭:৩০                              │
│  🎥 ভিডিও কল                                        │
│                                                     │
│  👨‍⚕️ ড. রমিজ উদ্দিন                                  │
│                                                     │
│  📝 ধানের পাতায় দাগ                                  │
│                                                     │
│  ┌───────────────┐  ┌───────────────┐              │
│  │   বিস্তারিত    │  │    মেসেজ     │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
```

#### Time Slot Picker
```
┌─────────────────────────────────────────────────────┐
│           📅 ১৫ জানুয়ারি, ২০২৬ (শনিবার)              │
│─────────────────────────────────────────────────────│
│                                                     │
│  সকাল                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ ৯:০০   │ │ ৯:৩০   │ │ ১০:০০  │               │
│  │ ✓      │ │ booked │ │ ✓      │               │
│  └─────────┘ └─────────┘ └─────────┘               │
│                                                     │
│  সন্ধ্যা                                             │
│  ┌─────────┐ ┌─────────┐                            │
│  │ ৭:০০   │ │ ৭:৩০   │                            │
│  │ ✓      │ │ ✓      │                            │
│  └─────────┘ └─────────┘                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔔 Notification Types

| Type | Title (BN) | When |
|------|------------|------|
| `new_appointment_request` | নতুন পরামর্শ অনুরোধ | Farmer requests appointment |
| `appointment_approved` | অ্যাপয়েন্টমেন্ট অনুমোদিত | Expert approves |
| `appointment_rejected` | অ্যাপয়েন্টমেন্ট প্রত্যাখ্যান | Expert rejects |
| `appointment_rescheduled` | নতুন সময় প্রস্তাব | Expert proposes new time |
| `appointment_confirmed` | সময় নিশ্চিত হয়েছে | Farmer confirms |
| `appointment_cancelled` | অ্যাপয়েন্টমেন্ট বাতিল | Either cancels |
| `appointment_reminder` | রিমাইন্ডার | 30 min before |
| `call_started` | কল শুরু হয়েছে | Expert/Farmer joins |
| `new_message` | নতুন মেসেজ | Message received |
| `prescription_ready` | প্রেসক্রিপশন তৈরি | Expert writes prescription |
| `feedback_request` | রেটিং দিন | After consultation |

---

## ⚡ Real-time Events (WebSocket)

| Event | Payload | Listeners |
|-------|---------|-----------|
| `message.sent` | {message, conversation_id} | Receiver |
| `message.read` | {message_ids, conversation_id} | Sender |
| `typing` | {user_id, conversation_id} | Other participant |
| `appointment.updated` | {appointment, status} | Both parties |
| `call.incoming` | {call_id, caller, appointment} | Callee |
| `call.answered` | {call_id} | Caller |
| `call.ended` | {call_id, reason} | Both parties |

---

## 🚀 Agora Setup Guide

### 1. Create Agora Account
```
1. Go to https://www.agora.io/
2. Sign up for free account
3. Create a new project
4. Get App ID (for client)
5. Get App Certificate (for token generation)
```

### 2. Backend Token Generation (PHP)
```php
// In AgoraService.php
use Agora\TokenBuilder;

class AgoraService 
{
    public function generateToken(
        string $channelName, 
        int $uid, 
        int $role = 1
    ): string {
        $appId = config('services.agora.app_id');
        $appCertificate = config('services.agora.certificate');
        $expireTime = 3600; // 1 hour
        
        return RtcTokenBuilder::buildTokenWithUid(
            $appId,
            $appCertificate,
            $channelName,
            $uid,
            $role,
            time() + $expireTime
        );
    }
}
```

### 3. Frontend SDK (React/TypeScript)
```typescript
// useAgora.ts hook
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export const useAgora = () => {
    const client = useRef<IAgoraRTCClient | null>(null);
    
    const joinCall = async (
        channel: string, 
        token: string, 
        uid: number
    ) => {
        client.current = AgoraRTC.createClient({ 
            mode: 'rtc', 
            codec: 'vp8' 
        });
        await client.current.join(APP_ID, channel, token, uid);
        // ... setup tracks
    };
    
    const leaveCall = async () => {
        await client.current?.leave();
    };
    
    return { joinCall, leaveCall, ... };
};
```

---

## 📱 Push Notification Setup (FCM)

### 1. Firebase Setup
```
1. Go to Firebase Console
2. Create project or use existing
3. Add Android app with package name
4. Download google-services.json
5. Place in android/app/
```

### 2. Capacitor Push Notification
```typescript
// In NotificationService.ts
import { PushNotifications } from '@capacitor/push-notifications';

export const initPushNotifications = async () => {
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
        await PushNotifications.register();
    }
    
    PushNotifications.addListener('registration', async (token) => {
        // Send token to backend
        await api.post('/notifications/token', {
            device_token: token.value,
            device_type: 'android'
        });
    });
    
    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
            // Handle foreground notification
        }
    );
};
```

---

## 📋 Testing Checklist

### Appointment Flow
- [ ] Farmer can view expert list
- [ ] Farmer can view expert profile with ratings
- [ ] Farmer can see available time slots
- [ ] Farmer can book appointment
- [ ] Expert receives notification
- [ ] Expert can approve/reject/reschedule
- [ ] Farmer receives status notification
- [ ] Both see appointment in their list

### Messaging Flow
- [ ] Farmer can start conversation
- [ ] Expert receives notification
- [ ] Messages appear in real-time
- [ ] Images can be sent
- [ ] Unread count shows correctly
- [ ] Messages marked as read

### Call Flow
- [ ] Join Call button appears at scheduled time
- [ ] Agora token generated correctly
- [ ] Audio call works
- [ ] Video call works
- [ ] Call ends after max duration
- [ ] Call status saved correctly

### Notification Flow
- [ ] Device token saved on login
- [ ] Push notifications received
- [ ] In-app notifications work
- [ ] Mark as read works
- [ ] Badge count updates

---

## 🎯 Development Priority Order

```
Week 1-2: Database & Basic Backend
├── ✅ Create migration SQL
├── Run migration
├── Create Laravel models
├── Create basic CRUD controllers
└── Test with Postman

Week 3-4: Appointment System
├── Expert availability UI
├── Booking UI
├── Appointment management
└── Status notifications

Week 5-6: Messaging System
├── Conversation list UI
├── Chat room UI
├── Real-time messaging
└── Image upload

Week 7-8: Call System (Agora)
├── Agora account setup
├── Token generation backend
├── Call UI components
└── Audio/Video integration

Week 9-10: Polish & Testing
├── Push notifications
├── Feedback system
├── Prescription system
├── Bug fixes & optimization
```

---

## 📞 Contact & Resources

- **Agora Docs**: https://docs.agora.io/en/
- **Laravel WebSocket**: https://beyondco.de/docs/laravel-websockets
- **Firebase FCM**: https://firebase.google.com/docs/cloud-messaging
- **Capacitor Push**: https://capacitorjs.com/docs/apis/push-notifications

---

*Last Updated: January 2026*
