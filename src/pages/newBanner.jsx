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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Form doğrulama şeması
const formSchema = z.object({
  bannerImage: z.string().min(2, {
    message: "Banner resmi yüklenmelidir.",
  }),
});

export default function NewBanner() {
  const [loading, setLoading] = useState(false);

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerImage: "",
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
          <h3 className="text-lg font-medium">Yeni Banner Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir banner eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field, formState }) => {
                const { error } = formState;
                const onChange = (event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    field.onChange(file);
                  }
                };
                return (
                  <FormItem>
                    <FormLabel>Banner Görseli</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="file"
                        accept="image/*"
                        placeholder="Banner Görseli"
                        onChange={onChange}
                        {...field}
                        className={cn(
                          "block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-foreground file:text-background hover:file:bg-primary-foreground",
                          error && "border-destructive"
                        )}
                      /> */}
                        <Input 
                          id="picture" 
                          type="file" 
                          onChange={onChange}
                          {...field}
                          className={cn(
                          error && "border-destructive"
                        )}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
