<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AvianCare (Web + Android Studio Project)

AvianCare now includes a **real Android Studio project** under `./android` that wraps the existing web app in a native Android WebView app.

## Project Structure

- Web app (React + Vite): repository root
- Android Studio app: `android/`
- Android Web assets target: `android/app/src/main/assets/public`

## Run Web App Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set `GEMINI_API_KEY` in `.env.local`
3. Start dev server:
   ```bash
   npm run dev
   ```

## Build Android App (from existing AvianCare code)

### 1) Build web bundle and sync it into Android project assets
```bash
npm run build:android
```

This does:
- `npm run build:web` -> creates `dist/`
- `npm run android:sync-assets` -> copies `dist/` into `android/app/src/main/assets/public`

### 2) Open Android Studio
Open the `android/` folder in Android Studio.

### 3) Run on phone/emulator
- Let Gradle sync complete.
- Connect Android phone with USB debugging enabled (or start emulator).
- Click **Run**.

## Android Notes

- The app loads from local assets using:
  - `file:///android_asset/public/index.html`
- Internet permission is enabled in manifest for Gemini/API requests.
- If you change web code, re-run:
  ```bash
  npm run build:android
  ```
  before running from Android Studio again.

## Requirements

- Node.js 18+
- Android Studio (latest stable)
- JDK 17+
- Android SDK (API 34 recommended)

## Export Android Studio ZIP

If you want a ready ZIP file for Android Studio, run:

```bash
npm run android:zip
```

This creates:
- `AvianCare-Android-Studio.zip`

You can share that zip and open the extracted `android/` folder directly in Android Studio.

