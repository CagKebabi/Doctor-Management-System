import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log('Login başarılı:', response);
      
      if (response.access && response.refresh) {
        localStorage.setItem('token', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('role', response.user.role);

        console.log("Access Token:", localStorage.getItem('token'));
        console.log("Refresh Token:", localStorage.getItem('refreshToken'));
        console.log("role", localStorage.getItem('role'));
        
        
        navigate("/");
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      console.error('Login error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-1.5">
                <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
                <p className="text-balance text-muted-foreground">
                  Doktor Yönetim Sistemi hesabınıza giriş yapın
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  // autoComplete="email"
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Şifre</Label>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  // autoComplete="current-password"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
              {/* <div className="text-center text-sm">
                Bir hesabınız yok mu?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Kayıt Ol
                </Link>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
