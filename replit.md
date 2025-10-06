# KalyaPlayer - Video Hosting Platform

## Overview
KalyaPlayer is a premium video hosting platform with Telegram bot integration. Users can upload videos through a Telegram bot, which are then hosted on Cloudinary and accessible via custom video player pages on the website.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Icons
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (video hosting)
- **Bot**: Telegram Bot API (node-telegram-bot-api)
- **Deployment**: Configured for Render on port 5000

## Features
### Telegram Bot
- `/start` - Welcome message and bot introduction
- `/help` - Display all available commands and usage instructions
- `/upload` - Complete video upload workflow:
  1. Quality selection (360p, 480p, 720p, 1080p)
  2. Title input
  3. Description input
  4. Video upload (manual upload or forward from another chat)

### Website
- **Homepage**: Display all uploaded videos in a grid
- **Video Player Page** (`/videos/:id`): 
  - Custom video player with quality indicator badge
  - Video title and description display
  - Owner welcome message with animated gradient border
  - Telegram link for easy uploads
- **Mobile-First Design**: Fully responsive across all devices

## Architecture
### Data Model
```typescript
Video {
  id: number (auto-increment)
  title: string
  description: string
  quality: "360p" | "480p" | "720p" | "1080p"
  cloudinaryUrl: string
  cloudinaryPublicId: string
}
```

### API Endpoints
- `GET /api/videos` - Fetch all videos
- `GET /api/videos/:id` - Fetch single video by ID

### Telegram Bot Workflow
1. User sends `/upload` command
2. Bot presents quality options (inline keyboard)
3. User enters video title (text message)
4. User enters video description (text message)
5. User uploads video file
6. Bot uploads to Cloudinary
7. Metadata saved to MongoDB
8. User receives shareable video link

## Configuration
### Credentials (Hardcoded)
- **Cloudinary**:
  - Cloud Name: dvaiziagm
  - API Key: 987384425582773
  - API Secret: oergohaEEIRZb3qinTH1te-ywqg

- **MongoDB Atlas**: 
  - Connection String: `mongodb+srv://bayef85829_db_user:B19PExYFETX7O7lU@cluster0.bazlqbd.mongodb.net/host_db?retryWrites=true&w=majority&appName=Cluster0`

- **Telegram Bot**:
  - Token: 8327387561:AAErzr6omwAcuzB_UGE5z9vcZ7IkCYbU45c

## Deployment (Render)
- **Port**: 5000 (configured in server)
- **Single Server**: Handles both bot webhooks/polling and frontend routes
- **Build Command**: `npm run build`
- **Start Command**: `npm run dev` (or `npm start` for production)

## Recent Changes
- December 2024: Initial project setup with complete MVP implementation
  - Implemented Telegram bot with upload workflow
  - Integrated Cloudinary for video hosting
  - Connected MongoDB Atlas for metadata storage
  - Built responsive video player frontend
  - Configured for Render deployment

## Project Structure
```
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/  # Navbar component
│   │   ├── pages/       # Home and VideoPlayer pages
│   │   └── App.tsx      # Main app with routing
├── server/              # Backend Express app
│   ├── telegram-bot.ts  # Telegram bot logic
│   ├── storage.ts       # MongoDB storage implementation
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
│   └── schema.ts        # Video data model
└── design_guidelines.md # Design system documentation
```

## User Preferences
- Mobile-first, responsive design is critical
- Premium video player experience
- Animated gradient border on welcome message
- Clean, modern UI with Tailwind CSS
