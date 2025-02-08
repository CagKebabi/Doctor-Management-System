import { TableStatistic } from "@/components/table-statistic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { recordsService } from "@/services/records.service";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

const columns = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "region",
    header: "Bölge",
  },
  // {
  //   accessorKey: "is_active",
  //   header: "Durum",
  // }
];

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const itemsPerPage = 10;

  // Kayıt listesi
  async function getRecords() {
    try {
      const records = await recordsService.getRecords();
      console.log('Kayıtlar:', records);
      setData(records);
    } catch (error) {
      console.error('Hata:', error);
    }
   }

  useEffect(() => {
    getRecords();
  }, []);

  // Filtreleme fonksiyonu
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sayfalama için veri hesaplama
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Table fonksiyonları
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

  return (
    <div className="space-y-4">
      <TableStatistic />
      
      {/* Search Input */}
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="İsme göre ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div> */}
      <div className="flex items-center py-4">
        <Input
          placeholder="İsme göre ara..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          {/* <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Bölge</TableHead>
              <TableHead>Oluşturan</TableHead>
              <TableHead>Olusturulma Tarihi</TableHead>
              <TableHead>Son Güncelleme Tarihi</TableHead>
            </TableRow>
          </TableHeader> */}
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
            {/* {Array.isArray(filteredData) && filteredData.length > 0 ? filteredData.map((item, index) => (
              <TableRow 
                key={index}
                data-state={row.getIsSelected() && "selected"}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell>{item.created_by}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
            :
            (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )
            } */}
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

      {/* Footer - Pagination and Record Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Toplam {totalItems} kayıt
        </div>
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first page, current page, last page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
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
  );
}
