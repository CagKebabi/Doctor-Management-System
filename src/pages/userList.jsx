import { DataTable } from "@/components/data-table";
import { TableStatistic } from "@/components/table-statistic";
import NewUser from "./newUser";
import { useEffect, useState } from "react";
import { userService } from "../services/user.service";


const columns = [
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
// const data = [
//   {
//     name: "Ahmet Şenses",
//     email: "ahmet@ornek.com",
//     role: "Admin",
//   },
//   {
//     name: "Ahmet Yılmaz",
//     email: "ahmet@ornek.com",
//     role: "Admin",
//   },
// ];

export default function UserList() {
  const [data, setData] = useState([]);
  async function getUsers() {
    try {
      const users = await userService.getUsers();
      console.log('Kullanıcılar:', users);
      setData(users);
    } catch (error) {
      console.error('Hata:', error);
    }
  } 
  useEffect(() => {
    getUsers();
  }, []);

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
        filterColumn="email"
        onRowSave={handleRowSave}
      />
    </>
  );
}
