# Verify Firebase Storage Rules Are Published

## Quick Check

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: gametibe2025
3. **Click "Storage"** in the left sidebar
4. **Click the "Rules" tab**
5. **Check if you see the Gamebridge rules**:
   ```javascript
   // Gamebridge admin panel files (images and videos)
   match /Gamebridge_images/{file=**} {
     allow read: if isSignedIn();
     allow write: if isSignedIn();
   }

   match /Gamebridge_videos/{file=**} {
     allow read: if isSignedIn();
     allow write: if isSignedIn();
   }
   ```

## If Rules Are NOT There:

1. Copy the entire content from `storage.rules` file
2. Paste it into the Firebase Console Rules editor
3. Click **"Publish"** button
4. Wait a few seconds for rules to deploy
5. Try uploading again

## If Rules ARE There But Still Getting 403:

### Option 1: Temporarily Allow Public Access (For Testing)

Change the Gamebridge rules to:
```javascript
// Gamebridge admin panel files (images and videos) - TEMPORARY PUBLIC ACCESS
match /Gamebridge_images/{file=**} {
  allow read: if true;
  allow write: if true;  // ⚠️ TEMPORARY - CHANGE BACK AFTER TESTING
}

match /Gamebridge_videos/{file=**} {
  allow read: if true;
  allow write: if true;  // ⚠️ TEMPORARY - CHANGE BACK AFTER TESTING
}
```

**⚠️ WARNING**: This allows anyone to upload/read files. Only use for testing!

### Option 2: Check Authentication

1. Open browser console (F12)
2. Check if you're logged in:
   ```javascript
   // In browser console
   firebase.auth().currentUser
   ```
3. If `null`, you need to log in again
4. If you see user object, auth is working

### Option 3: Verify Rules Syntax

Make sure there are no syntax errors:
- All `match` statements have proper paths
- All `allow` statements end with semicolons
- No missing brackets `{}`

## After Publishing Rules

1. **Wait 10-30 seconds** for rules to propagate
2. **Refresh your browser** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. **Try uploading again**

## Still Not Working?

Check the browser console for:
- Authentication errors
- Network errors
- CORS errors

The error message should now be more helpful and tell you exactly what's wrong.

