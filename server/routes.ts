import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeTelegramBot } from "./telegram-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Telegram bot
  initializeTelegramBot();

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get single video by ID
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid video ID" });
      }

      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
