# KKC Android test app

The Android project bundles the frontend using Capacitor. It includes the original KKC launcher icon, a branded launch screen, mobile navigation, offline programme viewing, native sharing and Android Back handling. Registration uses the existing Google Apps Script form in a browser window. Internet is required for registration, payment and videos.

## Software setup

Install Android Studio from https://developer.android.com/studio and complete its setup wizard. In SDK Manager install Android SDK Platform 36 and the recommended SDK Build Tools. Java 21 and Node.js 22 or newer are required (Java 21 and Node 24 are already present on this computer).

From FrontEnd:

```powershell
npm install
npm run android:build
npm run android:open
```

In Android Studio let Gradle sync, create an emulator in Device Manager or connect an Android phone with USB debugging enabled, and press Run. Android 7.0 or newer is supported by this project.

For a test APK, after Android Studio has configured the SDK:

```powershell
npm run android:apk
```

Output: android/app/build/outputs/apk/debug/app-debug.apk. This is a debug build for testing, not a signed Play Store release.

## Registration environments

android:build and android:apk use local registration URLs from .env.local. Test builds show a local-registration banner. android:build:prod uses production URLs from .env.production. Run the appropriate build before opening Android Studio. Native files load from dist-android; normal npm run build still creates the website in dist.

Never put private Sheet edit links or signing keys in frontend environment variables. Payment acknowledgement remains manual; the app does not verify bank transactions.

## Browser preview

Run npm run dev and open http://localhost:5173/?app-preview=1 in a mobile-sized browser. This previews the mobile screens; native splash, device sharing and Android Back must also be tested on Android. The preview switch is development-only.

## Before store publication

The current package ID is com.kkcorg.app. Confirm this before the first store release. Configure release signing outside Git, prepare the store listing and privacy policy, and test registration, QR payment handoff, sharing, offline behaviour and Back on real devices. Store submission and iOS packaging are separate later steps.
