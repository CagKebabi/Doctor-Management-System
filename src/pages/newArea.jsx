import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form doğrulama şeması
const formSchema = z.object({
  notificationTitle: z.string().min(2, {
    message: "Duyuru başlığı en az 2 karakter olmalıdır.",
  }),
  notificationText: z.string().min(2, {
    message: "Duyuru metni en az 2 karakter olmalıdır.",
  }),
  status: z.string({
    required_error: "Lütfen bir durum seçiniz.",
  }),
});

export default function NewArea() {
  const [loading, setLoading] = useState(false);

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        notificationTitle: "",
        notificationText: "",
        status: "active",
    },
  });

  // Form gönderme işlemi
  async function onSubmit(values) {
    setLoading(true);
    try {
      // API çağrısı burada yapılacak
      console.log(values);
      // Başarılı kayıt mesajı göster
    } catch (error) {
      console.error("Kayıt hatası:", error);
      // Hata mesajı göster
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Bölge Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir bölge eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="notificationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Bölge Adı" {...field} />
                  </FormControl>
                  <FormDescription>Bölgenin adı</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge Açıklaması</FormLabel>
                  <FormControl>
                    <Input placeholder="Bölge Açıklaması" {...field} />
                  </FormControl>
                  <FormDescription>Bölgenin açıklaması</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="pending">Beklemede</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
