import { MongoClient, Db, ObjectId } from "mongodb";
import { type Video, type InsertVideo } from "@shared/schema";

const MONGODB_URI = "mongodb+srv://bayef85829_db_user:B19PExYFETX7O7lU@cluster0.bazlqbd.mongodb.net/host_db?retryWrites=true&w=majority&appName=Cluster0";

export interface IStorage {
  getVideo(id: number): Promise<Video | null>;
  getAllVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;
  private connected = false;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  private async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.db = this.client.db("host_db");
      this.connected = true;
      console.log("Connected to MongoDB Atlas");
    }
  }

  private async getCollection() {
    await this.connect();
    return this.db!.collection("videos");
  }

  async getVideo(id: number): Promise<Video | null> {
    const collection = await this.getCollection();
    const video = await collection.findOne({ id });
    if (!video) return null;
    
    return {
      id: video.id as number,
      title: video.title as string,
      description: video.description as string,
      quality: video.quality as string,
      cloudinaryUrl: video.cloudinaryUrl as string,
      cloudinaryPublicId: video.cloudinaryPublicId as string,
    };
  }

  async getAllVideos(): Promise<Video[]> {
    const collection = await this.getCollection();
    const videos = await collection.find({}).sort({ id: -1 }).toArray();
    return videos.map(v => ({
      id: v.id as number,
      title: v.title as string,
      description: v.description as string,
      quality: v.quality as string,
      cloudinaryUrl: v.cloudinaryUrl as string,
      cloudinaryPublicId: v.cloudinaryPublicId as string,
    }));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const collection = await this.getCollection();
    
    // Get the next ID
    const lastVideo = await collection.findOne({}, { sort: { id: -1 } });
    const nextId = lastVideo ? ((lastVideo.id as number) + 1) : 1;
    
    const video: Video = {
      id: nextId,
      ...insertVideo as any,
    };
    
    await collection.insertOne(video as any);
    return video;
  }
}

export const storage = new MongoStorage();
