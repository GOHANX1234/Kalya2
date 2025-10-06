import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTelegram } from "react-icons/fa";
import { Link } from "wouter";
import { Play } from "lucide-react";

export default function Home() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
            KalyaPlayer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium video hosting platform with Telegram bot integration
          </p>
          <Button 
            data-testid="button-upload-telegram"
            variant="default" 
            size="lg"
            asChild
          >
            <a 
              href="https://t.me/kalyatoofan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaTelegram className="w-6 h-6" />
              Upload via Telegram
            </a>
          </Button>
        </div>

        {/* Videos Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Videos</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link 
                  key={video.id} 
                  href={`/videos/${video.id}`}
                  data-testid={`card-video-${video.id}`}
                >
                    <Card className="overflow-hidden hover-elevate transition-all duration-200 group">
                      <div className="relative aspect-video bg-black">
                        <video
                          className="w-full h-full object-cover"
                          preload="metadata"
                        >
                          <source src={video.cloudinaryUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <Badge 
                          data-testid={`badge-quality-${video.id}`}
                          className="absolute top-2 right-2 bg-primary/90 text-primary-foreground"
                        >
                          {video.quality}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 
                          data-testid={`text-title-${video.id}`}
                          className="font-semibold text-foreground line-clamp-1 mb-2"
                        >
                          {video.title}
                        </h3>
                        <p 
                          data-testid={`text-description-${video.id}`}
                          className="text-sm text-muted-foreground line-clamp-2"
                        >
                          {video.description}
                        </p>
                      </div>
                    </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to upload a video using our Telegram bot!
              </p>
              <Button 
                data-testid="button-upload-first"
                variant="default" 
                asChild
              >
                <a 
                  href="https://t.me/kalyatoofan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FaTelegram className="w-5 h-5" />
                  Upload Now
                </a>
              </Button>
            </Card>
          )}
        </div>

        {/* Footer Welcome Message */}
        <Card 
          data-testid="card-welcome-footer"
          className="mt-16 mx-auto max-w-md bg-card/80 backdrop-blur-sm border-2 animate-gradient-border"
        >
          <div className="p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Welcome to KalyaPlayer
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload your videos easily through our Telegram bot and share them with the world
            </p>
            <Button 
              data-testid="button-telegram-footer"
              variant="default" 
              size="default"
              asChild
              className="w-full"
            >
              <a 
                href="https://t.me/kalyatoofan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <FaTelegram className="w-5 h-5" />
                Join on Telegram
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
