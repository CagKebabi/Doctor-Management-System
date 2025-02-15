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
import { CircleEllipsis } from "lucide-react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { recordsService } from "@/services/records.service";
import { areaService } from "@/services/area.service";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const columns = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "region_name",
    header: "Bölge",
  },
];

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteValueInRecordLoading, setIsDeleteValueInRecordLoading] = useState(false);
  const [isUpdateValueInRecordLoading, setIsUpdateValueInRecordLoading] = useState(false);
  const [isAddingDetailLoading, setIsAddingDetailLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    region: ""
  });
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const [detailFields, setDetailFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [editingValue, setEditingValue] = useState(null);

  const handleAddDetail = () => {
    if (!newDetailName || !newDetailType || !newDetailValue) return;

    setDetailFields([
      ...detailFields,
      {
        field_name: newDetailName,
        field_type: newDetailType,
        value: newDetailValue
      }
    ]);

    // Reset form
    setNewDetailName("");
    setNewDetailType("");
    setNewDetailValue("");
  };

  const handleRemoveDetail = (index) => {
    const updatedFields = detailFields.filter((_, i) => i !== index);
    setDetailFields(updatedFields);
  };

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

   async function getAreas() {
    try {
      const areas = await areaService.getAreas();
      setAreas(areas);
    } catch (error) {
      console.error('Hata:', error);
    }
  }

  async function getAvailableFields() {
    try {
      const fields = await recordsService.getFields();
      setAvailableFields(fields);
      console.log('Kayıt Detay Listesi:', fields);
      
    } catch (error) {
      console.error('Alan listesi alınamadı:', error);
    }
  }

  useEffect(() => {
    getRecords();
    getAreas();
    getAvailableFields();
  }, []);

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFieldValue("");
  };

  const handleAddValue = async () => {
    setIsAddingDetailLoading(true);
    if (!selectedField || !fieldValue) {
      setIsAddingDetailLoading(false);
      return;
    }

    try {
      const field = {
        field_id: selectedField.id,
        fieldValue: selectedField.field_type === 'boolean' ? fieldValue === 'true' : fieldValue
      };

      await recordsService.addValueToRecord(selectedPatient.id, field);

      // Değerleri sıfırla
      setSelectedField(null);
      setFieldValue("");
      setIsAddingDetailLoading(false);
      
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
    } catch (error) {
      setIsAddingDetailLoading(false);
    }
  };

  const handleUpdateValue = async (valueId) => {
    if (!editingValue?.value) return;
    setIsUpdateValueInRecordLoading(true);
    try {
      await recordsService.updateValueInRecord(selectedPatient.id, valueId, editingValue.value);
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
      setEditingValue(null);
      setIsUpdateValueInRecordLoading(false);
      getRecords();
    } catch (error) {
      console.error('Değer güncellenemedi:', error);
      setIsUpdateValueInRecordLoading(false);
    }
  };

  const handleDeleteValue = async (valueId) => {
    setIsDeleteValueInRecordLoading(true);
    try {
      await recordsService.deleteValueInRecord(selectedPatient.id, valueId);
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
      setIsDeleteValueInRecordLoading(false);
    } catch (error) {
      console.error('Değer silinemedi:', error);
      setIsDeleteValueInRecordLoading(false);
    }
  };

  const handleDetailsClick = async (row) => {
    setSelectedPatient(row);
    setShowDetailsDialog(true);
    
    try {
      const recordDetails = await recordsService.getRecord(row.id);
      setDetailFields(recordDetails.values || []);
    } catch (error) {
      console.error('Kayıt detayları alınamadı:', error);
    }
  };

  // Filtreleme fonksiyonu
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sayfalama için veri hesaplama
  //const itemsPerPage = 10;

  const totalItems = filteredData.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentItems = filteredData.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonu
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

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

  const handleEditClick = (row) => {
    setSelectedPatient(row);
    setEditForm({
      name: row.name,
      region: row.region
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedPatient(row);
    setShowDeleteDialog(true);
  };

  const handleEditConfirm = async () => {
    setIsEditLoading(true);
    try {
      await recordsService.updateRecord(
        selectedPatient.id,
        editForm.name,
        editForm.region
      );
      setSelectedPatient(null);
      setIsEditLoading(false);
      setShowEditDialog(false);
      getRecords();
    } catch (error) {
      console.error('Güncelleme işlemi başarısız:', error);
      setIsEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteLoading(true);
    try {
      await recordsService.deleteRecord(selectedPatient.id);
      // Kayıt silindikten sonra listeyi güncelle
      setSelectedPatient(null);
      setIsDeleteLoading(false);
      setShowDeleteDialog(false);
      getRecords();
    } catch (error) {
      console.error('Silme işlemi başarısız:', error);
      setIsDeleteLoading(false);
    }
  };

  const handlePdfExport = async () => {
    setIsExportingPdf(true);
    try {
      await recordsService.exportRecordsToPDF();
    } catch (error) {
      console.error('PDF export hatası:', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExcelExport = async () => {
    setIsExportingExcel(true);
    try {
      await recordsService.exportRecordsToExcel();
    } catch (error) {
      console.error('Excel export hatası:', error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-4">
      <TableStatistic />
      {/* Search Input and Export Buttons */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="İsme göre ara..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePdfExport()}
            className="h-9 w-9"
            title="PDF olarak indir"
            disabled={isExportingPdf}
          >
            {isExportingPdf ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"/><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"/><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"/><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"/><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"/><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"/><path fill="#909090" d="M23.954 2.077V7.95h5.633z"/><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"/><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"/></svg>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleExcelExport()}
            className="h-9 w-9"
            title="Excel olarak indir"
            disabled={isExportingExcel}
          >
            {
              isExportingExcel ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><defs><linearGradient id="vscodeIconsFileTypeExcel0" x1="4.494" x2="13.832" y1="-2092.086" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#18884f"/><stop offset=".5" stopColor="#117e43"/><stop offset="1" stopColor="#0b6631"/></linearGradient></defs><path fill="#185c37" d="M19.581 15.35L8.512 13.4v14.409A1.19 1.19 0 0 0 9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5Z"/><path fill="#21a366" d="M19.581 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z"/><path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z"/><path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity="0.1"/><path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path fill="url(#vscodeIconsFileTypeExcel0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"/><path fill="#fff" d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017q.123-.281.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.4 2.4 0 0 1 9.2 16.8h-.024a1.7 1.7 0 0 1-.168.351l-1.493 2.722Z"/><path fill="#33c481" d="M28.806 3h-9.225v6.5H30V4.191A1.19 1.19 0 0 0 28.806 3"/><path fill="#107c41" d="M19.581 16H30v6.5H19.581Z"/></svg>
              )
            }            
          </Button>
        </div>
      </div>
      {/* Table */}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <CircleEllipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(row.original)}>
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDetailsClick(row.original)}>
                          Detayları Gör
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(row.original)} className="text-red-600">
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Footer - Pagination and Record Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Toplam {totalItems} kayıt
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-3xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Hasta Düzenle</DialogTitle>
            <DialogDescription>
              Hasta bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                İsim
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Bölge
              </Label>
              <Select 
                value={editForm.region} 
                onValueChange={(value) => setEditForm({ ...editForm, region: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Bölge seçin" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleEditConfirm} disabled={isEditLoading}>
              {isEditLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Kayıt Detayları</DialogTitle>
            <DialogDescription>
              {selectedPatient?.name} isimli kaydın detayları
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Mevcut Detaylar */}
            <div className="space-y-4">
              <h4 className="font-medium">Mevcut Detaylar</h4>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {detailFields.map((detail, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <h3 className="font-semibold text-base">{detail.field_name}</h3>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {editingValue?.id === detail.id ? (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleUpdateValue(detail.id)}
                              disabled={isUpdateValueInRecordLoading}
                            >
                              {isUpdateValueInRecordLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingValue(null)}
                            >
                              İptal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingValue(detail)}
                            >
                              Güncelle
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteValue(detail.id)}
                              disabled={isDeleteValueInRecordLoading}
                            >
                              {isDeleteValueInRecordLoading ? 'Siliniyor...' : 'Sil'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded mb-2">
                      {editingValue?.id === detail.id ? (
                        detail.field_type === 'boolean' ? (
                          <Select
                            //defaultValue={editingValue.value.toString()}
                            value={editingValue.value === "true" ? 'true' : 'false'}
                            onValueChange={(value) => {
                              console.log('Selected value:', value);
                              setEditingValue({
                                ...editingValue,
                                value: value.toString() 
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {editingValue.value ==="true" ? 'Evet' : 'Hayır'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Evet</SelectItem>
                              <SelectItem value="false">Hayır</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : detail.field_type === 'integer' ? (
                          <Input
                            type="number"
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({...editingValue, value: parseInt(e.target.value)})}
                          />
                        ) : (
                          <Input
                            type="text"
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({...editingValue, value: e.target.value})}
                          />
                        )
                      ) : (
                        <p className="text-sm">
                          {detail.field_type === 'boolean' 
                            ? (detail.value === "true" ? 'Evet' : 'Hayır')
                            : detail.value
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500 mb-2">
                      <span>Oluşturulma: {new Date(detail.created_at).toLocaleString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Oluşturan: {detail.created_by}</span>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>

            {/* Yeni Detay Ekleme */}
            <div className="space-y-4">
              <h4 className="font-medium">Yeni Detay Ekle</h4>
              <div className="space-y-2">
                <Select onValueChange={(value) => handleFieldSelect(availableFields.find(f => f.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.field_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedField && (
                  <div className="space-y-2">
                    <Label>Değer</Label>
                    {selectedField.field_type === 'boolean' ? (
                      <Select
                        value={fieldValue}
                        onValueChange={setFieldValue}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Evet</SelectItem>
                          <SelectItem value="false">Hayır</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={selectedField.field_type === 'integer' ? 'number' : 'text'}
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                    )}
                    <Button onClick={handleAddValue} disabled={isAddingDetailLoading}>
                      {isAddingDetailLoading ? 'Ekleniyor...' : 'Ekle'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hastayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu hastayı silmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={isDeleteLoading}>
              {isDeleteLoading ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
