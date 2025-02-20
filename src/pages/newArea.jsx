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
import { areaService } from "@/services/area.service";
import { useNavigate } from "react-router-dom";

// Form doğrulama şeması
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Bölge adı en az 2 karakter olmalıdır.",
  }),
  description: z.string().min(2, {
    message: "Bölge açıklaması en az 2 karakter olmalıdır.",
  }),
  image: z.instanceof(FileList)
    .refine((files) => files.length > 0, "Resim seçilmesi zorunludur.")
    .refine((files) => files[0].size <= 5000000, "Resim boyutu 5MB'dan küçük olmalıdır.")
    .refine(
      (files) => ["image/jpeg", "image/png", "image/jpg"].includes(files[0].type),
      "Sadece .jpg, .jpeg ve .png formatları desteklenmektedir."
    ),
});

export default function NewArea() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
    },
  });

  // Form gönderme işlemi
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image[0]);

      console.log('Form değerleri:', values);
      const response = await areaService.createNewArea(formData);
      console.log('Bölge oluşturuldu:', response);
      navigate("/area-list");
    } catch (error) {
      console.error("Bölge oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
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
              name="name"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge Açıklaması</FormLabel>
                  <FormControl>
                    <Input placeholder="Bölge Açıklaması" {...field} />
                  </FormControl>
                  <FormDescription>Bölgenin açıklaması</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Resim</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                      value={field.value?.fileName}
                    />
                  </FormControl>
                  <FormDescription>
                    Bölge için bir resim seçin (JPG, JPEG veya PNG)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
