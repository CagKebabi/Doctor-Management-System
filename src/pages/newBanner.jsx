import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { popupService } from "@/services/popup.service";
import { cn } from "@/lib/utils";

// Form şeması
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Banner başlığı en az 2 karakter olmalıdır.",
  }),
  image: z.any()
    .refine((image) => image?.length > 0, "Banner görseli yüklenmelidir.")
    .refine(
      (image) => image?.[0]?.size <= 5000000,
      "Dosya boyutu 5MB'dan küçük olmalıdır."
    )
    .refine(
      (image) => 
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(image?.[0]?.type),
      "Sadece .jpg, .jpeg, .png ve .webp formatları desteklenmektedir."
    ),
  is_active: z.boolean().default(true),
});

export default function NewBanner() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState("");

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: undefined,
      is_active: true,
    },
  });

  // Form gönderme işlemi
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("image", values.image[0]);
      formData.append("is_active", values.is_active);

      // Debug için form verilerini kontrol et
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log('Form değerleri:', {
        title: values.title,
        image: values.image[0].name,
        is_active: values.is_active
      });
      
      // API çağrısı burada yapılacak
      const response = await popupService.createNewPopup(formData);
      console.log('Banner oluşturuldu:', response);
      navigate("/");
    } catch (error) {
      console.error("Banner oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Banner Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir banner eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Başlığı</FormLabel>
                  <FormControl>
                    <Input placeholder="Banner başlığını giriniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field }, formState }) => {
                const { error } = formState;
                return (
                  <FormItem>
                    <FormLabel>Banner Görseli</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, onChange)}
                          className={cn(
                            // "file:bg-blue-50 hover:file:bg-blue-100 file:text-blue-600 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer cursor-pointer",
                            error && "border-red-500"
                          )}
                          {...field}
                        />
                        {preview && (
                          <div className="mt-4">
                            <img
                              src={preview}
                              alt="Banner önizleme"
                              className="max-w-full h-auto rounded-lg shadow-sm"
                              style={{ maxHeight: "200px" }}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, WEBP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Banner Aktif
                    </FormLabel>
                    <FormDescription>
                      Banner'ı aktif olarak yayınlamak için işaretleyin
                    </FormDescription>
                  </div>
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
