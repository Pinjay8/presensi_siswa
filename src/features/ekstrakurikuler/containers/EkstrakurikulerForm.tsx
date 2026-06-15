/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { useSchool } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { z } from "zod";
import { useEkstrakurikuler, useEkstrakurikulerCreation } from "../hooks";
import { courseCreateSchema, ekstrakurikulerCreateSchema } from "../utils";
import { useClassroom } from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { FaFileExcel } from "react-icons/fa";
import { useTeacherDetail } from "@/features/teacher/hooks";
import { useBiodataGuru } from "@/features/user";

// Interface for initial data
interface EkstrakurikulerInitialData {
  id?: number;
  // namaMataPelajaran?: string;
  // sekolahId?: number;
  // kelasId?: number;
  // tipe?: string;
  nama?: string;
  jenis?: string;
  pembinaId?: number;
  deskripsi?: string;
  lokasi?: string;
  thumbnail?: any;
  kontak?: string;
}

// Fungsi untuk menghasilkan template Excel dari file di public folder
const generateCourseTemplateExcel = () => {
  const templatePath = "/template_jadwal.xlsx"; // Path relatif dari public
  fetch(templatePath)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      const wb = XLSX.read(arrayBuffer, { type: "buffer" });
      XLSX.writeFile(wb, "Template_Upload_Mata_Pelajaran.xlsx");
    })
    .catch((error) => {
      console.error("Error loading template file:", error);
    });
};

