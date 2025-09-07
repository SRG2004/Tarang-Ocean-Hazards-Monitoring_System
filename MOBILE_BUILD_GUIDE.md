
# Taranga Mobile App Build Instructions

## APK Generation (Android)

### Method 1: Using Capacitor (Recommended)
1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. Initialize Capacitor:
   ```bash
   npx cap init "Taranga" "com.incois.taranga"
   ```

3. Build web assets:
   ```bash
   npm run build
   ```

4. Add Android platform:
   ```bash
   npx cap add android
   ```

5. Copy web assets:
   ```bash
   npx cap copy android
   ```

6. Open in Android Studio:
   ```bash
   npx cap open android
   ```

7. Build APK in Android Studio:
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - APK will be in: android/app/build/outputs/apk/debug/

### Method 2: Using React Native (Full Native)
1. Use the mobile-package.json dependencies
2. Follow React Native CLI setup guide
3. Run: `npx react-native run-android --variant=release`

## PWA Installation
The app is already configured as a PWA and can be installed directly from the browser.

## Features Included
- 📱 Responsive mobile design
- 🗺️ Interactive maps with offline support
- 📷 Camera integration for hazard reporting
- 📍 GPS location services
- 🔔 Push notifications for alerts
- 💾 Offline data sync
- 🔐 Firebase authentication
- 💰 Donation processing
- 👥 Volunteer management
- 📊 Real-time analytics

## Production Deployment
The web app is automatically deployed and accessible at your Replit URL.
For mobile distribution, use the generated APK or publish to app stores.
