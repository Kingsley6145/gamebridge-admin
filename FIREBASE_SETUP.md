# Firebase Hosting Setup Guide

This guide will walk you through deploying your Gamebridge Admin application to Firebase Hosting.

## Prerequisites

- A Google account
- Node.js and npm installed (already done ✅)
- Firebase CLI installed (already done ✅)

## Step-by-Step Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "gamebridge-admin")
4. Follow the setup wizard:
   - Disable Google Analytics (optional, unless you need it)
   - Click **"Create project"**
5. Wait for the project to be created, then click **"Continue"**

### 2. Enable Firebase Hosting

1. In your Firebase project dashboard, click on **"Hosting"** in the left sidebar
2. Click **"Get started"**
3. Follow the setup instructions (we'll do this via CLI)

### 3. Login to Firebase CLI

Open your terminal in the project directory and run:

```bash
npx firebase login
```

This will open a browser window for you to authenticate with your Google account.

### 4. Initialize Firebase Hosting

Run the following command:

```bash
npx firebase init hosting
```

When prompted:
- **Select an existing project** or create a new one
- **What do you want to use as your public directory?** → Type: `dist`
- **Configure as a single-page app?** → Type: `Yes` (this is important for React Router)
- **Set up automatic builds and deploys with GitHub?** → Type: `No` (you can set this up later if needed)
- **File dist/index.html already exists. Overwrite?** → Type: `No`

This will update your `.firebaserc` file with your project ID.

### 5. Build Your Application

Before deploying, build your production-ready application:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 6. Deploy to Firebase

Deploy your application:

```bash
npx firebase deploy --only hosting
```

After deployment, Firebase will provide you with a hosting URL like:
`https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`

### 7. View Your Deployed Site

- The deployment URL will be shown in the terminal
- You can also find it in the Firebase Console under **Hosting**

## Useful Commands

### Deploy to Firebase
```bash
npm run build && npx firebase deploy --only hosting
```

### Preview locally before deploying
```bash
npm run build
npx firebase serve
```
Then visit `http://localhost:5000`

### Deploy to a specific project
```bash
npx firebase use <project-id>
npx firebase deploy --only hosting
```

## Adding npm Scripts (Optional)

You can add these convenient scripts to your `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting",
    "serve": "npm run build && firebase serve"
  }
}
```

Then you can simply run:
- `npm run deploy` - Build and deploy
- `npm run serve` - Build and preview locally

## Custom Domain Setup (Optional)

1. Go to Firebase Console → Hosting
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for SSL certificate provisioning (can take a few hours)

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript/ESLint errors

### 404 errors on routes
- Ensure `firebase.json` has the rewrite rule: `"source": "**", "destination": "/index.html"`
- This is already configured ✅

### Authentication issues
- Run `npx firebase logout` then `npx firebase login` again

## Next Steps

- Set up continuous deployment with GitHub Actions
- Configure environment variables for production
- Set up Firebase Analytics (if needed)
- Configure custom domain

## Important Notes

- The `dist` folder contains your built files and is ignored by git (as it should be)
- Always run `npm run build` before deploying
- Firebase Hosting has a free tier with generous limits
- Your site will be available immediately after deployment

