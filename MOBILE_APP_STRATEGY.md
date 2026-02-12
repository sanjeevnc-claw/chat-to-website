# Mobile App Strategy - iOS & Android

## Overview

Native apps for App Store & Play Store, sharing the same backend as web.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALL CHANNELS                                  │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │   Web   │ │   iOS   │ │ Android │ │Telegram │ │WhatsApp │   │
│  │ Next.js │ │   App   │ │   App   │ │   Bot   │ │   Bot   │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       │          │          │          │          │            │
│       └──────────┴──────────┴──────────┴──────────┘            │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │  UNIFIED API    │                          │
│                   │  (Same Backend) │                          │
│                   └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Approach Options

### Option 1: React Native + Expo (Recommended)

| Pros | Cons |
|------|------|
| Single codebase (iOS + Android) | Not 100% native feel |
| Share components with web (React) | Some native modules need workarounds |
| Expo handles builds, signing, OTA updates | Larger app size |
| Fast development | |
| Hot reloading | |

**Best for**: Chat-based apps, quick iteration, small team

### Option 2: Capacitor (Wrap Web App)

| Pros | Cons |
|------|------|
| Literally wrap existing Next.js app | Web-view based (not truly native) |
| Instant iOS/Android from web code | Performance concerns |
| Minimal extra work | Less native feel |
| Single codebase | Limited native APIs |

**Best for**: MVP, validating mobile demand

### Option 3: Flutter

| Pros | Cons |
|------|------|
| Beautiful UI, smooth animations | Different language (Dart) |
| Single codebase | No code sharing with web |
| Great performance | Smaller ecosystem than React |
| Google backed | |

**Best for**: UI-heavy apps, greenfield projects

### Option 4: Native (Swift + Kotlin)

| Pros | Cons |
|------|------|
| Best performance & UX | 2 codebases |
| Full platform access | 2x development time |
| App Store approval easier | Need iOS + Android devs |

**Best for**: Enterprise apps, complex native features

---

## Recommendation: React Native + Expo

**Why:**
1. Chat UI is simple - doesn't need complex native features
2. Share components/logic with React web
3. Expo handles App Store/Play Store builds
4. OTA updates (push fixes without app store review)
5. One codebase, one team

---

## Mobile App Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     SCREENS                              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │  Splash  │ │  Auth    │ │   Chat   │ │ Projects │   │    │
│  │  │  Screen  │ │  Screen  │ │  Screen  │ │  List    │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                               │                         │    │
│  │                    ┌──────────▼──────────┐              │    │
│  │                    │     CHAT UI         │              │    │
│  │                    │  • Message bubbles  │              │    │
│  │                    │  • Image picker     │              │    │
│  │                    │  • Preview cards    │              │    │
│  │                    │  • Payment sheet    │              │    │
│  │                    └─────────────────────┘              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   NATIVE FEATURES                        │    │
│  │  • Push notifications (new messages, deploy complete)    │    │
│  │  • Camera/gallery access (upload photos)                 │    │
│  │  • Apple Pay / Google Pay (domain purchases)             │    │
│  │  • Share sheet (share preview links)                     │    │
│  │  • Biometric auth (Face ID / fingerprint)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   STATE & DATA                           │    │
│  │  • Zustand (state management)                            │    │
│  │  • React Query (API caching)                             │    │
│  │  • AsyncStorage (local persistence)                      │    │
│  │  • Secure Store (auth tokens)                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │    SAME API         │
                    │  /api/chat          │
                    │  /api/deploy        │
                    │  /api/domain        │
                    └─────────────────────┘
```

---

## Project Structure

```
website-builder-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (main)/
│   │   ├── index.tsx            # Projects list
│   │   ├── chat/[id].tsx        # Chat screen
│   │   └── settings.tsx
│   └── _layout.tsx
│
├── components/
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── ImagePicker.tsx
│   │   ├── PreviewCard.tsx
│   │   ├── DomainList.tsx
│   │   └── PaymentSheet.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ...
│
├── lib/
│   ├── api.ts                   # API client
│   ├── auth.ts                  # Auth helpers
│   ├── storage.ts               # Secure storage
│   └── notifications.ts         # Push notifications
│
├── hooks/
│   ├── useChat.ts
│   ├── useProjects.ts
│   └── useAuth.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── app.json                     # Expo config
├── eas.json                     # EAS Build config
└── package.json
```

---

## Key Screens

### 1. Chat Screen (Main Experience)

```
┌─────────────────────────────────────┐
│ ← Jane's Bakery Website        •••  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ AI: What kind of website    │   │
│  │     do you need?            │   │
│  └─────────────────────────────┘   │
│                                     │
│         ┌─────────────────────────┐ │
│         │ A bakery website!      │ │
│         └─────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ AI: Great! Here's your      │   │
│  │     preview:                │   │
│  │                             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │  [Preview Image]      │  │   │
│  │  │  janes-bakery.vercel  │  │   │
│  │  │  [Open] [Deploy]      │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐ 📷 │
│ │ Type a message...           │ ➤  │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2. Projects List

