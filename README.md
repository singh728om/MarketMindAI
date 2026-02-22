# MarketMind AI - E-commerce Growth Agency

This is a professional AI-driven e-commerce growth agency platform built with Next.js, Genkit, and Firebase.

## Features
- **AI Photoshoot Studio**: Generate professional product imagery with model and environment controls.
- **Listing Optimizer**: SEO-tuned titles and descriptions for Amazon, Flipkart, and Myntra.
- **Growth Intelligence**: Predictive market analysis and competitor benchmarking.
- **Catalog Automation**: Bulk marketplace template generation and validation.
- **Internal Ops Console**: Staff-facing dashboard for order fulfillment and system configuration.

## Production Deployment Guide

To publish this application to a live URL using **Firebase App Hosting**:

### 1. Push to GitHub
Initialize a git repository and push your code to GitHub:
1. Create a new repository on [GitHub](https://github.com/new).
2. Run the following in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial production-ready commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 2. Connect to Firebase App Hosting
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **studio-1862901099-45f44**.
3. In the left sidebar, navigate to **Build > App Hosting**.
4. Click **Get Started**.
5. Connect your GitHub account and select the repository you just created.
6. Configure the deployment (Next.js is automatically detected).
7. Click **Finish and Deploy**. Firebase will now build and host your app on a global CDN.

### 3. Provision Production Services
Ensure these services are active in your console:
- **Authentication**: Enable 'Email/Password' and 'Anonymous' providers.
- **Cloud Firestore**: Initialize the database in your preferred region.
- **Security Rules**: The rules are already defined in `firestore.rules` and will protect your data.

### 4. Post-Deployment Setup
1. Visit your live URL.
2. Navigate to `/internal/login` to access the Staff Portal.
3. Go to **System Config** and enter your production Gemini API Key.
4. Click **Save System Config** to activate the AI agents for all your customers.

## Local Development
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) to view the local instance.
