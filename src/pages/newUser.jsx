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
import { userService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";

// Form doğrulama şeması
const formSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz.",
  }),
  password: z.string().min(8, {
    message: "Şifre en az 8 karakter olmalıdır.",
  }),
  role: z.enum(["admin", "doctor"], {
    errorMap: (issue, ctx) => ({ message: 'Lütfen geçerli bir rol seçiniz' })
  }),
});

export default function NewUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [userRole, setUserRole] = useState(localStorage.getItem('role'));

 const userRole = localStorage.getItem('role');
  

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  // Form gönderme işlemi
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      console.log('Form değerleri:', values);
      const response = await userService.createNewUser(
        values.email,
        values.password,
        values.role
      );
      console.log('Kullanıcı oluşturuldu:', response);
      navigate("/user-list");
    } catch (error) {
      console.error("Kullanıcı oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Kullanıcı Oluştur</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir kullanıcı ekleyin
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="ornek@email.com"
                      autoComplete="new-email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="******"
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rol seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        userRole === "admin" && (
                          <>
                          <SelectItem value="doctor">Doktor</SelectItem>
                          </>
                        )
                      }
                      {
                        userRole === "superadmin" && (
                          <>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="doctor">Doktor</SelectItem>  
                          </>
                         )
                      }
                      {/* <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Doktor</SelectItem> */}
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
