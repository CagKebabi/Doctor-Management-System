import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { areaService } from "@/services/area.service";
import { recordsService } from "@/services/records.service";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function NewRecord() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailFields, setDetailFields] = useState([]);
  const [newDetailName, setNewDetailName] = useState("");
  const [newDetailType, setNewDetailType] = useState("");
  const [newDetailValue, setNewDetailValue] = useState("");

  // Bölge listesi alınıyor
  useEffect(() => {
    async function getAreas() {
      try {
        const areas = await areaService.getAreas();
        setAreas(areas);
      } catch (error) {
        console.error('Hata:', error);
      }
    }
    getAreas();
  }, []);

  // Form doğrulama şeması
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Kayıt adı en az 2 karakter olmalıdır.",
    }),
    region: z.string({
      required_error: "Lütfen bir bölge seçiniz",
    }).refine((value) => areas.some(area => area.id === value), {
      message: "Lütfen geçerli bir bölge seçiniz",
    })
  });

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",  
      region: "",
    },
  });

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

  const handleDetailsConfirm = async () => {
    setIsDetailsLoading(true);
    try {
      // detailFields'i API'nin beklediği formata dönüştür
      const formattedData = {
        fields: detailFields
      };

      await recordsService.addFieldsToRecord(selectedPatient.id, formattedData);
      setSelectedPatient(null);
      setDetailFields([]); // Formu temizle
      setIsDetailsLoading(false);
      setShowDetailsDialog(false);
      window.location.href = "/patient-list"; // Başarılı kayıttan sonra listeye git
    } catch (error) {
      console.error('Detaylar kaydedilemiyor:', error);
      setIsDetailsLoading(false);
    }
  };

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      console.log('Form değerleri:', values);
      const response = await recordsService.createNewRecord(
        values.name,
        values.region
      );
      console.log('Kayıt oluşturuldu:', response);
      setSelectedPatient(response); // Oluşturulan kaydı selectedPatient'a ata
      setShowDetailsDialog(true); // Detay diyaloğunu göster
    } catch (error) {
      console.error("Kayıt oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Kayıt Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir kayıt eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kayıt Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Kayıt adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bölge seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
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

      {/* Record Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Kayıt Detayları</DialogTitle>
            <DialogDescription>
              Yeni oluşturulan kayıt için detay ekleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          
          {/* Eklenen Detaylar */}
          {detailFields.length > 0 && (
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-3">Eklenen Detaylar</h4>
              {detailFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded">
                  <div>
                    <span className="font-medium">{field.field_name}: </span>
                    <span>{field.value}</span>
                    <span className="text-gray-500 text-sm ml-2">({field.field_type})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveDetail(index)}
                  >
                    Sil
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Yeni Detay Ekleme Formu */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Detay Adı</Label>
              <Input
                className="col-span-3"
                value={newDetailName}
                onChange={(e) => setNewDetailName(e.target.value)}
                placeholder="Detay adını giriniz"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Detay Türü</Label>
              <Select
                value={newDetailType}
                onValueChange={setNewDetailType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Detay türünü seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Yazı</SelectItem>
                  <SelectItem value="integer">Sayı</SelectItem>
                  <SelectItem value="boolean">Evet/Hayır</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seçilen türe göre değer inputu */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Değer</Label>
              {newDetailType === "boolean" ? (
                <Select
                  value={newDetailValue}
                  onValueChange={setNewDetailValue}
                  className="col-span-3"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Değer seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Evet</SelectItem>
                    <SelectItem value="false">Hayır</SelectItem>
                  </SelectContent>
                </Select>
              ) : newDetailType === "integer" ? (
                <Input
                  type="number"
                  className="col-span-3"
                  value={newDetailValue}
                  onChange={(e) => setNewDetailValue(e.target.value)}
                  placeholder="Sayısal değer giriniz"
                />
              ) : (
                <Input
                  className="col-span-3"
                  value={newDetailValue}
                  onChange={(e) => setNewDetailValue(e.target.value)}
                  placeholder="Değer giriniz"
                />
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddDetail}
              className="ml-auto"
            >
              Detay Ekle
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDetailsDialog(false);
              setDetailFields([]);
              setNewDetailName("");
              setNewDetailType("");
              setNewDetailValue("");
              window.location.href = "/patient-list"; // İptal durumunda listeye git
            }}>
              İptal
            </Button>
            <Button onClick={handleDetailsConfirm} disabled={isDetailsLoading}>
              {isDetailsLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
