import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell } from "lucide-react";

export default function NotificationNavigation() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Bildirimler"
            >
              <Bell className="h-5 w-5" />
              {/* <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white flex justify-center items-center">
                3
              </span> */}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bildirimleri Görüntüle</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}