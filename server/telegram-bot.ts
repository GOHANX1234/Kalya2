import TelegramBot from "node-telegram-bot-api";
import { v2 as cloudinary } from "cloudinary";
import { storage } from "./storage";
import { InsertVideo } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

// Telegram bot token
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Admin chat IDs - only these users can upload videos
const ADMIN_CHAT_IDS = [7479124922, 1721139930];

// Helper function to check if user is admin
function isAdmin(chatId: number): boolean {
  return ADMIN_CHAT_IDS.includes(chatId);
}

// Store user upload sessions
interface UploadSession {
  quality?: string;
  title?: string;
  description?: string;
  step: "quality" | "title" | "description" | "video";
}

const sessions = new Map<number, UploadSession>();

export function initializeTelegramBot() {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  // /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🎬 Welcome to KalyaPlayer Bot!

I help you upload videos to our premium video hosting platform.

🚀 What I can do:
• Upload videos in multiple qualities (360p, 480p, 720p, 1080p)
• Host your videos securely on Cloudinary
• Generate shareable video links

Use /help to see all available commands!`;

    bot.sendMessage(chatId, welcomeMessage);
  });

  // /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `📖 KalyaPlayer Bot Commands:

/start - Start the bot and see welcome message
/help - Show this help message
/upload - Begin video upload process

📹 Upload Process:
1. Use /upload command
2. Select video quality (360p, 480p, 720p, 1080p)
3. Enter video title
4. Enter video description
5. Send your video file

Your video will be uploaded and you'll receive a shareable link!`;

    bot.sendMessage(chatId, helpMessage);
  });

  // /upload command
  bot.onText(/\/upload/, (msg) => {
    const chatId = msg.chat.id;
    
    // Check if user is admin
    if (!isAdmin(chatId)) {
      bot.sendMessage(
        chatId,
        "🚫 Access Denied\n\nSorry, only authorized administrators can upload videos to KalyaPlayer.\n\nIf you believe this is an error, please contact the platform owner."
      );
      return;
    }
    
    // Initialize upload session
    sessions.set(chatId, { step: "quality" });

    const qualityKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "360p", callback_data: "quality_360p" },
            { text: "480p", callback_data: "quality_480p" },
          ],
          [
            { text: "720p", callback_data: "quality_720p" },
            { text: "1080p", callback_data: "quality_1080p" },
          ],
        ],
      },
    };

    bot.sendMessage(
      chatId,
      "🎥 Let's upload your video!\n\nFirst, select the video quality:",
      qualityKeyboard
    );
  });

  // Handle quality selection
  bot.on("callback_query", async (query) => {
    const chatId = query.message!.chat.id;
    const data = query.data;

    // Check if user is admin
    if (!isAdmin(chatId)) {
      await bot.answerCallbackQuery(query.id, { text: "Access denied - admin only" });
      return;
    }

    if (data?.startsWith("quality_")) {
      const quality = data.replace("quality_", "");
      const session = sessions.get(chatId);

      if (session) {
        session.quality = quality;
        session.step = "title";
        sessions.set(chatId, session);

        await bot.answerCallbackQuery(query.id);
        bot.sendMessage(
          chatId,
          `✅ Quality selected: ${quality}\n\n📝 Now, please enter the video title:`
        );
      }
    }
  });

  // Handle text messages (title and description)
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    // Skip if it's a command or video
    if (msg.text?.startsWith("/") || msg.video) {
      return;
    }

    // Check if user is admin for upload session
    if (session && !isAdmin(chatId)) {
      sessions.delete(chatId);
      bot.sendMessage(
        chatId,
        "🚫 Access Denied\n\nOnly authorized administrators can upload videos to KalyaPlayer."
      );
      return;
    }

    if (session && msg.text) {
      if (session.step === "title") {
        session.title = msg.text;
        session.step = "description";
        sessions.set(chatId, session);

        bot.sendMessage(
          chatId,
          `✅ Title saved: "${msg.text}"\n\n📄 Now, please enter the video description:`
        );
      } else if (session.step === "description") {
        session.description = msg.text;
        session.step = "video";
        sessions.set(chatId, session);

        bot.sendMessage(
          chatId,
          `✅ Description saved!\n\n🎬 Finally, please send your video file (you can upload it directly or forward from another chat):`
        );
      }
    }
  });

  // Handle video upload
  bot.on("video", async (msg) => {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    // Check if user is admin
    if (!isAdmin(chatId)) {
      bot.sendMessage(
        chatId,
        "🚫 Access Denied\n\nOnly authorized administrators can upload videos."
      );
      sessions.delete(chatId);
      return;
    }

    if (!session || session.step !== "video") {
      bot.sendMessage(
        chatId,
        "⚠️ Please start the upload process with /upload command first!"
      );
      return;
    }

    if (!session.quality || !session.title || !session.description) {
      bot.sendMessage(
        chatId,
        "❌ Upload session incomplete. Please start again with /upload"
      );
      sessions.delete(chatId);
      return;
    }

    const video = msg.video;
    if (!video) {
      bot.sendMessage(chatId, "❌ No video found. Please send a video file.");
      return;
    }
    const fileId = video.file_id;

    try {
      bot.sendMessage(chatId, "⏳ Uploading your video to Cloudinary...");

      // Download video from Telegram
      const fileLink = await bot.getFileLink(fileId);
      const response = await fetch(fileLink);
      const buffer = await response.arrayBuffer();
      const tempFilePath = path.join("/tmp", `${Date.now()}_${fileId}.mp4`);
      
      fs.writeFileSync(tempFilePath, Buffer.from(buffer));

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "video",
        folder: "kalyaplayer",
        quality: "auto",
      });

      // Clean up temp file
      await unlinkAsync(tempFilePath);

      // Save to database
      const videoData: InsertVideo = {
        title: session.title,
        description: session.description,
        quality: session.quality,
        cloudinaryUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
      };

      const savedVideo = await storage.createVideo(videoData);

      // Clear session
      sessions.delete(chatId);

      // Generate video link
      const productionUrl = process.env.PRODUCTION_URL || 'https://kalyaplayer-82rp.onrender.com';
      const devUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
      const baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : devUrl;
      const videoLink = `${baseUrl}/videos/${savedVideo.id}`;

      const successMessage = `✅ Video uploaded successfully!

📹 Video Details:
• Title: ${session.title}
• Quality: ${session.quality}
• ID: ${savedVideo.id}

🔗 Your video link:
${videoLink}

Share this link with anyone to let them watch your video!`;

      bot.sendMessage(chatId, successMessage);
    } catch (error) {
      console.error("Error uploading video:", error);
      bot.sendMessage(
        chatId,
        "❌ Failed to upload video. Please try again with /upload"
      );
      sessions.delete(chatId);
    }
  });

  console.log("Telegram bot is running...");
  return bot;
}
