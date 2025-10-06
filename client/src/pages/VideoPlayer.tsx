import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaTelegram } from "react-icons/fa";
import { AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function VideoPlayer() {
  const params = useParams();
  const videoId = params.id;
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: video, isLoading, error } = useQuery<Video>({
    queryKey: ["/api/videos", videoId],
    enabled: !!videoId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button data-testid="button-telegram" variant="default" asChild>
            <a 
              href="https://t.me/kalyatoofan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaTelegram className="w-5 h-5" />
              Upload via Telegram
            </a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-8">
        {/* Video Player Section */}
        <div className="relative">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
            <video
              data-testid="video-player"
              controls
              className="w-full h-full"
              controlsList="nodownload"
              preload="metadata"
            >
              <source src={video.cloudinaryUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Quality Badge */}
            <Badge 
              data-testid={`badge-quality-${video.quality}`}
              className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-bold backdrop-blur-sm"
            >
              {video.quality}
            </Badge>
          </div>
        </div>

        {/* Video Metadata Section */}
        <div className="space-y-4">
          <h1 
            data-testid="text-video-title"
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            {video.title}
          </h1>
          <p 
            data-testid="text-video-description"
            className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-prose"
          >
            {video.description}
          </p>
        </div>

        {/* Embed Section */}
        <Card className="bg-card/80 backdrop-blur-sm border-card-border">
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              Embed This Video
            </h3>
            <p className="text-sm text-muted-foreground">
              Copy the code below to embed this video on your website
            </p>
            
            <div className="relative">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-border">
                <code className="text-foreground">
                  {`<iframe 
  src="https://kalyaplayer-82rp.onrender.com/videos/${video.id}" 
  width="560" 
  height="315" 
  frameborder="0" 
  allowfullscreen
  loading="lazy"
  allow="autoplay; fullscreen"
  title="${video.title}">
</iframe>`}
                </code>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  const embedCode = `<iframe src="https://kalyaplayer-82rp.onrender.com/videos/${video.id}" width="560" height="315" frameborder="0" allowfullscreen loading="lazy" allow="autoplay; fullscreen" title="${video.title}"></iframe>`;
                  navigator.clipboard.writeText(embedCode);
                  setCopied(true);
                  toast({
                    title: "Copied!",
                    description: "Embed code copied to clipboard",
                  });
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Responsive</Badge>
              <Badge variant="outline">Lazy Loading</Badge>
              <Badge variant="outline">Fullscreen Support</Badge>
            </div>
          </div>
        </Card>

        {/* Owner Welcome Message */}
        <Card 
          data-testid="card-owner-message"
          className="mt-8 mx-auto max-w-md bg-card/80 backdrop-blur-sm border-2 animate-gradient-border"
        >
          <div className="p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Welcome to KalyaPlayer
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload your videos easily through our Telegram bot
            </p>
            <Button 
              data-testid="button-telegram-owner"
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