export const EkstrakurikulerForm = ({
  onClose,
  initialData,
}: {
  onClose?: () => void;
  initialData?: EkstrakurikulerInitialData;
}) => {
  const creation = useEkstrakurikulerCreation();
  const alert = useAlert();
  const profile = useProfile();
  const resource = useEkstrakurikuler();
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const isEdit = Boolean(initialData?.id);

  const teacher = useBiodataGuru();

  const form = useForm<z.infer<typeof ekstrakurikulerCreateSchema>>({
    resolver: zodResolver(ekstrakurikulerCreateSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      jenis: initialData?.jenis || "",
      pembinaId: initialData?.pembinaId || 0,
      deskripsi: initialData?.deskripsi || "",
      lokasi: initialData?.lokasi || "",
      thumbnail: initialData?.thumbnail || "",
      kontak: initialData?.kontak || "",
    },
  });

  async function onSubmit(data: z.infer<typeof ekstrakurikulerCreateSchema>) {
    try {
      if (!isEdit) {
        const isDuplicate = resource.data?.some(
          (course) =>
            course.namaMataPelajaran.toLowerCase() === data.nama.toLowerCase(),
        );

        if (isDuplicate) {
          alert.error(
            lang.text("errorDuplicateCourse", { context: data.nama }),
          );
          return;
        }
      }

      if (isEdit) {
        await creation.update(Number(initialData?.id), {
          nama: data.nama,
          jenis: data.jenis,
          pembinaId: data.pembinaId,
          deskripsi: data.deskripsi,
          lokasi: data.lokasi,
          thumbnail: data.thumbnail,
          kontak: data.kontak,
        });
      } else {
        await creation.create({
          nama: data.nama,
          jenis: data.jenis,
          pembinaId: data.pembinaId,
          deskripsi: data.deskripsi,
          lokasi: data.lokasi,
          thumbnail: data.thumbnail,
          kontak: data.kontak,
        });
      }

      alert.success(
        isEdit
          ? lang.text("successUpdate", { context: lang.text("course") })
          : lang.text("successCreate", { context: lang.text("course") }),
      );

      resource.query.refetch();
      onClose?.();
    } catch (err: any) {
      alert.error(
        err?.message ||
          (isEdit
            ? lang.text("failUpdate", { context: lang.text("course") })
            : lang.text("failCreate", { context: lang.text("course") })),
      );
    }
  }

  // Handle Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadStatus(lang.text("errSystem"));
      return;
    }

    try {
      setUploadStatus(lang.text("loading"));
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transformasi data ke format API
        const formattedData = jsonData.map((row: any) => ({
          namaMataPelajaran: row["Mata Pelajaran"]?.trim() || "",
          namaKelas: row["Nama Kelas"]?.trim() || "",
        }));

        // Validasi data
        // const validClasses =
        //   classroom.data?.map((cls) => cls.namaKelas.toLowerCase()) || [];
        // const validData = formattedData.filter(
        //   (item) =>
        //     item.namaMataPelajaran &&
        //     item.namaKelas &&
        //     validClasses.includes(item.namaKelas.toLowerCase()),
        // );

        // if (validData.length === 0) {
        //   setUploadStatus(lang.text("errSystem"));
        //   return;
        // }

        // // Cek kelas yang tidak valid
        // const invalidClasses = formattedData
        //   .filter(
        //     (item) =>
        //       item.namaKelas &&
        //       !validClasses.includes(item.namaKelas.toLowerCase()),
        //   )
        //   .map((item) => item.namaKelas);
        // if (invalidClasses.length > 0) {
        //   setUploadStatus(
        //     lang.text("errSystem", {
        //       context: invalidClasses.join(", "),
        //     }),
        //   );
        //   return;
        // }

        // // Cek duplikasi mata pelajaran
        // const duplicates = validData.filter((item) =>
        //   resource.data?.some(
        //     (course) =>
        //       course.namaMataPelajaran.toLowerCase() ===
        //       item.namaMataPelajaran.toLowerCase(),
        //   ),
        // );

        // if (duplicates.length > 0) {
        //   setUploadStatus(
        //     lang.text("errorDuplicateCourse", {
        //       context: duplicates.map((d) => d.namaMataPelajaran).join(", "),
        //     }),
        //   );
        //   return;
        // }

        // // Kirim data ke API
        // let successCount = 0;
        // let errorCount = 0;

        // for (const item of validData) {
        //   try {
        //     // Cari kelasId berdasarkan namaKelas
        //     const kelas = classroom.data?.find(
        //       (cls) =>
        //         cls.namaKelas.toLowerCase() === item.namaKelas.toLowerCase(),
        //     );
        //     const kelasId = kelas?.id;

        //     if (!kelasId) {
        //       throw new Error(
        //         `Kelas ID tidak ditemukan untuk ${item.namaKelas}`,
        //       );
        //     }

        //     await creation.create({
        //       namaMataPelajaran: item.namaMataPelajaran,
        //       kelasId,
        //       sekolahId: profile?.user?.sekolahId || 0,
        //     });
        //     successCount++;
        //   } catch (error) {
        //     console.error(`Gagal mengirim: ${item.namaMataPelajaran}`, error);
        //     errorCount++;
        //   }
        // }

        // setUploadStatus(
        //   lang.text("success", {
        //     success: successCount,
        //     failed: errorCount,
        //   }),
        // );

        // if (successCount > 0) {
        //   resource.query.refetch();
        //   alert.success(
        //     lang.text("successCreate", { context: lang.text("ekstrakurikuler") }),
        //   );
        // }

        // if (errorCount === 0) {
        //   setIsExcelModalOpen(false);
        // }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error saat memproses file:", error);
      setUploadStatus(lang.text("errSystem"));
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="max-w-lg gap-6">
            <div className="basis-1">
              {/* <div className="flex flex-col gap-4 mb-4">
                <div className="basis-1">
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-2 w-[450px]">
                        <FormLabel>{lang.text("school")}</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(x) => field.onChange(Number(x))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang.text("selectSchool")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {school.data.map((option, i) => (
                              <SelectItem key={i} value={String(option.id)}>
                                {option.namaSekolah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div> */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("name")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={lang.text("inputEkstrakurikuler")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage style={{ marginBottom: "5px" }}>
                          {fieldState.error?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="jenis"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("jenis")}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="OLAHRAGA">Olahraga</SelectItem>
                            <SelectItem value="AKADEMIK">Akademik</SelectItem>
                            <SelectItem value="KEAGAMAAN">Keagamaan</SelectItem>
                            <SelectItem value="LAINNYA">Lainnya</SelectItem>

                          </SelectContent>
                        </Select>

                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="basis-1">
                  <FormField
                    control={form.control}
                    name="pembinaId"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-2 w-[450px]">
                        <FormLabel>{lang.text("advisor")}</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(x) => field.onChange(Number(x))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={lang.text("selectAdvisor")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teacher?.data?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.namaGuru}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="deskripsi"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("description")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={lang.text("inputDescription")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage style={{ marginBottom: "5px" }}>
                          {fieldState.error?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* lokasi */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="lokasi"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("location")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={lang.text("inputLocation")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage style={{ marginBottom: "5px" }}>
                          {fieldState.error?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="kontak"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("contact")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={lang.text("inputContact")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage style={{ marginBottom: "5px" }}>
                          {fieldState.error?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="py-4">
                <Button
                  // disabled={
                  //   !form.formState.isDirty ||
                  //   !form.formState.isValid ||
                  //   creation.isLoading
                  // }
                  type="submit"
                >
                  {creation.isLoading
                    ? lang.text("saving")
                    : lang.text("saveChanges")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      {!isEdit && (
        <Dialog open={isExcelModalOpen} onOpenChange={setIsExcelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lang.text("upload")}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
              />
              {uploadStatus && <p>{uploadStatus}</p>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