```
┌─────────────────────────────────────┐
│ My Websites                    [+]  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🥐 Jane's Bakery            │   │
│  │    janesbakery.com          │   │
│  │    ● Live                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📷 Photo Studio             │   │
│  │    photo-studio.vercel.app  │   │
│  │    ○ Draft                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ➕ Start New Website        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3. Payment (Apple Pay / Google Pay)

```
┌─────────────────────────────────────┐
│         Purchase Domain             │
├─────────────────────────────────────┤
│                                     │
│         janesbakery.com             │
│           $9/year                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [Apple Pay Logo]       │   │
│  │                             │   │
│  │    Pay with Apple Pay       │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│        or pay with card             │
│                                     │
└─────────────────────────────────────┘
```

---

## Native Features Implementation

### Push Notifications

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  
  const token = await Notifications.getExpoPushTokenAsync();
  
  // Send token to our backend
  await api.post('/api/user/push-token', { 
    token: token.data,
    platform: Platform.OS 
  });
  
  return token.data;
}

// Backend sends notifications for:
// - "Your website is deployed!"
// - "Domain purchase complete!"
// - "Your site had 100 visitors today!"
```

### Apple Pay / Google Pay

```typescript
// components/PaymentSheet.tsx
import { useStripe } from '@stripe/stripe-react-native';

export function PaymentSheet({ domain, price, onSuccess }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const handlePay = async () => {
    // 1. Get payment intent from backend
    const { paymentIntent, ephemeralKey, customer } = await api.post(
      '/api/payments/create-intent',
      { domain, amount: price * 100 }
    );
    
    // 2. Init payment sheet (shows Apple Pay / Google Pay if available)
    await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Website Builder',
      applePay: { merchantCountryCode: 'US' },
      googlePay: { merchantCountryCode: 'US', testEnv: true }
    });
    
    // 3. Present payment sheet
    const { error } = await presentPaymentSheet();
    
    if (!error) {
      onSuccess();
    }
  };
  
  return (
    <Button onPress={handlePay}>
      Pay ${price} for {domain}
    </Button>
  );
}
```

### Image Picker (Upload Photos)

```typescript
// components/ImagePicker.tsx
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      // Upload to backend
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      
      const { url } = await api.upload('/api/upload', formData);
      return url;
    }
  };
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    // ... same upload logic
  };
  
  return { pickImage, takePhoto };
}
```

---

## Build & Deployment (Expo EAS)

### Setup

```bash
# Install Expo CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### Build Commands

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build both
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## App Store Requirements

### iOS (App Store)

1. **Apple Developer Account** - $99/year
2. **App Store Connect** - Create app listing
3. **App Review** - Usually 24-48 hours
4. **Requirements**:
   - Privacy policy URL
   - App icons (1024x1024)
   - Screenshots (various sizes)
   - App description, keywords
   - Age rating questionnaire

### Android (Play Store)

1. **Google Play Developer Account** - $25 one-time
2. **Play Console** - Create app listing
3. **Review** - Usually same day to 3 days
4. **Requirements**:
   - Privacy policy URL
   - App icons (512x512)
   - Feature graphic (1024x500)
   - Screenshots
   - Content rating questionnaire

---

## Timeline

### Phase 4: Mobile Apps (Weeks 9-12)

```
Week 9: Setup & Core
├── Day 1-2: Expo project setup, navigation
├── Day 3-4: Auth screens (login, signup)
├── Day 5: API client, auth flow
└── Weekend: Testing

Week 10: Chat Experience
├── Day 1-2: Chat UI components
├── Day 3: Image picker integration
├── Day 4: Preview cards, links
├── Day 5: Streaming responses
└── Weekend: Polish

Week 11: Payments & Native
├── Day 1-2: Stripe + Apple Pay + Google Pay
├── Day 3: Push notifications
├── Day 4: Deep links, share sheet
├── Day 5: Settings, profile
└── Weekend: Testing

Week 12: Launch
├── Day 1-2: iOS build, TestFlight
├── Day 3-4: Android build, internal testing
├── Day 5: App store submissions
└── Monitor reviews, fix issues
```

---

## Code Sharing with Web

```
shared/
├── types/           # TypeScript types (shared)
├── utils/           # Helper functions (shared)
├── api/             # API client (mostly shared)
└── constants/       # App constants (shared)

web/                 # Next.js web app
├── components/      # Web-specific components
└── ...

mobile/              # React Native app
├── components/      # Mobile-specific components
└── ...
```

**What's shared:**
- TypeScript types/interfaces
- API client logic
- Validation functions
- Constants (API endpoints, etc.)

**What's different:**
- UI components (web = HTML/CSS, mobile = React Native)
- Navigation (web = routes, mobile = stack navigator)
- Storage (web = localStorage, mobile = AsyncStorage)
- Payments (web = Stripe Elements, mobile = Apple/Google Pay)

---

## Summary

| Platform | Approach | Timeline |
|----------|----------|----------|
| Web | Next.js | Weeks 1-4 |
| Telegram | Bot API | Week 7 |
| WhatsApp | Twilio | Week 8 |
| iOS | React Native + Expo | Weeks 9-12 |
| Android | React Native + Expo | Weeks 9-12 |

**Total**: Same backend serves all 5 channels.

---

*React Native + Expo = fastest path to App Store + Play Store with a small team!*
