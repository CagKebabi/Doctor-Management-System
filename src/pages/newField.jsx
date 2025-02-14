import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recordsService } from "@/services/records.service";
import * as z from "zod";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";

export default function NewField() {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  // Form validation schema
  const formSchema = z.object({
    fieldName: z.string().min(2, {
      message: "Alan adı en az 2 karakter olmalıdır.",
    }),
    fieldType: z.enum(["boolean", "text", "integer"], {
      errorMap: (issue, ctx) => ({ message: 'Lütfen geçerli bir rol seçiniz' })
    }),
  });

  // Form definition
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: "",
      fieldType: "",
    },
  });

  // Edit form definition
  const editForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: "",
      fieldType: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await recordsService.createField(data.fieldName, data.fieldType);
      form.reset();
      fetchFields();
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit form submission handler
  const onEditSubmit = async (data) => {
    try {
      setLoading(true);
      await recordsService.updateField(selectedField.id, data.fieldName, data.fieldType);
      setEditDialogOpen(false);
      editForm.reset();
      fetchFields();
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (field) => {
    setSelectedField(field);
    editForm.reset({
      fieldName: field.field_name,
      fieldType: field.field_type,
    });
    setEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (field) => {
    setSelectedField(field);
    setDeleteDialogOpen(true);
  };

  // Delete confirmation handler
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await recordsService.deleteField(selectedField.id);
      setDeleteDialogOpen(false);
      fetchFields();
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing fields
  const fetchFields = async () => {
    try {
      const response = await recordsService.getFields();
      console.log("Kayıt Detayları:", response);
      setFields(response);
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* <h2 className="text-lg font-medium">Yeni Kayıt Detayı Oluştur</h2> */}
        <div>
          <h3 className="text-lg font-medium">Yeni Kayıt Detayı Oluştur</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir kayıt detayı eklemek için formu doldurun.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fieldName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kayıt Detayı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Kayıt detayı adını giriniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kayıt Detayı Tipi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kayıt detayı tipini seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Yazı</SelectItem>
                      <SelectItem value="integer">Sayı</SelectItem>
                      <SelectItem value="boolean">Evet/Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Kayıt Detayı Oluştur"}
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Mevcut Kayıt Detayları</h3>
          <div className="grid gap-4">
            {fields.map((field, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{field.field_name}</p>
                      <p className="text-sm text-gray-500">{field.field_type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(field)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(field)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kayıt Detayı Düzenle</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="fieldName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kayıt Detayı Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Kayıt detayı adını giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="fieldType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kayıt Detayı Tipi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kayıt detayı tipini seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Yazı</SelectItem>
                        <SelectItem value="integer">Sayı</SelectItem>
                        <SelectItem value="boolean">Evet/Hayır</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kayıt Detayı Silme Onayı</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedField?.field_name}" kayıt detayını silmek istediğinizden emin misiniz?
              <p className="mt-2">Bu işlem geri alınamaz.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}