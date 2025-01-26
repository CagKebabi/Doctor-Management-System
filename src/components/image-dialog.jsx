import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageDialog({ open, onOpenChange }) {
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
            src="https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ"
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
