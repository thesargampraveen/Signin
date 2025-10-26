# Google Sign-In Setup Instructions

## ✅ What's Already Done:
- Added Google Play Services metadata to AndroidManifest.xml
- Updated webClientId in both Login and Register screens
- Generated SHA-1 fingerprint: `39:79:D2:80:50:CF:71:28:C1:E1:4B:BF:5C:E3:17:69:BC:8B:48:30`

## 🚨 To Fix DEVELOPER_ERROR:

### Step 1: Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Select project: `signin-9ec8d`
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Android"
6. Package name: `com.signin`
7. SHA-1 fingerprint: `39:79:D2:80:50:CF:71:28:C1:E1:4B:BF:5C:E3:17:69:BC:8B:48:30`
8. Click "Create"

### Step 2: Firebase Console
1. Go to https://console.firebase.google.com/
2. Project: `signin-9ec8d`
3. Authentication → Sign-in method
4. Enable "Google" provider
5. Project Settings → General → Your apps
6. Add SHA-1 fingerprint: `39:79:D2:80:50:CF:71:28:C1:E1:4B:BF:5C:E3:17:69:BC:8B:48:30`

### Step 3: Download Updated Configuration
1. From Firebase Console, download new `google-services.json`
2. Replace `C:\Users\Admin\signin\android\app\google-services.json`

### Step 4: Rebuild App
```bash
npx react-native run-android
```

## 📋 Verification Checklist:
- [ ] Google Cloud Console has Android OAuth client with correct SHA-1
- [ ] Firebase Authentication has Google Sign-in enabled
- [ ] SHA-1 fingerprint added to Firebase Project Settings
- [ ] Package name matches: `com.signin`
- [ ] google-services.json is up to date

The DEVELOPER_ERROR should be resolved after these steps!