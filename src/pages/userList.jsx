import { DataTable } from "@/components/data-table";
import { UserTableStatistic } from "@/components/user-table-statistic";
import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
//BU KISIM
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Edit, Trash2 } from "lucide-react";
//BU KISIM


const columns = [
  {
    accessorKey: "email",
    header: "E-posta",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "is_active",
    header: "Durum",
  }
];


export default function UserList() {
  const [data, setData] = useState([]);
  //BU KISIM
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedData, setEditedData] = useState({
    email: "",
    is_active: false
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  //BU KISIM

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

  //BU KISIM
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditedData({
      email: row.original.email,
      is_active: row.original.is_active || false
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteDialogOpen(true);
  };

  const handleSaveClick = async () => {
    setIsEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', editedData.email);
      formData.append('is_active', editedData.is_active);

      await userService.updateUser(selectedRow.original.id, formData);
      setEditDialogOpen(false);
      setSelectedRow(null);
      setEditedData({
        email: "",
        is_active: false
      });
      // Tabloyu güncelle
      setIsEditLoading(false);
      getUsers();
    } catch (error) {
      console.error('Kullanıcı güncelleme hatası:', error);
      setIsEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteLoading(true);
    try {
      await userService.deleteUser(selectedRow.original.id);
      setDeleteDialogOpen(false);
      setSelectedRow(null);
      setIsDeleteLoading(false);
      // Tabloyu güncelle
      getUsers();
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
      setIsDeleteLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  //BU KISIM

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
      <UserTableStatistic data={data} />
      {/* <DataTable
        columns={columns}
        data={data}
        filterColumn="email"
        onRowSave={handleRowSave}
      /> */}
      <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="E-posta ile ara..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead>İşlemler</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(row)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(row)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>
              Kullanıcı bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-posta
              </Label>
              <Input
                id="email"
                value={editedData.email}
                onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Durum
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={editedData.is_active}
                  onCheckedChange={(checked) => 
                    setEditedData({ ...editedData, is_active: checked })
                  }
                />
                <Label htmlFor="status" className="text-sm text-muted-foreground">
                  {editedData.is_active ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveClick} disabled={isEditLoading}>
              {isEditLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silme İşlemini Onayla</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleteLoading} className="bg-red-500 hover:bg-red-700">
              {isDeleteLoading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Toplam {table.getFilteredRowModel().rows.length} kayıt
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              >
                1
              </PaginationLink>
            </PaginationItem>
            {table.getPageCount() > 2 && <PaginationEllipsis />}
            {table.getPageCount() > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                >
                  {table.getPageCount()}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={
                  !table.getCanNextPage()
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    </>
  );
}
