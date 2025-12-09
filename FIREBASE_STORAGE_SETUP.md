# Firebase Storage Setup Guide

## Issue
You're getting a `403 (storage/unauthorized)` error when trying to upload images. This is because Firebase Storage security rules need to be configured.

## Solution

### Option 1: Deploy Storage Rules via Firebase CLI (Recommended)

1. **Deploy the storage rules:**
   ```bash
   firebase deploy --only storage
   ```

   This will deploy the `storage.rules` file that's already configured in your project.

### Option 2: Set Rules via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **gametibe2025**
3. Click on **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to Gamebridge_ files for authenticated users
    match /Gamebridge_{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **Publish**

### Option 3: Allow Public Access (For Development Only - NOT RECOMMENDED FOR PRODUCTION)

If you want to allow uploads without authentication (for testing only), use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to Gamebridge_ files for everyone (DEVELOPMENT ONLY)
    match /Gamebridge_{allPaths=**} {
      allow read, write: if true;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

⚠️ **WARNING:** Only use Option 3 for development. Never use public access rules in production!

## What These Rules Do

- **`Gamebridge_{allPaths=**}`**: Allows access to all files/folders that start with `Gamebridge_`
- **`request.auth != null`**: Requires the user to be authenticated (logged in)
- **`allow read, write`**: Allows both reading (downloading) and writing (uploading) files

## After Setting Up Rules

1. Make sure you're logged in to your admin panel
2. Try uploading an image again
3. The image should now upload successfully to Firebase Storage
4. The image URL will be saved to your Realtime Database

## File Structure in Firebase Storage

After setup, your files will be organized like this:
```
Firebase Storage:
├── Gamebridge_images/
│   ├── 1765276429391_WhatsApp Image 2025-12-09 at 13.04.59.jpeg
│   └── ...
└── Gamebridge_videos/
    └── ...
```

## Troubleshooting

- **Still getting 403 errors?** Make sure you're logged in to the admin panel
- **Can't deploy rules?** Make sure you have Firebase CLI installed and are logged in: `firebase login`
- **Rules not working?** Check the Firebase Console to verify the rules were published correctly

