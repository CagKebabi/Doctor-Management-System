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

export default function PatientList() {
  //Edit İşlemleri
  const handleRowSave = async (editedData) => {
    // Handle saving the edited data
    try {
      // Make API call or update data
      console.log('Saving:', editedData);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };
  return (
    <>
      <TableStatistic />
      <DataTable
        columns={columns}
        data={data}
        filterColumn="name"
        onRowSave={handleRowSave}
      />
    </>
  );
}
