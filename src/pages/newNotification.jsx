import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notification.service";
import { areaService } from "@/services/area.service";


// Rol seçenekleri
const roleOptions = [
  { value: "all", label: "Tümü" },
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doktor" },
];

// Bölge seçenekleri
const regionOptions = [
  { value: "all", label: "Tüm Bölgeler" },
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "bursa", label: "Bursa" },
];

export default function NewNotification() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);

  // Form doğrulama şeması
  const formSchema = z.object({
    text: z.string().min(10, {
      message: "Duyuru metni en az 10 karakter olmalıdır.",
    }),
    targetRole: z.enum(["admin", "doctor"], {
      errorMap: (issue, ctx) => ({ message: 'Lütfen geçerli bir rol seçiniz' }),
    }),
    region: z.string({
      required_error: "Lütfen bir bölge seçiniz",
    }).refine((value) => areas.some(area => area.id === value), {
      message: "Lütfen geçerli bir bölge seçiniz",
    })
  });

  // Bölge listesi alınıyor
  useEffect(() => {
    async function getAreas() {
      try {
        const areas = await areaService.getAreas();
        setAreas(areas);
      } catch (error) {
        console.error('Hata:', error);
      }
    }
    getAreas();
  }, []);

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      targetRole: "",
      region: "",
    },
  });

  // Form gönderme işlemi
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      console.log('Form değerleri:', values);
      const response = await notificationService.createNewNotification(
        values.text,
        values.targetRole,
        values.region
      );
      console.log('Duyuru oluşturuldu:', response);
      navigate("/notifications");
    } catch (error) {
      console.error("Duyuru oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Duyuru Oluştur</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir duyuru ekleyin
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duyuru Metni</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Duyuru metnini giriniz..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Duyuru metni en az 10 karakter olmalıdır.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hedef Rol</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hedef rol seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Duyuruyu kimlerin görebileceğini seçin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bölge seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Duyurunun hangi bölgede görüneceğini seçin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Duyuru Oluştur"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
