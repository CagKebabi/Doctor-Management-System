import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { areaService } from "@/services/area.service";
import { recordsService } from "@/services/records.service";
import { useNavigate } from "react-router-dom";
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

export default function NewRecord() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

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

  // Form doğrulama şeması
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Kayıt adı en az 2 karakter olmalıdır.",
    }),
    region: z.string({
      required_error: "Lütfen bir bölge seçiniz",
    }).refine((value) => areas.some(area => area.id === value), {
      message: "Lütfen geçerli bir bölge seçiniz",
    })
  });

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",  
      region: "",
    },
  });

  // Form gönderme işlemi
  // async function onSubmit(values) {
  //   setLoading(true);
  //   try {
  //     // API çağrısı burada yapılacak
  //     const record = await recordService.createRecord(values);
  //     console.log(record);
  //     // Başarılı kayıt mesajı göster
  //   } catch (error) {
  //     console.error("Kayıt hatası:", error);
  //     // Hata mesajı göster
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      console.log('Form değerleri:', values);
      const response = await recordsService.createNewRecord(
        values.name,
        values.region
      );
      console.log('Kayıt oluşturuldu:', response);
      navigate("/patient-list");
    } catch (error) {
      console.error("Kayıt oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Kayıt Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir kayıt eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kayıt Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Kayıt adı" {...field} />
                  </FormControl>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
