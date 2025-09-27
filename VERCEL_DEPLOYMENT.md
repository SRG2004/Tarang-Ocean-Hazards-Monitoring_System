# Vercel Deployment Guide for Taranga Ocean Hazard Monitor

## Quick Deployment Steps

### 1. Connect Repository to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from this directory
vercel
```

### 2. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Build Configuration
The project is already configured with:
- ✅ `vercel.json` - Deployment configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Build script optimized for Vercel

### 4. One-Click Deploy Button
Add this to your repository README for easy deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Automatic Features Enabled

### Performance Optimization
- Static file optimization
- Automatic image optimization
- Edge caching for assets
- Gzip compression

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Cache-Control optimized for PWA

### Domain Configuration
- Custom domain support
- Automatic HTTPS/SSL
- Global CDN distribution
- Edge function support

## Post-Deployment Checklist

1. ✅ Verify all pages load correctly
2. ✅ Test Firebase authentication
3. ✅ Check map functionality
4. ✅ Verify real-time features
5. ✅ Test mobile responsiveness
6. ✅ Confirm PWA installation works

## Troubleshooting

### Build Issues
If build fails, check:
- All environment variables are set
- Firebase configuration is correct
- Dependencies are properly installed

### Runtime Issues
- Check browser console for errors
- Verify Firebase project settings
- Ensure API keys have correct permissions

Your Taranga system will be live at: `https://your-project.vercel.app`