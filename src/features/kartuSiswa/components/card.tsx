import { useStudents } from "@/features/parents/hooks/useStudent";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { useRef } from "react";
import DownloadButton from "./downloadButton";
import BackCard from "./newCard/backCard";
import FrontCard from "./newCard/frontCard";
import PaginationControls from "./paginate/PaginationControls";

interface MultiCardProps {
  searchKelas: string;
  currentPage: number;
  schoolId: number | null;
  selectedBackgroundFront: string;
  selectedBackgroundBack: string;
  setCurrentPage: (page: number) => void;
  orientation: "horizontal" | "vertical";
}

export const MultiCard = ({
  searchKelas,
  schoolId,
  currentPage,
  selectedBackgroundFront,
  selectedBackgroundBack,
  setCurrentPage,
  orientation,
}: MultiCardProps) => {
  // Ambil data siswa berdasarkan schoolId dan filter kelas
  const {
    data: students,
    pagination,
    isLoading,
    error,
  } = useStudents({
    page: currentPage,
    size: 9999,
    sekolahId: schoolId,
    kelasId: searchKelas === "all" ? undefined : Number(searchKelas), // Kirim kelasId hanya jika bukan "all"
  });
  const { data: schoolDetail, isLoading: isLoadingSchool } = useSchoolDetail({
    id: schoolId ?? 0,
  });

  console.log("searchKelas:", searchKelas);
  console.log("📌 Data Siswa:", students);

  // Ambil detail sekolah berdasarkan schoolId

  console.log("🏫 Data Sekolah:", schoolDetail);

  const { user } = useProfile();
  const isSuperAdmin = user?.role === "superAdmin";

  const printRef = useRef<HTMLDivElement>(null);
  const allDataRef = useRef<HTMLDivElement>(null);

  if (isLoadingSchool || isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching students: {error.message}</p>;

  // Filter students berdasarkan kelas jika searchKelas bukan "all"
  const filteredStudents = students?.filter((student) => {
    if (searchKelas === "all") return true; // Tampilkan semua siswa jika "all"
    const classId = student.biodataSiswa?.[0]?.kelas?.id;
    return classId && String(classId) === searchKelas; // Filter berdasarkan kelas.id
  }) || [];

  console.log("📌 Filtered Students:", filteredStudents);

  return (
    <div ref={printRef} style={{ padding: "30px", textAlign: "left" }}>
      {/* Grid Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            orientation === "horizontal" ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
          gap: "20px",
          justifyContent: "center",
          maxWidth: "100%",
          padding: "10px",
        }}
      >
        {filteredStudents.map((student) => {
          const logoSekolah = schoolDetail?.file
            ? `data:image/png;base64,${schoolDetail.file}`
            : "/default-school-logo.png";

          return (
            <div
              key={student.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Kartu Depan */}
              <FrontCard
                student={{
                  ...student,
                  sekolah: schoolDetail?.namaSekolah || "Nama Sekolah Tidak Ada",
                  alamatSekolah:
                  schoolDetail?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                  logoSekolah,
                }}
                background={selectedBackgroundFront}
                orientation={orientation}
              />

              {/* Kartu Belakang */}
              <BackCard
                student={{
                  ...student,
                  sekolah: schoolDetail?.namaSekolah || "Nama Sekolah Tidak Ada",
                  alamatSekolah:
                    schoolDetail?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                  logoSekolah,
                }}
                background={selectedBackgroundBack}
                orientation={orientation}
                visiMisi={schoolDetail?.visiMisi}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Tombol Unduh PDF */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <DownloadButton
          targetRef={printRef}
          allDataRef={allDataRef}
          isFiltered={searchKelas !== "all"}
          students={filteredStudents}
        />
      </div>
    </div>
  );
};