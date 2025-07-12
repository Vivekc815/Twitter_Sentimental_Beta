# 🚀 Setup Guide - Tweet Sentiment Analyzer

## 📋 **For Local Development**

1. **Copy the environment file:**
   ```bash
   cp env.local.example .env.local
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Your app will connect to the Railway backend automatically!**

## ☁️ **For Production (Vercel)**

The environment variable is already set in Vercel:
- `NEXT_PUBLIC_API_URL=https://web-production-9c93a.up.railway.app`

## 🔧 **How It Works**

- **Local Development**: Uses `.env.local` file
- **Production (Vercel)**: Uses Vercel environment variables
- **Fallback**: Uses `http://localhost:8000` if no environment variable is set

## 🎯 **Testing**

1. **Local**: Visit `http://localhost:3000`
2. **Production**: Visit your Vercel URL
3. **Both should work the same way!**

## 🆘 **Troubleshooting**

If it's not working:
1. Check that `.env.local` exists and has the correct URL
2. Restart your development server: `npm run dev`
3. Check the browser console for connection logs 