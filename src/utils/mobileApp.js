// Mobile App Generation Utilities
// This file contains utilities for generating mobile app configurations

export const generateMobileAppConfig = () => {
  return {
    name: "Tarang Ocean Hazard Monitor",
    displayName: "Tarang",
    identifier: "com.incois.tarang",
    version: "1.0.0",
    description: "Real-time ocean hazard monitoring and reporting system for coastal safety",
    icon: "public/favicon.svg",
    splash: {
      backgroundColor: "#667eea",
      image: "public/favicon.svg"
    },
    permissions: [
      "CAMERA",
      "LOCATION",
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "INTERNET",
      "ACCESS_NETWORK_STATE",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ],
    features: [
      "Real-time hazard reporting",
      "GPS location tracking",
      "Camera integration for media upload",
      "Offline data sync",
      "Push notifications for alerts",
      "Interactive maps",
      "Social media monitoring",
      "Donation management",
      "Volunteer coordination"
    ]
  };
};

export const generateCapacitorConfig = () => {
  return {
    appId: "com.incois.tarang",
    appName: "Tarang",
    webDir: "dist",
    bundledWebRuntime: false,
    plugins: {
      PushNotifications: {
        presentationOptions: ["badge", "sound", "alert"]
      },
      LocalNotifications: {
        smallIcon: "ic_stat_icon_config_sample",
        iconColor: "#488AFF",
        sound: "beep.wav"
      },
      Geolocation: {
        permissions: ["location"]
      },
      Camera: {
        permissions: ["camera", "photos"]
      }
    },
    android: {
      allowMixedContent: true,
      captureInput: true,
      webContentsDebuggingEnabled: true
    },
    ios: {
      contentInset: "automatic"
    }
  };
};

export const generateReactNativeConfig = () => {
  return {
    name: "TarangApp",
    displayName: "Tarang Ocean Monitor",
    version: "1.0.0",
    dependencies: {
      "react": "18.2.0",
      "react-native": "0.72.0",
      "@react-navigation/native": "^6.0.0",
      "@react-navigation/stack": "^6.0.0",
      "react-native-maps": "^1.0.0",
      "react-native-geolocation": "^3.0.0",
      "react-native-image-picker": "^5.0.0",
      "react-native-push-notification": "^8.0.0",
      "@react-native-firebase/app": "^18.0.0",
      "@react-native-firebase/auth": "^18.0.0",
      "@react-native-firebase/firestore": "^18.0.0",
      "@react-native-firebase/storage": "^18.0.0",
      "react-native-vector-icons": "^9.0.0",
      "react-native-chart-kit": "^6.0.0"
    },
    scripts: {
      "android": "react-native run-android",
      "ios": "react-native run-ios",
      "start": "react-native start",
      "build-android": "cd android && ./gradlew assembleRelease",
      "build-ios": "react-native run-ios --configuration Release"
    }
  };
};

// PWA Configuration for mobile-like experience
export const generatePWAConfig = () => {
  return {
    manifest: {
      name: "Tarang Ocean Hazard Monitor",
      short_name: "Tarang",
      description: "Real-time ocean hazard monitoring and reporting system",
      start_url: "/",
      display: "standalone",
      background_color: "#667eea",
      theme_color: "#667eea",
      orientation: "portrait",
      icons: [
        {
          src: "favicon.svg",
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any maskable"
        },
        {
          src: "favicon.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ],
      categories: ["utilities", "safety", "weather"],
      screenshots: [
        {
          src: "/screenshot-wide.jpg",
          sizes: "1280x720",
          type: "image/jpeg",
          form_factor: "wide"
        },
        {
          src: "/screenshot-narrow.jpg", 
          sizes: "750x1334",
          type: "image/jpeg",
          form_factor: "narrow"
        }
      ]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 300
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400
            }
          }
        }
      ]
    }
  };
};

// Generate APK build instructions
export const generateAPKBuildInstructions = () => {
  return {
    buildSteps: [
      "1. Install Capacitor: npm install @capacitor/core @capacitor/cli",
      "2. Initialize Capacitor: npx cap init",
      "3. Add Android platform: npx cap add android", 
      "4. Build web assets: npm run build",
      "5. Copy to native: npx cap copy",
      "6. Open in Android Studio: npx cap open android",
      "7. Build APK: Build > Build Bundle(s) / APK(s) > Build APK(s)",
      "8. APK location: app/build/outputs/apk/debug/app-debug.apk"
    ],
    requirements: [
      "Android Studio installed",
      "Android SDK configured",
      "Java 11 or higher",
      "Gradle configured"
    ],
    buildCommand: "npx cap run android --prod",
    outputPath: "android/app/build/outputs/apk/release/",
    signedAPK: "android/app/build/outputs/apk/release/app-release.apk"
  };
};
