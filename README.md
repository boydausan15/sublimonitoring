# LJ PRINTS - Production Management System

This application is a full-stack production management system built with React, Vite, Express, and Firebase.

## 🚀 Getting Started

To run this application locally or deploy it to a platform like Vercel, Railway, or Render, follow these steps:

### 1. Environment Variables

You must configure your Firebase credentials. Create a `.env` file in the root directory (or set these in your deployment platform's environment variables):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API Key (Optional, if using AI features)
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Installation

```bash
npm install
```

### 3. Development

```bash
npm run dev
```

### 4. Production Build & Start

```bash
npm run build
npm start
```

## 🌐 Deployment Note

This is a **Full-Stack** application with an Express backend. It **cannot** be hosted on static-only platforms like GitHub Pages. 

Please use a platform that supports Node.js (e.g., Vercel, Render, Railway, or Google Cloud Run).

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React, Motion
- **Backend**: Express.js
- **Database**: Firebase Firestore
- **Build Tool**: Vite
