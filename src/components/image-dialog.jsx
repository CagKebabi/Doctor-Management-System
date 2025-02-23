import { useState } from "react";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { popupService } from "@/services/popup.service";
import { API_BASE_URL } from "@/api/config";

export function ImageDialog({ open, onOpenChange }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await popupService.getPopups();
        setBanners(response);
      } catch (err) {
        console.error("Banner listesi yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hoşgeldiniz!</DialogTitle>
          <DialogDescription>
            Doktor yönetim sistemine hoş geldiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <img
            src={`${API_BASE_URL}${banners.find(banner => banner.is_active)?.image || "https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ"}`}
            alt="Welcome"
            className="h-[300px] w-[400px] rounded-lg object-cover"
          />
          <p className="text-center text-sm text-muted-foreground">
            Sağlık hizmetlerini dijitalleştirmek için buradayız.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
