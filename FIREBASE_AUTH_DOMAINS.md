# Fix Firebase Authentication Unauthorized Domain Error

## Problem
When you try to sign in on a new domain (like `gamebridge-admin-panel.web.app`), you get:
```
Firebase: Error (auth/unauthorized-domain)
```

This happens because Firebase Authentication only allows sign-in from domains that are explicitly authorized in the Firebase Console.

## Solution: Add Authorized Domains

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/project/gametibe2025/authentication/settings)
2. Navigate to: **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add Your New Domain
1. Click **"Add domain"** button
2. Enter: `gamebridge-admin-panel.web.app`
3. Click **"Add"**

### Step 3: Add Other Domains (if needed)
You should also add:
- `gamebridge-admin-panel.firebaseapp.com` (Firebase default domain)
- `localhost` (for local development)
- Any custom domains you plan to use

### Step 4: Verify
After adding the domain, try signing in again. The error should be resolved.

## Current Domains That Should Be Authorized

Based on your setup, make sure these domains are authorized:

1. ✅ `localhost` - For local development
2. ✅ `gamebridge-admin-panel.web.app` - Your new admin panel
3. ✅ `gamebridge-admin-panel.firebaseapp.com` - Firebase default domain
4. ✅ `gamebridgeadmin.web.app` - Your original site (if it uses auth)
5. ✅ Any custom domains you configure

## Quick Access Link
[Firebase Authentication Settings](https://console.firebase.google.com/project/gametibe2025/authentication/settings)

## Note
- Changes take effect immediately (no deployment needed)
- You can add up to 20 authorized domains per project
- Domains are case-insensitive

