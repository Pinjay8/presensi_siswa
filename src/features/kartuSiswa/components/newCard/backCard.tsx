import React from "react"
import "./styles/backCard.css" // Import CSS
import QRCode from "react-qr-code"
import { useSchoolDetail } from "@/features/schools"
import { useProfile } from "@/features/profile"

interface Student {
  id: number
  name: string
  nisn: string
  nis: string
  email: string
  image: string | null
  sekolah: string
  logoSekolah: string | null
  kelas: string | null
  alamatSekolah: string | null
  alamat: string | null
}

interface BackCardProps {
  student: Student
  background: string
  orientation: "horizontal" | "vertical",
  visiMisi?: any
}

const BackCard: React.FC<BackCardProps> = ({
  student,
  background,
  orientation,
  visiMisi
}) => {

  return (
    <div
      id={`student-card-${student.id}-back`}
      className={`mt-2 back-card ${orientation}`} // 🔥 Tambahkan class berdasarkan orientasi
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="back-card-content">
        <h2 className="back-title">{student.sekolah}</h2>

        {/* <div className={`visi-misi ${orientation}`}>
          <h2 className="section-title">VISI</h2>
          <p className="section-content">
            "Mewujudkan generasi yang berakhlak mulia, unggul dalam prestasi,
            serta siap menghadapi tantangan global dengan ilmu dan teknologi."
          </p>

          <h3 className="section-title">MISI</h3>
          <ul className="mission-list">
            <li>
              Menanamkan nilai-nilai keimanan dan ketakwaan dalam kehidupan
              sehari-hari.
            </li>
            <li>Mengembangkan pembelajaran berbasis teknologi dan inovasi.</li>
            <li>
              Mendorong siswa untuk berprestasi di bidang akademik dan
              non-akademik.
            </li>
            <li>
              Membentuk karakter siswa yang disiplin, mandiri, dan bertanggung
              jawab.
            </li>
          </ul>
        </div> */}

        <div className={`bg-white p-4 rounded-lg text-[13px] text-black visi-misi ${orientation}`} dangerouslySetInnerHTML={{ __html: visiMisi }} />

        {/* 🔹 QR Code diposisikan dengan benar */}
        <div className={`qr-logo-section ${orientation}`}>
          <div className="qr-container">
            <QRCode
              value={student.nisn}
              size={orientation === "vertical" ? 100 : 120}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackCard
