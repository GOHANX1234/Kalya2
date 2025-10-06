import { Link } from "wouter";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            data-testid="link-home"
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent hover-elevate px-2 py-1 rounded-md transition-all duration-200"
          >
            KalyaPlayer
          </Link>
          
          <Button 
            data-testid="button-telegram"
            variant="default" 
            size="default"
            asChild
          >
            <a 
              href="https://t.me/kalyatoofan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaTelegram className="w-5 h-5" />
              <span className="hidden sm:inline">Upload via Telegram</span>
              <span className="sm:hidden">Upload</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
