import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const TestComponent = () => {
    // Form elemanlarını tutacak state
    const [formElements, setFormElements] = useState([]);
    // Modal açık/kapalı state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Yeni form elemanı için form
    const newElementForm = useForm({
        defaultValues: {
            label: "",
            type: ""
        }
    });

    // Form elemanı ekleme fonksiyonu
    const addFormElement = (data) => {
        setFormElements([...formElements, data]);
        setIsDialogOpen(false);
        newElementForm.reset();
        toast.success("Form elemanı eklendi!");
    };

    // Ana form için
    const mainForm = useForm();

    const onSubmit = (data) => {
        console.log("Form data:", data);
        toast.success("Form gönderildi!");
    };

    // Input tipleri
    const inputTypes = [
        { value: "text", label: "Metin" },
        { value: "number", label: "Sayı" },
        { value: "email", label: "E-posta" },
        { value: "password", label: "Şifre" },
        { value: "date", label: "Tarih" },
        { value: "tel", label: "Telefon" }
    ];

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Dinamik Form Oluşturucu</span>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Yeni Form Elemanı Ekle</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yeni Form Elemanı</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={newElementForm.handleSubmit(addFormElement)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="label">Etiket</Label>
                                        <Input
                                            id="label"
                                            {...newElementForm.register("label")}
                                            placeholder="Form elemanı etiketi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tip</Label>
                                        <Select onValueChange={(value) => newElementForm.setValue("type", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Input tipi seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {inputTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full">Ekle</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...mainForm}>
                        <form onSubmit={mainForm.handleSubmit(onSubmit)} className="space-y-4">
                            {formElements.map((element, index) => (
                                <FormField
                                    key={index}
                                    control={mainForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{element.label}</FormLabel>
                                            <FormControl>
                                                <Input type={element.type} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            {formElements.length > 0 && (
                                <Button type="submit" className="w-full">
                                    Formu Gönder
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestComponent;