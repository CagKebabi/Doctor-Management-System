import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { TableStatistic } from "@/components/table-statistic";
import { authService } from "../services/auth.service";

const columns = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "email",
    header: "E-posta",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
];

// Örnek data
const data = [
  {
    name: "Ahmet Şenses",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Önrek",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    role: "Admin",
  },
];

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Kullanıcı giriş yapmamışsa null döndür (sayfa içeriğini gösterme)
  if (!authService.isAuthenticated()) {
    return null;
  }

  return (
    <>
      <TableStatistic />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
      />
    </>
  );
}
