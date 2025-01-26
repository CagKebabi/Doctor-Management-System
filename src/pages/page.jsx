import { DataTable } from "@/components/data-table";
import { TableStatistic } from "@/components/table-statistic";
import NewUser from "./newUser";

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
