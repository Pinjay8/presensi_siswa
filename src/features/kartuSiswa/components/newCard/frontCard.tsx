import React, { useState } from "react";
import "./styles/frontCard.css";

import Barcode from "react-barcode";
import QRCode from "react-qr-code";

import { SchoolLogo } from "@/features/schools/components";
import dayjs from "dayjs";

interface Student {
  id: number;
  name: string;
  nisn: string;
  nis: string;
  email: string;
  image: string | null;
  sekolah: string;
  logoSekolah: string | null;
  kelas: string | null;
  alamatSekolah: string | null;
  alamat: string | null;
  jenisKelamin: "Male" | "Female";
  tempatTanggalLahir: string;
  tanggalLahir: string;
}

const genderOptions = {
  Male: "Laki-laki",
  Female: "Perempuan",
};

interface FrontCardProps {
  student: Student;
  background: string;
  orientation: "horizontal" | "vertical";
}

const FrontCard: React.FC<FrontCardProps> = ({
  student,
  background,
  orientation,
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Hitung masa berlaku (3 tahun dari sekarang)
  const calculateExpiryDate = () => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + 3); // Tambah 3 tahun

    const month = String(expiryDate.getMonth() + 1).padStart(2, "0"); // Bulan (MM), +1 karena getMonth dimulai dari 0
    const year = String(expiryDate.getFullYear()).slice(-2); // Tahun (YY), ambil 2 digit terakhir

    return `${month}/${year}`; // Format: MM/YY
  };

  const expiryDate = calculateExpiryDate();

  // Format tanggal lahir ke DD-MM-YYYY
  const formattedTanggalLahir = (value: string) => {
    return value
      ? dayjs(value).format('DD-MM-YYYY')
      : 'Kosong';
  }

  return (
    <div id={`student-card-${student.id}`} className="container">
      <div
        className={`front-card ${orientation}`}
        style={{
          backgroundImage: `url(${background})`,
          width: orientation === "vertical" ? "300px" : "500px",
          height: orientation === "vertical" ? "500px" : "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🔹 Header */}
        <div className={`header ${orientation}`}>
          {orientation === "horizontal" && (
            <div className={`logo-container ${orientation}`}>
              <SchoolLogo
                image={student.logoSekolah || ""}
                title={student.sekolah}
              />
            </div>
          )}
          <div className="school-info">
            <h2 className="school-name">{student.sekolah}</h2>
            {orientation === "horizontal" && (
              <p className="school-address">{student.alamatSekolah}</p>
            )}
          </div>
        </div>

        {/* 🔹 Kartu Pelajar */}
        <div className="title">KARTU PELAJAR</div>

        {/* 🔹 Data Siswa */}
        <div className={`content ${orientation}`}>
          <div className={`photo-placeholder ${orientation}`}>
            <img
              src={
                student?.image === null
                  ? "/defaultProfile.png"
                  : student.image || "/default-avatar.png"
              }
              alt="Profile"
              className={`profile-image ${orientation}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImageError(true)}
            />
          </div>
          <div className={`info ${orientation}`}>
            <h3 className="student-name">{student.name}</h3>
            <div className="info-grid">
              <div className="label">NIS/NISN</div>
              <div className="value">
                : {student.nis} / {student.nisn}
              </div>
              <div className="label">TTL</div>
              <div className="value">
                : {formattedTanggalLahir(student?.tanggalLahir) || "Kosong"}
              </div>
              <div className="label">Jenis Kelamin</div>
              <div className="value">
                : {genderOptions[student.jenisKelamin]}
              </div>
              <div className="label">Alamat</div>
              <div className="value">
                : {student.alamat || "Tidak tersedia"}
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Footer */}
        <div className={`footer ${orientation}`}>
          <div className="barcode-placeholder relative -top-5">
            <Barcode
              value={student.nis}
              format="CODE128"
              fontSize={12} // Reduce the font size of the number
              width={2.2}
              height={38}
            />
          </div>
          {orientation === "horizontal" && (
            <div className="qr-section">
              {/* <p className="kepala-sekolah">Kepala Sekolah</p> */}
              {student.nisn ? (
                  <div className="relative top-[-10px]">
                    <QRCode value={String(student.nisn)} size={56} />
                  </div>
              ) : (
                <p>QR Code tidak tersedia</p>
              )}
            </div>
          )}
          {orientation === "horizontal" && (
            <div className="expired">
              <p>Berlaku sampai</p>
              <p className="date">{expiryDate}</p> {/* Gunakan expiryDate dinamis */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontCard;