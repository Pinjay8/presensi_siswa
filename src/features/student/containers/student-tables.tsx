import {
  Button,
  Calendar,
  DropdownMenu,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, useDataTableController } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import {
  checkAttendance,
  StudentTable,
  useAttedances,
} from "@/features/student";

import axios from "axios";
import dayjs from "dayjs";
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Import,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaFileExcel, FaFilePdf, FaPlus } from "react-icons/fa";
import { useStudentPagination } from "../hooks/use-student-pagination";
import { ImportStudentDialog } from "../components/ImportStudentDialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSiswaFormValues, createSiswaSchema } from "@/core/models";
import { userService } from "@/core/services";
import { useForm } from "react-hook-form";
import { useSchools } from "@/features/classroom/hooks/useSchool";
import { io } from "socket.io-client";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import StudentFormDialog from "../components/StudentFormDialog";
import { useProfile } from "@/features/profile";

export const StudentLandingTables = () => {
  const [openImport, setOpenImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPDF, setGeneratingPDF] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const alert = useAlert();

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 10 });

  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      // sekolahId: sekolahId ? +sekolahId : undefined,
      // idKelas: idKelas ? +idKelas : undefined,
      // keyword: global,
    }),
    [pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, refetch } = useStudentPagination(studentParams);

  const classRoom = useClassroom();

  const presentCount = useMemo(() => {
    return (
      data?.students?.filter(
        (item: any) => item.statusKehadiranHariIni === "hadir",
      ).length ?? 0
    );
  }, [data?.students]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/spreadsheets/d/1IoKbMSfnS0iyH3F-GCpEniJITWouHr-T/export?format=xlsx";
    link.setAttribute("download", "Template-Pendaftaran-Siswa.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = (type: string) => {
    handleDownload(type);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const importData = async () => {
    if (selectedFile) {
      const fileExtension = selectedFile?.name?.split(".").pop()?.toLowerCase();

      if (!["xlsx", "csv"].includes(fileExtension || "")) {
        alert.error("Harap unggah file dengan format .xlsx atau .csv");
        return;
      }
      // console.log("fileeees", selectedFile);

      setIsUploading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert.error("Token tidak ditemukan, silakan login.");
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload-excel`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.data) {
          alert.error("Tidak ada data yang dikembalikan dari server");
          setIsUploading(false);
          return;
        }

        const { data } = response.data;

        const formattedMessage = (
          <div>
            <p>✅ Berhasil diimport: {data?.success || 0}</p>
            <p>⚠️ Data yang dilewati: {data?.skipped || 0}</p>
            <p>❌ Data tidak valid: {data?.invalid || 0}</p>
          </div>
        );

        if (response.data.success) {
          setSelectedFile(null);
          // await Promise.all([attedances.query.refetch(), refetch()]);
          alert.success(
            (formattedMessage && formattedMessage.toString()) ||
              "Data berhasil diimport",
          );
        } else {
          setSelectedFile(null);
          // await Promise.all([attedances.query.refetch(), refetch()]);
          alert.error(
            (formattedMessage && formattedMessage.toString()) ||
              "Data gagal diimport",
          );
        }

        setOpenImport(false);
      } catch (error: any) {
        console.error("Error saat mengunggah file:", error);
        alert.error("Terjadi kesalahan saat mengimpor data");
      } finally {
        setIsUploading(false);
      }
    } else {
      alert.error("Tidak ada file yang dipilih!");
    }
  };

  const handleAlert = () => {
    alert.error(lang.text("shouldClassroom"));
  };

  const [openFormSiswa, setOpenFormSiswa] = useState(false);

  const defaultValues: any = {
    name: "",
    email: "",
    nis: "",
    nisn: "",
    noTlp: "",
    noTlpOrtu: "",
    alamat: "",
    password: "",
    sekolahId: "",
    jenisKelamin: "Male",
    tanggalLahir: "",
    // rfid: "",
  };

  const form = useForm<CreateSiswaFormValues>({
    resolver: zodResolver(createSiswaSchema),
    defaultValues,
  });

  // const { students, loading, refetch: refetchStudents } = useStudents();
  const queryCLient = useQueryClient();

  const onSubmit = async (values: CreateSiswaFormValues) => {
    try {
      const payload = {
        ...values,
        tanggalLahir: dayjs(values.tanggalLahir).toISOString(),
      };

      const result = await userService.createSiswa(payload);
      await refetch();
      await queryCLient.invalidateQueries({
        queryKey: ["students"],
      });
      setOpenFormSiswa(false);
      await alert.success(result.message || "Siswa berhasil dibuat");
      form.reset();
    } catch (error: any) {
      alert.error(error?.message || "Gagal membuat siswa");
    }
  };

  const { schools } = useSchools();

  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("absen", async (data) => {
      await refetch();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["studentsPaginated"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["attedances-new"],
        }),
      ]);
    });

    socket.on("absen-barcode", async (data) => {
      console.log("[BARCODE]", data);

      await refetch();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("error", (err) => {
      console.error("[ERROR]", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";

  const handleCloseFormSiswa = () => {
    form.reset(defaultValues);
    setOpenFormSiswa(false);
  };

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div
          className={`w-full flex lg:flex-nowrap flex-wrap gap-2 mt-2 ${
            isAdmin ? "justify-between" : "justify-end"
          }`}
        >
          {isAdmin && (
            <div className="flex w-max gap-2 items-center ">
              <Button
                className="hidden"
                variant="outline"
                onClick={() => handleDownloadExcel("csv")}
                // icon
                iconPosition="left"
                icon={<FaFileExcel />}
              >
                {lang.text("download")} Template CSV
              </Button>
              <Button
                // variant="outline"
                onClick={() => handleDownloadExcel("excel")}
                iconPosition="left"
                icon={<FaFileExcel />}
                className="bg-green-500 text-white"
              >
                {lang.text("download")} Template Excel
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  classRoom?.data.length > 0
                    ? setOpenImport(true)
                    : handleAlert()
                }
                iconPosition="left"
                icon={<Import />}
                className="bg-outline-green-500 text-black"
              >
                {lang.text("import")} Data
              </Button>
              <Button
                variant="default"
                onClick={() => setOpenFormSiswa(true)}
                style={{ padding: "2px 4px" }}
                icon={<FaPlus />}
              >
                {lang.text("createStudents")}
              </Button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="flex justify-between items-center pb-0 gap-4">
              <Button
                variant="outline"
                aria-label="presentCount"
                className="hover:bg-transparent cursor-default"
              >
                Hadir: {presentCount}
              </Button>
              <div className="w-full flex justify-between">
                <div className="flex items-center space-x-2">
                  <DropdownMenu
                    onOpenChange={(open) => setIsDropdownOpen(open)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="relative bg-red-600 text-white hover:bg-red-700"
                        variant="outline"
                        aria-label="download pdf"
                        disabled={isGeneratingPDF}
                      >
                        {isGeneratingPDF
                          ? "Generating..."
                          : lang.text("downloadAttedance")}{" "}
                        <FaFilePdf className="ml-2" />
                        {isDropdownOpen ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleDownloadPDF}>
                        {lang.text("downloadAttedanceDay")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadMonthlyPDF}>
                        {lang.text("downloadAttedanceMonthly")}
                      </DropdownMenuItem>
                    </DropdownMenuContent> */}
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudentTable
        data={data?.students ?? []}
        isLoading={isLoading}
        refetch={refetch}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={data?.pagination?.totalItems ?? 0}
      />

      <StudentFormDialog
        open={openFormSiswa}
        onClose={handleCloseFormSiswa}
        form={form}
        onSubmit={onSubmit}
        schools={schools ?? []}
      />

      <ImportStudentDialog
        open={openImport}
        onOpenChange={setOpenImport}
        selectedFile={selectedFile}
        isUploading={isUploading}
        onFileChange={handleFileUpload}
        onImport={importData}
      />
    </>
  );
};
